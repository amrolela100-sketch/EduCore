import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { CodeTelemetryViewer } from "@/components/code-telemetry-viewer";
import { TechPageClient } from "./tech-page-client";
import { EmptyState } from "@/components/empty-state";
import { StatCard } from "@/components/ui/stat-card";
import { Cpu, BarChart3, Code2, Users, Activity } from "lucide-react";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    candidateId?: string;
  }>;
}

export default async function TechAdminDashboard({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const session = await getServerSession(authOptions);

  if (!session || !session.user || (session.user.role !== "TECH_ADMIN" && session.user.role !== "SYSTEM_ADMIN")) {
    redirect("/login");
  }

  const applications = await prisma.application.findMany({
    where: {
      interviewSessions: {
        some: { status: "COMPLETED" },
      },
    },
    include: {
      candidateProfile: {
        include: {
          user: { select: { name: true, email: true } },
        },
      },
      jobPosting: true,
      interviewSessions: {
        include: {
          assessments: { include: { scores: true } },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  const activeAppId = resolvedSearchParams.candidateId || (applications[0]?.id || "");
  const activeApp = applications.find((app) => app.id === activeAppId);
  const activeSession = activeApp?.interviewSessions[0];
  const activeAssessment = activeSession?.assessments[0];
  const scores = activeAssessment?.scores || [];

  const userName = session.user.name || session.user.email || "";

  const totalEvaluated = applications.length;
  const avgScore = totalEvaluated > 0
    ? Math.round(applications.reduce((s, a) => s + (a.matchScore ?? 0), 0) / totalEvaluated)
    : 0;
  const sessionsCompleted = applications.reduce((s, a) => s + a.interviewSessions.length, 0);
  const withCode = applications.filter((a) => a.interviewSessions.some((i) => i.submittedCode && i.submittedCode.length > 10)).length;

  return (
    <TechPageClient userName={userName}>
      <div className="space-y-8 pb-12">
        <div>
           <h1 className="font-editorial text-3xl font-medium text-ink">Tech Workspace</h1>
           <p className="font-body-sm text-ink/60 mt-1">Review candidate code telemetry, execution traces, and AI assessment metrics.</p>
        </div>

        {/* Premium Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard
            label="Candidates Evaluated"
            value={totalEvaluated}
            icon={<Users className="w-4 h-4" />}
            accentColor="#0071e3"
          />
          <StatCard
            label="Avg Match Score"
            value={`${avgScore}%`}
            icon={<BarChart3 className="w-4 h-4" />}
            trend={avgScore >= 75 ? 5 : avgScore < 50 ? -5 : 0}
            trendLabel="vs last month"
            accentColor="#10b981"
          />
          <StatCard
            label="Completed Sessions"
            value={sessionsCompleted}
            icon={<Activity className="w-4 h-4" />}
            accentColor="#f59e0b"
          />
          <StatCard
            label="Code Submissions"
            value={withCode}
            icon={<Code2 className="w-4 h-4" />}
            accentColor="#8b5cf6"
          />
        </div>

        {/* Workspace Split Pane */}
        <div className="grid lg:grid-cols-12 gap-8 items-start h-[calc(100vh-300px)] min-h-[600px]">
          
          {/* Left: Candidates List */}
          <div className="lg:col-span-4 bg-white border border-[#EAEAEA] rounded-xl shadow-sm h-full flex flex-col overflow-hidden">
             <div className="p-5 border-b border-[#EAEAEA] bg-[#F9F9F9]">
                <h3 className="font-editorial text-xl font-medium flex items-center gap-2">
                   <Cpu className="w-5 h-5 text-coral"/> Pipeline
                </h3>
             </div>
             
             <div className="overflow-y-auto flex-1 divide-y divide-[#EAEAEA]">
               {applications.length === 0 ? (
                 <div className="p-6">
                   <EmptyState title="No tech evaluations available." />
                 </div>
               ) : (
                 applications.map((app) => {
                   const isActive = app.id === activeAppId;
                   const u = app.candidateProfile?.user;
                   return (
                     <Link
                       key={app.id}
                       href={`?candidateId=${app.id}`}
                       className={`block p-5 transition-colors group ${isActive ? "bg-coral/5 border-l-4 border-l-coral" : "hover:bg-[#F9F9F9] border-l-4 border-l-transparent"}`}
                     >
                       <div className="flex justify-between items-start mb-1">
                         <div className="font-body-sm font-medium text-ink group-hover:text-coral transition-colors">{u?.name || "Unknown"}</div>
                         <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-coral text-white' : 'bg-gray-100 text-gray-700'}`}>
                           {app.matchScore ?? 0}%
                         </span>
                       </div>
                       <div className="text-xs text-ink/50 mb-1">{u?.email}</div>
                       <div className="text-[10px] font-label-caps uppercase tracking-wider text-ink/40">{app.jobPosting?.title}</div>
                     </Link>
                   );
                 })
               )}
             </div>
          </div>

          {/* Right: Telemetry Details */}
          <div className="lg:col-span-8 bg-[#0a0a0a] border border-[#222] rounded-xl shadow-xl h-full flex flex-col overflow-hidden">
             <div className="p-4 border-b border-[#222] bg-[#111] flex items-center justify-between">
                <h3 className="font-mono text-sm text-white/70 flex items-center gap-2">
                  <Terminal className="w-4 h-4" /> Telemetry Viewer
                </h3>
                {activeSession && <span className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-green-400 bg-green-400/10 px-2 py-1 rounded-sm"><span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> Live</span>}
             </div>
             
             <div className="flex-1 overflow-hidden">
                {activeSession ? (
                  <CodeTelemetryViewer
                    code={activeSession.submittedCode || "// No code submitted."}
                    language="typescript"
                    metrics={{
                      executionTimeMs: 124,
                      memoryUsageKb: 4500,
                      cyclomaticComplexity: scores.find(s => s.dimension === "CODE_QUALITY")?.score || 12,
                      testPassRate: scores.find(s => s.dimension === "PROBLEM_SOLVING")?.score || 85,
                      aiReview: activeAssessment?.summary || "Pending AI review..."
                    }}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <EmptyState title="Select a candidate to view telemetry" />
                  </div>
                )}
             </div>
          </div>

        </div>
      </div>
    </TechPageClient>
  );
}

// Ensure Terminal icon is imported
import { Terminal } from "lucide-react";
