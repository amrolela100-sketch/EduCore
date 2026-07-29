"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface EditorialSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  index?: string | number;
  title: string;
  emphasisWord?: string;
  className?: string;
}

export function EditorialSection({
  index,
  title,
  emphasisWord,
  className,
  ...props
}: EditorialSectionProps) {
  return (
    <div className={cn("flex flex-col gap-2 mb-8", className)} {...props}>
      {index && (
        <span className="font-data-mono text-muted-foreground">
          {typeof index === "number" ? index.toString().padStart(2, "0") : index}
        </span>
      )}
      <h2 className="font-display-lg coral-dot">
        {title}{" "}
        {emphasisWord && <em className="text-emphasis">{emphasisWord}</em>}
      </h2>
    </div>
  );
}
