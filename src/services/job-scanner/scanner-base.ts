/**
 * Scanner Base — Abstract interface for job source scanners
 * 
 * Inspired by career-ops providers/ directory. Each scanner module
 * implements this interface for a specific ATS or job board.
 */

// ─── Types ──────────────────────────────────────────────────────────
export interface ScannedJob {
  title: string;
  description: string;
  requirements: string[];
  location: string | null;
  salaryRange: string | null;
  sourceUrl: string;
  sourceType: string;           // e.g., "GREENHOUSE", "LEVER"
  companyName: string;
  postedAt: Date | null;
  externalId: string;           // ID from the source system
}

export interface ScanResult {
  sourceType: string;
  companyName: string;
  jobs: ScannedJob[];
  scannedAt: Date;
  errors: string[];
}

// ─── Abstract Scanner ───────────────────────────────────────────────
export abstract class JobScanner {
  abstract readonly sourceType: string;

  /**
   * Scan a company's job board and return found positions.
   * @param companySlug - The company identifier used in the ATS URL
   * @param companyName - Human-readable company name
   */
  abstract scan(companySlug: string, companyName: string): Promise<ScanResult>;

  /**
   * Check if a specific job posting is still live (not expired/closed).
   * Zero-token liveness check — no AI call needed.
   */
  abstract checkLiveness(sourceUrl: string): Promise<boolean>;
}
