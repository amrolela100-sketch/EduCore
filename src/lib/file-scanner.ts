/**
 * File Scanner & Malicious Signature Checker
 * Validates uploaded buffers for embedded executable signatures, double extensions,
 * and dangerous magic bytes before saving to disk/storage.
 */

const DANGEROUS_MAGIC_BYTES = [
  Buffer.from([0x4d, 0x5a]),             // Windows Executable (MZ / EXE / DLL)
  Buffer.from([0x7f, 0x45, 0x4c, 0x46]), // Linux ELF Executable
  Buffer.from([0xca, 0xfe, 0xba, 0xbe]), // Mach-O / Java Class
  Buffer.from([0xd0, 0xcf, 0x11, 0xe0]), // OLE Compound File (Legacy DOC/XLS with macros)
];

const DANGEROUS_EXTENSIONS = [
  ".exe", ".bat", ".cmd", ".sh", ".vbs", ".ps1", ".jar", ".scr", ".pif", ".dll", ".so"
];

export function scanFileSafety(buffer: Buffer, fileName: string): { safe: boolean; reason?: string } {
  const lowerName = fileName.toLowerCase();

  // 1. Check double extensions (e.g. resume.pdf.exe)
  for (const ext of DANGEROUS_EXTENSIONS) {
    if (lowerName.endsWith(ext)) {
      return { safe: false, reason: `نوع الملف محظور للأمان (${ext})` };
    }
  }

  // 2. Magic Bytes Inspection
  for (const magic of DANGEROUS_MAGIC_BYTES) {
    if (buffer.length >= magic.length && buffer.subarray(0, magic.length).equals(magic)) {
      // Allow legacy doc only if expected extension matches doc
      if (magic.equals(DANGEROUS_MAGIC_BYTES[3]) && lowerName.endsWith(".doc")) {
        continue;
      }
      return { safe: false, reason: "تم اكتشاف توقيع ملف تنفيذي أو محظور (Executable signature detected)" };
    }
  }

  return { safe: true };
}
