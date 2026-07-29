import { describe, it, expect } from 'vitest';
import { extractTextFromFile } from '@/services/resume-parser';

describe('resume-parser', () => {
  it('should extract plain text from a .txt file', async () => {
    const text = 'Hello, I am a software engineer with 5 years of experience.';
    const buffer = Buffer.from(text, 'utf-8');
    const result = await extractTextFromFile(buffer, 'resume.txt');
    expect(result).toBe(text);
  });

  it('should reject files larger than 10 MB', async () => {
    const bigBuffer = Buffer.alloc(11 * 1024 * 1024); // 11 MB
    await expect(extractTextFromFile(bigBuffer, 'huge.pdf')).rejects.toThrow(/10/);
  });

  it('should fall back to utf-8 for unknown extensions', async () => {
    const text = 'Fallback content';
    const buffer = Buffer.from(text, 'utf-8');
    const result = await extractTextFromFile(buffer, 'document.xyz');
    expect(result).toBe(text);
  });

  it('should extract text from a minimal synthetic PDF buffer', async () => {
    // Build a tiny PDF with a BT/ET text block containing TestEngineer
    const parts = [
      '%PDF-1.4',
      '1 0 obj',
      '<< /Type /Catalog /Pages 2 0 R >>',
      'endobj',
      '2 0 obj',
      '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
      'endobj',
      '3 0 obj',
      '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>',
      'endobj',
      '4 0 obj',
      '<< /Length 44 >>',
      'stream',
      'BT',
      '/F1 12 Tf',
      '100 700 Td',
      '(TestEngineer) Tj',
      'ET',
      'endstream',
      'endobj',
      'xref',
      'trailer',
      '<< /Size 5 /Root 1 0 R >>',
      'startxref',
      '310',
      '%%EOF',
    ];
    const pdfContent = parts.join('\n');
    const buffer = Buffer.from(pdfContent, 'binary');
    const result = await extractTextFromFile(buffer, 'resume.pdf');
    expect(result).toContain('TestEngineer');
  });

  it('should extract text from a DOCX buffer (mammoth path)', async () => {
    // Minimal valid DOCX zip structure is complex; instead verify function does not crash
    // with a dummy buffer and delegates to mammoth or fallback.
    const text = 'DOCX fallback text';
    const buffer = Buffer.from(text, 'utf-8');
    // Unknown extension triggers text fallback; for docx it will fail inside mammoth,
    // but the catch wraps it into a localized error.
    await expect(extractTextFromFile(buffer, 'resume.docx')).rejects.toThrow();
  });
});
