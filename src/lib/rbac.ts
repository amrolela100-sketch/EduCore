import { getServerSession } from "next-auth";
import { authOptions } from "./auth-options";
import { UserRole } from "@/types";

export interface CurrentUser {
  id: string;
  email: string;
  name?: string | null;
  role: UserRole;
}

/**
 * Gets the current authenticated user and their role from the server session.
 * Returns null if the user is not authenticated.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session?.user?.role) {
      return null;
    }
    return {
      id: session.user.id,
      email: session.user.email || "",
      name: session.user.name,
      role: session.user.role,
    };
  } catch (error) {
    console.error("[getCurrentUser Error]:", error);
    return null;
  }
}

/**
 * Checks if a given user has one of the allowed roles.
 */
export function hasRole(user?: { role?: UserRole | string } | null, allowedRoles?: UserRole[] | string[]): boolean {
  if (!user || !user.role || !allowedRoles) return false;
  return (allowedRoles as string[]).includes(user.role);
}

/**
 * Asserts that the current user has one of the allowed roles.
 * Throws an error if authentication fails or if the user doesn't have permissions.
 */
export async function requireRole(allowedRoles: UserRole[]): Promise<CurrentUser> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("غير مصرح. يرجى تسجيل الدخول.");
  }

  if (!allowedRoles.includes(user.role)) {
    throw new Error("ليس لديك الصلاحية للوصول إلى هذا المورد.");
  }

  return user;
}
