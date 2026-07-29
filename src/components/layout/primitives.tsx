import React from "react";
import { cn } from "@/lib/utils";

/**
 * Card — primary surface container
 * Replaces: bg-white border border-[#D7DAD1] rounded-2xl shadow-xs
 */
interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "flat" | "code";
  padding?: "none" | "sm" | "md" | "lg";
}

const variantMap = {
  default: "editorial-card",
  elevated: "editorial-card",
  flat: "paper-surface",
  code: "bg-[#121110] text-[#FAF8F5] border-border rounded-sm font-mono text-xs",
};

const paddingMap = {
  none: "",
  sm: "p-4",
  md: "p-5 sm:p-6",
  lg: "p-6 sm:p-8",
};

export function Card({
  children,
  className,
  variant = "default",
  padding = "md",
}: CardProps) {
  return (
    <div className={cn(variantMap[variant], paddingMap[padding], className)}>
      {children}
    </div>
  );
}

/**
 * SectionHeader — reusable heading + subtitle block
 * Replaces: h3 + flex icon + mb-4 combos repeated everywhere
 */
interface SectionHeaderProps {
  title?: React.ReactNode;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  icon,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4 mb-4", className)}>
      <div className="flex items-center gap-2">
        {icon && (
          <span className="text-coral">{icon}</span>
        )}
        <div>
          <h3 className="font-editorial text-xl tracking-tight">{title}</h3>
          {subtitle && (
            <p className="font-data-mono text-ink/60 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/**
 * Badge — semantic status/tag indicator
 * Replaces: px-2.5 py-1 bg-[#14665A]/10 text-[#14665A] rounded-full font-mono
 */
interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info" | "human";
  className?: string;
}

const badgeVariantMap = {
  default: "bg-ink/5 text-ink border-transparent",
  success: "bg-[#34c759]/10 text-[#248a3d] border-transparent",
  warning: "bg-[#ff9500]/10 text-[#c77500] border-transparent",
  error: "bg-[#ff3b30]/10 text-[#c41e14] border-transparent",
  info: "bg-coral/10 text-coral border-transparent",
  human: "bg-[#6e6e73]/10 text-[#6e6e73] border-transparent",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "px-2.5 py-1 font-label-caps border",
        badgeVariantMap[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

/**
 * InputField — text input with consistent styling
 * Replaces: native <input> with repeated class strings
 */
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  function InputField({ label, icon, error, className, ...props }, ref) {
    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label className="font-label-caps text-ink/70 flex items-center gap-1.5">
            {icon && <span className="text-coral">{icon}</span>}
            <span>{label}</span>
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full border-b border-border bg-transparent px-2 py-2 font-body-sm text-ink",
            "focus:outline-none focus:border-ink focus:ring-0",
            "transition-all",
            error && "border-red-300 focus:border-red-500 text-red-900",
            className
          )}
          {...props}
        />
        {error && (
          <p className="font-body-sm text-[11px] text-red-600">{error}</p>
        )}
      </div>
    );
  }
);
