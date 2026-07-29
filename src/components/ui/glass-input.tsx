import React from "react";

export interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

export function GlassInput({ label, icon, className, ...props }: GlassInputProps) {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="text-sm font-label-caps uppercase text-ink/70 flex items-center gap-2 tracking-wide mb-2">
          {icon && <span className="text-coral">{icon}</span>}
          <span>{label}</span>
        </label>
      )}
      <input
        aria-label={label || props.name || "input"}
        className={[
          "w-full border-2 border-border bg-paper px-4 py-3 text-base text-ink outline-none",
          "placeholder:text-ink/30",
          "focus:border-ink focus:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)]",
          "transition-all duration-300 font-body-sm",
          className || "",
        ].join(" ")}
        {...props}
      />
    </div>
  );
}
