import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testIgnore: '**/unit/**',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  workers: 1,
  timeout: 60000,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'chromium-candidate',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'tests/.auth/candidate.json',
      },
      dependencies: ['auth-setup'],
    },
    {
      name: 'chromium-hr',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'tests/.auth/hr_admin.json',
      },
      dependencies: ['auth-setup'],
    },
    {
      name: 'chromium-tech',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'tests/.auth/tech_admin.json',
      },
      dependencies: ['auth-setup'],
    },
    {
      name: 'chromium-sys',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'tests/.auth/system_admin.json',
      },
      dependencies: ['auth-setup'],
    },
    {
      name: 'auth-setup',
      testMatch: /auth\.fixture\.ts/,
    },
  ],
});