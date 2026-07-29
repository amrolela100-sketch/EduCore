/**
 * Greenhouse Scanner — Scan Greenhouse ATS job boards
 * 
 * Uses Greenhouse's public JSON API (no auth required).
 * Inspired by career-ops providers/greenhouse.mjs.
 */

import { JobScanner, type ScanResult, type ScannedJob } from "./scanner-base";

interface GreenhouseJob {
  id: number;
  title: string;
  content: string;
  location?: { name?: string };
  updated_at?: string;
  absolute_url?: string;
  departments?: Array<{ name: string }>;
  offices?: Array<{ name: string }>;
}

export class GreenhouseScanner extends JobScanner {
  readonly sourceType = "GREENHOUSE";

  async scan(companySlug: string, companyName: string): Promise<ScanResult> {
    const errors: string[] = [];
    const jobs: ScannedJob[] = [];
    const apiUrl = `https://boards-api.greenhouse.io/v1/boards/${companySlug}/jobs?content=true`;

    try {
      const response = await fetch(apiUrl, {
        headers: { "Accept": "application/json" },
        signal: AbortSignal.timeout(15000),
      });

      if (!response.ok) {
        errors.push(`Greenhouse API returned ${response.status} for ${companySlug}`);
        return { sourceType: this.sourceType, companyName, jobs, scannedAt: new Date(), errors };
      }

      const data = await response.json();
      const rawJobs: GreenhouseJob[] = data?.jobs ?? [];

      for (const raw of rawJobs) {
        // Strip HTML from description
        const plainDescription = (raw.content || "")
          .replace(/<[^>]*>/g, " ")
          .replace(/&nbsp;/g, " ")
          .replace(/&amp;/g, "&")
          .replace(/\s+/g, " ")
          .trim();

        // Extract requirements from description (lines starting with bullet-like patterns)
        const requirements = extractRequirements(plainDescription);

        jobs.push({
          title: raw.title || "Untitled Position",
          description: plainDescription,
          requirements,
          location: raw.location?.name ?? raw.offices?.[0]?.name ?? null,
          salaryRange: null, // Greenhouse API doesn't expose salary
          sourceUrl: raw.absolute_url || `https://boards.greenhouse.io/${companySlug}/jobs/${raw.id}`,
          sourceType: this.sourceType,
          companyName,
          postedAt: raw.updated_at ? new Date(raw.updated_at) : null,
          externalId: String(raw.id),
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      errors.push(`Failed to scan ${companySlug}: ${message}`);
      console.error(`[GreenhouseScanner] Error scanning ${companySlug}:`, error);
    }

    return { sourceType: this.sourceType, companyName, jobs, scannedAt: new Date(), errors };
  }

  async checkLiveness(sourceUrl: string): Promise<boolean> {
    try {
      const response = await fetch(sourceUrl, {
        method: "HEAD",
        signal: AbortSignal.timeout(10000),
      });
      // Greenhouse returns 200 for live postings, 404 for closed
      return response.ok;
    } catch {
      return false;
    }
  }
}

// ─── Helpers ────────────────────────────────────────────────────────
function extractRequirements(description: string): string[] {
  const requirements: string[] = [];
  const lines = description.split(/[.;•\-–—]/).map((l) => l.trim()).filter(Boolean);

  const requirementPatterns = [
    /(\d+)\+?\s*years?\s+(?:of\s+)?experience/i,
    /proficien(?:t|cy)\s+(?:in|with)\s+(.+)/i,
    /experience\s+(?:with|in|using)\s+(.+)/i,
    /knowledge\s+of\s+(.+)/i,
    /familiar(?:ity)?\s+with\s+(.+)/i,
    /strong\s+(.+)\s+skills/i,
    /bachelor|master|phd|degree/i,
  ];

  for (const line of lines) {
    if (line.length < 10 || line.length > 200) continue;
    for (const pattern of requirementPatterns) {
      if (pattern.test(line)) {
        requirements.push(line.substring(0, 150));
        break;
      }
    }
  }

  return requirements.slice(0, 20); // Cap at 20 requirements
}
