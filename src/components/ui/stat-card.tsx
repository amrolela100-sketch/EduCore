import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  accentColor?: string;
}

export function StatCard({ label, value, icon, trend, trendLabel, accentColor = "#000" }: StatCardProps) {
  return (
    <div className="bg-white border border-[#EAEAEA] rounded-xl p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-label-caps text-xs text-ink/50 uppercase tracking-wider">{label}</h3>
        {icon && (
          <div 
            className="w-8 h-8 rounded-md flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity"
            style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
          >
            {icon}
          </div>
        )}
      </div>
      
      <div className="font-editorial text-3xl font-medium tracking-tight text-ink mb-3">
        {value}
      </div>
      
      {(trend !== undefined || trendLabel) && (
        <div className="flex items-center gap-2 text-xs font-body-sm font-medium">
          {trend !== undefined && (
            <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded-sm ${trend > 0 ? "bg-green-100 text-green-700" : trend < 0 ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}>
              {trend > 0 ? <TrendingUp className="w-3 h-3" /> : trend < 0 ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
              {Math.abs(trend)}%
            </span>
          )}
          {trendLabel && <span className="text-ink/40">{trendLabel}</span>}
        </div>
      )}
    </div>
  );
}
