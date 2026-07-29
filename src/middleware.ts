import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import type { UserRole } from "@/types";

function hasRole(role: UserRole | undefined, allowedRoles: UserRole[]): boolean {
  return !!role && allowedRoles.includes(role);
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // List of public API endpoints that do not require authentication
  const PUBLIC_API_ROUTES = [
    "/api/auth",
    "/api/register",
    "/api/forgot-password",
    "/api/reset-password",
    "/api/verify-email",
  ];

  const isPublicApi = PUBLIC_API_ROUTES.some((route) => path.startsWith(route));

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    if (path.startsWith("/api")) {
      if (isPublicApi) {
        return NextResponse.next();
      }
      return NextResponse.json(
        { success: false, error: "غير مصرح بالدخول. يرجى تسجيل الدخول أولاً." },
        { status: 401 }
      );
    }
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  const role = token.role as UserRole | undefined;

  if (!role) {
    if (path.startsWith("/api")) {
      return NextResponse.json(
        { success: false, error: "غير مصرح بالوصول لهذا المورد." },
        { status: 403 }
      );
    }
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (path.startsWith("/admin/system") && !hasRole(role, ["SYSTEM_ADMIN"])) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (path.startsWith("/admin/tech") && !hasRole(role, ["TECH_ADMIN", "SYSTEM_ADMIN"])) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (path.startsWith("/admin/hr") && !hasRole(role, ["HR_ADMIN", "SYSTEM_ADMIN"])) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (path.startsWith("/candidate") && !hasRole(role, ["CANDIDATE", "SYSTEM_ADMIN", "HR_ADMIN", "TECH_ADMIN"])) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/candidate/:path*",
    "/api/:path*",
  ],
};
