import { NextResponse } from "next/server";
import { prisma, withDbRetry } from "@/lib/db";
import { createSafeError, createSafeResult } from "@/lib/errors";
import { checkRateLimit, getClientIp, createRateLimitResponse } from "@/lib/rate-limit";
import { Prisma } from "@prisma/client";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const rateLimit = await checkRateLimit(`forgot_pw_${clientIp}`, 3, 60000);
    if (!rateLimit.allowed) {
      return createRateLimitResponse();
    }

    const body = await request.json().catch(() => ({}));
    const email = body?.email;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        createSafeError(null, "forgot-password:email", "البريد الإلكتروني مطلوب."),
        { status: 400 }
      );
    }

    const user = await withDbRetry(() =>
      prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
      })
    );

    // Always return safe success response to avoid email enumeration
    if (!user) {
      return NextResponse.json(
        createSafeResult(null, "إذا كان البريد الإلكتروني مسجلاً، فستصلك تعليمات استعادة كلمة المرور قريباً."),
        { status: 200 }
      );
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await withDbRetry(() =>
      prisma.user.update({
        where: { id: user.id },
        data: {
          passwordResetToken: resetToken,
          passwordResetExpiresAt: expiresAt,
        } as Prisma.UserUpdateInput,
      })
    );

    // Development helper logging (in dev environment only)
    if (process.env.NODE_ENV === "development") {
      console.log(`[DEV ONLY - PASSWORD RESET LINK]: /reset-password?token=${resetToken}`);
    }

    return NextResponse.json(
      createSafeResult(
        null,
        "إذا كان البريد الإلكتروني مسجلاً، فستصلك تعليمات استعادة كلمة المرور قريباً."
      ),
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("[FORGOT PASSWORD ERROR]:", error);
    return NextResponse.json(
      createSafeError(error, "forgot-password", "حدث خطأ أثناء إرسال طلب استعادة كلمة المرور."),
      { status: 500 }
    );
  }
}
