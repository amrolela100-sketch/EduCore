import { NextResponse } from "next/server";
import { createSafeError } from "./errors";

/**
 * Validates request origin against allowed host to prevent CSRF on state-changing API requests.
 */
export function validateRequestOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const host = request.headers.get("host");

  if (!host) return true;

  if (origin) {
    try {
      const originHost = new URL(origin).host;
      return originHost === host;
    } catch {
      return false;
    }
  }

  if (referer) {
    try {
      const refererHost = new URL(referer).host;
      return refererHost === host;
    } catch {
      return false;
    }
  }

  return true;
}

export function createCsrfForbiddenResponse(): NextResponse {
  return NextResponse.json(
    createSafeError(null, "CSRF Check", "تم رفض الطلب: المصدر غير موثوق به (CSRF protection)."),
    { status: 403 }
  );
}
