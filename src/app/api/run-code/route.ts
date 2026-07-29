import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { checkRateLimit, getClientIp, createRateLimitResponse } from "@/lib/rate-limit";
import { executeSandboxedCode } from "@/lib/eval-wrapper";
import { createSafeError } from "@/lib/errors";

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const rateLimit = await checkRateLimit(`run_code_${clientIp}`, 20, 60000);
    if (!rateLimit.allowed) {
      return createRateLimitResponse();
    }

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "غير مصرح بالدخول." }, { status: 401 });
    }

    const { code, language = "typescript" } = await request.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "كود البرمجة مطلوب." }, { status: 400 });
    }

    const evalResult = await executeSandboxedCode(code, language, 3000);

    return NextResponse.json(evalResult, { status: evalResult.success ? 200 : 400 });
  } catch (err: unknown) {
    console.error("[SANDBOX CODE EXECUTION ROUTE ERROR]:", err);
    const safeErr = createSafeError(err, "run-code", "حدث خطأ أثناء تنفيذ الكود.");
    return NextResponse.json(safeErr, { status: 500 });
  }
}
