"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Zap, TrendingUp, Shield, Award } from "lucide-react";

interface TickerItemProps {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  icon: React.ReactNode;
  decimals?: number;
}

function TickerItem({ value, prefix = "", suffix = "", label, icon, decimals = 0 }: TickerItemProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const duration = 2000;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(eased * value);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.4 }}
      className="flex items-center gap-4 px-5 py-4 bg-paper border-2 border-border shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] hover:border-ink transition-all duration-300"
    >
      <div className="w-12 h-12 bg-ink border-2 border-border flex items-center justify-center text-paper flex-shrink-0 shadow-[2px_2px_0px_0px_rgba(20,20,20,1)]">
        {icon}
      </div>      <div className="flex flex-col gap-1 items-start min-w-0">
        <span className="font-editorial text-2xl font-bold text-ink tracking-tight truncate">          {prefix}{displayValue.toFixed(decimals)}{suffix}
        </span>        <span className="font-label-caps text-xs text-ink/70 font-bold uppercase truncate">{label}</span>
      </div>
    </motion.div>
  );
}

interface MetricsTickerProps {
  language: string;
}

export function MetricsTicker({ language }: MetricsTickerProps) {  const isArabic = language === "ar";

  const tickerData: TickerItemProps[] = [
    {      value: 98,
      suffix: "%",
      label: isArabic ? "دقة المطابقة" : "Match Accuracy",
      icon: <Shield className="w-5 h-5" />,
    },
    {
      value: 3.2,
      suffix: "x",
      label: isArabic ? "أسرع توظيف" : "Faster Hiring",
      icon: <Zap className="w-5 h-5" />,
      decimals: 1,
    },
    {
      value: 2.4,
      prefix: "$",
      suffix: "M",
      label: isArabic ? "توفير التكاليف" : "Cost Saved",
      icon: <TrendingUp className="w-5 h-5" />,
      decimals: 1,
    },
    {
      value: 94,
      suffix: "%",
      label: isArabic ? "رضا العملاء" : "Satisfaction",
      icon: <Award className="w-5 h-5" />,
    },
  ];

  return (
    <section className="py-10 bg-ink border-y-2 border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {tickerData.map((item, index) => (
            <TickerItem key={index} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}