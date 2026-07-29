"use client";

import { useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { CompaniesTab, Company } from "@/components/admin/system/companies-tab";
import { UsersTab, User } from "@/components/admin/system/users-tab";
import { ApiProvidersTab, ApiProvider } from "@/components/admin/system/api-providers-tab";
import { AgentTelemetryTab } from "@/components/admin/system/agent-telemetry-tab";

interface SystemSettingsClientProps {
  initialCompanies: Company[];
  initialUsers: User[];
  initialProviders: ApiProvider[];
  initialSettings: Record<string, string>;
}

export function SystemSettingsClient({
  initialCompanies,
  initialUsers,
  initialProviders,
  initialSettings,
}: SystemSettingsClientProps) {
  const searchParams = useSearchParams();

  const currentTab = searchParams.get("tab");
  const activeTab = ["companies", "users", "permissions", "ai"].includes(currentTab || "")
    ? currentTab
    : "system"; // 'system' root goes to Companies by default if we want, or we map it.
  
  // Wait, if no tab is provided (just /admin/system), we should default to "companies" or "users".
  const effectiveTab = ["companies", "users", "permissions", "ai"].includes(activeTab || "") ? activeTab : "companies";

  const [aiAuditLog, setAiAuditLog] = useState<string[]>([
    "2026-07-18 14:48:33 - Agent Model mappings synchronized with cluster settings.",
    "2026-07-18 14:48:33 - Platform API Providers initialized from seeded database tables.",
  ]);

  const handleLogAudit = useCallback((msg: string) => {
    setAiAuditLog((prev) => [msg, ...prev]);
  }, []);

  return (
    <div className="w-full bg-white p-6 sm:p-8 min-h-[600px]">
      {effectiveTab === "companies" && (
        <CompaniesTab initialCompanies={initialCompanies} onLogAudit={handleLogAudit} />
      )}

      {effectiveTab === "users" && (
        <UsersTab initialUsers={initialUsers} onLogAudit={handleLogAudit} />
      )}

      {effectiveTab === "permissions" && (
        <AgentTelemetryTab auditLogs={aiAuditLog} />
      )}

      {effectiveTab === "ai" && (
        <ApiProvidersTab
          initialProviders={initialProviders}
          initialSettings={initialSettings}
          onLogAudit={handleLogAudit}
        />
      )}
    </div>
  );
}
