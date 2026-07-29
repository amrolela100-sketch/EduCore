"use client";

import React, { useState } from "react";
import { submitHumanOverride } from "@/app/admin/hr/actions";
import { HrOverrideModalDialog, ApplicationData } from "@/components/admin/hr-override-modal-dialog";
import { StaggerContainer, StaggerItem, PulseBadge } from "@/components/ui/motion-wrapper";
import { UserCheck, Search, Filter } from "lucide-react";

interface HrOverrideFormProps {
  initialApplications: ApplicationData[];
}

export function HrOverrideForm({ initialApplications = [] }: HrOverrideFormProps) {
  const [selectedApp, setSelectedApp] = useState<ApplicationData | null>(null);
  const [justification, setJustification] = useState("");
  const [decision, setDecision] = useState<"ACCEPTED" | "REJECTED">("ACCEPTED");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const applications = initialApplications ?? [];

  const filteredApps = applications.filter((app) => {
    const candidateName = app?.candidateProfile?.user?.name || "";
    const candidateEmail = app?.candidateProfile?.user?.email || "";
    const jobTitle = app?.jobPosting?.title || "";

    const matchesSearch =
      candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidateEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      jobTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleOpenOverride = (app: ApplicationData) => {
    setSelectedApp(app);
    setJustification("");
    setMessage("");
    setError("");
  };

  const handleClose = () => {
    setSelectedApp(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    setLoading(true);
    setMessage("");
    setError("");

    const formData = new FormData();
    formData.append("applicationId", selectedApp.id);
    formData.append("decision", decision);
    formData.append("justification", justification);

    try {
      const result = await submitHumanOverride(null, formData);

      if (!result.success) {
        setError(result.error || "فشل تسجيل التعديل البشري.");
      } else {
        setMessage(result.message || "تم تسجيل القرار بنجاح.");
        setTimeout(() => {
          setSelectedApp(null);
        }, 1200);
      }
    } catch (err) {
      console.error("[Override Form Submit Error]:", err);
      setError("حدث خطأ غير متوقع أثناء معالجة الطلب.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 font-sans">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-paper border-2 border-border shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
        <div className="relative w-full sm:w-72">
          <Search className="w-5 h-5 absolute left-3 top-3 text-ink/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث عن مرشح أو وظيفة..."
            className="w-full pl-10 pr-3 py-2.5 font-label-caps text-sm bg-paper border-2 border-border outline-none focus:border-ink focus:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto text-sm font-label-caps">
          <Filter className="w-4 h-4 text-ink/50 flex-shrink-0" />
          {["ALL", "APPLIED", "ACCEPTED", "REJECTED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-2 border-2 transition-all cursor-pointer ${
                statusFilter === st
                  ? "bg-ink text-paper border-ink shadow-[2px_2px_0px_0px_rgba(224,62,0,1)]"
                  : "bg-transparent text-ink border-border hover:border-ink"
              }`}
            >
              {st === "ALL" ? "الكل" : st}
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      {filteredApps.length === 0 ? (
        <div className="p-8 text-center bg-paper border-2 border-border font-label-caps text-sm text-ink/50 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
          لا توجد طلبات توظيف تطابق التصفية الحالية.
        </div>
      ) : (
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredApps.map((app) => {
            const candidateName = app?.candidateProfile?.user?.name || app?.candidateProfile?.user?.email || "مرشح";
            return (
              <StaggerItem key={app.id}>
                <div className="p-5 bg-paper border-2 border-border hover:border-ink shadow-sm hover:shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] transition-all space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-editorial text-xl text-ink tracking-tight">{candidateName}</h4>
                      <p className="font-label-caps text-sm text-ink/60 mt-1">{app?.jobPosting?.title}</p>
                    </div>
                    <PulseBadge
                      text={app.status}
                      variant={app.status === "ACCEPTED" ? "success" : app.status === "REJECTED" ? "warning" : "info"}
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm pt-3 border-t border-dotted border-border font-label-caps">
                    <span className="text-ink/60">درجة المطابقة:</span>
                    <span className="font-bold text-coral">{app?.matchScore ?? 0}%</span>
                  </div>

                  <button
                    onClick={() => handleOpenOverride(app)}
                    className="w-full py-2.5 bg-transparent hover:bg-ink border-2 border-ink text-ink hover:text-paper font-label-caps font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>تعديل القرار البشري HR Override</span>
                  </button>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      )}

      {/* Override Modal */}
      <HrOverrideModalDialog
        isOpen={Boolean(selectedApp)}
        onClose={handleClose}
        selectedApp={selectedApp}
        decision={decision}
        setDecision={setDecision}
        justification={justification}
        setJustification={setJustification}
        loading={loading}
        message={message}
        error={error}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
