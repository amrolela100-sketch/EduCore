"use client";

import React from "react";
import { PageShell } from "@/components/layout/page-shell";
import { PageFadeIn } from "@/components/ui/motion-wrapper";

interface CandidatePageClientProps {
  userName: string;
  children: React.ReactNode;
}

/** @deprecated Thin wrapper preserved for compat; migrate to PageShell directly. */
export function CandidatePageClient({ userName, children }: CandidatePageClientProps) {
  return (
    <PageShell variant="candidate" userName={userName}>
      <PageFadeIn className="flex flex-col gap-6">
        {children}
      </PageFadeIn>
    </PageShell>
  );
}
