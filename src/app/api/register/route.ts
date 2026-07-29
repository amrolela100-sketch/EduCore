import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { checkRateLimit, getClientIp, createRateLimitResponse } from "@/lib/rate-limit";

let cachedCandidateRoleId: string | null = null;

export async function POST(request: Request) {
  try {
    // 0. Rate limiting protection (max 5 registrations per 60s per IP)
    const clientIp = getClientIp(request);
    const rateLimit = await checkRateLimit(`register_${clientIp}`, 5, 60000);
    if (!rateLimit.allowed) {
      return createRateLimitResponse(rateLimit.resetMs);
    }

    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: "الرجاء إدخال جميع الحقول المطلوبة." },
        { status: 400 }
      );
    }

    // 1. Password strength validation
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: "كلمة المرور يجب أن تكون 8 أحرف على الأقل." },
        { status: 400 }
      );
    }

    // 2. Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "صيغة البريد الإلكتروني غير صحيحة." },
        { status: 400 }
      );
    }

    // 3. Name length validation
    const trimmedName = name.trim();
    if (trimmedName.length < 2 || trimmedName.length > 100) {
      return NextResponse.json(
        { success: false, error: "الاسم يجب أن يكون بين 2 و 100 حرف." },
        { status: 400 }
      );
    }

    // 4. Fetch and cache the CANDIDATE role ID to avoid database queries on subsequent calls
    if (!cachedCandidateRoleId) {
      const candidateRole = await prisma.role.findUnique({
        where: { name: "CANDIDATE" },
      });

      if (!candidateRole) {
        return NextResponse.json(
          { success: false, error: "لم يتم تكوين دور المرشح في النظام." },
          { status: 500 }
        );
      }
      cachedCandidateRoleId = candidateRole.id;
    }

    // 5. Hash password
    const passwordHash = hashPassword(password);

    // 6. Create User and CandidateProfile atomically in a transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: email.toLowerCase().trim(),
          name: trimmedName,
          passwordHash,
          roleId: cachedCandidateRoleId!,
        },
      });

      await tx.candidateProfile.create({
        data: {
          userId: newUser.id,
          skills: [],
          experience: [],
          education: [],
          certifications: [],
          languages: [],
          projects: [],
        },
      });

      return newUser;
    });

    return NextResponse.json({
      success: true,
      message: "تم إنشاء الحساب بنجاح. يمكنك الآن تسجيل الدخول.",
      userId: user.id,
    });
  } catch (error: unknown) {
    // 7. Catch Prisma unique constraint violation (P2002) for email duplicate checks
    const isPrismaError =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: unknown }).code === "P2002";
    if (isPrismaError) {
      return NextResponse.json(
        { success: false, error: "هذا البريد الإلكتروني مسجل بالفعل." },
        { status: 400 }
      );
    }

    console.error("[CRITICAL ERROR - Registration Route]:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ غير متوقع أثناء التسجيل. يرجى المحاولة لاحقاً." },
      { status: 500 }
    );
  }
}
