"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldOff, ArrowLeft, LogIn } from "lucide-react";
import { useLanguage } from "@/components/language-context";
import { AppNavbar } from "@/components/app-navbar";
import { AppFooter } from "@/components/app-footer";

export default function UnauthorizedPage() {
  const { language } = useLanguage();

  return (
    <div className="bg-paper text-ink font-sans min-h-screen flex flex-col antialiased selection:bg-verified selection:text-white">
      {/* Unified Navbar */}
      <AppNavbar variant="public" />

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6 relative">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#1d1d1f_1px,transparent_1px)] bg-[size:24px_24px]" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md glass-premium border border-white/50 rounded-3xl p-8 relative z-10 shadow-premium text-center"
        >
          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.4, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-gradient-to-br from-brand-rose/20 to-brand-rose/5 text-brand-rose rounded-2xl flex items-center justify-center mx-auto mb-5 border border-brand-rose/15 shadow-[0_0_20px_rgba(244,63,94,0.2)]"
          >
            <ShieldOff className="w-8 h-8" />
          </motion.div>

          <h1 className="text-xl sm:text-2xl font-bold text-ink mb-2 tracking-tight">
            {language === "ar" ? "وصول غير مصرح" : "Access Denied"}
          </h1>
          <p className="text-sm text-ink/60 mb-8 max-w-xs mx-auto leading-relaxed">
            {language === "ar"
              ? "ليس لديك الصلاحية للوصول إلى هذه الصفحة. يرجى تسجيل الدخول بحساب يملك الصلاحيات المناسبة."
              : "You do not have permission to access this page. Please sign in with an account that has the appropriate permissions."}
          </p>

          <div className="flex flex-col gap-3">
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/login"
                className="font-data-mono uppercase font-bold py-3.5 gradient-cta-primary text-white flex items-center justify-center gap-2 rounded-xl shadow-premium hover:shadow-glow-emerald transition-all duration-300"
              >
                <LogIn className="w-4 h-4" />
                <span>{language === "ar" ? "تسجيل الدخول" : "Sign In"}</span>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/"
                className="font-data-mono uppercase font-bold py-3.5 border border-ledger/80 text-ink hover:bg-white/60 hover:border-brand-emerald/30 hover:text-brand-emerald transition-all duration-300 flex items-center justify-center gap-2 rounded-xl backdrop-blur-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{language === "ar" ? "العودة للرئيسية" : "Back to Home"}</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Unified Footer */}
      <AppFooter variant="dark" />
    </div>
  );
}
