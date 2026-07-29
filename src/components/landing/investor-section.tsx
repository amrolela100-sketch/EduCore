"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Clock, Star, TrendingUp, DollarSign, Target } from "lucide-react";

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

function AnimatedCounter({ end, duration = 2000, prefix = "", suffix = "", decimals = 0 }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
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
  decimals?: number;
  delay?: number;
}

function StatCard({ icon, value, suffix = "", prefix = "", label, trend, decimals = 0, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="relative bg-paper p-6 border-2 border-border shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(20,20,20,1)] hover:border-ink transition-all group"
    >
      <div className="absolute top-4 right-4 w-10 h-10 border-2 border-border bg-paper flex items-center justify-center text-coral shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] group-hover:bg-ink group-hover:text-paper group-hover:border-ink transition-all duration-300">
        {icon}
      </div>

      <div className="flex flex-col gap-2 pt-8">
        <div className="font-editorial text-4xl font-bold text-ink tracking-tight">
          <AnimatedCounter end={value} suffix={suffix} prefix={prefix} decimals={decimals} />
        </div>
        <div className="font-label-caps text-sm text-ink/70 font-bold uppercase tracking-wider">{label}</div>
        {trend && (
          <div className="flex items-center gap-1 text-xs text-coral font-bold mt-1 border-t-2 border-dotted border-border pt-2">
            <TrendingUp className="w-4 h-4" />
            <span>{trend}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface WhyEduCoreProps {
  language: string;
}

export function WhyEduCore({ language }: WhyEduCoreProps) {
  const isArabic = language === "ar";

  const differentiators = [
    {
      icon: <Target className="w-5 h-5" />,
      title: isArabic ? "دقة مطابقة 98%" : "98% Match Accuracy",
      description: isArabic
        ? "تحليل فني قائم على البراهين يضمن التوظيف الأمثل"
        : "Evidence-based technical analysis ensures optimal hiring",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: isArabic ? "3.2x أسرع في التوظيف" : "3.2x Faster Hiring",
      description: isArabic
        ? "تقليل دورة التوظيف بنسبة 68% عبر الأتمتة الذكية"
        : "68% reduction in hiring cycle through intelligent automation",
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      title: isArabic ? "$2.4M وفّرنا للعملاء" : "$2.4M Saved",
      description: isArabic
        ? "تكاليف توظيف أقل وجودة hires أعلى"
        : "Lower hiring costs with higher quality hires",
    },
    {
      icon: <Star className="w-5 h-5" />,
      title: isArabic ? "رضا 94% للعملاء" : "94% Client Satisfaction",
      description: isArabic
        ? "مقياس NPS يتجاوز معايير الصناعة"
        : "NPS score exceeds industry standards",
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
          <div className="inline-flex items-center gap-2 px-4 py-2 border-2 border-border mb-4 shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] bg-paper">
            <span className="font-label-caps text-xs font-bold text-ink uppercase tracking-wider">
              {isArabic ? "المميزات التنافسية" : "Competitive Edge"}
            </span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-ink tracking-tight mb-4">
            {isArabic ? "لماذا EduCore؟" : "Why EduCore?"}
          </h2>
          <p className="font-body-sm text-ink/70 max-w-2xl mx-auto text-base">
            {isArabic
              ? "نقفز فوق المقابلات التقليدية بنظام تقييم فني قائم على البراهين"
              : "Skip the bias-prone interviews with our evidence-based technical evaluation system"}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {differentiators.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative bg-paper p-6 border-2 border-border shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(20,20,20,1)] transition-all group"
            >
              <div className="w-12 h-12 bg-ink border-2 border-border flex items-center justify-center text-paper mb-6 shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] group-hover:-translate-y-1 transition-transform">
                {item.icon}
              </div>
              <h3 className="font-label-caps text-lg font-bold text-ink mb-3 uppercase tracking-wide">{item.title}</h3>
              <p className="font-body-sm text-sm text-ink/70 leading-relaxed border-t-2 border-dotted border-border pt-3">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface InvestorSectionProps {
  language: string;
}

export function InvestorSection({ language }: InvestorSectionProps) {
  const isArabic = language === "ar";

  const metrics = [
    {
      icon: <Users className="w-5 h-5" />,
      value: 2847,
      suffix: "+",
      label: isArabic ? "مهندس تم توظيفهم" : "Engineers Hired",
      trend: "+23% MoM",
    },
    {
      icon: <Star className="w-5 h-5" />,
      value: 98,
      suffix: "%",
      label: isArabic ? "معدل رضا العملاء" : "Client Satisfaction",
      trend: "+5% QoQ",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      value: 12,
      suffix: isArabic ? " يوم" : " days",
      label: isArabic ? "متوسط وقت التوظيف" : "Avg Time-to-Hire",
      trend: "-40% vs Industry",
      decimals: 0,
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      value: 340,
      suffix: "%",
      label: isArabic ? "العائد على الاستثمار" : "ROI",
      trend: isArabic ? "سنوياً" : "YoY",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-ink text-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 border-2 border-paper mb-4 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] bg-ink">
            <span className="font-label-caps text-xs font-bold text-paper uppercase tracking-wider">
              {isArabic ? "لمحة للمستثمرين" : "Investor Snapshot"}
            </span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-5xl font-bold tracking-tight mb-4">
            {isArabic ? "أرقام تتحدث عن نفسها" : "Numbers That Speak for Themselves"}
          </h2>
          <p className="font-body-sm text-paper/70 max-w-2xl mx-auto">
            {isArabic
              ? "نمو متسارع في جميع المقاييس الرئيسية مع الحفاظ على جودة عالية"
              : "Accelerating growth across all key metrics while maintaining high quality"}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {metrics.map((metric, index) => (
            <StatCard key={index} {...metric} delay={index * 0.1} />
          ))}
        </div>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t-2 border-paper/20 pt-12">
          {[
            { label: isArabic ? "توظيف ناجح" : "Successful Placements", value: "2,847+" },
            { label: isArabic ? "شركة شريكة" : "Partner Companies", value: "156" },
            { label: isArabic ? "دولة" : "Countries", value: "23" },
            { label: isArabic ? "حجم السوق" : "TAM", value: "$48B" },
          ].map((item, i) => (
            <div key={i} className="text-center p-6 border-2 border-transparent hover:border-paper hover:bg-paper/5 transition-colors">
              <div className="font-editorial text-2xl sm:text-3xl font-bold text-coral">{item.value}</div>
              <div className="font-label-caps font-bold text-xs text-paper/50 mt-2 uppercase">{item.label}</div>
            </div>
          ))}
          </div>
      </div>
    </section>
  );
}