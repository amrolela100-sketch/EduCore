import crypto from "crypto";

const ENCRYPTION_ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 12 bytes is standard for GCM

// Get the encryption secret from environmental variables
// SECURITY: No fallback — ENCRYPTION_SECRET must be explicitly set in production
const SECRET = process.env.ENCRYPTION_SECRET;

if (!SECRET) {
  console.warn(
    "[SECURITY WARNING]: ENCRYPTION_SECRET is not set. API key encryption will fail. " +
    "Set ENCRYPTION_SECRET in your .env file (use: openssl rand -base64 32)."
  );
}

// Derive a cryptographically secure 32-byte key from the secret
function getEncryptionKey(): Buffer {
  if (!SECRET) {
    throw new Error(
      "ENCRYPTION_SECRET environment variable is required for encryption operations. " +
      "Set it in your .env file."
    );
  }
  return crypto.createHash("sha256").update(SECRET).digest();
}

/**
 * Encrypts a plain text string using AES-256-GCM.
 * Packs the IV, ciphertext, and auth tag into a single colon-separated hex string.
 */
export function encryptKey(plainText: string): string {
  if (!plainText) return "";
  
  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, key, iv);
    
    let encrypted = cipher.update(plainText, "utf8", "hex");
    encrypted += cipher.final("hex");
    
    const authTag = cipher.getAuthTag().toString("hex");
    
    // Format: iv:encrypted_text:auth_tag
    return `${iv.toString("hex")}:${encrypted}:${authTag}`;
  } catch (error) {
    console.error("[CRITICAL ERROR - Encryption Engine]: Failed to encrypt key.", error);
    throw new Error("Failed to encrypt sensitive configuration data.");
  }
}

/**
 * Decrypts a colon-separated hex string packed by encryptKey back to plain text.
 */
export function decryptKey(cipherText: string): string {
  if (!cipherText) return "";
  
  try {
    const key = getEncryptionKey();
    const parts = cipherText.split(":");
    
    if (parts.length !== 3) {
      throw new Error("Invalid encrypted format. Expected 3 segments.");
    }
    
    const [ivHex, encryptedHex, authTagHex] = parts;
    
    const iv = Buffer.from(ivHex, "hex");
    const encryptedText = Buffer.from(encryptedHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    
    const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedText, undefined, "utf8");
    decrypted += decipher.final("utf8");
    
    return decrypted;
  } catch (error) {
    console.error("[CRITICAL ERROR - Encryption Engine]: Failed to decrypt key. The key might be corrupted or encryption secret has changed.", error);
    return ""; // Return empty string to prevent application crash, allowing fallback
  }
}
