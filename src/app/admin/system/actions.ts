"use server";

import { prisma, withDbRetry } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { encryptKey, decryptKey } from "@/lib/encryption";
import { getCurrentUser, hasRole } from "@/lib/rbac";
import { createSafeError, createSafeResult, SafeResult } from "@/lib/errors";
import { validateExternalUrl } from "@/lib/url-validator";
import { Prisma } from "@prisma/client";


// Authorization check helper leveraging centralized RBAC
async function checkAuth() {
  const user = await getCurrentUser();
  if (!user || !hasRole(user, ["SYSTEM_ADMIN"])) {
    throw new Error("Unauthorized access. Admin role required.");
  }
  return user;
}

// Seed default providers if none exist
async function seedDefaultProvidersIfEmpty() {
  const count = await prisma.apiProvider.count();
  if (count === 0) {
    const defaults = [
      { name: "Google Gemini", providerKey: "google", baseUrl: null, isActive: true },
      { name: "OpenAI", providerKey: "openai", baseUrl: "https://api.openai.com/v1", isActive: true },
      { name: "Anthropic Claude", providerKey: "anthropic", baseUrl: "https://api.anthropic.com/v1", isActive: true },
    ];
    for (const d of defaults) {
      await withDbRetry(() =>
        prisma.apiProvider.create({
          data: d,
        })
      );
    }
  }
}

export async function createCompany(formData: { name: string; description: string; website: string }): Promise<SafeResult> {
  try {
    await checkAuth();
    const { name, description, website } = formData;
    if (!name) {
      return createSafeError(null, "Create Company Validation", "اسم الشركة مطلوب.");
    }

    const company = await withDbRetry(() =>
      prisma.company.create({
        data: {
          name,
          description,
          website,
        },
      })
    );

    revalidatePath("/admin/system");
    return {
      ...createSafeResult(company, "تم إنشاء الشركة بنجاح."),
      company,
    };
  } catch (error: unknown) {
    return createSafeError(error, "System Admin Action - createCompany", "حدث خطأ أثناء إضافة الشركة.");
  }
}

export async function getApiProviders(): Promise<SafeResult> {
  try {
    await checkAuth();
    await seedDefaultProvidersIfEmpty();
    const providers = await prisma.apiProvider.findMany({
      orderBy: { name: "asc" },
    });

    const formattedProviders = providers.map((p) => ({
      id: p.id,
      name: p.name,
      providerKey: p.providerKey,
      baseUrl: p.baseUrl,
      isActive: p.isActive,
      hasKey: !!p.encryptedKey,
    }));

    return {
      ...createSafeResult(formattedProviders, "تم تحميل مزودي الـ API بنجاح."),
      providers: formattedProviders,
    };
  } catch (error: unknown) {
    return createSafeError(error, "System Admin Action - getApiProviders", "فشل تحميل مزودي الـ API.");
  }
}

export async function saveApiProvider(formData: {
  id?: string;
  name: string;
  providerKey: string;
  baseUrl?: string | null;
  apiKey?: string | null;
  isActive?: boolean;
}): Promise<SafeResult> {
  try {
    const adminUser = await checkAuth();
    const { id, name, providerKey, baseUrl, apiKey, isActive = true } = formData;

    if (!name || !providerKey) {
      return createSafeError(null, "Save API Provider Validation", "الاسم ونوع المزود مطلوبان.");
    }

    // Comprehensive SSRF URL Validation
    if (baseUrl) {
      const urlCheck = await validateExternalUrl(baseUrl);
      if (!urlCheck.valid) {
        return createSafeError(null, "SSRF Check", urlCheck.error || "رابط الـ API غير صالح.");
      }
    }


    const data: Prisma.ApiProviderCreateInput = {
      name,
      providerKey,
      baseUrl: baseUrl || null,
      isActive,
    };

    if (apiKey && apiKey !== "••••••••") {
      data.encryptedKey = encryptKey(apiKey);
    }

    const provider = await withDbRetry(() =>
      id
        ? prisma.apiProvider.update({ where: { id }, data })
        : prisma.apiProvider.create({ data })
    );

    // Create Audit Log
    try {
      await withDbRetry(() =>
        prisma.auditLog.create({
          data: {
            action: id ? "UPDATE_API_PROVIDER" : "CREATE_API_PROVIDER",
            details: { providerId: provider.id, providerName: provider.name, providerKey: provider.providerKey },
            userId: adminUser.id,
          },
        })
      );
    } catch (e) {
      console.error("[Audit Log Error]:", e);
    }

    revalidatePath("/admin/system");
    return {
      ...createSafeResult(provider, "تم حفظ مزود الـ API بنجاح."),
      provider,
    };
  } catch (error: unknown) {
    return createSafeError(error, "System Admin Action - saveApiProvider", "حدث خطأ أثناء حفظ مزود الـ API.");
  }
}

