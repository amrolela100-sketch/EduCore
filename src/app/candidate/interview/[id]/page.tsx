import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser, hasRole } from "@/lib/rbac";
import { InterviewInterface } from "@/components/interview-interface";
import { InterviewTranscript } from "@/types";
import { InterviewPageClient } from "./interview-page-client";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function InterviewPage({ params }: PageProps) {
  const resolvedParams = await params;
  const user = await getCurrentUser();

  if (!user || !hasRole(user, ["CANDIDATE"])) {
    redirect("/login");
  }

  // Find the candidate profile first
  const candidateProfile = await prisma.candidateProfile.findUnique({
    where: { userId: user.id },
  });

  if (!candidateProfile) {
    redirect("/login");
  }

  // Robust Lookup: Find application either by application.id OR by interviewSession.id
  const application = await prisma.application.findFirst({
    where: {
      candidateProfileId: candidateProfile.id,
      OR: [
        { id: resolvedParams.id },
        {
          interviewSessions: {
            some: { id: resolvedParams.id },
          },
        },
      ],
    },
    include: {
      jobPosting: {
        include: { company: true },
      },
      interviewSessions: true,
    },
  });

  if (!application) {
    notFound();
  }

  // Locate the target session (either matching resolvedParams.id or default to first session)
  const activeSession =
    application.interviewSessions.find((s) => s.id === resolvedParams.id) ||
    application.interviewSessions[0];

  if (!activeSession) {
    return (
      <div className="p-8 text-center bg-paper min-h-screen flex items-center justify-center font-sans relative overflow-hidden">
        <div className="bg-paper border-2 border-border p-8 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] max-w-md relative z-10 transition-all hover:shadow-[6px_6px_0px_0px_rgba(20,20,20,1)] hover:-translate-y-1 hover:border-ink">
          <h1 className="font-editorial text-2xl font-bold text-ink mb-4 tracking-tight border-b-2 border-dotted border-border pb-4">لا توجد جلسة مقابلة نشطة لهذا الطلب.</h1>
          <p className="font-body-sm text-ink/70 mb-8 leading-relaxed">يرجى العودة للوحة المرشح والتأكد من توفر جلسة متاحة.</p>
          <Link
            href="/candidate"
            className="inline-block px-6 py-3 bg-ink text-paper font-label-caps text-sm font-bold uppercase border-2 border-transparent hover:bg-coral hover:text-ink hover:border-ink transition-all duration-300 shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] hover:shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] hover:-translate-y-0.5"
          >
            العودة للوحة المرشح
          </Link>
        </div>
      </div>
    );
  }

  // Extract transcript challenge details
  const transcriptData = (activeSession.transcript as unknown as InterviewTranscript) || {};
  const challengeType = transcriptData.challengeType || "CODING";
  const challengeTitle = transcriptData.challengeTitle || "Technical Challenge";
  const challengeDescription = transcriptData.challengeDescription || "";
  const questions = (transcriptData.questions || []).map((q) => (typeof q === "string" ? q : q.text || ""));

  return (
    <InterviewPageClient
      cancelAction={
        <Link
          href="/candidate"
          className="font-label-caps text-sm px-5 py-2.5 border-2 border-ink text-ink hover:bg-ink hover:text-paper transition-all duration-300 uppercase font-bold shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] hover:shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] hover:-translate-y-0.5"
        >
          Cancel & Exit
        </Link>
      }
    >
      {/* Main Form Canvas */}
      <InterviewInterface
        applicationId={application.id}
        interviewSessionId={activeSession.id}
        challengeTitle={challengeTitle}
        challengeDescription={challengeDescription}
        questions={questions}
        challengeType={challengeType}
      />
    </InterviewPageClient>
  );
}
