"use client";

import { PageShell } from "@/components/layout/page-shell";

interface TechPageClientProps {
  userName: string;
  children: React.ReactNode;
}

export function TechPageClient({ userName, children }: TechPageClientProps) {
  return (
    <PageShell variant="tech" userName={userName}>
      {children}
    </PageShell>
  );
}
