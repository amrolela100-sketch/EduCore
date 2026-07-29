"use client";

import React from "react";
import { motion } from "framer-motion";
import { AppNavbar } from "@/components/app-navbar";
import { AppFooter } from "@/components/app-footer";
import { BreadcrumbNav, BreadcrumbItem } from "@/components/breadcrumb-nav";
import { AppSidebar, MobileSidebarButton, useSidebar } from "@/components/layout/app-sidebar";
import { cn } from "@/lib/utils";
import { Bell, LogOut, Search } from "lucide-react";
import { signOut } from "next-auth/react";

export type PageShellVariant =
  | "default"
  | "system"
  | "hr"
  | "tech"
  | "candidate"
  | "interview"
  | "auth"
  | "public";

const VARIANT_TO_ROLE = {
  system: "SYSTEM_ADMIN" as const,
  hr: "HR_ADMIN" as const,
  tech: "TECH_ADMIN" as const,
  candidate: "CANDIDATE" as const,
};

interface PageShellProps {
  children: React.ReactNode;
  variant?: PageShellVariant;
  userName?: string | null;
  bare?: boolean;
  breadcrumbs?: BreadcrumbItem[];
  navActions?: React.ReactNode;
  showLogout?: boolean;
  className?: string;
}

export function PageShell({
  children,
  variant = "default",
  userName,
  bare = false,
  breadcrumbs,
  navActions,
  showLogout = true,
  className = "",
}: PageShellProps) {
  const { collapsed } = useSidebar();
  const isAuthenticated = ["system", "hr", "tech", "candidate"].includes(variant);
  const role = isAuthenticated ? VARIANT_TO_ROLE[variant as keyof typeof VARIANT_TO_ROLE] : null;

  if (bare) {
    return (
      <div className={`min-h-screen flex flex-col ${className}`}>
        {children}
      </div>
    );
  }

  /* ─── Public / Auth pages ─── */
  const isPublicOrAuth = variant === "auth" || variant === "public" || variant === "default";

  if (isPublicOrAuth) {
    return (
      <div className={cn("min-h-screen flex flex-col bg-white text-ink antialiased", className)}>
        <AppNavbar
          variant={variant}
          userName={userName}
          actions={navActions}
          showLogout={showLogout}
        />
        <main id="main-content" className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-8 py-6">
          {breadcrumbs && breadcrumbs.length > 0 && <BreadcrumbNav items={breadcrumbs} />}
          {children}
        </main>
        <AppFooter variant="dark" />
      </div>
    );
  }

  /* ─── Authenticated CRM Layout ─── */
  const sidebarWidth = collapsed ? "72px" : "260px";

  return (
    <div className={cn("min-h-screen flex bg-[#FAFAFA] text-ink antialiased", className)}>
      {/* Sidebar */}
      {role && <AppSidebar role={role} userName={userName} />}

      {/* Main content area */}
      <div
        className="flex-1 flex flex-col min-h-screen transition-all duration-300 ease-out"
        style={{ marginLeft: role ? sidebarWidth : 0 }}
      >
        {/* CRM Topbar */}
        <header className="sticky top-0 z-20 bg-white border-b border-[#EAEAEA] shadow-sm">
          <div className="flex items-center justify-between px-6 h-16 w-full">
            <div className="flex items-center gap-4">
              <MobileSidebarButton />
              {breadcrumbs && breadcrumbs.length > 0 ? (
                 <BreadcrumbNav items={breadcrumbs} />
              ) : (
                 <AnimateHeaderBadge variant={variant} />
              )}
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-ink/60 hover:bg-ink/5 rounded-full transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-coral rounded-full border border-white"></span>
              </button>
              {navActions}
              {showLogout && (
                 <button 
                   onClick={() => signOut({ callbackUrl: "/" })}
                   className="flex items-center gap-2 px-3 py-1.5 text-sm font-label-caps text-ink/70 hover:bg-ink/5 hover:text-coral rounded-md transition-colors"
                 >
                   <LogOut className="w-4 h-4" />
                   Logout
                 </button>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main id="main-content" className="flex-grow px-6 lg:px-10 py-8">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.28, 0, 0.22, 1] }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

function AnimateHeaderBadge({ variant }: { variant: PageShellVariant }) {
  const labels: Record<string, { text: string; en: string; accent: string }> = {
    system: { text: "لوحة إدارة النظام", en: "System Workspace", accent: "#141414" },
    hr: { text: "تفتيش HR", en: "HR Workspace", accent: "#141414" },
    tech: { text: "مختبر التقييم التقني", en: "Tech Workspace", accent: "#141414" },
    candidate: { text: "لوحة المرشح", en: "Candidate Workspace", accent: "#E03E00" },
    interview: { text: "جلسة اختبار محمية", en: "Sandboxed Testing", accent: "#141414" },
  };
  const info = labels[variant] ?? { text: "", en: "Workspace", accent: "#0071e3" };

  return (
    <div className="flex items-center gap-2">
      <span className="font-body-sm font-medium text-ink/70">
        {info.en}
      </span>
    </div>
  );
}
