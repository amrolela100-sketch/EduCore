/**
 * Playwright auth fixtures – log in each role and save storageState
 * so downstream projects can reuse authenticated sessions.
 *
 * Steps:
 * 1. Run `npx playwright test tests/fixtures/auth.fixture.ts` once to generate states.
 * 2. Reference the output path in playwright.config.ts `storageState`.
 */
import { test as base, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const AUTH_STATE_DIR = path.resolve(__dirname, '../.auth');

if (!fs.existsSync(AUTH_STATE_DIR)) {
  fs.mkdirSync(AUTH_STATE_DIR, { recursive: true });
}

interface AuthCredentials {
  email: string;
  password: string;
}

const ROLE_CREDENTIALS: Record<string, AuthCredentials> = {
  candidate: {
    email: 'candidate@example.com',
    password: 'candidatepassword',
  },
  hr_admin: {
    email: 'hr@educore.com',
    password: 'hrpassword',
  },
  tech_admin: {
    email: 'tech@educore.com',
    password: 'techpassword',
  },
  system_admin: {
    email: 'system@educore.com',
    password: 'systempassword',
  },
};

async function loginAndSaveState(
  page: import('@playwright/test').Page,
  role: string,
  creds: AuthCredentials
) {
  const csrfRes = await page.request.get('/api/auth/csrf');
  const { csrfToken } = await csrfRes.json();

  await page.request.post('/api/auth/callback/credentials', {
    form: {
      csrfToken,
      email: creds.email,
      password: creds.password,
      json: 'true',
    },
  });

  const statePath = path.join(AUTH_STATE_DIR, `${role}.json`);
  await page.context().storageState({ path: statePath });
}

const test = base.extend<Record<string, never>>({});

for (const [role, creds] of Object.entries(ROLE_CREDENTIALS)) {
  test(`authenticate ${role}`, async ({ page }) => {
    await loginAndSaveState(page, role, creds);
    const statePath = path.join(AUTH_STATE_DIR, `${role}.json`);
    expect(fs.existsSync(statePath)).toBe(true);
  });
}

export { test };
