"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ShieldCheck, Lock, Award, FileBadge, CheckCircle, Users, Building2, TrendingUp } from "lucide-react";

interface TrustBadge {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
}

const trustBadges: TrustBadge[] = [
  { icon: <ShieldCheck className="w-6 h-6" />, label: "SOC 2 Type II", sublabel: "Certified" },
  { icon: <Lock className="w-6 h-6" />, label: "GDPR", sublabel: "Compliant" },
  { icon: <Award className="w-6 h-6" />, label: "ISO 27001", sublabel: "Certified" },
  { icon: <FileBadge className="w-6 h-6" />, label: "HIPAA", sublabel: "Ready" },
];

const companyLogos = [
  { name: "TechCorp", abbr: "TC" },
  { name: "InnovateTech", abbr: "IT" },
  { name: "DataFlow", abbr: "DF" },
  { name: "CloudBase", abbr: "CB" },
  { name: "NextGen", abbr: "NG" },
  { name: "ScaleUp", abbr: "SU" },
  { name: "DevFirst", abbr: "DF" },
];

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  duration?: number;
}

function AnimatedCounter({ target, suffix = "", duration = 2000 }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    const steps = 60;
    const increment = target / steps;
    const stepDuration = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [target, isInView, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}

interface TrustConnectionProps {
  language: string;
}

export function TrustConnection({ language }: TrustConnectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isArabic = language === "ar";

  return (
    <section ref={ref} className="py-20 bg-paper border-t-2 border-border font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center space-y-2"
        >
          <h3 className="font-editorial text-3xl sm:text-4xl font-bold text-ink mb-4">
            {isArabic ? "ثقة وأمان على مستوى المؤسسات" : "Enterprise-Grade Security & Trust"}
          </h3>
          <p className="font-body-sm text-sm sm:text-base text-ink/70 max-w-2xl mx-auto">
            {isArabic
              ? "نلتزم بأعلى معايير الأمان والخصوصية العالمية"
              : "Trusted by leading companies worldwide with top compliance standards"}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {trustBadges.map((badge, index) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
              className="group flex flex-col items-center gap-3 p-6 bg-white border-2 border-border shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(20,20,20,1)] hover:border-ink transition-all duration-300"
            >
              <div className="p-4 border-2 border-border bg-ink text-paper shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] group-hover:bg-coral group-hover:text-ink transition-all duration-300">
                {badge.icon}
              </div>
              <div className="text-center mt-2">
                <span className="block font-editorial text-lg font-bold text-ink">{badge.label}</span>
                {badge.sublabel && (
                  <span className="block font-label-caps text-[10px] text-ink/60 mt-1 uppercase tracking-wider font-bold">{badge.sublabel}</span>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-6 pt-10"
        >
          <p className="text-center font-label-caps text-xs text-ink/50 uppercase tracking-widest font-bold">
            {isArabic ? "موثوق من قبل فرق الهندسة في" : "Trusted by engineering teams at"}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {companyLogos.map((logo, index) => (
              <motion.div
                key={logo.name}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}
                className="flex items-center gap-2 text-ink/70 hover:text-ink transition-colors cursor-default grayscale hover:grayscale-0"
              >
                <span className="flex items-center justify-center w-10 h-10 border-2 border-border bg-white shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] font-ultra font-bold text-sm">
                  {logo.abbr}
                </span>
                <span className="font-label-caps text-sm font-bold hidden sm:block">{logo.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t-2 border-border"
        >
          <div className="flex flex-col items-center gap-2 p-6 bg-white border-2 border-border shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
            <div className="flex items-center gap-2 text-coral">
              <Users className="w-5 h-5" />
              <span className="font-editorial text-2xl sm:text-3xl font-bold text-ink">
                <AnimatedCounter target={500} suffix="+" duration={2000} />
              </span>
            </div>
            <span className="font-label-caps text-[10px] text-ink/70 text-center uppercase tracking-wider font-bold">
              {isArabic ? "مهندس تم توظيفهم" : "Engineers Hired"}
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 p-6 bg-white border-2 border-border shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
            <div className="flex items-center gap-2 text-coral">
              <Building2 className="w-5 h-5" />
              <span className="font-editorial text-2xl sm:text-3xl font-bold text-ink">
                <AnimatedCounter target={120} suffix="+" duration={2500} />
              </span>
            </div>
            <span className="font-label-caps text-[10px] text-ink/70 text-center uppercase tracking-wider font-bold">
              {isArabic ? "شركة شريكة" : "Partner Companies"}
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 p-6 bg-white border-2 border-border shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
            <div className="flex items-center gap-2 text-coral">
              <TrendingUp className="w-5 h-5" />
              <span className="font-editorial text-2xl sm:text-3xl font-bold text-ink">
                <AnimatedCounter target={98} suffix="%" duration={1800} />
              </span>
            </div>
            <span className="font-label-caps text-[10px] text-ink/70 text-center uppercase tracking-wider font-bold">
              {isArabic ? "رضا العملاء" : "Client Satisfaction"}
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 p-6 bg-white border-2 border-border shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
            <div className="flex items-center gap-2 text-coral">
              <CheckCircle className="w-5 h-5" />
              <span className="font-editorial text-2xl sm:text-3xl font-bold text-ink">24/7</span>
            </div>
            <span className="font-label-caps text-[10px] text-ink/70 text-center uppercase tracking-wider font-bold">
              {isArabic ? "دعم متاح" : "Support Available"}
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-6 pt-4"
        >
          <div className="flex items-center gap-2 font-label-caps text-[10px] text-ink/60 uppercase font-bold tracking-wider">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>{isArabic ? "تشفير 256-bit" : "256-bit Encryption"}</span>
          </div>
          <div className="flex items-center gap-2 font-label-caps text-[10px] text-ink/60 uppercase font-bold tracking-wider">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>{isArabic ? "سجلات تدقيق كاملة" : "Full Audit Logs"}</span>
          </div>
          <div className="flex items-center gap-2 font-label-caps text-[10px] text-ink/60 uppercase font-bold tracking-wider">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>{isArabic ? "النسخ الاحتياطي اليومي" : "Daily Backups"}</span>
          </div>
          <div className="flex items-center gap-2 font-label-caps text-[10px] text-ink/60 uppercase font-bold tracking-wider">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>{isArabic ? "99.9% وقت التشغيل" : "99.9% Uptime SLA"}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}