import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, apiError, withErrorHandler } from "@/lib/api-utils";
import { requireAuth } from "@/lib/auth";

export const PATCH = withErrorHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const user = await requireAuth();
  if (user.role !== "admin") {
    return apiError("Forbidden: admin only", 403, "FORBIDDEN");
  }
  const { id } = await params;

  const body = await req.json();
  const data: any = {};
  if (body.name !== undefined) {
    data.name = body.name;
    data.slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }
  if (body.icon !== undefined) data.icon = body.icon;
  if (body.color !== undefined) data.color = body.color;
  if (body.description !== undefined) data.description = body.description;

  const updated = await db.category.update({ where: { id }, data });
  return apiSuccess({ category: updated });
});

export const DELETE = withErrorHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const user = await requireAuth();
  if (user.role !== "admin") {
    return apiError("Forbidden: admin only", 403, "FORBIDDEN");
  }
  const { id } = await params;

  await db.category.delete({ where: { id } });
  return apiSuccess({ deleted: true });
});
