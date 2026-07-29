import { PageShell } from "@/components/layout/page-shell";
export default function AdminTechLoading() {
  return (
    <PageShell>
      <div className="space-y-8 pb-12 animate-pulse mt-4">
        <div className="space-y-4">
           <div className="h-10 bg-border/40 w-1/3"></div>
           <div className="h-4 bg-border/40 w-1/4"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
           <div className="h-28 bg-border/20 border border-border"></div>
           <div className="h-28 bg-border/20 border border-border"></div>
           <div className="h-28 bg-border/20 border border-border"></div>
           <div className="h-28 bg-border/20 border border-border"></div>
        </div>
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 h-96 bg-border/10 border border-border"></div>
          <div className="lg:col-span-8 h-[600px] bg-border/10 border border-border"></div>
        </div>
      </div>
    </PageShell>
  );
}
