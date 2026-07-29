import { NextResponse } from "next/server";
import { getRedisClient } from "./redis-client";

const FALLBACK_MAP = new Map<string, RateLimitRecord>();
let fallbackWarned = false;

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

interface RateLimitConfig {
  limit: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetMs: number;
}

export type RateLimiter = (identifier: string) => Promise<RateLimitResult>;

/**
 * Creates a reusable rate limiter function with a fixed configuration.
 *
 * Usage:
 *   const limiter = createRateLimiter({ limit: 10, windowMs: 60000 });
 *   const result = await limiter(`my-route_${clientIp}`);
 *
 * HYBRID BEHAVIOUR:
 *   - If REDIS_URL is set and ioredis is installed, the limiter uses Redis
 *     INCR + EXPIRE for accurate distributed rate limiting across all
 *     serverless instances.
 *   - Otherwise, it falls back to an in-memory Map. A one-time console
 *     warning is emitted. This fallback is accurate only within a single
 *     process and resets on cold starts (e.g. Vercel).
 */
export function createRateLimiter(config: RateLimitConfig): RateLimiter {
  return async (identifier: string): Promise<RateLimitResult> => {
    return checkRateLimit(identifier, config.limit, config.windowMs);
  };
}

export async function checkRateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60000
): Promise<{ allowed: boolean; remaining: number; resetMs: number }> {
  const redis = await getRedisClient();

  if (redis) {
    return checkRateLimitRedis(redis, identifier, limit, windowMs);
  }

  if (!fallbackWarned) {
    console.warn(
      `[RateLimit] Redis unavailable — using in-memory fallback. ` +
        `Rate limits will NOT be shared across serverless instances or survive cold starts. ` +
        `Install "ioredis" and set REDIS_URL for distributed rate limiting.`
    );
    fallbackWarned = true;
  }

  return checkRateLimitMemory(identifier, limit, windowMs);
}

/* ------------------------------------------------------------------ */
/*  Redis-backed implementation                                         */
/* ------------------------------------------------------------------ */

async function checkRateLimitRedis(
  redis: import("ioredis").Redis,
  identifier: string,
  limit: number,
  windowMs: number
): Promise<{ allowed: boolean; remaining: number; resetMs: number }> {
  const key = `ratelimit:${identifier}`;

  try {
    const pipe = redis.pipeline();
    pipe.incr(key);
    pipe.pttl(key);
    const result = await pipe.exec();
    if (!result) {
      throw new Error("Redis pipeline returned null");
    }
    const [, countRaw] = result[0];
    const [, pttlRaw] = result[1];
    const count = Number(countRaw);
    const pttl = Number(pttlRaw);

    // On first request in the window, set the TTL
    if (count === 1 || pttl <= 0) {
      await redis.pexpire(key, windowMs);
    }

    const resetMs = pttl > 0 ? pttl : windowMs;

    if (count > limit) {
      return { allowed: false, remaining: 0, resetMs };
    }

    return { allowed: true, remaining: Math.max(0, limit - count), resetMs };
  } catch (err) {
    console.error("[RateLimit] Redis error — denying request:", err);
    return { allowed: false, remaining: 0, resetMs: windowMs };
  }
}

/* ------------------------------------------------------------------ */
/*  In-memory fallback implementation                                   */
/* ------------------------------------------------------------------ */

function checkRateLimitMemory(
  identifier: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetMs: number } {
  const now = Date.now();
  const record = FALLBACK_MAP.get(identifier);

  // Periodic cleanup of stale entries if map grows large
  if (FALLBACK_MAP.size > 5000) {
    for (const [key, entry] of FALLBACK_MAP.entries()) {
      if (entry.resetTime <= now) {
        FALLBACK_MAP.delete(key);
      }
    }
  }

  if (!record || record.resetTime <= now) {
    FALLBACK_MAP.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      allowed: true,
      remaining: limit - 1,
      resetMs: windowMs,
    };
  }

  if (record.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetMs: record.resetTime - now,
    };
  }

  record.count += 1;
  return {
    allowed: true,
    remaining: limit - record.count,
    resetMs: record.resetTime - now,
  };
}

/**
 * Extract client IP address from incoming HTTP Request headers.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}

/**
 * Pre-built Rate Limiter Middleware Response for API routes with Retry-After header.
 */
export function createRateLimitResponse(resetMs: number = 60000): NextResponse {
  const retryAfterSeconds = Math.ceil(resetMs / 1000);
  return NextResponse.json(
    {
      success: false,
      error:
        "تم تجاوز الحد الأقصى للطلبات المسموح بها مؤقتاً. يرجى الانتظار والمحاولة لاحقاً.",
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfterSeconds),
        "X-RateLimit-Reset": String(Date.now() + resetMs),
      },
    }
  );
}
