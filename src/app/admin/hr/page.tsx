import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import { prisma, withDbRetry } from "@/lib/db";
import { hasRole } from "@/lib/rbac";
import { HrOverrideForm } from "@/components/hr-override-form";
import { HRAuditTimeline, AuditTimelineEvent } from "@/components/admin/hr-audit-timeline";
import { HrPageClient } from "./hr-page-client";
import { StatCard } from "@/components/ui/stat-card";
import { FileText, UserCheck, UserX, TrendingUp, BarChart3, Clock } from "lucide-react";
import { Badge } from "@/components/layout/primitives";
import { DataTable, ColumnDef } from "@/components/ui/data-table";

export const dynamic = "force-dynamic";

export default async function HrAdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!hasRole(session?.user ?? null, ["HR_ADMIN", "SYSTEM_ADMIN"])) {
    redirect("/login");
  }

  const applications = await withDbRetry(() =>
    prisma.application.findMany({
      include: {
        candidateProfile: {
          include: {
            user: { select: { name: true, email: true } },
          },
        },
        jobPosting: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: "desc" },
    })
  );

  const total = applications.length;
  const accepted = applications.filter((a) => a.status === "ACCEPTED").length;
  const rejected = applications.filter((a) => a.status === "REJECTED").length;
  const pending = applications.filter(
    (a) => a.status === "APPLIED" || a.status === "MATCHED" || a.status === "INTERVIEWING" || a.status === "EVALUATED"
  ).length;
  const avgScore = total > 0
    ? Math.round(applications.reduce((sum, a) => sum + (a.matchScore ?? 0), 0) / total)
    : 0;

  const sampleAuditEvents: AuditTimelineEvent[] = (applications ?? []).map((app) => ({
    id: app.id,
    timestamp: new Date(app.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    type: app.status === "ACCEPTED" || app.status === "REJECTED" ? "HR_OVERRIDE" : "AI_EVALUATION",
    actor: app.status === "ACCEPTED" || app.status === "REJECTED" ? "HR Admin" : "Gemini AI Agent",
    title: `تقييم طلب: ${app.jobPosting?.title || "وظيفة"}`,
    description: app.rankingReason || "تم استخراج مهارات المرشح وتقييم المطابقة مع متطلبات الوظيفة.",
    status: app.status === "ACCEPTED" ? "ACCEPTED" : app.status === "REJECTED" ? "REJECTED" : "PENDING",
    score: app.matchScore ?? 85,
    reasoning: app.rankingReason || undefined,
  }));

  const userName = session?.user?.name || session?.user?.email || "";

  return (
    <HrPageClient userName={userName}>
      <div className="space-y-8">
        <div className="mb-8">
          <h1 className="font-display-md text-foreground">HR Administration</h1>
          <p className="text-muted-foreground mt-2 font-body-base">Manage candidate pipelines and oversee AI evaluations.</p>
        </div>

        {/* Premium Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Total Applications"
            value={total}
            icon={<FileText className="w-4 h-4" />}
            trend={Math.round((pending / (total || 1)) * 100)}
            trendLabel="pending review"
            accentColor="#8b5cf6"
          />
          <StatCard
            label="Accepted"
            value={accepted}
            icon={<UserCheck className="w-4 h-4" />}
            trend={Math.round((accepted / (total || 1)) * 100)}
            accentColor="#10b981"
          />
          <StatCard
            label="Rejected"
            value={rejected}
            icon={<UserX className="w-4 h-4" />}
            trend={-(Math.round((rejected / (total || 1)) * 100))}
            accentColor="#ef4444"
          />
          <StatCard
            label="Avg Match Score"
            value={`${avgScore}%`}
            icon={<TrendingUp className="w-4 h-4" />}
            accentColor="#3b82f6"
          />
        </div>

        {/* Main Content Area */}
        <div className="grid lg:grid-cols-3 gap-8 pt-6">
          <div className="lg:col-span-2 space-y-6">
             <div className="flex items-center justify-between">
                <h2 className="font-display-sm text-foreground">Application Pipeline</h2>
             </div>
             {/* Using HrOverrideForm which we'll assume is already a form, but we wrap it in a sleek container */}
             <div className="glass-panel p-6">
                <HrOverrideForm initialApplications={applications} />
             </div>
          </div>

          <div className="space-y-6">
             <h2 className="font-display-sm text-foreground flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary"/> Audit Trace
             </h2>
             <div className="glass-panel p-6 max-h-[600px] overflow-y-auto">
               <HRAuditTimeline
                 events={sampleAuditEvents}
                 candidateName="مرشحي المنصة"
                 jobTitle="الطلبات النشطة"
               />
             </div>
          </div>
        </div>
      </div>
    </HrPageClient>
  );
}
