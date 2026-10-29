import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, apiError, withErrorHandler } from "@/lib/api-utils";
import { requireRole } from "@/lib/auth";

export const PATCH = withErrorHandler(async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const user = await requireRole("academy", "admin");
  const body = await req.json();
  const ann = await db.announcement.findUnique({ where: { id }, include: { academy: true } });
  if (!ann) return apiError("Announcement not found", 404, "NOT_FOUND");
  if (user.role === "academy" && ann.academy.ownerId !== user.id) {
    return apiError("Forbidden", 403, "FORBIDDEN");
  }
  const updateData: any = {};
  if (body.title !== undefined) updateData.title = body.title;
  if (body.content !== undefined) updateData.content = body.content;
  if (body.published !== undefined) updateData.published = body.published;
  const updated = await db.announcement.update({ where: { id }, data: updateData });
  return apiSuccess({ announcement: updated });
});

export const DELETE = withErrorHandler(async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const user = await requireRole("academy", "admin");
  const ann = await db.announcement.findUnique({ where: { id }, include: { academy: true } });
  if (!ann) return apiError("Announcement not found", 404, "NOT_FOUND");
  if (user.role === "academy" && ann.academy.ownerId !== user.id) {
    return apiError("Forbidden", 403, "FORBIDDEN");
  }
  await db.announcement.delete({ where: { id } });
  return apiSuccess({ success: true });
});
