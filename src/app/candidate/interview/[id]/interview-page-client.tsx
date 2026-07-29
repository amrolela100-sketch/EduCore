"use client";

import { PageShell } from "@/components/layout/page-shell";
import { AppNavbar } from "@/components/app-navbar";

interface InterviewPageClientProps {
  cancelAction: React.ReactNode;
  children: React.ReactNode;
}

export function InterviewPageClient({ cancelAction, children }: InterviewPageClientProps) {
  return (
    <PageShell variant="interview" bare className="bg-paper text-ink font-sans selection:bg-coral selection:text-paper">
      <AppNavbar variant="interview" actions={cancelAction} />
      <div className="flex-grow overflow-hidden relative">
        <div className="relative z-10 h-full p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </PageShell>
  );
}
