"use client";

import { useState, useMemo } from "react";
import { createCompany } from "@/app/admin/system/actions";

export interface Company {
  id: string;
  name: string;
  description: string | null;
  website: string | null;
  createdAt: Date;
}

interface CompaniesTabProps {
  initialCompanies: Company[];
  onLogAudit: (msg: string) => void;
}

export function CompaniesTab({ initialCompanies, onLogAudit }: CompaniesTabProps) {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [suspendedCompanies, setSuspendedCompanies] = useState<Record<string, boolean>>({});
  const [newCompany, setNewCompany] = useState({ name: "", description: "", website: "" });
  const [companyLoading, setCompanyLoading] = useState(false);
  const [companyError, setCompanyError] = useState("");
  const [companySearch, setCompanySearch] = useState("");

  const filteredCompanies = useMemo(() => {
    const q = companySearch.toLowerCase().trim();
    if (!q) return companies;
    return companies.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.website || "").toLowerCase().includes(q) ||
        (c.description || "").toLowerCase().includes(q)
    );
  }, [companies, companySearch]);

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setCompanyLoading(true);
    setCompanyError("");

    const res = await createCompany(newCompany);
    if (res.success && res.company) {
      setCompanies([res.company as Company, ...companies]);
      setNewCompany({ name: "", description: "", website: "" });
    } else {
      setCompanyError(res.error || "Failed to create company.");
    }
    setCompanyLoading(false);
  };

  const toggleCompanySuspension = (id: string, name: string) => {
    const nextSuspended = !suspendedCompanies[id];
    setSuspendedCompanies({
      ...suspendedCompanies,
      [id]: nextSuspended,
    });
    const timestamp = new Date().toISOString().replace("T", " ").substring(0, 19);
    onLogAudit(`${timestamp} - Company "${name}" status toggled to ${nextSuspended ? "SUSPENDED" : "ACTIVE"} by system@educore.com`);
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h2 className="font-editorial text-3xl font-bold text-ink mb-2">Employer Organizations</h2>
        <p className="font-body-sm text-ink/70">
          Register new corporate accounts or suspend existing business clients.
        </p>
      </div>

      {/* Create Company Form */}
      <form onSubmit={handleCreateCompany} className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-paper p-6 border-2 border-border shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] transition-all duration-300">
        <div className="flex flex-col gap-2 col-span-1">
          <label className="font-label-caps text-xs text-ink font-bold tracking-wide">Company Name</label>
          <input
            type="text"
            required
            placeholder="e.g., EduCore Corp"
            value={newCompany.name}
            onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
            className="border-2 border-border bg-transparent px-4 py-3 text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:border-ink focus:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] transition-all duration-300"
          />
        </div>
        <div className="flex flex-col gap-2 col-span-1">
          <label className="font-label-caps text-xs text-ink font-bold tracking-wide">Website</label>
          <input
            type="url"
            placeholder="https://example.com"
            value={newCompany.website}
            onChange={(e) => setNewCompany({ ...newCompany, website: e.target.value })}
            className="border-2 border-border bg-transparent px-4 py-3 text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:border-ink focus:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] transition-all duration-300"
          />
        </div>
        <div className="flex flex-col gap-2 col-span-1">
          <label className="font-label-caps text-xs text-ink font-bold tracking-wide">Description</label>
          <input
            type="text"
            placeholder="Corporate description"
            value={newCompany.description}
            onChange={(e) => setNewCompany({ ...newCompany, description: e.target.value })}
            className="border-2 border-border bg-transparent px-4 py-3 text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:border-ink focus:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] transition-all duration-300"
          />
        </div>
        {companyError && (
          <div className="col-span-1 md:col-span-3 text-coral font-label-caps text-sm font-bold animate-fade-in">
            {companyError}
          </div>
        )}
        <div className="col-span-1 md:col-span-3 flex justify-end">
          <button
            type="submit"
            disabled={companyLoading}
            className="font-label-caps uppercase font-bold text-sm px-8 py-3 bg-ink text-paper disabled:opacity-50 border-2 border-transparent hover:border-ink hover:bg-coral hover:text-ink hover:shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] transition-all duration-300 cursor-pointer"
          >
            {companyLoading ? "Registering..." : "Add Organization"}
          </button>
        </div>
      </form>

      {/* Search Organizations Bar */}
      <div className="bg-paper p-6 border-2 border-border shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
        <div className="flex flex-col gap-2 w-full">
          <label className="font-label-caps text-xs text-ink font-bold tracking-wide">Search Organizations</label>
          <input
            type="text"
            placeholder="Filter by organization name, website or description..."
            value={companySearch}
            onChange={(e) => setCompanySearch(e.target.value)}
            className="border-2 border-border bg-transparent px-4 py-3 text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:border-ink focus:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] transition-all duration-300"
          />
        </div>
      </div>

      {/* Companies List */}
      <div className="overflow-x-auto border-2 border-border bg-paper shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-border bg-ink/5">
              <th className="font-label-caps text-xs py-4 px-6 text-ink font-bold tracking-wider">Company</th>
              <th className="font-label-caps text-xs py-4 px-6 text-ink font-bold tracking-wider">Website</th>
              <th className="font-label-caps text-xs py-4 px-6 text-ink font-bold tracking-wider">Registered</th>
              <th className="font-label-caps text-xs py-4 px-6 text-ink font-bold tracking-wider">Status</th>
              <th className="font-label-caps text-xs py-4 px-6 text-ink font-bold tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-dotted divide-border">
            {filteredCompanies.length === 0 && (
              <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">لا توجد مؤسسات مطابقة للبحث.</td></tr>
            )}
            {filteredCompanies.map((c) => {
              const isSuspended = !!suspendedCompanies[c.id];
              return (
                <tr key={c.id} className="hover:bg-ink/5 transition-all duration-150">
                  <td className="py-5 px-6">
                    <div className="font-bold text-sm text-ink">{c.name}</div>
                    {c.description && <div className="font-body-sm text-ink/50 mt-1">{c.description}</div>}
                  </td>
                  <td className="py-5 px-6 font-label-caps text-coral text-sm">
                    {c.website ? (
                      <a href={c.website} target="_blank" rel="noopener noreferrer" className="hover:underline">{c.website}</a>
                    ) : (
                      <span className="text-ink/40">N/A</span>
                    )}
                  </td>
                  <td className="py-5 px-6 font-label-caps text-sm text-ink/60">{new Date(c.createdAt).toISOString().split("T")[0]}</td>
                  <td className="py-5 px-6">
                    <span className={`inline-flex items-center gap-2 font-label-caps text-[10px] px-3 py-1.5 border-2 font-bold ${
                      isSuspended
                        ? "bg-rose-50 border-rose-300 text-rose-600 shadow-[2px_2px_0px_0px_rgba(225,29,72,0.3)]"
                        : "bg-emerald-50 border-emerald-300 text-emerald-600 shadow-[2px_2px_0px_0px_rgba(16,185,129,0.3)]"
                    }`}>
                      <span className={`w-2 h-2 rounded-none ${isSuspended ? "bg-rose-500" : "bg-emerald-500"}`} />
                      {isSuspended ? "SUSPENDED" : "ACTIVE"}
                    </span>
                  </td>
                  <td className="py-5 px-6 text-right">
                    <button
                      onClick={() => toggleCompanySuspension(c.id, c.name)}
                      className={`font-label-caps text-xs px-4 py-2 border-2 transition-all duration-200 cursor-pointer ${
                        isSuspended
                          ? "bg-transparent border-ink text-ink hover:bg-ink hover:text-paper hover:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)]"
                          : "bg-transparent border-coral text-coral hover:bg-coral hover:text-ink hover:border-ink hover:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)]"
                      }`}
                    >
                      {isSuspended ? "Activate" : "Suspend"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
