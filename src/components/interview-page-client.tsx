"use client";

import { AppNavbar } from "@/components/app-navbar";
import { AppFooter } from "@/components/app-footer";

interface InterviewPageClientProps {
  cancelAction: React.ReactNode;
  children: React.ReactNode;
}

export function InterviewPageClient({ cancelAction, children }: InterviewPageClientProps) {
  return (
    <div className="bg-[#F5F6F2] text-[#1B211D] font-sans min-h-screen flex flex-col antialiased selection:bg-[#14665A] selection:text-white">
      <AppNavbar variant="interview" actions={cancelAction} />
      {children}
      <AppFooter variant="light" />
    </div>
  );
}
