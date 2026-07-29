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
      className="relative overflow-hidden min-h-[90vh] flex items-center justify-center"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-14 sm:py-24 flex flex-col items-center text-center space-y-10">
        {/* ── Investor chips ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 font-label-caps text-xs rounded-full glass-card border-primary/20 text-foreground animate-float" style={{ animationDelay: "0s" }}>
            <Building2 className="w-3.5 h-3.5 text-primary" />
            <span>{isArabic ? "للاستثمار" : "For Investors"}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 font-label-caps text-xs rounded-full glass-card border-primary/20 text-foreground animate-float" style={{ animationDelay: "0.5s" }}>
            <TrendingUp className="w-3.5 h-3.5 text-primary" />
            <span>{isArabic ? "سوق 48 مليار دولار" : "$48B Market"}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 font-label-caps text-xs rounded-full bg-primary/10 text-primary border border-primary/30 shadow-[0_0_15px_rgba(139,92,246,0.3)] animate-float" style={{ animationDelay: "1s" }}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {isArabic ? "قابل للتوسع عالمياً" : "Globally Scalable"}
            </span>
          </div>
        </motion.div>

        {/* ── Headline ── */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="font-display-xl max-w-5xl"
          dir={isArabic ? "rtl" : "ltr"}
        >
          {isArabic ? (
            <>
              توظيف مبني على{" "}
              <span className="text-gradient relative inline-block">
                الذكاء الاصطناعي
              </span>{" "}
              ودون انحياز خوارزمي
            </>
          ) : (
            <>
              Hire with{" "}
              <span className="text-gradient relative inline-block">
                Verifiable AI Data
              </span>{" "}
              & Zero Hallucinations
            </>
          )}
        </motion.h1>

        {/* ── Sub-headline ── */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="font-body-base text-muted-foreground max-w-3xl leading-relaxed text-lg"
          dir={isArabic ? "rtl" : "ltr"}
        >
          {isArabic
            ? "نربط أفضل الكفاءات بالشركات عبر بيئات تقييم معزولة (AI Sandboxes) وسجلات تدقيق ذكية تعتمد على الأداء الحقيقي وليس الكلمات الرنانة."
            : "Connecting top engineering talent with verified positions via AI-powered code sandboxes and dynamic glassmorphic dashboards."}
        </motion.p>

        {/* ── CTAs ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-6 pt-4"
        >
          <Link
            href="/login"
            data-od-id="hero-cta-primary"
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-label-caps rounded-full shadow-[0_0_20px_rgba(139,92,246,0.5)] hover:shadow-[0_0_30px_rgba(139,92,246,0.7)] hover:-translate-y-1 transition-all duration-300"
          >
            <span className="relative z-10 font-bold">
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
            className="group inline-flex items-center gap-3 px-8 py-4 glass-card font-label-caps rounded-full hover:-translate-y-1 transition-all duration-300"
          >
            <Play className="w-5 h-5 text-primary" fill="currentColor" />
            <span className="font-bold">
              {isArabic ? "مشاهدة العرض التوضيحي" : "Watch Demo"}
            </span>
          </Link>
        </motion.div>

        {/* ── Quick stats ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-6 pt-12"
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
              label: isArabic ? "دقة المطابقة" : "AI Match Accuracy",
            },
            {
              icon: Clock,
              value: isArabic ? "تحليل فوري 24/7" : "24/7 Real-time",
              label: "",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-6 py-3 glass-card rounded-2xl"
            >
              <div className="p-2 rounded-full bg-primary/10">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bold text-foreground text-lg leading-tight">{item.value}</span>
                {item.label && <span className="font-label-caps text-muted-foreground text-[10px]">{item.label}</span>}
              </div>
            </div>
          ))}
        </motion.div>

        <LanguageToggle />
      </div>
    </section>
  );
}
