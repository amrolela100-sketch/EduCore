import { NextResponse } from "next/server";
import { prisma, withDbRetry } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { createSafeError, createSafeResult } from "@/lib/errors";
import { checkRateLimit, getClientIp, createRateLimitResponse } from "@/lib/rate-limit";
import { Prisma } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const rateLimit = await checkRateLimit(`reset_pw_${clientIp}`, 5, 60000);
    if (!rateLimit.allowed) {
      return createRateLimitResponse();
    }

    const body = await request.json().catch(() => ({}));
    const { token, newPassword } = body || {};

    if (!token || !newPassword) {
      return NextResponse.json(
        createSafeError(null, "reset-password:validation", "جميع الحقول مطلوبة."),
        { status: 400 }
      );
    }

    if (typeof newPassword !== "string" || newPassword.length < 8) {
      return NextResponse.json(
        createSafeError(null, "reset-password:strength", "كلمة المرور يجب أن تكون 8 أحرف على الأقل."),
        { status: 400 }
      );
    }

    const user = await withDbRetry(() =>
      prisma.user.findFirst({
        where: { passwordResetToken: token } as Prisma.UserWhereInput,
      })
    );

    if (!user) {
      return NextResponse.json(
        createSafeError(null, "reset-password:token", "رمز إعادة التعيين غير صالح أو مستخدم مسبقاً."),
        { status: 400 }
      );
    }

    const userWithToken = user as typeof user & { passwordResetExpiresAt?: Date | null };
    if (userWithToken.passwordResetExpiresAt && userWithToken.passwordResetExpiresAt < new Date()) {
      return NextResponse.json(
        createSafeError(null, "reset-password:expired", "انتهت صلاحية رمز إعادة التعيين. يرجى طلب رمز جديد."),
        { status: 400 }
      );
    }

    const newPasswordHash = hashPassword(newPassword);

    await withDbRetry(() =>
      prisma.user.update({
        where: { id: user.id },
        data: {
          passwordHash: newPasswordHash,
          passwordResetToken: null,
          passwordResetExpiresAt: null,
        } as Prisma.UserUpdateInput,
      })
    );

    return NextResponse.json(
      createSafeResult(null, "تم تغيير كلمة المرور بنجاح! يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة."),
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("[RESET PASSWORD ERROR]:", error);
    return NextResponse.json(
      createSafeError(error, "reset-password", "حدث خطأ غير متوقع أثناء تغيير كلمة المرور."),
      { status: 500 }
    );
  }
}
