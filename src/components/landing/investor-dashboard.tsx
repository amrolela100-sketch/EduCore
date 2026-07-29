"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, Clock, TrendingUp, Target, BarChart3, Rocket, Award } from "lucide-react";
import { StatCard, GrowthBar, ROICard } from "./investor";



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