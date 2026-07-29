"use client";

import { motion } from "framer-motion";
import { DollarSign } from "lucide-react";

export interface ROICardProps {
  title: string;
  amount: string;
  description: string;
  delay: number;
}

export function ROICard({ title, amount, description, delay }: ROICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      viewport={{ once: true }}
      className="bg-paper border-2 border-border p-5 text-ink hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] transition-all cursor-pointer"
    >
      <div className="flex items-center gap-2 mb-3 border-b-2 border-border pb-2">
        <DollarSign className="w-5 h-5 text-coral" />
        <span className="text-xs font-label-caps font-bold text-ink/70 uppercase">{title}</span>
      </div>
      <div className="font-editorial text-2xl font-bold text-ink mb-1">{amount}</div>
      <p className="font-body-sm text-xs text-ink/50">{description}</p>
    </motion.div>
  );
}
