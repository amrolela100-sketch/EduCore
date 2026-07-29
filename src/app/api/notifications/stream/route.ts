import { getCurrentUser } from "@/lib/rbac";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();

  // Polling loop inside SSE stream
  let isAborted = false;
  request.signal.addEventListener("abort", () => {
    isAborted = true;
  });

  (async () => {
    let lastChecked = new Date(Date.now() - 60000);

    try {
      while (!isAborted) {
        const unreadNotifications = await prisma.notification.findMany({
          where: {
            userId: user.id,
            isRead: false,
            createdAt: { gte: lastChecked },
          },
          orderBy: { createdAt: "desc" },
        });

        if (unreadNotifications.length > 0) {
          lastChecked = new Date();
          const data = `data: ${JSON.stringify(unreadNotifications)}\n\n`;
          await writer.write(encoder.encode(data));
        }

        // Wait 5 seconds before next check
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    } catch (err) {
      console.error("[SSE NOTIFICATIONS ERROR]:", err);
    } finally {
      writer.close().catch(() => {});
    }
  })();

  return new Response(responseStream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
    },
  });
}
