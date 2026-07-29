/**
 * Lazy Redis client that gracefully falls back to null if REDIS_URL is not set
 * or if ioredis is not installed. This allows the app to run in both
 * development (no Redis) and production (Redis-backed) environments.
 */

let redis: import("ioredis").Redis | null = null;
let redisWarned = false;

export async function getRedisClient() {
  if (redis) return redis;
  if (!process.env.REDIS_URL) return null;

  try {
    // ioredis is an optional dependency; keep a comment for clarity
    const { Redis } = await import("ioredis");
    redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      lazyConnect: true,
    });

    redis.on("error", (err: Error) => {
      // Prevent crashing the whole app on transient Redis errors
      if (!redisWarned) {
        console.warn("[Redis] Connection error — falling back to in-memory store:", err.message);
        redisWarned = true;
      }
    });

    redis.on("connect", () => {
      console.info("[Redis] Connected successfully.");
      redisWarned = false;
    });

    await redis.connect();
    return redis;
  } catch {
    if (!redisWarned) {
      console.warn("[Redis] ioredis not available — falling back to in-memory store. Install 'ioredis' and set REDIS_URL for distributed rate limiting.");
      redisWarned = true;
    }
    return null;
  }
}

/**
 * Close the Redis connection cleanly. Useful for tests and graceful shutdowns.
 */
export async function closeRedisClient(): Promise<void> {
  if (redis) {
    await redis.quit();
    redis = null;
  }
}
