import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import { prisma, withDbRetry } from "@/lib/db";
import { hasRole } from "@/lib/rbac";
import Link from "next/link";
import ResumeUploadBox from "@/components/resume-upload-box";
import { ApplyButton } from "@/components/apply-button";
import { CandidatePageClient } from "./candidate-page-client";
import { ProfileNotFoundCard } from "./profile-not-found-card";
import { Badge } from "@/components/layout/primitives";
import { EmptyState } from "@/components/empty-state";
import { StatCard } from "@/components/ui/stat-card";
import { Briefcase, Sparkles, Building2, MapPin, Cpu, FileText, TrendingUp, CheckCircle2, ChevronRight } from "lucide-react";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

type UserWithProfile = Prisma.UserGetPayload<{
  include: {
    profile: {
      include: {
        applications: {
          include: {
            jobPosting: { include: { company: true } };
            interviewSessions: { include: { assessments: true } };
          };
        };
      };
    };
  };
}>;

type JobWithCompany = Prisma.JobPostingGetPayload<{ include: { company: true } }>;

export default async function CandidateDashboard() {
  const session = await getServerSession(authOptions);

  if (!hasRole(session?.user ?? null, ["CANDIDATE"])) {
    redirect("/login");
  }

  let user: UserWithProfile | null = null;
  let openJobs: JobWithCompany[] = [];

  try {
    user = await withDbRetry(() =>
      prisma.user.findUnique({
        where: { id: session!.user.id },
        include: {
          profile: {
            include: {
              applications: {
                include: {
                  jobPosting: { include: { company: true } },
                  interviewSessions: { include: { assessments: true } },
                },
              },
            },
          },
        },
      })
    );

    if (user?.profile) {
      const applications = user.profile.applications || [];
      const appliedJobIds = new Set<string>(applications.map((app) => app.jobPostingId));

      openJobs = await withDbRetry(() =>
        prisma.jobPosting.findMany({
          where: { status: "OPEN", id: { notIn: Array.from(appliedJobIds) } },
          include: { company: true },
        })
      );
    }
  } catch (error) {
    console.error("[CANDIDATE DASHBOARD DB ERROR]:", error);
  }

  if (!user || !user.profile) {
    return (
      <CandidatePageClient userName="">
        <ProfileNotFoundCard />
      </CandidatePageClient>
    );
  }

  const profile = user.profile;
  const applications = profile?.applications || [];
  const userName = user?.name || user?.email || "";

  const appsCount = applications.length;
  const openCount = openJobs.length;
  const avgMatch = appsCount > 0
    ? Math.round(applications.reduce((s, a) => s + (a.matchScore ?? 0), 0) / appsCount)
    : 0;
  const scheduledInterviews = applications.filter(
    (a) => a.interviewSessions && a.interviewSessions.length > 0
  ).length;

  return (
    <CandidatePageClient userName={userName}>
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        {/* Header Section */}
        <section className="flex flex-col md:flex-row gap-8 items-start justify-between">
          <div className="space-y-4 flex-1">
            <h1 className="font-editorial text-4xl font-medium text-ink tracking-tight">
              Welcome back, {userName || "Candidate"}
            </h1>
            <p className="font-body-sm text-ink/60 text-base">
              Track your applications and discover new roles that match your profile.
            </p>
            
            <div className="pt-4 flex flex-wrap gap-2 items-center">
              <span className="font-label-caps text-ink/50 text-xs mr-2">Verified Skills:</span>
              {(profile?.skills ?? []).length > 0 ? (
                profile.skills.map((skill) => (
                  <span key={skill} className="px-2 py-1 bg-coral/10 text-coral text-xs font-medium rounded-md border border-coral/20">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-ink/40 italic">Upload your resume to extract skills.</span>
              )}
            </div>
          </div>

          <div className="w-full md:w-[320px] shrink-0">
             <ResumeUploadBox />
          </div>
        </section>

        {/* Premium Quick Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Applications"
            value={appsCount}
            icon={<FileText className="w-4 h-4" />}
            trend={scheduledInterviews > 0 ? Math.round((scheduledInterviews / appsCount) * 100) : 0}
            trendLabel="interview rate"
            accentColor="#0071e3"
          />
          <StatCard
            label="Interviews"
            value={scheduledInterviews}
            icon={<CheckCircle2 className="w-4 h-4" />}
            accentColor="#10b981"
          />
          <StatCard
            label="Match Score"
            value={`${avgMatch}%`}
            icon={<TrendingUp className="w-4 h-4" />}
            accentColor="#E03E00"
          />
          <StatCard
            label="Open Roles"
            value={openCount}
            icon={<Briefcase className="w-4 h-4" />}
            trendLabel="matching your profile"
            accentColor="#86868b"
          />
        </section>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Applications Table */}
          <section className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-editorial text-2xl font-medium text-ink">Active Applications</h2>
            </div>
            
            {applications.length === 0 ? (
              <EmptyState title="You haven't applied to any jobs yet." />
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-[#EAEAEA] overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F9F9F9] border-b border-[#EAEAEA]">
                      <th className="py-3 px-5 text-xs font-label-caps uppercase tracking-wider text-ink/50">Role</th>
                      <th className="py-3 px-5 text-xs font-label-caps uppercase tracking-wider text-ink/50">Status</th>
                      <th className="py-3 px-5 text-xs font-label-caps uppercase tracking-wider text-ink/50 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAEAEA]">
                    {applications.map((app) => {
                      const sess = app?.interviewSessions?.[0];
                      return (
                        <tr key={app.id} className="hover:bg-[#F9F9F9] transition-colors group">
                          <td className="py-4 px-5">
                            <div className="font-body-sm font-medium text-ink">{app?.jobPosting?.title}</div>
                            <div className="text-xs text-ink/50 mt-0.5">{app?.jobPosting?.company?.name}</div>
                          </td>
                          <td className="py-4 px-5">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${app?.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' : app?.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                              {app?.status ?? "APPLIED"}
                            </span>
                          </td>
                          <td className="py-4 px-5 text-right">
                            {sess ? (
                              <Link href={`/candidate/interview/${sess?.id}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-ink text-white rounded-md text-xs font-medium hover:bg-coral transition-colors">
                                <Cpu className="w-3.5 h-3.5" /> Start Interview
                              </Link>
                            ) : (
                              <span className="text-ink/40 italic text-xs">Processing...</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Open Jobs List */}
          <section className="lg:col-span-5 space-y-4">
            <h2 className="font-editorial text-2xl font-medium text-ink">Recommended Roles</h2>
            {openJobs.length === 0 ? (
               <EmptyState title="No matching jobs available right now." />
            ) : (
               <div className="space-y-3">
                 {openJobs.map((job) => (
                    <div key={job.id} className="bg-white rounded-xl shadow-sm border border-[#EAEAEA] p-5 hover:border-ink/30 transition-colors group">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="font-editorial text-xl font-medium text-ink mb-1">{job.title}</h3>
                          <div className="flex flex-wrap gap-3 text-xs font-label-caps text-ink/50">
                            <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5"/> {job?.company?.name || "EduCore"}</span>
                            {job.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5"/> {job.location}</span>}
                          </div>
                        </div>
                        <ApplyButton jobPostingId={job.id} />
                      </div>
                    </div>
                 ))}
               </div>
            )}
          </section>
        </div>

      </div>
    </CandidatePageClient>
  );
}
