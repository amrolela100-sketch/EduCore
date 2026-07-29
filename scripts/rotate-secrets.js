#!/usr/bin/env node
/**
 * Security Secret Rotation Script
 * Run this script to generate new secure random secrets for the application.
 *
 * Usage:
 *   node scripts/rotate-secrets.js
 *
 * Then copy the output into your .env file (NEVER commit .env).
 */

const crypto = require("crypto");

const nextauthSecret = crypto.randomBytes(32).toString("base64");
const encryptionSecret = crypto.randomBytes(32).toString("hex");

console.log("# === Rotate these secrets immediately and update your .env file ===");
console.log(`NEXTAUTH_SECRET=${nextauthSecret}`);
console.log(`ENCRYPTION_SECRET=${encryptionSecret}`);
console.log("# === End of secrets ===");
