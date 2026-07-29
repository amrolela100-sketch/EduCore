import { Pool, neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import ws from "ws";

// Set the WebSocket constructor for the Neon serverless driver.
// Node 18+ includes native globalThis.WebSocket, which avoids Webpack bufferUtil polyfill issues.
if (typeof globalThis.WebSocket !== "undefined") {
  neonConfig.webSocketConstructor = globalThis.WebSocket;
} else {
  neonConfig.webSocketConstructor = ws;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is missing!");
  }
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 25,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });
  const adapter = new PrismaNeon(pool as unknown as ConstructorParameters<typeof PrismaNeon>[0]);
  return new PrismaClient({ adapter });
}

// Use a Proxy to defer PrismaClient creation until the first DB query is actually executed.
// This guarantees Next.js has finished loading the environment variables (.env) before we try to read DATABASE_URL.
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop, receiver) {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = createPrismaClient();
    }
    return Reflect.get(globalForPrisma.prisma, prop, receiver);
  },
});

/**
 * Executes a database query or transaction with exponential backoff auto-retry.
 * Protects against transient connection pool timeouts during high load spikes.
 */
export async function withDbRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delayMs = 150
): Promise<T> {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await fn();
    } catch (error: unknown) {
      attempt++;
      const errObj = error as { code?: string; message?: string } | null;
      const isTransient =
        errObj?.code === "P2024" ||
        errObj?.message?.includes("connection") ||
        errObj?.message?.includes("timeout") ||
        errObj?.message?.includes("Pool");

      if (!isTransient || attempt >= retries) {
        throw error;
      }
      const backoff = delayMs * Math.pow(2, attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, backoff));
    }
  }
  return await fn();
}

export default prisma;
