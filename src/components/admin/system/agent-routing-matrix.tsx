"use client";

import { useState } from "react";
import { saveAgentSettings } from "@/app/admin/system/actions";
import { ApiProvider } from "./api-providers-tab";

// Allowed models per provider type
const PROVIDER_MODELS: Record<string, string[]> = {
  google: ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash"],
  openai: ["gpt-4o", "gpt-4o-mini", "o1-mini"],
  anthropic: ["claude-3-5-sonnet", "claude-3-5-haiku", "claude-3-opus"],
  custom: ["custom-model-1", "custom-model-2"],
};

interface AgentRoutingMatrixProps {
  initialSettings: Record<string, string>;
  providers: ApiProvider[];
  onLogAudit: (msg: string) => void;
}

export function AgentRoutingMatrix({ initialSettings, providers, onLogAudit }: AgentRoutingMatrixProps) {
  // Settings state (agent mappings)
  const [settings, setSettings] = useState<Record<string, string>>({
    dispatcher_provider: initialSettings["dispatcher_provider"] || "google",
    dispatcher_model: initialSettings["dispatcher_model"] || "gemini-1.5-pro",
    profiler_provider: initialSettings["profiler_provider"] || "google",
    profiler_model: initialSettings["profiler_model"] || "gemini-1.5-flash",
    job_matcher_provider: initialSettings["job_matcher_provider"] || "google",
    job_matcher_model: initialSettings["job_matcher_model"] || "gemini-1.5-flash",
    interviewer_provider: initialSettings["interviewer_provider"] || "google",
    interviewer_model: initialSettings["interviewer_model"] || "gemini-1.5-pro",
    evaluator_provider: initialSettings["evaluator_provider"] || "google",
    evaluator_model: initialSettings["evaluator_model"] || "gemini-1.5-pro",
    ranker_provider: initialSettings["ranker_provider"] || "google",
    ranker_model: initialSettings["ranker_model"] || "gemini-1.5-pro",
  });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsError, setSettingsError] = useState("");

  const handleSaveSettings = async () => {
    setSettingsError("");
    setSettingsLoading(true);
    try {
      const res = await saveAgentSettings(settings);
      if (!res.success) {
        setSettingsError(res.error || "Failed to save settings.");
        setSettingsLoading(false);
        return;
      }
      
      const timestamp = new Date().toISOString().replace("T", " ").substring(0, 19);
      onLogAudit(`${timestamp} - Agent Model mappings synchronized with cluster settings by system@educore.com`);
    } catch {
      setSettingsError("حدث خطأ غير متوقع أثناء حفظ الإعدادات.");
    } finally {
      setSettingsLoading(false);
    }
  };

  return (
    <div className="bg-paper p-8 border-2 border-border shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] transition-all duration-300 mt-12">
      <div className="mb-8 flex justify-between items-center flex-wrap gap-4 border-b-2 border-border pb-6">
        <div>
          <h3 className="font-editorial text-2xl font-bold text-ink mb-2">Autonomous Agent Routing Matrix</h3>
          <p className="font-body-sm text-ink/70">
            حدد لكل وكيل ذكي مزود الـ API المفضل وطراز الذكاء الاصطناعي (Model) المراد تشغيل المهمة عليه.
          </p>
        </div>
        
        {settingsError && (
          <div className="bg-paper border-2 border-coral text-coral p-3 text-sm font-label-caps font-bold">
            {settingsError}
          </div>
        )}
        
        <button
          onClick={handleSaveSettings}
          disabled={settingsLoading}
          className="font-label-caps uppercase text-sm px-8 py-3 border-2 border-transparent bg-ink text-paper hover:bg-coral hover:text-ink hover:border-ink transition-all duration-200 hover:-translate-y-1 hover:translate-x-1 hover:shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] active:translate-y-0 active:translate-x-0 active:shadow-none disabled:opacity-50 cursor-pointer"
        >
          {settingsLoading ? "جاري الحفظ..." : "حفظ خريطة توجيه الوكلاء"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-paper p-6 border-2 border-dotted border-border">
        {(["dispatcher", "profiler", "job_matcher", "interviewer", "evaluator", "ranker"] as const).map((agent) => {
          const selectedProvider = settings[`${agent}_provider`] || "google";
          const availableModels = PROVIDER_MODELS[selectedProvider] || [];
          
          return (
            <div key={agent} className="flex flex-col gap-4 bg-paper p-5 border-2 border-border transition-all duration-200 hover:border-ink hover:-translate-y-1 hover:translate-x-1 hover:shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
              <div className="flex items-center justify-between border-b-2 border-dotted border-border pb-3 mb-2">
                <label className="font-label-caps text-sm text-ink font-bold uppercase tracking-wide">
                  {agent.replace("_", " ")} Agent
                </label>
                <span className="font-label-caps text-[10px] px-2 py-1 bg-ink text-paper font-bold uppercase">
                  Route
                </span>
              </div>

              <div className="space-y-2">
                <span className="text-xs text-ink/70 font-label-caps font-bold">المزود (Provider)</span>
                <select
                  value={selectedProvider}
                  onChange={(e) => {
                    const newProv = e.target.value;
                    const defaultModelForProv = PROVIDER_MODELS[newProv]?.[0] || "";
                    setSettings({
                      ...settings,
                      [`${agent}_provider`]: newProv,
                      [`${agent}_model`]: defaultModelForProv,
                    });
                  }}
                  className="border-2 border-border bg-transparent p-2.5 font-label-caps text-sm text-ink focus:outline-none focus:border-ink focus:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] transition-all duration-200 w-full"
                >
                  {providers.filter(p => p.isActive).map((p) => (
                    <option key={p.id} value={p.providerKey}>
                      {p.name} ({p.providerKey})
                    </option>
                  ))}
                  {providers.filter(p => p.isActive).length === 0 && (
                    <option value="google">Default (Google)</option>
                  )}
                </select>
              </div>

              <div className="space-y-2">
                <span className="text-xs text-ink/70 font-label-caps font-bold">طراز الذكاء (Model Engine)</span>
                <select
                  value={settings[`${agent}_model`] || ""}
                  onChange={(e) => setSettings({
                    ...settings,
                    [`${agent}_model`]: e.target.value
                  })}
                  className="border-2 border-border bg-transparent p-2.5 font-mono text-sm text-coral focus:outline-none focus:border-ink focus:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] transition-all duration-200 w-full text-left"
                >
                  {availableModels.map((modelName) => (
                    <option key={modelName} value={modelName}>
                      {modelName}
                    </option>
                  ))}
                  {availableModels.length === 0 && (
                    <option value="gemini-1.5-flash">gemini-1.5-flash (Fallback)</option>
                  )}
                </select>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
