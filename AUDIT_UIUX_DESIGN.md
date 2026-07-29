# EduCore — UI/UX & Design System Audit Report
**Date:** 2026-07-24 | **Scope:** `app/**/page.tsx` + Page Shells + Layout + Globals

---

## Executive Summary
الـ UI عموماً "Premium" ومتناسق بصرياً، بس البنية تحت الهود **فوضى Design Tokens**. فيه 220+ استخدام لم由于工作hardcoded colors بدل المتغيرات المعرفة في `globals.css`. الـ Page Shells متكررة 5 مرات. الـ i18n partially applied. المشروع **يستحق Design System صغير** (tokens + components) لتقليل التكرار وتحسين الصيانة.

---

## 🔴 Page-Level Issues

| # | Page | Issue | Severity |
|---|------|-------|----------|
| 1 | `/` (Home) | `any[]` type على `jobPostings`; لا empty state placeholder إذا فشلت DB (بتعتمد على الـ child component) | Medium |
| 2 | `/login` | كل الـ inputs native `<input>` مش shadcn/ui Input; لا `aria-invalid`/`aria-describedby` linked لخطأ البنر | Medium |
| 3 | `/login` | `text-red-500` hardcoded بدل design token `--color-flag` (#9B3B2C) على أيقونة الخطأ | Low |
| 4 | `/unauthorized` | `ArrowLeft` أيقونة ثابتة — بعكس RTL مع أن الصفحة بتدعم تبديل اللغة | Low |
| 5 | `/admin/system` | كل الـ header text إنجليزي فقط بدون `t()`/ترجمة (باقي الصفحات عربية) | Medium |
| 6 | `/admin/tech` | Empty state إنجليزي فقط: "No evaluated candidates in the pipeline yet." — لا i18n | Medium |
| 7 | `/candidate/interview/[id]` | `Cancel & Exit` نص إنجليزي hardcoded بدون `useLanguage()` | Low |
| 8 | `/candidate/interview/[id]` | `notFound()` بتنادي بدون UI fallback مخصص — بتعرض Next.js default 404 | Low |
| 9 | `/candidate` | DB error مش بيظهر للمستخدم بشكل صريح (console.error بس) | Medium |
| 10 | All admin pages | `font-mono text-[11px]` повтор كتير — مفيش utility class مقنن للـ metadata labels | Low |

---

## 🟡 Component-Level Issues

| # | Component / Pattern | Issue | Severity |
|---|---------------------|-------|----------|
| 11 | **Page Shells** | `HrPageClient`, `SystemPageClient`, `TechPageClient`, `CandidatePageClient`, `InterviewPageClient` — كلهم نفس الـ wrapper تقريباً (تكرار 5 مرات) | **High** |
| 12 | **Page Shells** | `CandidatePageClient` بس هي اللي بتستخدم `PageFadeIn` — باقي الصفحات لا inconsistently | Medium |
| 13 | **AppNavbar** | Mobile menu بيفتح/يغلق بـ `AnimatePresence` missing — الـ `exit` animation مش شغالة لأنه مش محاط بـ `AnimatePresence` | Medium |
| 14 | **AppNavbar** | `aria-label="Toggle menu"` موجود، بس فيه duplicate markup (User pill بتتكرر في Desktop + Mobile) | Low |
| 15 | **BreadcrumbNav** | Labels hardcoded إنجليزي/عربي مش مستخدمة من i18n dictionary (مثال: `"Admin Workspace"`, `"HR Audit Ledger"`) | Medium |
| 16 | **system-settings-client** | Classname `text-label-caps` مش موجود في `globals.css` (probable typo — المقصود `font-label-caps` بس بدون `text-label-caps`) | Medium |
| 17 | **system-settings-client** | `hover:translate-x-1` على sidebar buttons — في RTL هذه animation بتتحرك لليمين مش لليسار (مفروض `hover:translate-x-[-4px]` أو `hover:translate-x` conditional) | Medium |

---

## 🔵 Design Token-Level Issues

| # | Issue | Evidence | Severity |
|---|-------|----------|----------|
| 18 | **Hardcoded colors everywhere** | `#1B211D` استخدم 220 مرة, `#14665A` 188 مرة, `#D7DAD1` 133 مرة عبر كل `src/` | **High** |
| 19 | **Tokens معرفة بس مش مستخدمة** | في `globals.css` `--color-paper`, `--color-ink`, `--color-verified` معرفين بس كل الـ pages بتستخدم hardcoded hex | **High** |
| 20 | **Dual color system** | `oklch` (shadcn defaults) + custom tokens (`--color-paper` etc) + hardcoded hex = 3 competing palettes | High |
| 21 | **No semantic spacing tokens** | `p-5 sm:p-6`, `rounded-2xl`, `gap-6` повтор على كل card بدون Card component موحد | Medium |
| 22 | **Typography utilities ignored** | `font-display-lg`, `font-headline-md` موجودين في CSS بس الصفحات بتستخدم `text-xl font-bold` مباشرة | Medium |
| 23 | **Shadow inconsistency** | فيه 3 أنواع shadows: `shadow-xs`, `shadow-[0_8px_30px_rgba(0,0,0,0.06)]`, `shadow-[0_1px_3px_rgba(0,0,0,0.04)]` — مفيش shadow token | Low |

---

## ⚠️ RTL & Accessibility

| # | Issue | Severity |
|---|-------|----------|
| 24 | `dir="rtl"` hardcoded static على `<html>` — حتى المحتوى الإنجليزي (System, Tech) بيظهر RTL | **High** |
| 25 | `prefers-reduced-motion` مش مدروس — كل framer-motion animations بتشتغل دائماً | Medium |
| 26 | Scrollbar customization (`::-webkit-scrollbar`) كويس بس ما في fallback لـ Firefox (`scrollbar-width`) | Low |
| 27 | Color contrast كويس عموماً (verified #14665A على #F5F6F2 = ~7:1)، بس `#1B211D]/40` تكسيات text ممكن تكون ضعيفة على بعض الشاشات | Low |
| 28 | الـ `text-[11px]` كتير — صغير جداً وممكن يسبب readability issues على mobile | Medium |

---

## 📊 Metrics Summary

```
Hardcoded Colors (Top 5):
- #1B211D  → 220 usages
- #14665A  → 188 usages
- #D7DAD1  → 133 usages
- #F5F6F2  → 45 usages
- #FAFBF8  → 17 usages

Page Shell Duplication: 5 nearly identical wrappers
shadcn/ui Components Used: ~3 (Button, Modal, Motion-Wrapper)
Custom Native Inputs: Majority
i18n Partial Coverage: ~60%
```

---

## 🏗️ Recommendation: Build a Mini Design System

### 1. Tokens Layer (CSS Variables)
```css
:root {
  /* Already defined — start USING them */
  --color-paper: #F5F6F2;
  --color-ink: #1B211D;
  --color-verified: #14665A;
  --color-human: #B8752F;
  --color-flag: #9B3B2C;
  --color-ledger: #D7DAD1;
  --color-surface: #FAFBF8;

  /* Add spacing + shadow tokens */
  --shadow-card: 0 1px 3px rgba(0,0,0,0.04);
  --shadow-elevated: 0 8px 30px rgba(0,0,0,0.06);
}
```

### 2. Utility Classes (Tailwind Layer)
```css
@utility bg-paper { background-color: var(--color-paper); }
@utility text-ink { color: var(--color-ink); }
@utility border-ledger { border-color: var(--color-ledger); }
/* ... etc to replace 500+ hardcoded usages */
```

### 3. Shared Components needed:
- `<PageShell variant="hr|tech|system|candidate">` → واحد بدل 5 wrappers
- `<Card>` → `bg-white border border-ledger rounded-2xl` + variants
- `<Input>` → shadcn/ui wrapper مع focus ring tokenized
- `<Badge>` → already partially built in motion-wrapper, expand it
- `<EmptyState>` → consistent empty, error, loading states
- `<SectionHeader>` → للـ h1 + subtitle الم повтор على كل page

### 4. RTL Fix:
```tsx
// Replace static dir="rtl" with dynamic from language context
<html dir={direction} lang={language}>
```

---

## ✅ What's Working Well

- **Unified Navbar & Footer** (`AppNavbar`/`AppFooter`) — نموذجي لـ DRY principle
- **Animation system** (`motion-wrapper.tsx`) — micro-interactions كويسة
- **Color palette** محددة وواضحة (المشكلة في الاستخدام مش التحديد)
- **Responsive breakpoints** (`sm:`, `lg:`, `md:`) موجودة بشكل ثابت
- **shadcn/ui setup** موجود في المشروع وقابل للتوسيع

---

## Priority Queue (Fix Order)

1. **P0**: Refactor 5 Page Shells → `<PageShell variant=...>`
2. **P0**: Replace hardcoded colors بالـ CSS custom properties utilities
3. **P1**: Fix `dir="rtl"` static → dynamic حسب اللغة
4. **P1**: Extract `<Card>`, `<SectionHeader>`, `<EmptyState>` components
5. **P2**: Add `prefers-reduced-motion` media query guards
6. **P2**: Complete i18n coverage للـ Admin pages
7. **P3**: Unify shadows + spacing tokens
8. **P3**: Accessibility polish (aria-current, aria-invalid)
