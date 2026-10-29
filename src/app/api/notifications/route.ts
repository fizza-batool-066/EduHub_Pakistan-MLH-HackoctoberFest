import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, withErrorHandler } from "@/lib/api-utils";
import { requireRole } from "@/lib/auth";

/**
 * GET /api/notifications
 * Returns notifications for the current user
 */
export const GET = withErrorHandler(async () => {
  const user = await requireRole("student", "academy", "teacher", "admin");
  const notifications = await db.notification.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
    take: 50,
  });
  return apiSuccess({ notifications });
});

/**
 * PATCH /api/notifications
 * Body: { id?, markAll?: true }
 * Mark single or all as read
 */
export const PATCH = withErrorHandler(async (req: NextRequest) => {
  const user = await requireRole("student", "academy", "teacher", "admin");
  const body = await req.json();
  if (body.markAll) {
    await db.notification.updateMany({
      where: { userId: user.id, read: false },
      data: { read: true },
    });
  } else if (body.id) {
    await db.notification.update({
      where: { id: body.id },
      data: { read: true },
    });
  }
  return apiSuccess({ success: true });
});
