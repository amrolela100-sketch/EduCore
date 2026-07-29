"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { LanguageToggle } from "@/components/language-toggle";
import { LogoutButton } from "@/components/logout-button";
import { useLanguage } from "@/components/language-context";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

/**
 * Unified navigation bar component for all pages.
 * Replaces duplicated header markup across the system.
 */

export type NavbarVariant = "default" | "system" | "hr" | "tech" | "candidate" | "interview" | "auth" | "public";

interface AppNavbarProps {
  /** Current user's display name or email */
  userName?: string | null;
  /** Which workspace/role badge to show */
  variant?: NavbarVariant;
  /** Optional right-side extra actions (e.g. "Cancel & Exit" link) */
  actions?: React.ReactNode;
  /** Whether to show the logout button (default: true for authenticated variants) */
  showLogout?: boolean;
}

const variantConfig: Record<NavbarVariant, { badge: string; badgeEn: string; borderColor: string; bgColor: string; textColor: string }> = {
  default:   { badge: "",                         badgeEn: "",                         borderColor: "", bgColor: "", textColor: "" },
  system:    { badge: "لوحة إدارة النظام",         badgeEn: "System Admin",             borderColor: "border-flag", bgColor: "bg-flag/5", textColor: "text-flag" },
  hr:        { badge: "لوحة تفتيش HR",             badgeEn: "HR Administration",        borderColor: "border-human", bgColor: "bg-human/5", textColor: "text-human" },
  tech:      { badge: "مختبر التقييم التقني",       badgeEn: "Tech Workspace",           borderColor: "border-verified", bgColor: "bg-verified/5", textColor: "text-verified" },
  candidate: { badge: "لوحة المرشح",               badgeEn: "Candidate Workspace",      borderColor: "border-verified", bgColor: "bg-verified/5", textColor: "text-verified" },
  interview: { badge: "جلسة اختبار محمية",          badgeEn: "Sandboxed Testing",        borderColor: "border-human", bgColor: "bg-human/5", textColor: "text-human" },
  auth:      { badge: "",                          badgeEn: "",                         borderColor: "", bgColor: "", textColor: "" },
  public:    { badge: "",                          badgeEn: "",                         borderColor: "", bgColor: "", textColor: "" },
};

export function AppNavbar({ userName, variant = "default", actions, showLogout }: AppNavbarProps) {
  const { language } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Update background opacity based on scroll
      setIsScrolled(currentScrollY > 20);
      
      // Headroom logic: hide on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const config = variantConfig[variant];
  const isAuthenticated = variant !== "auth" && variant !== "public" && variant !== "default";
  const shouldShowLogout = showLogout ?? isAuthenticated;
  const badgeText = language === "ar" ? config.badge : config.badgeEn;

  return (
    <header className={`w-full sticky top-0 z-50 transition-all duration-300 nav-headroom ${
      isHidden ? "nav-headroom--hidden" : ""
    } ${
      isScrolled ? "bg-paper/90 backdrop-blur-md border-b border-border shadow-sm" : "bg-transparent border-b border-transparent"
    }`}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:px-4 focus:py-2 focus:bg-ink focus:text-paper focus:font-body-sm focus:rounded-sm"
      >
        {language === 'ar' ? 'تخطي إلى المحتوى' : 'Skip to content'}
      </a>
      <div className="flex justify-between items-center w-full px-4 sm:px-6 lg:px-8 py-4 max-w-7xl mx-auto">
        {/* Left: Logo + Badge */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="font-display-md text-ink tracking-tight font-medium leading-none">
              Edu<span className="text-emphasis">Core</span>
            </span>
          </Link>

          {badgeText && (
            <span className={`font-label-caps px-2.5 py-1 rounded-sm border ${config.borderColor} ${config.textColor} ${config.bgColor} hidden sm:inline-block`}>
              {badgeText}
            </span>
          )}
        </div>

        {/* Right: Desktop Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <LanguageToggle />
          
          {userName && (
            <div className="flex items-center gap-2 px-3 py-1.5 paper-surface rounded-sm">
              <div className="w-5 h-5 bg-ink text-paper rounded-full flex items-center justify-center font-mono text-[10px]">
                {userName[0]?.toUpperCase() ?? "U"}
              </div>
              <span className="font-body-sm text-ink truncate max-w-[140px]">
                {userName}
              </span>
            </div>
          )}

          {actions}
          {shouldShowLogout && <LogoutButton />}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="sm:hidden p-2 text-ink hover:bg-paper rounded-lg transition-colors cursor-pointer"
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden border-t border-border bg-paper px-4 py-4 space-y-4 overflow-hidden"
          >
            {badgeText && (
              <span className={`font-label-caps px-2.5 py-1 rounded-sm border ${config.borderColor} ${config.textColor} ${config.bgColor} inline-block`}>
                {badgeText}
              </span>
            )}

            {userName && (
              <div className="flex items-center gap-2 px-3 py-2 paper-surface rounded-sm">
                <div className="w-5 h-5 bg-ink text-paper rounded-full flex items-center justify-center font-mono text-[10px]">
                  {userName[0]?.toUpperCase() ?? "U"}
                </div>
                <span className="font-body-sm text-ink">
                  {userName}
                </span>
              </div>
            )}

            <div className="flex items-center gap-3 flex-wrap">
              <LanguageToggle />
              {actions}
              {shouldShowLogout && <LogoutButton />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
