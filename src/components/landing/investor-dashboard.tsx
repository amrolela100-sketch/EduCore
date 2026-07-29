"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Clock, TrendingUp, DollarSign, Target, BarChart3, Rocket, Award } from "lucide-react";

interface AnimatedNumberProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

function AnimatedNumber({ end, duration = 2000, prefix = "", suffix = "", decimals = 0 }: AnimatedNumberProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(eased * end);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return (
    <span>
      {prefix}
      {count.toFixed(decimals)}
      {suffix}
    </span>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  trend?: string;
  trendPositive?: boolean;
  decimals?: number;
  delay?: number;
}

function StatCard({ icon, value, suffix = "", prefix = "", label, trend, trendPositive = true, decimals = 0, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="relative bg-paper p-6 border-2 border-border shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(20,20,20,1)] hover:border-ink transition-all duration-300 group overflow-hidden"
    >
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-ink/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative">
        <div className="flex items-start justify-between mb-4 border-b-2 border-dotted border-border pb-4">
          <div className="w-14 h-14 bg-paper border-2 border-border flex items-center justify-center text-coral shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] group-hover:-translate-y-1 group-hover:bg-ink group-hover:text-paper group-hover:border-ink transition-all duration-300">
            {icon}
          </div>
          {trend && (
            <div className={`flex items-center gap-1 px-3 py-1 font-label-caps text-xs font-bold uppercase border-2 ${trendPositive ? "border-emerald-500 text-emerald-500" : "border-red-500 text-red-500"}`}>
              <TrendingUp className={`w-3 h-3 ${!trendPositive ? "rotate-180" : ""}`} />
              <span>{trend}</span>
            </div>
          )}
        </div>

        <div className="font-editorial text-4xl font-bold text-ink tracking-tight mb-2">
          <AnimatedNumber end={value} suffix={suffix} prefix={prefix} decimals={decimals} />
        </div>
        <div className="font-label-caps text-sm text-ink/70 font-bold uppercase tracking-wider">{label}</div>
      </div>
    </motion.div>
  );
}

interface GrowthBarProps {
  label: string;
  value: number;
  max?: number;
  delay: number;
}

function GrowthBar({ label, value, max = 100, delay }: GrowthBarProps) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth((value / max) * 100), delay * 1000);
    return () => clearTimeout(timer);
  }, [value, max, delay]);

  return (
    <div className="space-y-2 border-b-2 border-dotted border-border pb-3">
      <div className="flex justify-between text-sm font-label-caps font-bold">
        <span className="text-ink/70 uppercase">{label}</span>
        <span className="text-ink">{value}%</span>
      </div>
      <div className="h-2 bg-paper border-2 border-border overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 1, delay: delay * 0.5, ease: "easeOut" }}
          className="h-full bg-ink"
        />
      </div>
    </div>
  );
}

interface ROICardProps {
  title: string;
  amount: string;
  description: string;
  delay: number;
}

function ROICard({ title, amount, description, delay }: ROICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      viewport={{ once: true }}
      className="bg-paper border-2 border-border p-5 text-ink hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] transition-all cursor-pointer"
    >
      <div className="flex items-center gap-2 mb-3 border-b-2 border-border pb-2">
        <DollarSign className="w-5 h-5 text-coral" />
        <span className="text-xs font-label-caps font-bold text-ink/70 uppercase">{title}</span>
      </div>
      <div className="font-editorial text-2xl font-bold text-ink mb-1">{amount}</div>
      <p className="font-body-sm text-xs text-ink/50">{description}</p>
    </motion.div>
  );
}

interface InvestorDashboardProps {
  language: string;
}

