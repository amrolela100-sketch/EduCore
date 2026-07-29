"use client";



export interface ProviderFormData {
  name: string;
  providerKey: string;
  baseUrl: string;
  apiKey: string;
  isActive: boolean;
}

interface ProviderFormModalProps {
  formData: ProviderFormData;
  editingProviderId: string | null;
  providerError: string;
  providerLoading: boolean;
  onChange: (data: ProviderFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancelEdit: () => void;
}

export function ProviderFormModal({
  formData,
  editingProviderId,
  providerError,
  providerLoading,
  onChange,
  onSubmit,
  onCancelEdit,
}: ProviderFormModalProps) {
  return (
    <div className="bg-paper p-6 border-2 border-border transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
      <h3 className="font-editorial text-2xl font-bold text-ink mb-6 flex items-center gap-3 border-b-2 border-border pb-4">
        <span className="w-3 h-3 bg-coral rounded-none" />
        {editingProviderId ? "تعديل مزود API" : "إضافة مزود API جديد"}
      </h3>

      {providerError && (
        <div className="bg-paper border-2 border-coral text-coral p-4 text-sm mb-6 font-label-caps font-bold">
          {providerError}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="flex flex-col gap-2">
          <label className="font-label-caps text-xs text-ink font-bold block">
            اسم المزود (Provider Name)
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Gemini Production, Azure OpenAI"
            value={formData.name}
            onChange={(e) => onChange({ ...formData, name: e.target.value })}
            className="border-2 border-border bg-transparent p-3 text-sm text-ink focus:outline-none focus:border-ink focus:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] transition-all duration-200 w-full"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-label-caps text-xs text-ink font-bold block">
            نوع المزود (Provider Engine)
          </label>
          <select
            value={formData.providerKey}
            onChange={(e) => onChange({ ...formData, providerKey: e.target.value })}
            className="border-2 border-border bg-transparent p-3 font-mono text-sm focus:outline-none focus:border-ink focus:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] transition-all duration-200 w-full"
          >
            <option value="google">Google Gemini</option>
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic Claude</option>
            <option value="custom">Custom Engine</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-label-caps text-xs text-ink font-bold block">
            رابط الـ API البديل (Base URL - Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. https://api.openai.com/v1"
            value={formData.baseUrl}
            onChange={(e) => onChange({ ...formData, baseUrl: e.target.value })}
            className="border-2 border-border bg-transparent p-3 font-mono text-sm focus:outline-none focus:border-ink focus:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] transition-all duration-200 w-full text-left direction-ltr"
          />
          <span className="text-[10px] text-ink/60 mt-1 block">
            اتركه فارغاً لاستخدام الرابط الافتراضي للمزود.
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-label-caps text-xs text-ink font-bold block">
            مفتاح الـ API (API Key)
          </label>
          <input
            type="password"
            placeholder={formData.apiKey === "••••••••" ? "••••••••" : "أدخل مفتاح الـ API هنا"}
            value={formData.apiKey}
            onChange={(e) => onChange({ ...formData, apiKey: e.target.value })}
            className="border-2 border-border bg-transparent p-3 font-mono text-sm focus:outline-none focus:border-ink focus:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] transition-all duration-200 w-full text-left"
          />
          <span className="text-[10px] text-ink/60 mt-1 block">
            يتم تشفير هذا المفتاح تلقائياً باستخدام خوارزمية AES-256-GCM قبل حفظه بقاعدة البيانات.
          </span>
        </div>

        <div className="flex items-center gap-3 py-2">
          <input
            type="checkbox"
            id="provider-active"
            checked={formData.isActive}
            onChange={(e) => onChange({ ...formData, isActive: e.target.checked })}
            className="accent-coral h-5 w-5 border-2 border-border rounded-none cursor-pointer"
          />
          <label htmlFor="provider-active" className="font-body-sm text-sm text-ink select-none cursor-pointer">
            تفعيل المزود واستخدامه في توجيه الوكلاء
          </label>
        </div>

        <div className="flex gap-4 pt-4 border-t-2 border-border">
          <button
            type="submit"
            disabled={providerLoading}
            className="font-label-caps uppercase text-sm px-6 py-3 border-2 border-transparent bg-ink text-paper hover:bg-coral hover:text-ink hover:border-ink transition-all duration-200 hover:-translate-y-1 hover:translate-x-1 hover:shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] active:translate-y-0 active:translate-x-0 active:shadow-none disabled:opacity-50 cursor-pointer"
          >
            {providerLoading ? "جاري الحفظ..." : "حفظ المزود"}
          </button>
          {editingProviderId && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="font-label-caps uppercase text-sm px-6 py-3 border-2 border-border bg-transparent text-ink hover:bg-ink hover:text-paper transition-all duration-200 cursor-pointer"
            >
              إلغاء
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
