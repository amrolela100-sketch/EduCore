import { describe, it, expect } from 'vitest';
import { hasRole } from '@/lib/rbac';
import type { UserRole } from '@/types';

describe('hasRole', () => {
  const allRoles: UserRole[] = ['CANDIDATE', 'HR_ADMIN', 'TECH_ADMIN', 'SYSTEM_ADMIN'];

  it('returns true when user role is in allowed roles', () => {
    const user = { role: 'HR_ADMIN' as UserRole };
    expect(hasRole(user, ['HR_ADMIN', 'SYSTEM_ADMIN'])).toBe(true);
  });

  it('returns false when user role is NOT in allowed roles', () => {
    const user = { role: 'CANDIDATE' as UserRole };
    expect(hasRole(user, ['HR_ADMIN', 'SYSTEM_ADMIN'])).toBe(false);
  });

  it('returns false for null/undefined user', () => {
    expect(hasRole(null, allRoles)).toBe(false);
    expect(hasRole(undefined, allRoles)).toBe(false);
  });

  it('returns false for user without role property', () => {
    expect(hasRole({}, allRoles)).toBe(false);
    expect(hasRole({ name: 'NoRole' } as any, allRoles)).toBe(false);
  });

  it('returns false when allowedRoles is missing', () => {
    const user = { role: 'SYSTEM_ADMIN' as UserRole };
    expect(hasRole(user, undefined as unknown as UserRole[])).toBe(false);
  });

  it('works with string array roles (coercion)', () => {
    const user = { role: 'TECH_ADMIN' };
    expect(hasRole(user, ['TECH_ADMIN'])).toBe(true);
    expect(hasRole(user, ['HR_ADMIN'])).toBe(false);
  });

  it('handles empty allowedRoles array', () => {
    const user = { role: 'SYSTEM_ADMIN' as UserRole };
    expect(hasRole(user, [])).toBe(false);
  });
});
