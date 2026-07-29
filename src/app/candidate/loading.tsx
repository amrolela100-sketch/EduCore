import { PageShell } from "@/components/layout/page-shell";
export default function CandidateLoading() {
  return (
    <PageShell>
      <div className="max-w-5xl mx-auto mt-8 space-y-12 pb-12 animate-pulse">
        <div className="border-b-2 border-border pb-8 space-y-4">
           <div className="h-12 bg-border/40 w-1/2"></div>
           <div className="h-4 bg-border/40 w-1/3"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
           <div className="h-28 bg-border/20 border border-border"></div>
           <div className="h-28 bg-border/20 border border-border"></div>
           <div className="h-28 bg-border/20 border border-border"></div>
           <div className="h-28 bg-border/20 border border-border"></div>
        </div>
        <div className="space-y-4">
           <div className="h-8 bg-border/30 w-1/4 mb-4"></div>
           <div className="h-20 bg-border/10 border border-border"></div>
           <div className="h-20 bg-border/10 border border-border"></div>
        </div>
      </div>
    </PageShell>
  );
}