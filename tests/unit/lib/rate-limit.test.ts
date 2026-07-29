import { describe, it, expect } from 'vitest';
import { checkRateLimit, createRateLimiter } from '@/lib/rate-limit';
import type { RateLimitResult } from '@/lib/rate-limit';

// NOTE: checkRateLimit uses module-level in-memory state.
// We use unique identifiers per test to avoid cross-test pollution.

describe('createRateLimiter', () => {
  it('should allow requests under the limit', async () => {
    const limiter = createRateLimiter({ limit: 3, windowMs: 10000 });
    const id = `under-limit-${Date.now()}`;

    const r1 = await limiter(id);
    expect(r1.allowed).toBe(true);
    expect(r1.remaining).toBe(2);

    const r2 = await limiter(id);
    expect(r2.allowed).toBe(true);
    expect(r2.remaining).toBe(1);
  });

  it('should block requests over the limit within the window', async () => {
    const limiter = createRateLimiter({ limit: 2, windowMs: 60000 });
    const id = `over-limit-${Date.now()}`;

    await limiter(id);
    await limiter(id);
    const r3 = await limiter(id);

    expect(r3.allowed).toBe(false);
    expect(r3.remaining).toBe(0);
    expect(r3.resetMs).toBeGreaterThan(0);
    expect(r3.resetMs).toBeLessThanOrEqual(60000);
  });

  it('should reset the window after it expires', async () => {
    const windowMs = 50;
    const limiter = createRateLimiter({ limit: 1, windowMs });
    const id = `reset-window-${Date.now()}`;

    const first = await limiter(id);
    expect(first.allowed).toBe(true);

    // Wait for window to expire
    await new Promise((res) => setTimeout(res, windowMs + 10));

    const second = await limiter(id);
    expect(second.allowed).toBe(true);
    expect(second.remaining).toBe(0);
  });

  it('should track different identifiers independently', async () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 60000 });
    const now = Date.now();

    const a = await limiter(`a-${now}`);
    const b = await limiter(`b-${now}`);

    expect(a.allowed).toBe(true);
    expect(b.allowed).toBe(true);
  });
});

describe('checkRateLimit defaults', () => {
  it('should use default limit of 10 and window of 60000ms', async () => {
    const id = `defaults-${Date.now()}`;
    const results: RateLimitResult[] = [];

    for (let i = 0; i < 12; i++) {
      results.push(await checkRateLimit(id));
    }

    // 10 allowed, 11th blocked
    expect(results.filter((r) => r.allowed).length).toBe(10);
    expect(results[10].allowed).toBe(false);
    expect(results[10].resetMs).toBeGreaterThan(0);
    expect(results[10].resetMs).toBeLessThanOrEqual(60000);
  });
});
