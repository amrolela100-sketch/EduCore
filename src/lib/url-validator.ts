import { URL } from "url";
import dns from "dns/promises";

const BLOCKED_HOSTS = ["localhost", "127.0.0.1", "0.0.0.0", "::1", "[::1]"];
const BLOCKED_RANGES = [
  /^10\./,                          // Class A private range (10.0.0.0/8)
  /^172\.(1[6-9]|2\d|3[01])\./,     // Class B private range (172.16.0.0/12)
  /^192\.168\./,                    // Class C private range (192.168.0.0/16)
  /^169\.254\./,                    // Link-local / AWS Metadata (169.254.0.0/16)
  /^100\.(6[4-9]|[7-9]\d|1[0-2]\d)/,// Shared address space (100.64.0.0/10)
  /^fc[0-9a-f]{2}:/i,               // IPv6 unique local
  /^fe80:/i,                        // IPv6 link-local
];

export async function validateExternalUrl(urlString: string): Promise<{
  valid: boolean;
  error?: string;
}> {
  try {
    const parsed = new URL(urlString);

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return { valid: false, error: "رابط الـ API يجب أن يكون بروتوكول HTTP أو HTTPS فقط." };
    }

    const hostname = parsed.hostname.toLowerCase();

    if (BLOCKED_HOSTS.includes(hostname)) {
      return { valid: false, error: "رابط الـ API غير صالح (ممنوع الإشارة لعناوين الشبكة المحلية)." };
    }

    for (const pattern of BLOCKED_RANGES) {
      if (pattern.test(hostname)) {
        return { valid: false, error: "رابط الـ API غير صالح (ممنوع الإشارة لعنوان شبكة خاصة)." };
      }
    }

    // Resolve hostname to IP to prevent DNS rebinding attacks
    const addresses = await dns.resolve4(hostname).catch(() => []);
    for (const addr of addresses) {
      if (BLOCKED_HOSTS.includes(addr)) {
        return { valid: false, error: "اسم النطاق يُحل إلى عنوان محلي حظر الإشارة إليه." };
      }
      for (const pattern of BLOCKED_RANGES) {
        if (pattern.test(addr)) {
          return { valid: false, error: "اسم النطاق يُحل إلى عنوان شبكة خاصة محظورة (DNS Rebinding Check)." };
        }
      }
    }

    return { valid: true };
  } catch {
    return { valid: false, error: "صيغة الرابط (URL) غير صالحة." };
  }
}
