"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { AnimatedNumber } from "./animated-number";

export interface StatCardProps {
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

export function StatCard({ icon, value, suffix = "", prefix = "", label, trend, trendPositive = true, decimals = 0, delay = 0 }: StatCardProps) {
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
