import { PageShell } from "@/components/layout/page-shell";
export default function AdminHRLoading() {
  return (
    <PageShell>
      <div className="space-y-8 pb-12 animate-pulse mt-4">
        <div className="border-b-2 border-border pb-6 space-y-4">
           <div className="h-10 bg-border/40 w-1/3"></div>
           <div className="h-4 bg-border/40 w-1/4"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
           <div className="h-28 bg-border/20 border border-border"></div>
           <div className="h-28 bg-border/20 border border-border"></div>
           <div className="h-28 bg-border/20 border border-border"></div>
           <div className="h-28 bg-border/20 border border-border"></div>
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-8 bg-border/30 w-1/4"></div>
            <div className="h-96 bg-border/10 border border-border"></div>
          </div>
          <div className="space-y-4">
            <div className="h-8 bg-border/30 w-1/3"></div>
            <div className="h-64 bg-border/10 border border-border"></div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
