const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let val = (match[2] || "").trim();
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.substring(1, val.length - 1);
      }
      process.env[key] = val;
    }
  }
}

const { Pool, neonConfig } = require("@neondatabase/serverless");
const ws = require("ws");
const crypto = require("crypto");
neonConfig.webSocketConstructor = ws;

function verifyPassword(password, hashWithSalt) {
  try {
    const [salt, storedHash] = hashWithSalt.split(":");
    if (!salt || !storedHash) return false;
    const hash = crypto.scryptSync(password, salt, 64).toString("hex");
    return hash === storedHash;
  } catch (e) {
    return false;
  }
}

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const res = await pool.query('SELECT u.id, u.email, u."passwordHash", r.name as role FROM "User" u JOIN "Role" r ON u."roleId" = r.id WHERE u.email = $1', ['hr@educore.com']);
  console.log("HR USER DB RECORD:", res.rows[0]);
  if (res.rows[0]) {
    const valid = verifyPassword("hrpassword", res.rows[0].passwordHash);
    console.log("Password valid:", valid);
  }
  await pool.end();
}

main();
