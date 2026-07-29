"use client";

import { motion } from "framer-motion";
import { useSafeReducedMotion } from "@/hooks/use-safe-reduced-motion";
import { LucideIcon, Inbox } from "lucide-react";

/**
 * Unified Empty State component — enhanced with skeleton support.
 * Supersedes the previous empty-state.tsx and primitives.tsx EmptyState.
 */

interface EmptyStateProps {
  /** Main title */
  title: string;
  /** Description text */
  description?: string;
  /** Lucide icon to display */
  icon?: LucideIcon;
  /** Optional action button */
  action?: React.ReactNode;
  /** Optional className override */
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  action,
  className = "",
}: EmptyStateProps) {
  const prefersReducedMotion = useSafeReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col items-center justify-center py-12 px-6 text-center border-y border-dotted border-border ${className}`}
    >
      <div className="text-ink/30 mb-6">
        <Icon className="w-8 h-8" strokeWidth={1} />
      </div>
      <h3 className="font-editorial text-xl text-ink/80 mb-2">{title}</h3>
      {description && (
        <p className="font-body-sm text-ink/50 max-w-sm leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </motion.div>
  );
}

/* ─── Skeleton Components ─────────────────────── */

function SkeletonPulse({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-ledger/40 via-ledger/70 to-ledger/40 rounded-md ${className}`}
    />
  );
}

/** Card skeleton for stat cards */
export function StatCardSkeleton() {
  return (
    <div className="editorial-card p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <SkeletonPulse className="h-4 w-24" />
        <SkeletonPulse className="h-8 w-8 rounded-sm" />
      </div>
      <SkeletonPulse className="h-8 w-24" />
      <SkeletonPulse className="h-3 w-32" />
    </div>
  );
}

/** Table row skeleton */
export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-border">
      {Array.from({ length: columns }).map((_, i) => (
        <SkeletonPulse
          key={i}
          className={`h-4 ${i === 0 ? "w-40" : i === columns - 1 ? "w-20" : "w-28"}`}
        />
      ))}
    </div>
  );
}

/** Generic card content skeleton */
export function CardSkeleton() {
  return (
    <div className="editorial-card p-8 space-y-4">
      <SkeletonPulse className="h-6 w-48" />
      <SkeletonPulse className="h-4 w-full" />
      <SkeletonPulse className="h-4 w-3/4" />
      <div className="flex gap-2 pt-4">
        <SkeletonPulse className="h-8 w-16 rounded-sm" />
        <SkeletonPulse className="h-8 w-16 rounded-sm" />
        <SkeletonPulse className="h-8 w-20 rounded-sm" />
      </div>
    </div>
  );
}
