/**
 * POST /api/scan-jobs
 * 
 * Scans external job sources and imports new postings.
 * Requires HR_ADMIN or SYSTEM_ADMIN role.
 */

import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/rbac";
import { createSafeResult, createSafeError } from "@/lib/errors";
import { checkRateLimit, getClientIp, createRateLimitResponse } from "@/lib/rate-limit";
import {
  scanAndImport,
  getAvailableScanners,
  type ScanRequest,
} from "@/services/job-scanner/scanner-manager";

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const rateLimit = await checkRateLimit(`scan_jobs_${clientIp}`, 5, 60000);
    if (!rateLimit.allowed) {
      return createRateLimitResponse(rateLimit.resetMs);
    }

    await requireRole(["HR_ADMIN", "SYSTEM_ADMIN"]);

    const body = await req.json();
    const { sourceType, companySlug, companyName } = body as ScanRequest;

    if (!sourceType || !companySlug || !companyName) {
      return NextResponse.json(
        createSafeError(
          null,
          "scan-jobs:validation",
          `الحقول المطلوبة: sourceType, companySlug, companyName. المصادر المتاحة: ${getAvailableScanners().join(", ")}`
        ),
        { status: 400 }
      );
    }

    const result = await scanAndImport({ sourceType, companySlug, companyName });

    return NextResponse.json(
      createSafeResult(result, `تم مسح ${result.scanned} وظيفة، استُوردت ${result.imported}، تُجوهلت ${result.skipped}.`)
    );
  } catch (error) {
    console.error("[CRITICAL ERROR - scan-jobs]:", error);
    return NextResponse.json(
      createSafeError(error, "scan-jobs", "حدث خطأ أثناء مسح مصادر الوظائف."),
      { status: 500 }
    );
  }
}

/**
 * GET /api/scan-jobs — Returns available scanner types
 */
export async function GET() {
  try {
    await requireRole(["HR_ADMIN", "SYSTEM_ADMIN"]);

    return NextResponse.json(
      createSafeResult({
        availableScanners: getAvailableScanners(),
      })
    );
  } catch (error) {
    console.error("[CRITICAL ERROR - scan-jobs:GET]:", error);
    return NextResponse.json(
      createSafeError(error, "scan-jobs:GET", "حدث خطأ."),
      { status: 500 }
    );
  }
}
