/**
 * Scanner Manager — Orchestrates job source scanning operations
 * 
 * Manages available scanners, deduplicates results, and imports
 * jobs into the EduCore database via Prisma.
 */

import { prisma } from "@/lib/db";
import { detectArchetype } from "@/services/archetype-detector";
import { type JobScanner, type ScanResult } from "./scanner-base";
import { GreenhouseScanner } from "./greenhouse-scanner";

// ─── Registry ───────────────────────────────────────────────────────
const SCANNERS: Record<string, JobScanner> = {
  GREENHOUSE: new GreenhouseScanner(),
};

export function getAvailableScanners(): string[] {
  return Object.keys(SCANNERS);
}

// ─── Scan Orchestrator ──────────────────────────────────────────────
export interface ScanRequest {
  sourceType: string;
  companySlug: string;
  companyName: string;
}

export interface ImportResult {
  scanned: number;
  imported: number;
  skipped: number;
  errors: string[];
}

/**
 * Scan a job source and import new postings into the database.
 * Deduplicates by sourceUrl to avoid re-importing known jobs.
 */
export async function scanAndImport(request: ScanRequest): Promise<ImportResult> {
  const scanner = SCANNERS[request.sourceType];
  if (!scanner) {
    return {
      scanned: 0,
      imported: 0,
      skipped: 0,
      errors: [`مصدر غير مدعوم: ${request.sourceType}. المتاح: ${Object.keys(SCANNERS).join(", ")}`],
    };
  }

  // Run the scan
  const scanResult: ScanResult = await scanner.scan(request.companySlug, request.companyName);

  if (scanResult.jobs.length === 0) {
    return {
      scanned: 0,
      imported: 0,
      skipped: 0,
      errors: scanResult.errors,
    };
  }

  // Ensure the company exists
  const company = await prisma.company.upsert({
    where: { name: request.companyName },
    update: {},
    create: {
      name: request.companyName,
      website: `https://boards.greenhouse.io/${request.companySlug}`,
    },
  });

  // Find existing jobs by sourceUrl to deduplicate
  const existingUrls = new Set(
    (
      await prisma.jobPosting.findMany({
        where: {
          sourceUrl: { in: scanResult.jobs.map((j) => j.sourceUrl) },
        },
        select: { sourceUrl: true },
      })
    )
      .map((j) => j.sourceUrl)
      .filter(Boolean)
  );

  // Import new jobs
  let imported = 0;
  let skipped = 0;
  const importErrors: string[] = [...scanResult.errors];

  for (const job of scanResult.jobs) {
    if (existingUrls.has(job.sourceUrl)) {
      skipped++;
      continue;
    }

    try {
      const archetype = detectArchetype(job.title, job.description);

      await prisma.jobPosting.create({
        data: {
          title: job.title,
          description: job.description.substring(0, 10000), // Cap description length
          requirements: job.requirements,
          location: job.location,
          salaryRange: job.salaryRange,
          sourceUrl: job.sourceUrl,
          sourceType: job.sourceType,
          archetype,
          companyId: company.id,
          status: "OPEN",
        },
      });

      imported++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      importErrors.push(`فشل استيراد "${job.title}": ${msg}`);
      console.error(`[ScannerManager] Failed to import job "${job.title}":`, err);
    }
  }

  return {
    scanned: scanResult.jobs.length,
    imported,
    skipped,
    errors: importErrors,
  };
}

/**
 * Batch scan multiple sources.
 */
export async function batchScan(requests: ScanRequest[]): Promise<ImportResult[]> {
  const results: ImportResult[] = [];
  for (const request of requests) {
    const result = await scanAndImport(request);
    results.push(result);
  }
  return results;
}
