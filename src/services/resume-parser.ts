import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Fallback PDF text extractor that parses stream text blocks directly from the PDF binary Buffer.
 * Useful when worker file resolution fails in Next.js server runtime environments.
 */
function extractRawPdfText(buffer: Buffer): string {
  const content = buffer.toString("binary");
  const textMatches: string[] = [];

  // Match text objects inside BT ... ET (Begin Text ... End Text) blocks
  const btRegex = /BT[\s\S]*?ET/g;
  let match: RegExpExecArray | null;

  while ((match = btRegex.exec(content)) !== null) {
    const block = match[0];
    const strRegex = /\(([\s\S]*?)\)\s*T[jJ]|\[([\s\S]*?)\]\s*TJ/g;
    let strMatch: RegExpExecArray | null;

    while ((strMatch = strRegex.exec(block)) !== null) {
      const rawStr = strMatch[1] || strMatch[2] || "";
      const cleaned = rawStr
        .replace(/\\\( /g, "(")
        .replace(/\\\)/g, ")")
        .replace(/\\n/g, "\n")
        .replace(/\\r/g, "\r")
        .replace(/\\t/g, "\t")
        .replace(/\\\d{3}/g, "")
        .replace(/[()]/g, " ")
        .trim();

      if (cleaned.length > 0) {
        textMatches.push(cleaned);
      }
    }
  }

  // Fallback: if BT blocks found no text, extract readable printable strings (>3 chars)
  if (textMatches.length === 0) {
    const printableRegex = /[\x20-\x7E\u0600-\u06FF]{3,}/g;
    let pMatch: RegExpExecArray | null;
    while ((pMatch = printableRegex.exec(content)) !== null) {
      const val = pMatch[0].trim();
      if (val && !val.startsWith("%PDF") && !val.includes("obj") && !val.includes("endobj") && !val.includes("stream")) {
        textMatches.push(val);
      }
    }
  }

  return textMatches.join("\n");
}

/**
 * Extracts plain text from a resume/portfolio document buffer based on its file extension.
 * Supports PDF, DOCX, and TXT files.
 */
export async function extractTextFromFile(buffer: Buffer, filename: string): Promise<string> {
  if (buffer.length > MAX_FILE_SIZE) {
    throw new Error(`حجم الملف "${filename}" يبلغ ${(buffer.length / (10 * 1024 * 1024)).toFixed(2)} ميغابايت، لكن الحد الأقصى المسموح به هو 10 ميغابايت. يرجى رفع ملف أصغر.`);
  }

  const extension = filename.split(".").pop()?.toLowerCase();

  try {
    if (extension === "pdf") {
      try {
        const uint8Array = new Uint8Array(buffer);
        const parser = new PDFParse(uint8Array);
        const data = await parser.getText();
        if (data && data.text && data.text.trim().length > 0) {
          return data.text;
        }
      } catch (pdfErr: unknown) {
        const msg = pdfErr instanceof Error ? pdfErr.message : String(pdfErr);
        console.warn(`[PDF PARSER WORKER WARN - ${filename}]: ${msg}. Utilizing fallback stream extraction.`);
      }

      // Execute fallback text extraction
      const fallbackText = extractRawPdfText(buffer);
      if (fallbackText && fallbackText.trim().length > 0) {
        return fallbackText;
      }

      // Final fallback: readable string extraction
      return buffer.toString("utf-8");
    }
    
    if (extension === "docx") {
      const result = await mammoth.extractRawText({ buffer });
      return result.value || "";
    }
    
    // Default to treating it as plain text
    return buffer.toString("utf-8");
  } catch (error) {
    console.error(`[CRITICAL ERROR - Resume Parsing (${filename})]:`, error);
    throw new Error("فشل استخراج النصوص من الملف. يرجى التأكد من أن الملف غير تالف وتجربة رفعه مرة أخرى.");
  }
}
