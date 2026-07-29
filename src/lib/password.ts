import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

/**
 * Hashes a plain-text password using Node's native crypto.scryptSync.
 * Returns the hash in the format: salt:hash
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Verifies a plain-text password against a stored hash (format: salt:hash).
 */
export function verifyPassword(password: string, hashWithSalt: string): boolean {
  try {
    const [salt, storedHash] = hashWithSalt.split(":");
    if (!salt || !storedHash) return false;

    const hash = scryptSync(password, salt, 64).toString("hex");
    
    const hashBuffer = Buffer.from(hash, "hex");
    const storedHashBuffer = Buffer.from(storedHash, "hex");
    
    if (hashBuffer.length !== storedHashBuffer.length) {
      return false;
    }
    
    return timingSafeEqual(hashBuffer, storedHashBuffer);
  } catch (error) {
    console.error("Password verification failed:", error);
    return false;
  }
}
