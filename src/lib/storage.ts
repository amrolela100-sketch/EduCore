import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

export interface StorageUploadResult {
  success: boolean;
  url?: string;
  key?: string;
  originalName?: string;
  size?: number;
  mimeType?: string;
  error?: string;
}

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB limit
const ALLOWED_EXTENSIONS = [".pdf", ".docx", ".doc", ".txt"];
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "text/plain",
];

export interface IStorageAdapter {
  store(uniqueKey: string, buffer: Buffer): Promise<string>;
  retrieve(key: string): Promise<Buffer | null>;
  exists(key: string): Promise<boolean>;
  delete(key: string): Promise<boolean>;
}

export class LocalDiskStorageAdapter implements IStorageAdapter {
  private uploadDir: string;

  constructor(uploadDir?: string) {
    this.uploadDir = uploadDir || path.join(process.cwd(), "storage", "uploads");
  }

  async store(uniqueKey: string, buffer: Buffer): Promise<string> {
    await fs.promises.mkdir(this.uploadDir, { recursive: true });
    const targetPath = path.join(this.uploadDir, uniqueKey);
    await fs.promises.writeFile(targetPath, buffer);
    return targetPath;
  }

  async retrieve(key: string): Promise<Buffer | null> {
    const filePath = path.join(this.uploadDir, key);
    try {
      return await fs.promises.readFile(filePath);
    } catch {
      return null;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      await fs.promises.access(path.join(this.uploadDir, key), fs.constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }

  async delete(key: string): Promise<boolean> {
    const filePath = path.join(this.uploadDir, key);
    try {
      await fs.promises.unlink(filePath);
      return true;
    } catch {
      return false;
    }
  }
}

// Global adapter instance (default to local disk; can be replaced for S3)
let storageAdapter: IStorageAdapter = new LocalDiskStorageAdapter();

export function setStorageAdapter(adapter: IStorageAdapter): void {
  storageAdapter = adapter;
}

export function getStorageAdapter(): IStorageAdapter {
  return storageAdapter;
}

/**
 * Secure Storage Helper for candidate resumes and portfolio documents.
 * Handles validation, sanitization, and local/cloud storage persistence.
 */
export async function storeFile(file: File | Blob, filename: string): Promise<StorageUploadResult> {
  try {
    const originalName = filename || "document.pdf";
    const ext = path.extname(originalName).toLowerCase() || ".pdf";

    // 1. Extension and Security Check
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return {
        success: false,
        error: `نوع الملف غير مسموح به. الأنواع المسموحة هي: ${ALLOWED_EXTENSIONS.join(", ")}`,
      };
    }

    // 2. File Size Check
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return {
        success: false,
        error: "حجم الملف يتجاوز الحد الأقصى المسموح به (10 ميجابايت).",
      };
    }

    // 3. MIME type validation
    if (!ALLOWED_MIME_TYPES.includes(file.type) && file.type !== "") {
      return {
        success: false,
        error: "نوع MIME للملف غير مسموح به.",
      };
    }

    // 4. Generate sanitized unique storage key
    const sanitizedBase = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    const uniqueKey = `${Date.now()}_${randomUUID().replace(/-/g, "")}_${sanitizedBase}${ext}`;

    // 5. Write file content via adapter
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await storageAdapter.store(uniqueKey, buffer);

    const secureUrl = `/api/files/${uniqueKey}`;

    return {
      success: true,
      url: secureUrl,
      key: uniqueKey,
      originalName,
      size: file.size,
      mimeType: file.type || "application/octet-stream",
    };
  } catch (error) {
    console.error("[CRITICAL ERROR - Storage Handler]:", error);
    return {
      success: false,
      error: "حدث خطأ أثناء حفظ المستند في وحدة التخزين الآمنة.",
    };
  }
}
