import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";
import { hasRole } from "@/lib/rbac";
import { promises as fsPromises } from "fs";
import path from "path";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "غير مصرح بالدخول." }, { status: 401 });
    }

    const { key } = await params;
    if (!key || key.includes("..") || key.includes("/") || key.includes("\\")) {
      return NextResponse.json({ error: "مسار ملف غير صالح." }, { status: 400 });
    }

    const userId = session.user.id;

    // Check permissions — use exact match on filename suffix (not loose contains)
    const isAdmin = hasRole(session.user, ["HR_ADMIN", "TECH_ADMIN", "SYSTEM_ADMIN"]);
    if (!isAdmin) {
      const resume = await prisma.resume.findFirst({
        where: {
          fileUrl: { endsWith: `/${key}` },
          candidateProfile: { userId },
        },
      });

      const portfolio = await prisma.portfolio.findFirst({
        where: {
          fileUrl: { endsWith: `/${key}` },
          candidateProfile: { userId },
        },
      });

      if (!resume && !portfolio) {
        return NextResponse.json(
          { error: "لا تملك صلاحية الوصول إلى هذا الملف." },
          { status: 403 }
        );
      }
    }

    // Check file in storage/uploads or fallback public/uploads
    const storagePath = path.join(process.cwd(), "storage", "uploads", key);
    const fallbackPath = path.join(process.cwd(), "public", "uploads", key);

    let fileBuffer: Buffer | null = null;

    try {
      await fsPromises.access(storagePath);
      fileBuffer = await fsPromises.readFile(storagePath);
    } catch {
      try {
        await fsPromises.access(fallbackPath);
        fileBuffer = await fsPromises.readFile(fallbackPath);
      } catch {
        // neither path exists
      }
    }

    if (!fileBuffer) {
      return NextResponse.json({ error: "الملف غير موجود." }, { status: 404 });
    }

    const ext = path.extname(key).toLowerCase();
    const contentTypeMap: Record<string, string> = {
      ".pdf": "application/pdf",
      ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ".doc": "application/msword",
      ".txt": "text/plain; charset=utf-8",
    };

    const contentType = contentTypeMap[ext] || "application/octet-stream";

    // Sanitize filename to prevent HTTP response splitting / header injection
    const safeFilename = key
      .replace(/[\x00-\x1f\x7f]/g, "") // strip control chars
      .replace(/[\r\n"\\]/g, "");      // strip CRLF, quotes, backslash

    return new NextResponse(new Uint8Array(fileBuffer), {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${safeFilename}"`,
        "Cache-Control": "private, max-age=3600",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("[CRITICAL ERROR - File Access Route]:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تحميل الملف." },
      { status: 500 }
    );
  }
}
