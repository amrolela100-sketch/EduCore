"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { useLanguage } from "@/components/language-context";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbNav({ items }: BreadcrumbNavProps) {
  const { direction } = useLanguage();
  const ChevronIcon = direction === "rtl" ? ChevronRight : ChevronRight;

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center flex-wrap gap-1.5 font-data-mono text-xs text-ink">
        <li>
          <Link
            href="/"
            className="flex items-center gap-1 opacity-70 hover:opacity-100 hover:text-coral transition-all focus-visible:outline-none p-0.5"
            aria-label="Home Workspace"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-1.5">
              <ChevronIcon className="w-3.5 h-3.5 opacity-40 shrink-0 select-none" aria-hidden="true" />
              {isLast || !item.href ? (
                <span
                  className="font-bold text-coral opacity-100 tracking-tight p-0.5"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="opacity-70 hover:opacity-100 hover:text-coral transition-all focus-visible:outline-none p-0.5"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
