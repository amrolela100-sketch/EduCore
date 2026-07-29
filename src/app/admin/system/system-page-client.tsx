"use client";

import { PageShell } from "@/components/layout/page-shell";

interface SystemPageClientProps {
  userName: string;
  children: React.ReactNode;
}

export function SystemPageClient({ userName, children }: SystemPageClientProps) {
  return (
    <PageShell variant="system" userName={userName}>
      {children}
    </PageShell>
  );
}
