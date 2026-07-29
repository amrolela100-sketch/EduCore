const fs = require("fs");
const path = require("path");

// 1. Manually load .env file
try {
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
        } else if (val.startsWith("'") && val.endsWith("'")) {
          val = val.substring(1, val.length - 1);
        }
        process.env[key] = val;
      }
    }
  }
} catch (e) {
  console.error("Failed to load .env file:", e);
}

const { Pool, neonConfig } = require("@neondatabase/serverless");
const ws = require("ws");
neonConfig.webSocketConstructor = ws;

async function cleanTestUsers() {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL missing!");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    console.log("🔍 جاري البحث وحذف جميع المستخدمين الوهميين الناتجة عن اختبار k6...");

    // 1. Count matching test users
    const countRes = await pool.query(
      `SELECT COUNT(*)::int as count FROM "User" WHERE email LIKE 'loadtest-%' OR email LIKE '%@test.com' OR name LIKE 'LoadTest User%'`
    );
    const count = countRes.rows[0].count;

    console.log(`📊 عدد المستخدمين الوهميين المكتشفين: ${count}`);

    if (count === 0) {
      console.log("✅ لا يوجد أي مستخدم وهمي بحاجة للحذف.");
      return;
    }

    // 2. Delete test users (PostgreSQL cascading relations will automatically purge CandidateProfile, Applications, Sessions, Notifications)
    const deleteRes = await pool.query(
      `DELETE FROM "User" WHERE email LIKE 'loadtest-%' OR email LIKE '%@test.com' OR name LIKE 'LoadTest User%'`
    );

    console.log(`🎉 تم حذف جميع المستخدمين الوهميين (${deleteRes.rowCount} مستخدم) وكافة بياناتهم الملحقة بنجاح!`);
  } catch (error) {
    console.error("❌ حدث خطأ أثناء الحذف:", error);
  } finally {
    await pool.end();
  }
}

cleanTestUsers();
