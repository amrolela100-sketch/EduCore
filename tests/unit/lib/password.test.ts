import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from '@/lib/password';

describe('password', () => {
  it('should hash a password and produce salt:hash format', () => {
    const hash = hashPassword('MySecret123!');
    expect(hash).toContain(':');
    const [salt, derived] = hash.split(':');
    expect(salt).toHaveLength(32); // 16 bytes hex = 32 chars
    expect(derived).toHaveLength(128); // 64 bytes hex = 128 chars
  });

  it('should verify a correct password', () => {
    const hash = hashPassword('CorrectHorseBatteryStaple');
    expect(verifyPassword('CorrectHorseBatteryStaple', hash)).toBe(true);
  });

  it('should reject an incorrect password', () => {
    const hash = hashPassword('SecretPassword');
    expect(verifyPassword('WrongPassword', hash)).toBe(false);
  });

  it('should reject malformed hash strings', () => {
    expect(verifyPassword('any', 'nocolon')).toBe(false);
    expect(verifyPassword('any', '')).toBe(false);
  });

  it('should produce unique salts for identical passwords', () => {
    const h1 = hashPassword('SamePassword');
    const h2 = hashPassword('SamePassword');
    expect(h1).not.toBe(h2);
  });
});