export function InvestorDashboard({ language }: InvestorDashboardProps) {
  const isArabic = language === "ar";

  const statCards = [
    {
      icon: <Users className="w-7 h-7" />,
      value: 2847,
      suffix: "+",
      label: isArabic ? "مهندس تم توظيفهم" : "Engineers Hired",
      trend: "+23%",
      trendPositive: true,
    },
    {
      icon: <Award className="w-7 h-7" />,
      value: 98,
      suffix: "%",
      label: isArabic ? "رضا العملاء" : "Client Satisfaction",
      trend: "+5%",
      trendPositive: true,
    },
    {
      icon: <Clock className="w-7 h-7" />,
      value: 12,
      suffix: isArabic ? " يوم" : " days",
      label: isArabic ? "متوسط وقت التوظيف" : "Avg Time-to-Hire",
      trend: "-40%",
      trendPositive: true,
    },
    {
      icon: <TrendingUp className="w-7 h-7" />,
      value: 340,
      suffix: "%",
      label: isArabic ? "العائد على الاستثمار" : "ROI",
      trend: "YoY",
      trendPositive: true,
    },
  ];

  const growthMetrics = [
    { label: isArabic ? "نمو قاعدة العملاء" : "Customer Growth", value: 156 },
    { label: isArabic ? "الاستخدام الشهري" : "Monthly Active Users", value: 89 },
    { label: isArabic ? "تحسين الاحتفاظ" : "Retention Rate", value: 94 },
    { label: isArabic ? "صافي الترويج" : "Net Promoter Score", value: 72 },
  ];

  const roiCards = [
    {
      title: isArabic ? "وفّرنا للعملاء" : "Saved for Clients",
      amount: "$2.4M",
      description: isArabic ? "تكاليف توظيف مباشرة" : "Direct hiring cost savings",
    },
    {
      title: isArabic ? "إيرادات متكررة" : "Recurring Revenue",
      amount: "$1.8M",
      description: isArabic ? "ARR الحالي" : "Current ARR",
    },
    {
      title: isArabic ? "قيمة عمرية" : "Customer LTV",
      amount: "$48K",
      description: isArabic ? "متوسط لكل عميل" : "Average per customer",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 border-2 border-border bg-paper shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] mb-4">
            <BarChart3 className="w-4 h-4 text-coral" />
            <span className="text-xs font-label-caps font-bold uppercase tracking-wider text-ink">
              {isArabic ? "لوحة تحكم المستثمرين" : "Investor Dashboard"}
            </span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-ink tracking-tight mb-4">
            {isArabic ? "أداء EduCore في أرقام" : "EduCore Performance in Numbers"}
          </h2>
          <p className="font-body-sm text-ink/70 max-w-2xl mx-auto text-base">
            {isArabic
              ? "نتائج موثقة ومقاييس قابلة للتحقق تعكس نمو الشركة واستقرارها"
              : "Verified results and metrics reflecting company growth and stability"}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {statCards.map((card, index) => (
            <StatCard key={index} {...card} delay={index * 0.1} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-paper p-8 border-2 border-border shadow-[6px_6px_0px_0px_rgba(20,20,20,1)]"
          >
            <div className="flex items-center gap-4 mb-8 border-b-2 border-border pb-4">
              <div className="w-12 h-12 bg-ink border-2 border-border flex items-center justify-center text-paper shadow-[2px_2px_0px_0px_rgba(20,20,20,1)]">
                <Rocket className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-label-caps font-bold text-lg text-ink uppercase">
                  {isArabic ? "مقاييس النمو" : "Growth Metrics"}
                </h3>
                <p className="font-body-sm text-sm text-ink/70">
                  {isArabic ? "أداء ربع سنوي" : "Quarterly Performance"}
                </p>
              </div>
            </div>
            <div className="space-y-5">
              {growthMetrics.map((metric, index) => (
                <GrowthBar key={index} {...metric} delay={index * 0.2} />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-ink p-8 border-2 border-border text-paper shadow-[6px_6px_0px_0px_rgba(20,20,20,1)]"
          >
            <div className="flex items-center gap-4 mb-8 border-b-2 border-paper/20 pb-4">
              <div className="w-12 h-12 bg-paper border-2 border-paper flex items-center justify-center text-ink shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-label-caps font-bold text-lg uppercase text-paper">
                  {isArabic ? "العائد على الاستثمار" : "ROI Highlights"}
                </h3>
                <p className="font-body-sm text-sm text-paper/70">
                  {isArabic ? "توفير قياسى" : "Measurable Impact"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {roiCards.map((card, index) => (
                <ROICard key={index} {...card} delay={index * 0.15} />
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t-2 border-border pt-12"
        >
          {[
            { value: "28,847+", label: isArabic ? "مهندس تم توظيفهم" : "Engineers Placed" },
            { value: "156", label: isArabic ? "شركة شريكة" : "Partner Firms" },
            { value: "23", label: isArabic ? "دولة" : "Countries" },
            { value: "$48B", label: isArabic ? "حجم السوق" : "TAM" },
          ].map((item, i) => (
            <div key={i} className="text-center p-6 bg-paper border-2 border-transparent hover:border-ink transition-colors cursor-pointer group">
              <div className="font-editorial text-3xl sm:text-4xl font-bold text-ink group-hover:text-coral transition-colors">{item.value}</div>
              <div className="font-label-caps font-bold text-xs text-ink/70 mt-3 uppercase tracking-wider">{item.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}