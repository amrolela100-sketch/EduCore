"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export interface GrowthBarProps {
  label: string;
  value: number;
  max?: number;
  delay: number;
}

export function GrowthBar({ label, value, max = 100, delay }: GrowthBarProps) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth((value / max) * 100), delay * 1000);
    return () => clearTimeout(timer);
  }, [value, max, delay]);

  return (
    <div className="space-y-2 border-b-2 border-dotted border-border pb-3">
      <div className="flex justify-between text-sm font-label-caps font-bold">
        <span className="text-ink/70 uppercase">{label}</span>
        <span className="text-ink">{value}%</span>
      </div>
      <div className="h-2 bg-paper border-2 border-border overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 1, delay: delay * 0.5, ease: "easeOut" }}
          className="h-full bg-ink"
        />
      </div>
    </div>
  );
}
