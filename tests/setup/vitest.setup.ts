import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

vi.mock('ioredis', () => ({
  Redis: class RedisMock {
    constructor() {}
    async get() { return null; }
    async set() { return 'OK'; }
    async del() { return 1; }
    async quit() {}
  },
}));
