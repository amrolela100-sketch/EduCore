/**
 * Minimal database seed for integration/E2E test environments.
 * Seeds roles, one company, and one open job posting.
 *
 * Usage: import { seedTestData } from './db-seed' and call before tests.
 */

export const TEST_ROLES = [
  { id: 'role-candidate', name: 'CANDIDATE', description: 'Job applicant' },
  { id: 'role-hr', name: 'HR_ADMIN', description: 'HR administrator' },
  { id: 'role-tech', name: 'TECH_ADMIN', description: 'Technical interviewer' },
  { id: 'role-sys', name: 'SYSTEM_ADMIN', description: 'System administrator' },
] as const;

export const TEST_COMPANY = {
  id: 'comp-test-001',
  name: 'Acme Test Corp',
  description: 'A fictional company for test scenarios',
  website: 'https://acme.test',
} as const;

export const TEST_JOB = {
  id: 'job-test-001',
  title: 'Senior Frontend Engineer',
  description: 'Build scalable React components and lead UI architecture.',
  requirements: ['React', 'TypeScript', 'Tailwind CSS'],
  salaryRange: '$120k – $160k',
  location: 'Remote',
  status: 'OPEN',
  companyId: TEST_COMPANY.id,
} as const;

/**
 * Seeds the minimal dataset using the provided Prisma client instance.
 * Safe to call multiple times — uses upsert for idempotency.
 */
export async function seedTestData(prisma: {
  role: {
    upsert: (args: {
      where: { name: string };
      update: Record<string, unknown>;
      create: Record<string, unknown>;
    }) => Promise<unknown>;
  };
  company: {
    upsert: (args: {
      where: { id: string };
      update: Record<string, unknown>;
      create: Record<string, unknown>;
    }) => Promise<unknown>;
  };
  jobPosting: {
    upsert: (args: {
      where: { id: string };
      update: Record<string, unknown>;
      create: Record<string, unknown>;
    }) => Promise<unknown>;
  };
}) {
  for (const role of TEST_ROLES) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }

  await prisma.company.upsert({
    where: { id: TEST_COMPANY.id },
    update: {},
    create: TEST_COMPANY,
  });

  await prisma.jobPosting.upsert({
    where: { id: TEST_JOB.id },
    update: {},
    create: TEST_JOB,
  });
}
