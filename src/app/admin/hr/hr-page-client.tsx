"use client";

import { PageShell } from "@/components/layout/page-shell";

interface HrPageClientProps {
  userName: string;
  children: React.ReactNode;
}

export function HrPageClient({ userName, children }: HrPageClientProps) {
  return (
    <PageShell variant="hr" userName={userName}>
      {children}
    </PageShell>
  );
}
