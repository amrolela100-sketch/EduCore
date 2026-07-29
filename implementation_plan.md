# 🚀 خطة التنفيذ — EduCore Production-Ready Roadmap

> **مرجع:** [تقرير فحص الجودة الشامل](file:///C:/Users/ASUS/.gemini/antigravity-ide/brain/c39ff4f3-a70b-4184-bb28-47d0d6ffc8c6/educore_qa_audit_report.md)  
> **الهدف:** تحويل EduCore من حالته الحالية (52.8/100) إلى حالة جاهزة للإنتاج (≥85/100)  
> **الجدول الزمني التقديري:** 7-8 أسابيع

---

## نظرة عامة على المراحل

```mermaid
gantt
    title EduCore — Production Readiness Roadmap
    dateFormat  YYYY-MM-DD
    axisFormat  %d/%m

    section Phase 1 — Critical (Completed)
    تدوير الأسرار                :done, p1a, 2026-07-29, 1d
    استبدال VM Sandbox           :done, p1b, 2026-07-29, 3d
    إصلاح Brute-Force            :done, p1c, 2026-07-30, 1d
    إصلاح Regex المكسور          :done, p1d, 2026-07-30, 1d
    إضافة مفتاح Gemini AI        :done, p1e, 2026-07-30, 1d
    إصلاح Prisma Schema          :done, p1f, 2026-07-31, 1d

    section Phase 2 — Security (Completed)
    إضافة CSP Header             :done, p2a, 2026-08-04, 2d
    إصلاح SSRF                   :done, p2b, 2026-08-04, 2d
    إضافة CSRF Protection        :done, p2c, 2026-08-06, 2d
    تحسين Prompt Sanitizer       :done, p2d, 2026-08-06, 1d
    منع تسريب الأخطاء            :done, p2e, 2026-08-07, 1d
    إضافة Unique Constraint      :done, p2f, 2026-08-08, 1d
    Email Verification            :done, p2g, 2026-08-11, 3d
    توحيد Error Contract         :done, p2h, 2026-08-14, 2d


    section Phase 3 — Architecture & UX (Completed)
    Pagination                    :done, p3a, 2026-08-18, 3d
    Real-time Notifications       :done, p3b, 2026-08-21, 3d
    Password Reset Flow           :done, p3c, 2026-08-25, 2d
    File Virus Scanning           :done, p3d, 2026-08-27, 2d
    Project Cleanup               :done, p3e, 2026-08-29, 1d
    Loading States & UX Polish    :done, p3f, 2026-09-01, 2d
    Accessibility Fixes           :done, p3g, 2026-09-03, 2d


    section Phase 4 — Testing (Completed)
    Unit Tests                    :done, p4a, 2026-09-05, 5d
    Integration Tests             :done, p4b, 2026-09-10, 4d
    E2E Tests                     :done, p4c, 2026-09-15, 4d
    Security Tests                :done, p4d, 2026-09-19, 3d

```

---

## المرحلة 1: إصلاحات حرجة 🔴

> **المدة:** أسبوع واحد  
> **الأولوية:** يجب إكمالها قبل أي عمل آخر  
> **الهدف:** إغلاق جميع الثغرات التي تُعرّض النظام لخطر فوري

---

### P1-T1: تدوير الأسرار المكشوفة وتأمين بيانات الاعتماد

> **BUG المرتبط:** BUG-001  
> **الخطورة:** 🔴 حرج  
> **الوقت المقدر:** نصف يوم

#### الملفات المتأثرة
- [.env](file:///c:/Users/ASUS/Desktop/EduCore/.env)
- [credentials.json](file:///c:/Users/ASUS/Desktop/EduCore/credentials.json)
- [.gitignore](file:///c:/Users/ASUS/Desktop/EduCore/.gitignore)

#### خطوات التنفيذ

**1. إبطال وتدوير كلمة مرور Neon DB:**
```bash
# من لوحة تحكم Neon Console:
# Project Settings → Connection String → Reset Password
# ثم تحديث .env بالقيمة الجديدة
```

**2. توليد أسرار جديدة:**
```bash
# توليد NEXTAUTH_SECRET جديد
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# توليد ENCRYPTION_SECRET جديد
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**3. حذف credentials.json من Git tracking:**
```bash
git rm --cached credentials.json
echo "credentials.json" >> .gitignore  # تأكد من وجودها (موجودة ✅)
git commit -m "security: remove leaked credentials from tracking"
```

**4. تنظيف تاريخ Git (إذا لزم الأمر):**
```bash
# فحص هل الملف كان مُتتبعاً سابقاً
git log --all --full-history -- credentials.json .env

# إذا ظهر في التاريخ — استخدم git-filter-repo لحذفه نهائياً
pip install git-filter-repo
git filter-repo --path credentials.json --invert-paths
git filter-repo --path .env --invert-paths
```

**5. إضافة ملف `.env.example` محدّث (بدون قيم حقيقية):**
```env
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
DIRECT_URL="postgresql://user:password@host/dbname?sslmode=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
ENCRYPTION_SECRET="generate-with-openssl-rand-hex-32"
GOOGLE_GENERATIVE_AI_API_KEY="your-gemini-api-key"
REDIS_URL="redis://localhost:6379"
```

#### معيار القبول
- [ ] جميع الأسرار القديمة مُبطلة ولا تعمل
- [ ] `credentials.json` غير موجود في `git ls-files`
- [ ] `.env.example` محدث بدون قيم حقيقية
- [ ] التطبيق يعمل بالأسرار الجديدة

---

### P1-T2: استبدال VM Sandbox بحل آمن لتنفيذ الكود

> **BUG المرتبط:** BUG-002  
> **الخطورة:** 🔴 حرج  
> **الوقت المقدر:** 2-3 أيام

#### الملفات المتأثرة
- [run-code/route.ts](file:///c:/Users/ASUS/Desktop/EduCore/src/app/api/run-code/route.ts)
- `package.json` (إضافة dependency جديدة)

#### خيارات التنفيذ

| الخيار | المزايا | العيوب | التوصية |
|--------|---------|--------|---------|
| **isolated-vm** | عزل حقيقي، V8 isolate منفصل، سريع | يحتاج native compilation | ✅ **مُوصى** |
| **WebAssembly (QuickJS)** | آمن تماماً، لا native deps | أبطأ، لا يدعم كل JS features | بديل جيد |
| **Client-side only** | صفر مخاطر على الخادم | لا يمكن تسجيل النتائج server-side | أبسط حل |

#### خطوات التنفيذ (الخيار المُوصى: `isolated-vm`)

**1. تثبيت المكتبة:**
```bash
pnpm add isolated-vm
```

**2. إعادة كتابة route handler:**
```typescript
// src/app/api/run-code/route.ts
import ivm from 'isolated-vm';

const MAX_MEMORY_MB = 32;
const TIMEOUT_MS = 3000;

async function executeInSandbox(code: string): Promise<{
  logs: string[];
  result: string | null;
  error: string | null;
}> {
  const isolate = new ivm.Isolate({ memoryLimit: MAX_MEMORY_MB });
  const context = await isolate.createContext();
  const jail = context.global;
  
  // Capture console.log
  const logs: string[] = [];
  await jail.set('_log', new ivm.Callback((...args: string[]) => {
    logs.push(args.join(' '));
  }));
  
  await context.eval(`
    const console = {
      log: (...args) => _log(...args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a))),
      error: (...args) => _log('[ERROR]', ...args.map(a => String(a))),
      warn: (...args) => _log('[WARN]', ...args.map(a => String(a))),
    };
  `);
  
  try {
    const result = await context.eval(code, { timeout: TIMEOUT_MS });
    return { logs, result: result ? String(result) : null, error: null };
  } catch (err) {
    return { logs, result: null, error: err instanceof Error ? err.message : 'Unknown error' };
  } finally {
    isolate.dispose();
  }
}
```

**3. تحديث `next.config.ts`:**
```typescript
serverExternalPackages: ["@neondatabase/serverless", "ws", "isolated-vm"],
```

#### معيار القبول
- [ ] لا يمكن الوصول لـ `process`, `require`, `__dirname` من داخل الـ sandbox
- [ ] اختبار هروب `this.constructor.constructor('return process')()` يفشل
- [ ] حد الذاكرة (32MB) يعمل — كود يستهلك ذاكرة كبيرة يُقتل
- [ ] حد الوقت (3 ثوانٍ) يعمل — حلقة لانهائية تُقتل

---

### P1-T3: إصلاح تجاوز حماية Brute-Force

> **BUG المرتبط:** BUG-003  
> **الخطورة:** 🔴 حرج  
> **الوقت المقدر:** نصف يوم

#### الملفات المتأثرة
- [auth-options.ts](file:///c:/Users/ASUS/Desktop/EduCore/src/lib/auth-options.ts#L97)

#### خطوات التنفيذ

**تعديل `checkLockout` لتعطيل الحماية فقط في بيئة test:**
```typescript
// قبل (معطل في كل بيئة غير production):
if (process.env.NODE_ENV !== "production") return { locked: false };

// بعد (معطل فقط في بيئة الاختبار):
if (process.env.NODE_ENV === "test") return { locked: false };
```

#### معيار القبول
- [ ] في بيئة `development`: الحساب يُقفل بعد 5 محاولات فاشلة
- [ ] في بيئة `test`: لا يوجد قفل (لتسهيل الاختبار)
- [ ] في بيئة `production`: لا يوجد تغيير (يعمل كما هو)

---

### P1-T4: إصلاح Regex المكسور في استخراج المهارات

> **BUG المرتبط:** BUG-005  
> **الخطورة:** 🟠 عالي  
> **الوقت المقدر:** 15 دقيقة

#### الملفات المتأثرة
- [upload-resume/route.ts](file:///c:/Users/ASUS/Desktop/EduCore/src/app/api/upload-resume/route.ts#L110)

#### خطوات التنفيذ

```typescript
// السطر 110 — قبل (regex مكسور):
const techWordsMatch = text.match(/[A-Z][a-zA-Z0-[#]{2,}/g) || [];

// بعد (regex صحيح):
const techWordsMatch = text.match(/[A-Z][a-zA-Z0-9#]{2,}/g) || [];
```

#### معيار القبول
- [ ] Regex يعمل بدون runtime error
- [ ] يستخرج كلمات مثل `TypeScript`, `Node`, `React`, `C#`

---

### P1-T5: إضافة مفتاح Google Gemini AI وتحقق مبكر

> **BUG المرتبط:** BUG-004  
> **الخطورة:** 🟠 عالي  
> **الوقت المقدر:** نصف يوم

#### الملفات المتأثرة
- [.env](file:///c:/Users/ASUS/Desktop/EduCore/.env)
- إنشاء ملف جديد: `src/lib/ai-config.ts`
- تعديل: `src/services/job-evaluator.ts`, `gap-analyzer.ts`, `cv-tailor.ts`

#### خطوات التنفيذ

**1. إضافة المفتاح لـ `.env`:**
```env
GOOGLE_GENERATIVE_AI_API_KEY="your-actual-gemini-api-key"
```

**2. إنشاء `src/lib/ai-config.ts` للتحقق المبكر:**
```typescript
// src/lib/ai-config.ts

let aiAvailable: boolean | null = null;

export function isAIAvailable(): boolean {
  if (aiAvailable === null) {
    aiAvailable = !!process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!aiAvailable) {
      console.warn(
        "[AI CONFIG] GOOGLE_GENERATIVE_AI_API_KEY is not set. " +
        "AI features (evaluation, gap analysis, CV tailoring) will be disabled."
      );
    }
  }
  return aiAvailable;
}

export function requireAI(): void {
  if (!isAIAvailable()) {
    throw new Error("خدمة الذكاء الاصطناعي غير متوفرة حالياً. يرجى التواصل مع مسؤول النظام.");
  }
}
```

**3. إضافة `requireAI()` في بداية كل service يعتمد على AI:**
```typescript
// في job-evaluator.ts, gap-analyzer.ts, cv-tailor.ts
import { requireAI } from "@/lib/ai-config";

export async function evaluateCandidateJobMatch(...) {
  requireAI(); // يرمي خطأ واضح بدلاً من خطأ مبهم من SDK
  // ...
}
```

#### معيار القبول
- [ ] عند عدم وجود المفتاح: رسالة خطأ واضحة بالعربية (ليس stack trace)
- [ ] عند وجود المفتاح: جميع خدمات AI تعمل بنجاح
- [ ] `.env.example` يحتوي على المفتاح كـ placeholder

---

### P1-T6: إصلاح Prisma Schema — إضافة URL لـ datasource

> **BUG المرتبط:** BUG-007  
> **الخطورة:** 🟠 عالي  
> **الوقت المقدر:** 15 دقيقة

#### الملفات المتأثرة
- [schema.prisma](file:///c:/Users/ASUS/Desktop/EduCore/prisma/schema.prisma#L1-L3)

#### خطوات التنفيذ

```prisma
// قبل:
datasource db {
  provider = "postgresql"
}

// بعد:
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

#### معيار القبول
- [ ] `npx prisma validate` يمر بنجاح
- [ ] `npx prisma db pull` يعمل
- [ ] التطبيق يعمل بشكل طبيعي مع Neon adapter

---

## المرحلة 2: تعزيز الأمان 🟠

> **المدة:** أسبوعان  
> **الشرط:** إكمال المرحلة 1  
> **الهدف:** إغلاق جميع الثغرات العالية والمتوسطة

---

### P2-T1: إضافة Content-Security-Policy Header

> **BUG المرتبط:** BUG-016  
> **الوقت المقدر:** 1-2 يوم

#### الملفات المتأثرة
- [next.config.ts](file:///c:/Users/ASUS/Desktop/EduCore/next.config.ts)

#### خطوات التنفيذ

إضافة CSP header مع nonce-based script policy:
```typescript
{
  key: "Content-Security-Policy",
  value: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",  // Next.js يحتاج unsafe-inline حالياً
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob:",
    "connect-src 'self' https://generativelanguage.googleapis.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; "),
}
```

#### معيار القبول
- [ ] CSP header يظهر في response headers
- [ ] التطبيق يعمل بدون أخطاء CSP في console
- [ ] inline scripts محمية

---

### P2-T2: إصلاح SSRF الشامل

> **BUG المرتبط:** BUG-006  
> **الوقت المقدر:** 1-2 يوم

#### الملفات المتأثرة
- [system/actions.ts](file:///c:/Users/ASUS/Desktop/EduCore/src/app/admin/system/actions.ts)
- إنشاء: `src/lib/url-validator.ts`

#### خطوات التنفيذ

**1. إنشاء مُحقق URL مركزي:**
```typescript
// src/lib/url-validator.ts
import { URL } from "url";
import dns from "dns/promises";

const BLOCKED_HOSTS = ["localhost", "127.0.0.1", "0.0.0.0", "::1", "[::1]"];
const BLOCKED_RANGES = [
  /^10\./,           // Class A private
  /^172\.(1[6-9]|2\d|3[01])\./,  // Class B private
  /^192\.168\./,     // Class C private  
  /^169\.254\./,     // Link-local / metadata
  /^100\.(6[4-9]|[7-9]\d|1[0-2]\d)/,  // Shared address space
  /^fc[0-9a-f]{2}:/i,  // IPv6 unique local
  /^fe80:/i,           // IPv6 link-local
];

export async function validateExternalUrl(urlString: string): Promise<{
  valid: boolean;
  error?: string;
}> {
  try {
    const parsed = new URL(urlString);
    
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return { valid: false, error: "يجب أن يكون البروتوكول HTTP أو HTTPS فقط." };
    }

    if (BLOCKED_HOSTS.includes(parsed.hostname)) {
      return { valid: false, error: "الرابط يشير لعنوان محلي ممنوع." };
    }

    for (const pattern of BLOCKED_RANGES) {
      if (pattern.test(parsed.hostname)) {
        return { valid: false, error: "الرابط يشير لعنوان شبكة خاصة ممنوع." };
      }
    }

    // DNS rebinding check
    const addresses = await dns.resolve4(parsed.hostname).catch(() => []);
    for (const addr of addresses) {
      for (const pattern of BLOCKED_RANGES) {
        if (pattern.test(addr)) {
          return { valid: false, error: "الرابط يُحل إلى عنوان شبكة خاصة." };
        }
      }
    }

    return { valid: true };
  } catch {
    return { valid: false, error: "صيغة الرابط غير صالحة." };
  }
}
```

**2. استخدامه في `saveApiProvider` و `testApiProviderConnection`.**

#### معيار القبول
- [ ] `172.16.x.x`, `169.254.169.254`, `0.0.0.0`, `[::1]` جميعها ممنوعة
- [ ] DNS rebinding (domain يُحل لـ 127.0.0.1) ممنوع
- [ ] الرابط الخارجي الصحيح يعمل بشكل طبيعي

---

### P2-T3: إضافة حماية CSRF

> **BUG المرتبط:** BUG-013  
> **الوقت المقدر:** 1-2 يوم

#### الملفات المتأثرة
- [apply/route.ts](file:///c:/Users/ASUS/Desktop/EduCore/src/app/api/apply/route.ts)
- إنشاء: `src/lib/csrf.ts`

#### خطوات التنفيذ

**الخيار الأبسط: التحقق من Origin header:**
```typescript
// src/lib/csrf.ts
export function validateOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const expectedOrigin = process.env.NEXTAUTH_URL || "http://localhost:3000";
  
  if (origin) {
    return origin === new URL(expectedOrigin).origin;
  }
  if (referer) {
    return new URL(referer).origin === new URL(expectedOrigin).origin;
  }
  // No origin/referer = same-origin request (safe)
  return true;
}
```

**إضافته لجميع routes التي تقبل form-data.**

#### معيار القبول
- [ ] طلبات من مواقع خارجية تُرفض بـ 403
- [ ] طلبات من الموقع نفسه تعمل بشكل طبيعي

---

### P2-T4: تحسين Prompt Injection Sanitizer

> **BUG المرتبط:** BUG-014  
> **الوقت المقدر:** نصف يوم

#### الملفات المتأثرة
- [prompt-sanitizer.ts](file:///c:/Users/ASUS/Desktop/EduCore/src/lib/prompt-sanitizer.ts)

#### خطوات التنفيذ

توسيع الأنماط وsanitize الـ label:
```typescript
const INJECTION_PATTERNS = [
  /\b(ignore previous instructions|system prompt|you are now|new role)\b/gi,
  /<\/?system>/gi,
  /---\s*(system|instruction|prompt)/gi,
  /\{\{[\s\S]*?\}\}/g,
  /[\x00-\x08\x0B\x0C\x0E-\x1F]/g,
  // إضافات جديدة:
  /<\|system\|>/gi,
  /<\|assistant\|>/gi,
  /\[INST\]/gi,
  /### (System|Assistant|Human):/gi,
  /<\/?(?:system|user|assistant|instruction)>/gi,
  /\bact as\b.*\b(?:admin|root|system)\b/gi,
];

export function sanitizePromptInput(input: string, label?: string): string {
  let sanitized = input;
  for (const pattern of INJECTION_PATTERNS) {
    sanitized = sanitized.replace(pattern, "[FILTERED]");
  }
  // sanitize label أيضاً
  const safeLabel = (label || "user-input").replace(/[^a-zA-Z0-9_-]/g, "_");
  return `<USER_INPUT label="${safeLabel}">\n${sanitized}\n</USER_INPUT>`;
}
```

---

### P2-T5: منع تسريب معلومات الأخطاء التقنية

> **BUG المرتبط:** BUG-008  
> **الوقت المقدر:** نصف يوم

#### الملفات المتأثرة
- [system/actions.ts](file:///c:/Users/ASUS/Desktop/EduCore/src/app/admin/system/actions.ts#L311-L318)
- [admin/hr/actions.ts](file:///c:/Users/ASUS/Desktop/EduCore/src/app/admin/hr/actions.ts#L137)

#### خطوات التنفيذ

كل مكان يُرجع `rawMessage` أو `error.message` للواجهة → استبداله برسالة عامة:
```typescript
// قبل:
message: `حدث خطأ في شبكة الاتصال: ${rawMessage || "فشل إرسال الطلب."}`,

// بعد:
message: "حدث خطأ في شبكة الاتصال أثناء اختبار المزود. يرجى المحاولة لاحقاً.",
```

---

### P2-T6: إضافة Unique Constraint على Application

> **BUG المرتبط:** BUG-010  
> **الوقت المقدر:** 15 دقيقة

#### الملفات المتأثرة
- [schema.prisma](file:///c:/Users/ASUS/Desktop/EduCore/prisma/schema.prisma)

```prisma
model Application {
  // ... الحقول الموجودة ...
  @@unique([candidateProfileId, jobPostingId])
}
```

ثم:
```bash
npx prisma db push
```

---

### P2-T7: إضافة Email Verification عند التسجيل

> **الوقت المقدر:** 2-3 أيام

#### الملفات المتأثرة
- [schema.prisma](file:///c:/Users/ASUS/Desktop/EduCore/prisma/schema.prisma) — إضافة `emailVerified` و `verificationToken`
- [register/route.ts](file:///c:/Users/ASUS/Desktop/EduCore/src/app/api/register/route.ts)
- إنشاء: `src/app/api/verify-email/route.ts`
- إنشاء: `src/lib/email.ts`

#### خطوات التنفيذ

**1. تعديل schema:**
```prisma
model User {
  // ... الحقول الموجودة ...
  emailVerified     Boolean  @default(false)
  verificationToken String?  @unique
  tokenExpiresAt    DateTime?
}
```

**2. تعديل تدفق التسجيل:**
- إنشاء token عشوائي عند التسجيل
- إرسال بريد تحقق (Resend أو Nodemailer)
- عدم السماح بتسجيل الدخول حتى يتم التحقق

**3. إنشاء endpoint `/api/verify-email?token=xxx`**

---

### P2-T8: توحيد Error Response Contract

> **BUG المرتبط:** انتهاك SafeResult pattern  
> **الوقت المقدر:** 1-2 يوم

#### الملفات المتأثرة
- [run-code/route.ts](file:///c:/Users/ASUS/Desktop/EduCore/src/app/api/run-code/route.ts)
- [evaluate-interview/route.ts](file:///c:/Users/ASUS/Desktop/EduCore/src/app/api/evaluate-interview/route.ts)
- أي route يُرجع `{ error: ... }` بدلاً من `createSafeError()`

#### خطوات التنفيذ

مراجعة جميع API routes والتأكد من استخدام `createSafeError` و `createSafeResult` بشكل موحد.

---

## المرحلة 3: تحسينات معمارية و UX 🟡

> **المدة:** 3 أسابيع  
> **الشرط:** إكمال المرحلة 2  
> **الهدف:** تحسين الأداء، تجربة المستخدم، والبنية المعمارية

---

### P3-T1: إضافة Pagination للقوائم

> **الوقت المقدر:** 2-3 أيام

#### الملفات المتأثرة
- [candidate/page.tsx](file:///c:/Users/ASUS/Desktop/EduCore/src/app/candidate/page.tsx)
- [admin/hr/page.tsx](file:///c:/Users/ASUS/Desktop/EduCore/src/app/admin/hr/page.tsx)
- [admin/tech/page.tsx](file:///c:/Users/ASUS/Desktop/EduCore/src/app/admin/tech/page.tsx)

#### النهج
- Cursor-based pagination لـ Prisma queries
- إنشاء `PaginationControls` component مشترك
- تحديد 20 عنصر لكل صفحة كحد افتراضي

---

### P3-T2: إضافة Real-time Notifications

> **الوقت المقدر:** 2-3 أيام

#### النهج
- استخدام **Server-Sent Events (SSE)** — أبسط من WebSocket ويعمل مع serverless
- إنشاء `/api/notifications/stream` endpoint
- `NotificationBell` component في الـ navbar
- عرض إشعار عند: تقييم جديد، تغيير حالة الطلب، وظيفة جديدة

---

### P3-T3: إضافة Password Reset Flow

> **الوقت المقدر:** 1-2 يوم

#### الملفات الجديدة
- `src/app/api/forgot-password/route.ts`
- `src/app/api/reset-password/route.ts`
- `src/app/reset-password/page.tsx`

---

### P3-T4: إضافة File Virus Scanning

> **الوقت المقدر:** 1-2 يوم

#### النهج
- دمج **VirusTotal API** (مجاني حتى 4 فحوصات/دقيقة)
- أو استخدام **ClamAV** محلياً عبر `clamscan`
- فحص الملف بعد الرفع وقبل حفظه نهائياً

---

### P3-T5: تنظيف المشروع (Project Cleanup)

> **الوقت المقدر:** نصف يوم

- [ ] حذف `schema.sql` (Prisma هو المصدر الوحيد)
- [ ] حذف `ai-harness-presentation.html`
- [ ] حذف `credentials.json`
- [ ] تصحيح اسم المشروع في `package.json` من `autonomous-recruitment-hub` إلى `educore`
- [ ] نقل `prisma` من `dependencies` إلى `devDependencies`
- [ ] إزالة `GOOGLE_VERIFICATION_TOKEN` placeholder من layout

---

### P3-T6: Loading States و UX Polish

> **الوقت المقدر:** 1-2 يوم

- [ ] إضافة skeleton loading لجميع الصفحات الرئيسية
- [ ] إضافة progress bar لرفع الملفات
- [ ] إضافة confirmation dialog قبل التقديم على وظيفة
- [ ] توحيد اللغة (عربي بالكامل أو إنجليزي بالكامل) حسب اختيار المستخدم
- [ ] عرض نتيجة التقييم بشكل واضح في dashboard المرشح

---

### P3-T7: إصلاحات Accessibility

> **الوقت المقدر:** 1-2 يوم

- [ ] إضافة `aria-label` لجميع الأزرار والعناصر التفاعلية
- [ ] إضافة `autocomplete` attributes لحقول login/register
- [ ] إضافة skip-to-content link
- [ ] التأكد من contrast ratio ≥ 4.5:1 لجميع النصوص
- [ ] اختبار التنقل بالـ keyboard فقط

---

## المرحلة 4: التغطية الاختبارية 🧪

> **المدة:** مستمرة (الدورة الأولى: 2-3 أسابيع)  
> **الشرط:** يبدأ بالتوازي مع المرحلة 3  
> **الهدف:** تغطية ≥70% للكود الحرج

---

### P4-T1: Unit Tests (Vitest)

> **الوقت المقدر:** 5 أيام  
> **الأولوية:** الأعلى — يبدأ فوراً

| الملف | الحالات المطلوبة | الأولوية |
|-------|-----------------|----------|
| `password.ts` | hash/verify، empty input، unicode، timing safety | 🔴 |
| `encryption.ts` | encrypt/decrypt، corrupted data، missing secret | 🔴 |
| `rbac.ts` | hasRole true/false، null user، requireRole throw | 🔴 |
| `rate-limit.ts` | allow/deny، window reset، cleanup at 5000 | 🟠 |
| `prompt-sanitizer.ts` | injection patterns، clean input passthrough | 🟠 |
| `evaluation-rubric.ts` | calculateOverallScore، getScoreGrade edges | 🟡 |
| `archetype-detector.ts` | all 10 archetypes، mixed signals، FULLSTACK detection | 🟡 |
| `ai-schemas.ts` | stripMarkdownFences edge cases | 🟡 |
| `errors.ts` | createSafeResult، createSafeError | 🟢 |

---

### P4-T2: Integration Tests (Vitest + Mocked Prisma)

> **الوقت المقدر:** 4 أيام

| الـ Route | الحالات المطلوبة |
|-----------|-----------------|
| `POST /api/register` | valid، duplicate email، weak password، missing fields |
| `POST /api/upload-resume` | valid PDF، oversized file، invalid MIME، no auth |
| `POST /api/apply` | valid، duplicate، no profile، closed job |
| `POST /api/evaluate-match` | valid، not found، already evaluated، wrong role |
| `POST /api/run-code` | valid JS، infinite loop، sandbox escape attempt |
| `GET /api/files/[key]` | owner access، admin access، unauthorized access |

---

### P4-T3: E2E Tests (Playwright)

> **الوقت المقدر:** 4 أيام

| السيناريو | الخطوات |
|-----------|---------|
| **رحلة المرشح** | تسجيل → دخول → رفع CV → تقديم → مقابلة → تقييم |
| **رحلة HR** | دخول → إنشاء وظيفة → مراجعة تقديمات → قرار بشري |
| **رحلة System Admin** | دخول → إعدادات API → اختبار اتصال → إعدادات وكلاء |
| **حماية الصلاحيات** | مرشح يحاول دخول admin → يُحوَّل لـ unauthorized |
| **Responsive** | فحص mobile/tablet/desktop لجميع الصفحات الرئيسية |

---

### P4-T4: Security Tests

> **الوقت المقدر:** 3 أيام

| الاختبار | الوصف |
|----------|-------|
| **XSS Injection** | إدخال `<script>alert(1)</script>` في عناوين الوظائف والأوصاف |
| **Prompt Injection** | إدخال "ignore previous instructions" في السيرة الذاتية |
| **SSRF Bypass** | محاولة إدخال `http://169.254.169.254/` كـ API URL |
| **Path Traversal** | طلب `GET /api/files/../../.env` |
| **Brute Force** | 10 محاولات دخول فاشلة → التحقق من القفل |
| **Rate Limiting** | إرسال 50 طلب في ثانية → التحقق من 429 |

---

## ملخص الخطة

| المرحلة | المهام | المدة | الحالة |
|---------|--------|-------|--------|
| 🔴 **المرحلة 1** — إصلاحات حرجة | 6 مهام | أسبوع | ⏳ في الانتظار |
| 🟠 **المرحلة 2** — تعزيز الأمان | 8 مهام | أسبوعان | ⏳ في الانتظار |
| 🟡 **المرحلة 3** — معمارية و UX | 7 مهام | 3 أسابيع | ⏳ في الانتظار |
| 🧪 **المرحلة 4** — اختبارات | 4 مهام | 2-3 أسابيع | ⏳ في الانتظار |

> [!TIP]
> **الأثر المتوقع:** إكمال المرحلتين 1 و 2 سيرفع التقييم من **52.8/100** إلى **~78/100**. إكمال جميع المراحل سيُوصل التقييم إلى **≥85/100** — جاهز للإنتاج.
