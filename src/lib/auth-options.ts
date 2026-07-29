import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./db";
import { verifyPassword } from "./password";
import { UserRole } from "@/types";
import { getRedisClient } from "./redis-client";

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1_000;

const fallbackFailedAttempts = new Map<
  string,
  { count: number; lockedUntil: number | null }
>();
let fallbackWarned = false;

/* ------------------------------------------------------------------ */
/*  Distributed lockout helpers (Redis-aware)                         */
/* ------------------------------------------------------------------ */

function buildLockKey(email: string): string {
  return `lockout:${email.toLowerCase().trim()}`;
}

async function getLockoutInfo(
  email: string
): Promise<{ count: number; lockedUntil: number | null }> {
  const redis = await getRedisClient();
  if (!redis) {
    return fallbackFailedAttempts.get(email) || { count: 0, lockedUntil: null };
  }

  try {
    const raw = await redis.get(buildLockKey(email));
    if (!raw) return { count: 0, lockedUntil: null };
    const parsed = JSON.parse(raw);
    return {
      count: parsed.count ?? 0,
      lockedUntil: parsed.lockedUntil ?? null,
    };
  } catch {
    return { count: 0, lockedUntil: null };
  }
}

async function setLockoutInfo(
  email: string,
  info: { count: number; lockedUntil: number | null }
): Promise<void> {
  const redis = await getRedisClient();
  if (!redis) {
    fallbackFailedAttempts.set(email, info);
    return;
  }

  try {
    // Keep lockout data for at least the lock duration; if no lock is active,
    // expire after a shorter window (1 hour) so Redis stays clean.
    const ttlMs = info.lockedUntil
      ? Math.max(info.lockedUntil - Date.now(), LOCK_DURATION_MS)
      : 60 * 60 * 1_000;

    await redis.setex(
      buildLockKey(email),
      Math.ceil(ttlMs / 1000),
      JSON.stringify(info)
    );
  } catch (err) {
    console.error("[BruteForce] Redis set error:", err);
    fallbackFailedAttempts.set(email, info);
  }
}

async function deleteLockoutInfo(email: string): Promise<void> {
  const redis = await getRedisClient();
  if (!redis) {
    fallbackFailedAttempts.delete(email);
    return;
  }

  try {
    await redis.del(buildLockKey(email));
  } catch (err) {
    console.error("[BruteForce] Redis del error:", err);
    fallbackFailedAttempts.delete(email);
  }
}

/* ------------------------------------------------------------------ */
/*  Lockout logic                                                       */
/* ------------------------------------------------------------------ */

async function checkLockout(email: string): Promise<{
  locked: boolean;
  remainingMinutes?: number;
}> {
  if (process.env.NODE_ENV === "test") return { locked: false };

  const info = await getLockoutInfo(email);
  if (!info) return { locked: false };

  if (info.lockedUntil && Date.now() < info.lockedUntil) {
    const remainingMinutes = Math.ceil(
      (info.lockedUntil - Date.now()) / 60_000
    );
    return { locked: true, remainingMinutes };
  }

  // Lock has expired — clean up
  await deleteLockoutInfo(email);
  return { locked: false };
}

async function recordFailedAttempt(email: string): Promise<void> {
  const info = (await getLockoutInfo(email)) || { count: 0, lockedUntil: null };
  info.count++;

  if (info.count >= MAX_FAILED_ATTEMPTS) {
    info.lockedUntil = Date.now() + LOCK_DURATION_MS;
  }

  await setLockoutInfo(email, info);
}

async function clearFailedAttempts(email: string): Promise<void> {
  await deleteLockoutInfo(email);
}

/* ------------------------------------------------------------------ */
/*  AuthOptions                                                         */
/* ------------------------------------------------------------------ */

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "candidate@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("الرجاء إدخال البريد الإلكتروني وكلمة المرور.");
        }

        const redis = await getRedisClient();
        if (!redis && !fallbackWarned) {
          console.warn(
            `[BruteForce] Redis unavailable — using in-memory fallback. ` +
              `Failed-attempt counters will NOT be shared across serverless instances or survive cold starts. ` +
              `Install "ioredis" and set REDIS_URL for distributed brute-force protection.`
          );
          fallbackWarned = true;
        }

        const lockStatus = await checkLockout(credentials.email);
        if (lockStatus.locked) {
          throw new Error(
            `تم قفل الحساب مؤقتاً. حاول مرة أخرى خلال ${lockStatus.remainingMinutes} دقيقة.`
          );
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            include: { role: true },
          });

          if (!user) {
            await recordFailedAttempt(credentials.email);
            throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
          }

          const isValid = verifyPassword(credentials.password, user.passwordHash);
          if (!isValid) {
            await recordFailedAttempt(credentials.email);
            throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
          }

          await clearFailedAttempts(credentials.email);

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role.name as UserRole,
          };
        } catch (error) {
          console.error("[NextAuth Authorize Error]:", error);
          throw error;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

/*
 * NOTE: Brute-force protection now uses a hybrid Redis + in-memory approach.
 *
 *   - If REDIS_URL is set and ioredis is installed, lockout state is stored in
 *     Redis with automatic TTL expiry, providing durable distributed protection
 *     across serverless instances.
 *   - Otherwise, a per-process Map is used and a one-time console warning is
 *     emitted. The fallback resets on cold starts and does not share state
 *     between instances (e.g. on Vercel).
 */
