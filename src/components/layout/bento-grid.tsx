"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

/**
 * BentoGrid — layout engine for the new dashboard architecture
 * Provides glass bento cards with staggered animation entry.
 */

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
  columns?: 2 | 3 | 4;
}

export function BentoGrid({ children, className, columns = 4 }: BentoGridProps) {
  return (
    <div className={cn(
      "bento-grid",
      columns === 4 ? "bento-grid-dense" : `grid-cols-1 md:grid-cols-${columns}`,
      className
    )} style={{ "--bento-cols": columns } as React.CSSProperties}>
      {children}
    </div>
  );
}

/**
 * BentoCard — glass card with animated entry and hover lift
 */
interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  span?: "default" | "wide" | "tall" | "large";
  delay?: number;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  header?: React.ReactNode;
  footer?: React.ReactNode;
  accentColor?: string;
}

export function BentoCard({
  children,
  className,
  span = "default",
  delay = 0,
  padding = "md",
  header,
  footer,
  accentColor,
}: BentoCardProps) {
  const spanClass = {
    default: "bento-span-1",
    wide: "bento-span-2",
    tall: "bento-span-tall",
    large: "bento-span-large",
  }[span];

  const paddingClass = {
    none: "",
    sm: "p-4",
    md: "p-5 sm:p-6",
    lg: "p-6 sm:p-8",
  }[padding];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: delay * 0.08,
        ease: [0.28, 0, 0.22, 1],
      }}
      className={cn(
        "editorial-card flex flex-col",
        paddingClass,
        spanClass,
        className
      )}
    >
      {accentColor && (
        <div
          className="absolute top-0 left-0 right-0 h-[3px]"
          style={{ background: accentColor }}
        />
      )}
      {header && (
        <div className="flex items-start justify-between gap-3 mb-6">
          {header}
        </div>
      )}
      <div className={cn("flex-grow")}>
        {children}
      </div>
      {footer && (
        <div className="pt-6 mt-auto border-t border-dotted">
          {footer}
        </div>
      )}
    </motion.div>
  );
}

/**
 * MetricWidget — high-impact number display for bento cards
 */
interface MetricWidgetProps {
  value: string | number;
  label: React.ReactNode;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: React.ReactNode;
  accentColor?: string;
}

export function MetricWidget({
  value,
  label,
  change,
  changeType = "neutral",
  icon,
}: MetricWidgetProps) {
  const changeStyles = {
    positive: "text-[#248a3d]",
    negative: "text-[#c41e14]",
    neutral: "text-muted-apple",
  };

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex items-start justify-between mb-4">
        <span className="font-label-caps text-ink/70">{label}</span>
        {icon && (
          <div
            className="w-8 h-8 flex items-center justify-center text-coral"
          >
            {icon}
          </div>
        )}
      </div>
      <div className="font-editorial text-4xl text-ink">{value}</div>
      {change && (
        <div className={cn("font-label-caps mt-2", changeStyles[changeType])}>
          {changeType === "positive" ? "↑" : changeType === "negative" ? "↓" : "→"} {change}
        </div>
      )}
    </div>
  );
}

/**
 * StatusBadge — pill badge with dot indicator
 */
interface StatusBadgeProps {
  text: string;
  variant?: "green" | "blue" | "amber" | "red" | "neutral";
  pulse?: boolean;
}

export function StatusBadge({ text, variant = "blue", pulse = false }: StatusBadgeProps) {
  const colors = {
    green: { bg: "rgba(224, 62, 0, 0.1)", text: "#E03E00", dot: "#E03E00" }, // Using coral for positive to match Atelier Zero
    blue: { bg: "rgba(20, 20, 20, 0.05)", text: "#141414", dot: "#141414" }, // Ink for blue
    amber: { bg: "rgba(20, 20, 20, 0.05)", text: "#141414", dot: "#141414" },
    red: { bg: "rgba(20, 20, 20, 0.05)", text: "#141414", dot: "#141414" },
    neutral: { bg: "transparent", text: "#141414", dot: "#141414" },
  };

  const c = colors[variant];

  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 font-label-caps border border-border"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      {pulse && (
        <span
          className="w-1.5 h-1.5 rounded-none animate-pulse"
          style={{ backgroundColor: c.dot }}
        />
      )}
      {text}
    </span>
  );
}

/**
 * QuickActionButton — contextual action for bento footers
 */
interface QuickActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
}

export function QuickActionButton({
  children,
  icon,
  variant = "primary",
  className,
  ...props
}: QuickActionButtonProps) {
  const variants = {
    primary: "bg-ink text-paper hover:bg-coral",
    secondary: "bg-transparent text-ink border border-border hover:border-ink",
    ghost: "bg-transparent text-ink hover:bg-ink/5",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center gap-2 px-5 py-2.5 rounded-sm font-label-caps transition-all duration-300",
        variants[variant],
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
