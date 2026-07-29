import { NextResponse } from "next/server";
import { prisma, withDbRetry } from "@/lib/db";
import { createSafeError, createSafeResult } from "@/lib/errors";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        createSafeError(null, "verify-email:token", "رمز التحقق مفقود."),
        { status: 400 }
      );
    }

    const user = await withDbRetry(() =>
      prisma.user.findFirst({
        where: { emailVerificationToken: token } as Prisma.UserWhereInput,
      })
    );

    if (!user) {
      return NextResponse.json(
        createSafeError(null, "verify-email:invalid", "رمز التحقق غير صالح أو مستخدم مسبقاً."),
        { status: 400 }
      );
    }

    const userWithToken = user as typeof user & { emailVerificationExpiresAt?: Date | null };
    if (userWithToken.emailVerificationExpiresAt && userWithToken.emailVerificationExpiresAt < new Date()) {
      return NextResponse.json(
        createSafeError(null, "verify-email:expired", "انتهت صلاحية رمز التحقق. يرجى طلب رمز جديد."),
        { status: 400 }
      );
    }

    await withDbRetry(() =>
      prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: true,
          emailVerificationToken: null,
          emailVerificationExpiresAt: null,
        } as Prisma.UserUpdateInput,
      })
    );

    return NextResponse.json(
      createSafeResult(null, "تم تفعيل البريد الإلكتروني بنجاح! يمكنك الآن تسجيل الدخول."),
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("[VERIFY EMAIL ERROR]:", error);
    return NextResponse.json(
      createSafeError(error, "verify-email", "حدث خطأ أثناء تفعيل البريد الإلكتروني."),
      { status: 500 }
    );
  }
}
