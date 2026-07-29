import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser, hasRole } from "@/lib/rbac";
import { SystemSettingsClient } from "./system-settings-client";
import { SystemPageClient } from "./system-page-client";
import { Building2, Users, BrainCircuit, Settings, Server } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";

export const dynamic = "force-dynamic";

export default async function SystemAdminDashboard() {
  const user = await getCurrentUser();

  if (!user || !hasRole(user, ["SYSTEM_ADMIN"])) {
    redirect("/login");
  }

  const companies = await prisma.company.findMany({ orderBy: { createdAt: "desc" } });

  const users = await prisma.user.findMany({
    include: { role: { select: { name: true, description: true } } },
    orderBy: { createdAt: "desc" },
  });

  const providersCount = await prisma.apiProvider.count();
  if (providersCount === 0) {
    const defaults = [
      { name: "Google Gemini", providerKey: "google", baseUrl: null, isActive: true },
      { name: "OpenAI", providerKey: "openai", baseUrl: "https://api.openai.com/v1", isActive: true },
      { name: "Anthropic Claude", providerKey: "anthropic", baseUrl: "https://api.anthropic.com/v1", isActive: true },
    ];
    for (const d of defaults) {
      await prisma.apiProvider.create({ data: d });
    }
  }

  const dbProviders = await prisma.apiProvider.findMany({ orderBy: { name: "asc" } });
  const initialProviders = dbProviders.map((p) => ({
    id: p.id,
    name: p.name,
    providerKey: p.providerKey,
    baseUrl: p.baseUrl,
    isActive: p.isActive,
    hasKey: !!p.encryptedKey,
  }));

  const dbSettings = await prisma.systemSetting.findMany();
  const initialSettings: Record<string, string> = {};
  for (const s of dbSettings) initialSettings[s.key] = s.value;

  const userName = user.name || user.email || "";

  const totalCompanies = companies.length;
  const totalUsers = users.length;
  const activeProviders = dbProviders.filter((p) => p.isActive).length;
  const totalSettings = Object.keys(initialSettings).length;

  return (
    <SystemPageClient userName={userName}>
      <div className="space-y-8 pb-12">
        <div>
          <h1 className="font-editorial text-3xl font-medium text-ink">Platform Control</h1>
          <p className="font-body-sm text-ink/60 mt-1">
            Internal system settings, user roles, company directories, and agent configurations.
          </p>
        </div>

        {/* Premium CRM Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard
            label="Companies"
            value={totalCompanies}
            icon={<Building2 className="w-4 h-4" />}
            accentColor="#0071e3"
          />
          <StatCard
            label="Total Users"
            value={totalUsers}
            icon={<Users className="w-4 h-4" />}
            trend={totalUsers > 0 ? 1 : 0}
            trendLabel="active this month"
            accentColor="#10b981"
          />
          <StatCard
            label="Active AI Providers"
            value={activeProviders}
            icon={<BrainCircuit className="w-4 h-4" />}
            accentColor="#f59e0b"
          />
          <StatCard
            label="System Configs"
            value={totalSettings}
            icon={<Settings className="w-4 h-4" />}
            accentColor="#86868b"
          />
        </div>

        {/* Main Content (Tabs) */}
        <div className="bg-white rounded-xl shadow-sm border border-[#EAEAEA] overflow-hidden">
          <SystemSettingsClient
            initialCompanies={companies}
            initialUsers={users}
            initialProviders={initialProviders}
            initialSettings={initialSettings}
          />
        </div>
      </div>
    </SystemPageClient>
  );
}
