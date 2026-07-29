"use client";

import { useState } from "react";
import { saveApiProvider, testApiProviderConnection } from "@/app/admin/system/actions";
import { ProviderCard } from "./providers/provider-card";
import { ProviderFormModal } from "./providers/provider-form-modal";
import { AgentRoutingMatrix } from "./agent-routing-matrix";

export interface ApiProvider {
  id: string;
  name: string;
  providerKey: string;
  baseUrl: string | null;
  isActive: boolean;
  hasKey: boolean;
}

interface ApiProvidersTabProps {
  initialProviders: ApiProvider[];
  initialSettings: Record<string, string>;
  onLogAudit: (msg: string) => void;
}

// Provider models are now in AgentRoutingMatrix

export function ApiProvidersTab({ initialProviders, initialSettings, onLogAudit }: ApiProvidersTabProps) {
  // Providers state
  const [providers, setProviders] = useState<ApiProvider[]>(initialProviders ?? []);
  const [providerForm, setProviderForm] = useState({
    name: "",
    providerKey: "google",
    baseUrl: "",
    apiKey: "",
    isActive: true,
  });
  const [editingProviderId, setEditingProviderId] = useState<string | null>(null);
  const [providerError, setProviderError] = useState("");
  const [providerLoading, setProviderLoading] = useState(false);
  const [testingProviderId, setTestingProviderId] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; message: string }>>({});

  // Settings state removed, handled in AgentRoutingMatrix

  const handleTestProvider = async (providerId: string, providerName: string) => {
    setTestingProviderId(providerId);
    try {
      const res = await testApiProviderConnection(providerId);
      setTestResults((prev) => ({
        ...prev,
        [providerId]: { success: res.success, message: res.message ?? "" },
      }));

      const timestamp = new Date().toISOString().replace("T", " ").substring(0, 19);
      const auditText = res.success 
        ? `${timestamp} - API Test SUCCESS for "${providerName}": ${res.message}`
        : `${timestamp} - API Test FAILED for "${providerName}": ${res.message}`;
      onLogAudit(auditText);
    } catch {
      setTestResults((prev) => ({
        ...prev,
        [providerId]: { success: false, message: "فشل إرسال طلب الاختبار." },
      }));
    } finally {
      setTestingProviderId(null);
    }
  };

  const handleSaveProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    setProviderError("");
    setProviderLoading(true);

    try {
      const res = await saveApiProvider({
        id: editingProviderId || undefined,
        name: providerForm.name,
        providerKey: providerForm.providerKey,
        baseUrl: providerForm.baseUrl || null,
        apiKey: providerForm.apiKey || null,
        isActive: providerForm.isActive,
      });

      if (!res.success) {
        setProviderError(res.error || "Failed to save provider.");
        setProviderLoading(false);
        return;
      }

      const updatedProvider = res.provider as Record<string, unknown>;
      const newProviders = [...providers];
      const updId = typeof updatedProvider.id === "string" ? updatedProvider.id : "";
      const matchIdx = newProviders.findIndex((p) => p.id === updId);
      
      const payload: ApiProvider = {
        id: updId,
        name: typeof updatedProvider.name === "string" ? updatedProvider.name : "",
        providerKey: typeof updatedProvider.providerKey === "string" ? updatedProvider.providerKey : "",
        baseUrl: typeof updatedProvider.baseUrl === "string" ? updatedProvider.baseUrl : null,
        isActive: typeof updatedProvider.isActive === "boolean" ? updatedProvider.isActive : false,
        hasKey: typeof updatedProvider.encryptedKey === "string" ? !!updatedProvider.encryptedKey : (editingProviderId ? newProviders[matchIdx]?.hasKey : false),
      };

      if (matchIdx >= 0) {
        newProviders[matchIdx] = payload;
      } else {
        newProviders.push(payload);
      }

      setProviders(newProviders);
      
      setProviderForm({
        name: "",
        providerKey: "google",
        baseUrl: "",
        apiKey: "",
        isActive: true,
      });
      setEditingProviderId(null);
      
      const timestamp = new Date().toISOString().replace("T", " ").substring(0, 19);
      onLogAudit(`${timestamp} - API Provider "${payload.name}" configuration updated by system@educore.com`);
    } catch {
      setProviderError("حدث خطأ غير متوقع أثناء حفظ المزود.");
    } finally {
      setProviderLoading(false);
    }
  };

  const handleEditProviderClick = (p: ApiProvider) => {
    setEditingProviderId(p.id);
    setProviderForm({
      name: p.name,
      providerKey: p.providerKey,
      baseUrl: p.baseUrl || "",
      apiKey: p.hasKey ? "••••••••" : "",
      isActive: p.isActive,
    });
  };

  // Settings save handler removed, handled in AgentRoutingMatrix

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h2 className="font-editorial text-3xl font-bold text-ink mb-2">Autonomous Agent Routing & Provider Controls</h2>
        <p className="font-body-sm text-ink/70">
          Configure API Providers, secure credential payloads, and route candidate evaluators to specific language models.
        </p>
      </div>

      {/* Top row: Providers form & list */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Secure Provider Configuration Form */}
        <div className="lg:col-span-5">
          <ProviderFormModal
            formData={providerForm}
            editingProviderId={editingProviderId}
            providerError={providerError}
            providerLoading={providerLoading}
            onChange={setProviderForm}
            onSubmit={handleSaveProvider}
            onCancelEdit={() => {
              setEditingProviderId(null);
              setProviderForm({
                name: "",
                providerKey: "google",
                baseUrl: "",
                apiKey: "",
                isActive: true,
              });
            }}
          />
        </div>

        {/* Providers List Grid */}
        <div className="lg:col-span-7 bg-paper p-6 border-2 border-border transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] space-y-4">
          <h3 className="font-editorial text-2xl font-bold text-ink">قائمة مزودي الـ API المسجلين</h3>
          <div className="space-y-3">
            {(providers ?? []).map((p) => (
              <ProviderCard
                key={p.id}
                provider={p}
                testResult={testResults[p.id]}
                isTesting={testingProviderId === p.id}
                onTest={handleTestProvider}
                onEdit={handleEditProviderClick}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic Agent to Model Routing mapping panel */}
      <AgentRoutingMatrix 
        initialSettings={initialSettings} 
        providers={providers} 
        onLogAudit={onLogAudit} 
      />
    </div>
  );
}
