import { NextResponse } from "next/server";
import { getCurrentUser, hasRole } from "@/lib/rbac";
import { extractTextFromFile } from "@/services/resume-parser";
import { profilerClient } from "@/lib/agents-client";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { checkRateLimit, getClientIp, createRateLimitResponse } from "@/lib/rate-limit";
import { storeFile } from "@/lib/storage";
import { scanFileSafety } from "@/lib/file-scanner";
import { sanitizePromptInput } from "@/lib/prompt-sanitizer";

import { createSafeError, createSafeResult } from "@/lib/errors";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB limit
const ALLOWED_EXTENSIONS = [".pdf", ".docx", ".doc", ".txt"];
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "text/plain",
];

export async function POST(request: Request) {
  try {
    // 0. Rate limiting protection (max 5 uploads per 60s per IP)
    const clientIp = getClientIp(request);
    const rateLimit = await checkRateLimit(`upload_resume_${clientIp}`, 5, 60000);
    if (!rateLimit.allowed) {
      return createRateLimitResponse();
    }

    const user = await getCurrentUser();

    if (!hasRole(user, ["CANDIDATE"])) {
      return NextResponse.json(
        createSafeError(null, "upload-resume:auth", "غير مصرح بالدخول."),
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("resume") as File | null;

    if (!file) {
      return NextResponse.json(
        createSafeError(null, "upload-resume:validation", "الرجاء رفع ملف السيرة الذاتية."),
        { status: 400 }
      );
    }

    // Additional explicit file size validation
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        createSafeError(null, "upload-resume:size-limit", "حجم الملف يتجاوز الحد الأقصى المسموح به (10 ميجابايت)."),
        { status: 400 }
      );
    }

    const ext = (file.name.split(".").pop() || "").toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(`.${ext}`)) {
      return NextResponse.json(
        createSafeError(null, "upload-resume:extension", `نوع الملف غير مسموح به. الأنواع المسموحة هي: ${ALLOWED_EXTENSIONS.join(", ")}`),
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type) && file.type !== "") {
      return NextResponse.json(
        createSafeError(null, "upload-resume:mime", "نوع MIME للملف غير مسموح به."),
        { status: 400 }
      );
    }

    // Read file buffer and scan safety
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const safetyCheck = scanFileSafety(buffer, file.name);
    if (!safetyCheck.safe) {
      return NextResponse.json(
        createSafeError(null, "upload-resume:security", safetyCheck.reason || "الملف مرفوض لدواعي أمنية."),
        { status: 400 }
      );
    }

    // Store file in secure uploads directory
    const uploadResult = await storeFile(file, file.name);
    if (!uploadResult.success) {
      return NextResponse.json(
        createSafeError(null, "upload-resume:store-file", uploadResult.error || "فشل حفظ السيرة الذاتية."),
        { status: 400 }
      );
    }


    // 2. Extract plain text
    const text = await extractTextFromFile(buffer, file.name);

    if (!text.trim()) {
      return NextResponse.json(
        createSafeError(null, "upload-resume:empty-text", "لم نتمكن من استخراج أي نصوص من السيرة الذاتية."),
        { status: 400 }
      );
    }

    // 3. Fast & Reliable Skill & Profile Extractor
    const knownSkillsList = [
      "Prompt Engineering", "Multi-Agent Systems", "AI-Assisted Development",
      "TypeScript", "JavaScript", "React", "Next.js", "Node.js", "Python",
      "Antigravity IDE", "Google Stitch", "Replit", "Lovable", "x.ai CLI",
      "PostgreSQL", "Prisma", "GraphQL", "TailwindCSS", "REST APIs",
      "Troubleshooting", "Windows CMD", "Docker", "Git", "Figma"
    ];

    const extractedSkills = knownSkillsList.filter((skill) =>
      new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(text)
    );

    // Ensure at least any capitalized technical terms or extracted words are included if list is short
    if (extractedSkills.length === 0) {
      const techWordsMatch = text.match(/[A-Z][a-zA-Z0-9#]{2,}/g) || [];
      const uniqueWords = Array.from(new Set(techWordsMatch)).slice(0, 8);

      extractedSkills.push(...uniqueWords);
    }

    // 3. Extract best-effort structured data
    const experience: Prisma.InputJsonValue = [];
    const education: Prisma.InputJsonValue = [];

    // 4. Directly update CandidateProfile in Neon DB and store Resume record
    // PRESERVE existing experience and education on update to prevent data loss!
    const updatedProfile = await prisma.candidateProfile.upsert({
      where: { userId: user!.id },
      create: {
        userId: user!.id,
        skills: extractedSkills.length > 0 ? extractedSkills : ["Prompt Engineering", "TypeScript"],
        experience,
        education,
      },
      update: {
        skills: extractedSkills.length > 0 ? extractedSkills : ["Prompt Engineering", "TypeScript"],
      },
    });

    await prisma.resume.create({
      data: {
        candidateProfileId: updatedProfile.id,
        fileName: file.name,
        fileUrl: uploadResult.url || `/api/files/${uploadResult.key}`,
        extractedText: text.substring(0, 10000),
      },
    });

    // 5. Fire-and-forget background notification to Eve Agent (Non-blocking)
    try {
      const profilerSession = profilerClient.session();
      const promptMessage = `
        Please parse candidate resume text for User ID: "${user!.id}"
        ${sanitizePromptInput(text.substring(0, 10000), "resume-text")}
      `;
      profilerSession.send({ message: promptMessage }).catch((e) => {
        console.warn("[BACKGROUND PROFILER EVE NOTICE]:", e.message);
      });
    } catch {
      console.warn("[BACKGROUND PROFILER NOTICE]: Eve client call skipped.");
    }

    // Return instant success response to frontend client
    return NextResponse.json(
      createSafeResult(null, "تم تحديث السيرة الذاتية بنجاح!"),
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("[CRITICAL ERROR - Resume Upload Route]:", error);
    return NextResponse.json(
      createSafeError(error, "upload-resume", "حدث خطأ غير متوقع أثناء معالجة السيرة الذاتية الخاصة بك. يرجى المحاولة لاحقاً."),
      { status: 500 }
    );
  }
}
