"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Building2,
  Play,
  Users,
  Award,
  Clock,
} from "lucide-react";
import { LanguageToggle } from "@/components/language-toggle";

interface LandingHeroProps {
  language: string;
}

function AnimatedCounter({
  target,
  suffix = "",
}: {
  target: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <span suppressHydrationWarning>
      {mounted ? count.toLocaleString() : "0"}
      {suffix}
    </span>
  );
}

export function LandingHero({ language }: LandingHeroProps) {
  const isArabic = language === "ar";

  return (
    <section
      data-od-id="landing-hero"
      className="relative overflow-hidden border-b border-ledger"
    >
      {/* ── Paper texture background ── */}
      <div className="absolute inset-0 bg-paper pointer-events-none" />
      <div className="absolute inset-0 pattern-dots pointer-events-none opacity-[0.03]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-14 sm:py-24 flex flex-col items-center text-center space-y-10">
        {/* ── Investor chips ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-2"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 font-label-caps border border-border bg-paper text-ink shadow-[2px_2px_0px_0px_rgba(20,20,20,1)]">
            <Building2 className="w-3.5 h-3.5" />
            <span>{isArabic ? "للاستثمار" : "For Investors"}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 font-label-caps border border-border bg-paper text-ink shadow-[2px_2px_0px_0px_rgba(20,20,20,1)]">
            <TrendingUp className="w-3.5 h-3.5 text-coral" />
            <span>{isArabic ? "سوق 48 مليار دولار" : "$48B Market"}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 font-label-caps border border-ink bg-ink text-paper shadow-[2px_2px_0px_0px_rgba(224,62,0,1)]">
            <Sparkles className="w-3.5 h-3.5 text-coral" />
            <span>
              {isArabic ? "قابل للتوسع عالمياً" : "Globally Scalable"}
            </span>
          </div>
        </motion.div>

        {/* ── Headline ── */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.55 }}
          className="font-editorial text-5xl sm:text-7xl text-ink max-w-4xl"
          dir={isArabic ? "rtl" : "ltr"}
        >
          {isArabic ? (
            <>
              توظيف مبني على{" "}
              <span className="text-coral italic relative inline-block">
                القياسات الفنية الحقيقية
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  height="6"
                  viewBox="0 0 200 6"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 5 Q 100 0 200 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    opacity="0.35"
                  />
                </svg>
              </span>{" "}
              ودون انحياز خوارزمي
            </>
          ) : (
            <>
              Hire with{" "}
              <span className="text-coral italic relative inline-block">
                Verifiable Engineering Data
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  height="6"
                  viewBox="0 0 200 6"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 5 Q 100 0 200 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    opacity="0.35"
                  />
                </svg>
              </span>{" "}
              & Zero Hallucinations
            </>
          )}
        </motion.h1>

        {/* ── Sub-headline ── */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.55 }}
          className="font-body-lg text-ink/80 max-w-2xl leading-relaxed"
          dir={isArabic ? "rtl" : "ltr"}
        >
          {isArabic
            ? "ربط المرشحين بالشركات عبر بيئات برمجة معزولة (Sandboxed Technical Assessments) وسجلات تدقيق قابلة للمراجعة والتعديل البشري."
            : "Connecting top engineering talent with verified positions via sandboxed code assessments and fully auditable compliance ledgers."}
        </motion.p>

        {/* ── CTAs ── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.55 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-2"
        >
          <Link
            href="/login"
            data-od-id="hero-cta-primary"
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-ink text-paper font-label-caps border border-transparent shadow-[4px_4px_0px_0px_rgba(224,62,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(224,62,0,1)] transition-all"
          >
            <span className="relative z-10">
              {isArabic ? "دخول منصة التوظيف" : "Access Workspace"}
            </span>
            {isArabic ? (
              <ArrowLeft className="w-5 h-5 relative z-10 transition-transform group-hover:-translate-x-1" />
            ) : (
              <ArrowRight className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" />
            )}
          </Link>

          <Link
            href="/login"
            data-od-id="hero-cta-secondary"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-paper text-ink font-label-caps border-2 border-ink shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] transition-all"
          >
            <Play className="w-5 h-5 text-coral" fill="currentColor" />
            <span>
              {isArabic ? "مشاهدة العرض التوضيحي" : "Watch Demo"}
            </span>
          </Link>
        </motion.div>

        {/* ── Quick stats ── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.55 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-2"
        >
          {[
            {
              icon: Users,
              value: <AnimatedCounter target={500} suffix="+" />,
              label: isArabic ? "مهندس تم توظيفهم" : "Engineers Hired",
            },
            {
              icon: Award,
              value: <AnimatedCounter target={98} suffix="%" />,
              label: isArabic ? "رضا العملاء" : "Client Satisfaction",
            },
            {
              icon: Clock,
              value: isArabic ? "دعم متاح 24/7" : "24/7 Support",
              label: "",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-4 py-2 border border-border bg-paper font-data-mono text-ink/80"
            >
              <item.icon className="w-4 h-4 text-coral" />
              <span className="font-bold text-ink">{item.value}</span>
              {item.label && <span className="font-label-caps">{item.label}</span>}
            </div>
          ))}
        </motion.div>

        {/* ── Compliance badges ── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.55 }}
          className="flex flex-wrap items-center justify-center gap-2 pt-2"
        >
          {[
            "SOC 2 Type II",
            "GDPR Compliant",
            "ISO 27001",
            "HIPAA Ready",
          ].map((badge) => (
            <div
              key={badge}
              className="inline-flex items-center gap-1.5 px-3 py-1 font-label-caps text-ink/60 border border-dotted border-border"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-coral/70" />
              <span>{badge}</span>
            </div>
          ))}
        </motion.div>

        {/* ── Guarantee note ── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.55 }}
          className="mt-6 flex items-center gap-2 font-label-caps text-ink/50"
        >
          <Clock className="w-3.5 h-3.5" />
          <span>
            {isArabic
              ? "الحد الأقصى للتأخير: 48 ساعة للتأهيل الأولي"
              : "Max 48h initial screening delay guarantee"}
          </span>
        </motion.div>

        <LanguageToggle />
      </div>
    </section>
  );
}