export async function getAgentSettings(): Promise<SafeResult> {
  try {
    await checkAuth();
    const settings = await prisma.systemSetting.findMany();

    const settingsMap: Record<string, string> = {};
    for (const s of settings) {
      settingsMap[s.key] = s.value;
    }
    return {
      ...createSafeResult(settingsMap, "تم تحميل إعدادات الوكلاء."),
      settings: settingsMap,
    };
  } catch (error: unknown) {
    return createSafeError(error, "System Admin Action - getAgentSettings", "فشل تحميل إعدادات الوكلاء.");
  }
}

export async function saveAgentSettings(settings: Record<string, string>): Promise<SafeResult> {
  try {
    const adminUser = await checkAuth();
    for (const [key, value] of Object.entries(settings)) {
      await withDbRetry(() =>
        prisma.systemSetting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        })
      );
    }

    // Create Audit Log
    try {
      await withDbRetry(() =>
        prisma.auditLog.create({
          data: {
            action: "UPDATE_AGENT_SETTINGS",
            details: { settingsKeys: Object.keys(settings) },
            userId: adminUser.id,
          },
        })
      );
    } catch (e) {
      console.error("[Audit Log Error]:", e);
    }

    revalidatePath("/admin/system");
    return createSafeResult(null, "تم حفظ إعدادات الوكلاء بنجاح.");
  } catch (error: unknown) {
    return createSafeError(error, "System Admin Action - saveAgentSettings", "حدث خطأ أثناء حفظ إعدادات الوكلاء.");
  }
}

export async function testApiProviderConnection(providerId: string): Promise<SafeResult> {
  try {
    await checkAuth();

    const provider = await prisma.apiProvider.findUnique({
      where: { id: providerId },
    });

    if (!provider) {
      return createSafeError(null, "System Admin Action - testApiProviderConnection", "لم يتم العثور على المزود المطلوب.");
    }

    if (!provider.encryptedKey) {
      return createSafeError(null, "System Admin Action - testApiProviderConnection", "لم يتم تعيين مفتاح API لهذا المزود بعد. أدخل المفتاح واضغط حفظ أولاً.");
    }

    if (provider.baseUrl) {
      const urlCheck = await validateExternalUrl(provider.baseUrl);
      if (!urlCheck.valid) {
        return createSafeError(null, "SSRF Check", urlCheck.error || "رابط الـ API الخاص بالمزود غير صالح للأمان.");
      }
    }

    const apiKey = decryptKey(provider.encryptedKey);

    if (!apiKey) {
      return createSafeError(null, "System Admin Action - testApiProviderConnection", "فشل فك تشفير المفتاح. قد يكون المفتاح مفقوداً أو غير صالح.");
    }

    const startTime = Date.now();
    let isOk = false;
    let statusText = "";

    if (provider.providerKey === "google") {
      const targetUrl = provider.baseUrl
        ? `${provider.baseUrl}/v1beta/models`
        : `https://generativelanguage.googleapis.com/v1beta/models`;

      const res = await fetch(targetUrl, {
        method: "GET",
        headers: { "x-goog-api-key": apiKey },
      });
      isOk = res.ok;
      if (!isOk) {
        const errJson = await res.json().catch(() => ({}));
        statusText = errJson.error?.message || `HTTP ${res.status}: ${res.statusText}`;
      }
    } else if (provider.providerKey === "openai") {
      const targetUrl = provider.baseUrl || "https://api.openai.com/v1/models";
      const res = await fetch(targetUrl, {
        method: "GET",
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      isOk = res.ok;
      if (!isOk) {
        const errJson = await res.json().catch(() => ({}));
        statusText = errJson.error?.message || `HTTP ${res.status}: ${res.statusText}`;
      }
    } else if (provider.providerKey === "anthropic") {
      const targetUrl = provider.baseUrl || "https://api.anthropic.com/v1/models";
      const res = await fetch(targetUrl, {
        method: "GET",
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
      });
      isOk = res.ok || res.status === 404;
      if (!isOk) {
        const errJson = await res.json().catch(() => ({}));
        statusText = errJson.error?.message || `HTTP ${res.status}: ${res.statusText}`;
      }
    } else {
      if (provider.baseUrl) {
        const res = await fetch(provider.baseUrl, { method: "GET" }).catch(() => null);
        isOk = !!res;
        statusText = isOk ? "" : "فشل الوصول لرابط الخدمة المخصص.";
      } else {
        isOk = true;
      }
    }

    const latencyMs = Date.now() - startTime;

    if (isOk) {
      return {
        ...createSafeResult({ latencyMs }, `تم الاتصال بمزود ${provider.name} بنجاح! زمن الاستجابة: ${latencyMs}ms.`),
      };
    } else {
      return createSafeError(null, "System Admin Action - testApiProviderConnection", `فشل الاتصال بـ ${provider.name}: ${statusText || "مفتاح غير صالح أو مرفوض من الخادم."}`);
    }
  } catch (error: unknown) {
    return createSafeError(error, "System Admin Action - testApiProviderConnection", "حدث خطأ غير متوقع أثناء اختبار الاتصال بمزود الخدمة. يرجى المحاولة لاحقاً.");
  }

}
