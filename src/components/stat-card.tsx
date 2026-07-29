"use client";

import { motion } from "framer-motion";
import { useSafeReducedMotion } from "@/hooks/use-safe-reduced-motion";
import { LucideIcon } from "lucide-react";

/**
 * Reusable animated statistics card component for dashboards.
 * Respects prefers-reduced-motion.
 */

interface StatCardProps {
  /** Card title / label */
  label: string;
  /** The stat value */
  value: string | number;
  /** Optional subtitle or additional info */
  subtitle?: string;
  /** Lucide icon component */
  icon?: LucideIcon;
  /** Color theme for the card accent */
  accentColor?: "emerald" | "amber" | "crimson" | "neutral";
  /** Animation delay index for stagger effect */
  index?: number;
}

const accentMap = {
  emerald: {
    iconBg: "bg-coral/10",
    iconColor: "text-coral",
    border: "border-border",
    valueBg: "text-ink",
  },
  amber: {
    iconBg: "bg-coral/10",
    iconColor: "text-coral",
    border: "border-border",
    valueBg: "text-ink",
  },
  crimson: {
    iconBg: "bg-coral/10",
    iconColor: "text-coral",
    border: "border-border",
    valueBg: "text-ink",
  },
  neutral: {
    iconBg: "bg-ink/5",
    iconColor: "text-ink",
    border: "border-border",
    valueBg: "text-ink",
  },
};

export function StatCard({
  label,
  value,
  subtitle,
  icon: Icon,
  accentColor = "emerald",
  index = 0,
}: StatCardProps) {
  const accent = accentMap[accentColor];
  const prefersReducedMotion = useSafeReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: prefersReducedMotion ? 0 : index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className={`editorial-card p-6 flex flex-col gap-4`}
    >
      <div className="flex items-center justify-between">
        <span className="font-label-caps text-ink/70">
          {label}
        </span>
        {Icon && (
          <div className={`w-8 h-8 rounded-sm ${accent.iconBg} ${accent.iconColor} flex items-center justify-center`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className={`font-editorial text-4xl ${accent.valueBg}`}>
        {value}
      </div>

      {subtitle && (
        <p className="font-body-sm text-ink/60">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
