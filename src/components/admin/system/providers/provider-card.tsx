"use client";

import { type ApiProvider } from "../api-providers-tab";

interface ProviderCardProps {
  provider: ApiProvider;
  testResult?: { success: boolean; message: string };
  isTesting: boolean;
  onTest: (id: string, name: string) => void;
  onEdit: (provider: ApiProvider) => void;
}

export function ProviderCard({
  provider,
  testResult,
  isTesting,
  onTest,
  onEdit,
}: ProviderCardProps) {
  return (
    <div className="border-2 border-border bg-paper p-5 transition-all duration-300 space-y-4 hover:border-ink hover:-translate-y-1 hover:translate-x-1 hover:shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h4 className="font-editorial text-xl font-bold text-ink">{provider.name}</h4>
            <span
              className={`inline-block w-2.5 h-2.5 rounded-none border-2 ${
                provider.isActive ? "bg-emerald-400 border-emerald-600" : "bg-zinc-300 border-zinc-500"
              }`}
            />
          </div>
          <span className="font-label-caps text-xs text-ink/60 block mt-1">
            Engine: {provider.providerKey.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onEdit(provider)}
            className="text-xs font-label-caps font-bold text-ink hover:text-coral underline underline-offset-4 px-2 py-1 cursor-pointer transition-colors"
          >
            تعديل
          </button>
          <button
            type="button"
            disabled={isTesting}
            className="text-xs font-label-caps font-bold border-2 border-ink text-ink hover:bg-ink hover:text-paper px-4 py-2 transition-all duration-200 disabled:opacity-50 hover:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] cursor-pointer"
            onClick={() => onTest(provider.id, provider.name)}
          >
            {isTesting ? "جاري الاختبار..." : "اختبار الاتصال"}
          </button>
        </div>
      </div>

      {provider.baseUrl && (
        <p className="font-mono text-[11px] text-ink/70 truncate border-t-2 border-dotted border-border pt-3 mt-3">
          URL: {provider.baseUrl}
        </p>
      )}

      {testResult && (
        <div
          className={`p-3 text-sm font-label-caps font-bold border-2 ${
            testResult.success
              ? "bg-emerald-50 text-emerald-700 border-emerald-300 shadow-[2px_2px_0px_0px_rgba(16,185,129,0.3)]"
              : "bg-rose-50 text-rose-600 border-rose-300 shadow-[2px_2px_0px_0px_rgba(225,29,72,0.3)]"
          }`}
        >
          {testResult.message}
        </div>
      )}
    </div>
  );
}
