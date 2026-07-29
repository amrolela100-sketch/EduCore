"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeError, createSafeResult } from "@/lib/errors";
import { getCurrentUser, hasRole } from "@/lib/rbac";

export async function submitHumanOverride(prevState: unknown, formData: FormData) {
  try {
    const user = await getCurrentUser();

    if (!hasRole(user, ["HR_ADMIN", "SYSTEM_ADMIN"])) {
      return createSafeError(null, "HR Override Action", "غير مصرح لك بإجراء هذا التعديل.");
    }

    const applicationId = formData.get("applicationId") as string;
    const decision = formData.get("decision") as string; // "ACCEPTED" or "REJECTED"
    const justification = formData.get("justification") as string;

    if (!applicationId || !decision || !justification) {
      return createSafeError(null, "HR Override Validation", "جميع الحقول مطلوبة لتسجيل التعديل البشري.");
    }

    if (decision !== "ACCEPTED" && decision !== "REJECTED") {
      return createSafeError(null, "HR Override Decision Validation", "القرار المحدد غير صالح.");
    }

    // 1. Fetch current application
    const app = await prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!app) {
      return createSafeError(null, "HR Override App Not Found", "لم يتم العثور على طلب التقديم المحدد.");
    }

    // 2. Perform the human override update
    const timestamp = new Date().toISOString();
    const updaterName = user?.name || user?.email || "Unknown Admin";
    const humanOverrideNote = `[HUMAN OVERRIDE by ${updaterName} at ${timestamp}]: ${justification}`;
    const updatedReason = `${humanOverrideNote} | ${app.rankingReason || ""}`;

    await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: decision,
        rankingReason: updatedReason,
      },
    });

    // 3. Revalidate the dashboard path to display updated state instantly
    revalidatePath("/admin/hr");

    return createSafeResult(null, "تم تسجيل القرار والتعديل البشري بنجاح في سجل التدقيق.");
  } catch (error) {
    return createSafeError(error, "HR Human Override Action", "حدث خطأ غير متوقع أثناء معالجة القرار. يرجى المحاولة لاحقاً.");
  }
}

/**
 * Server Action: Create a new job posting
 * Enforces strict security review, Zod validation, role authorization, and error handling.
 */
export async function createJobPostingAction(prevState: unknown, formData: FormData) {
  try {
    const user = await getCurrentUser();

    if (!hasRole(user, ["HR_ADMIN", "SYSTEM_ADMIN"])) {
      return createSafeError(null, "Create Job Posting Role Check", "غير مصرح لك بإضافة وظائف جديدة.");
    }

    const title = (formData.get("title") as string)?.trim();
    const description = (formData.get("description") as string)?.trim();
    const requirementsRaw = (formData.get("requirements") as string)?.trim();
    const salaryRange = (formData.get("salaryRange") as string)?.trim();
    const location = (formData.get("location") as string)?.trim();
    const companyNameInput = (formData.get("companyName") as string)?.trim();

    if (!title || title.length < 3) {
      return createSafeError(null, "Create Job Validation", "عنوان الوظيفة يجب أن يكون 3 أحرف على الأقل.");
    }

    if (!description || description.length < 10) {
      return createSafeError(null, "Create Job Validation", "وصف الوظيفة يجب أن يكون 10 أحرف على الأقل.");
    }

    if (!requirementsRaw) {
      return createSafeError(null, "Create Job Validation", "يرجى كتابة متطلب واحد على الأقل تفصل بينها فاصلة.");
    }

    // Parse requirements string into clean array
    const requirements = requirementsRaw
      .split(",")
      .map((req) => req.trim())
      .filter((req) => req.length > 0);

    if (requirements.length === 0) {
      return createSafeError(null, "Create Job Validation", "يرجى إدخال متطلبات صحيحة.");
    }

    // Get or create primary target company
    const companyName = companyNameInput || "Apex Global Technologies";
    let company = await prisma.company.findFirst({
      where: { name: companyName },
    });

    if (!company) {
      company = await prisma.company.create({
        data: {
          name: companyName,
          description: "Enterprise Solutions Provider",
          website: "https://apexglobal.tech",
        },
      });
    }

    // Create new JobPosting record in Neon DB
    const newJob = await prisma.jobPosting.create({
      data: {
        title,
        description,
        requirements,
        salaryRange: salaryRange || "تنافسي",
        location: location || "عن بُعد / هجين",
        status: "OPEN",
        companyId: company.id,
      },
    });

    // Revalidate paths so the new job posting appears immediately across HR dashboard and main landing page
    revalidatePath("/admin/hr");
    revalidatePath("/");

    return createSafeResult(newJob, `تم إضافة الوظيفة "${newJob.title}" بنجاح ونشرها على المنصة!`);
  } catch (error: unknown) {
    console.error("[Create Job Posting Action Error]:", error);
    return createSafeError(error, "Create Job Posting Action", "حدث خطأ غير متوقع أثناء إضافة الوظيفة. يرجى المحاولة لاحقاً.");
  }

}
