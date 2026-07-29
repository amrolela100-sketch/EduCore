"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export function PaginationControls({
  currentPage,
  totalPages,
  baseUrl,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const getPageUrl = (page: number) => `${baseUrl}?page=${page}`;

  return (
    <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-border">
      {hasPrev ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="p-2 rounded-sm border border-border paper-surface text-ink/70 hover:bg-ink hover:text-paper transition-colors flex items-center gap-1 font-label-caps"
        >
          <ChevronRight className="w-4 h-4" />
          <span>السابق</span>
        </Link>
      ) : (
        <span className="p-2 rounded-sm border border-border/30 bg-paper/40 text-ink/30 cursor-not-allowed flex items-center gap-1 font-label-caps">
          <ChevronRight className="w-4 h-4" />
          <span>السابق</span>
        </span>
      )}

      <span className="px-4 py-2 font-data-mono text-ink/70 paper-surface rounded-sm border border-border">
        صفحة <strong className="text-ink">{currentPage}</strong> من{" "}
        <strong className="text-ink">{totalPages}</strong>
      </span>

      {hasNext ? (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="p-2 rounded-sm border border-border paper-surface text-ink/70 hover:bg-ink hover:text-paper transition-colors flex items-center gap-1 font-label-caps"
        >
          <span>التالي</span>
          <ChevronLeft className="w-4 h-4" />
        </Link>
      ) : (
        <span className="p-2 rounded-sm border border-border/30 bg-paper/40 text-ink/30 cursor-not-allowed flex items-center gap-1 font-label-caps">
          <span>التالي</span>
          <ChevronLeft className="w-4 h-4" />
        </span>
      )}
    </div>
  );
}
