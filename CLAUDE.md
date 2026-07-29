# 🏛️ EduCore Architecture & Code Quality Directives

## 1. Zero Monolithic & Duplicate Code Policy
- Never create ad-hoc helper duplicates. Always inspect `@/lib/` before implementing new logic.
- Orphaned or duplicated files (e.g. typos in extensions or spaces in file names) must be deleted immediately.

## 2. Mandatory Centralized RBAC
- Role authorization MUST exclusively use `@/lib/rbac` utility functions (`getCurrentUser`, `hasRole`, `requireRole`).
- Direct string comparisons like `session.user.role === 'HR_ADMIN'` inside page routes, server actions, or API handlers are strictly prohibited.

## 3. Server-Side Error Contract & Type Safety
- All Server Actions MUST use the standardized `SafeResult<T>` pattern defined in `@/lib/errors`.
- Never return arbitrary raw objects `{ success: boolean, error: string }`. Always return responses wrapped via `createSafeResult()` or `createSafeError()`.

## 4. Single Source of Truth for Database Queries
- All database write operations and critical reads must leverage Prisma Client via `@/lib/db`.
- Use `withDbRetry()` for transient failure protection on sensitive data mutations.

## 5. UI & RTL Component Integrity
- Code snippets, terminal logs, and telemetry viewers MUST enforce `dir="ltr"` and `text-left` explicitly to prevent text inversion in Arabic/RTL mode.
