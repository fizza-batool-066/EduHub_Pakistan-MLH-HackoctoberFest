import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, withErrorHandler } from "@/lib/api-utils";
import { requireRole } from "@/lib/auth";

/**
 * GET /api/favorites
 * Returns the current student's saved academies
 */
export const GET = withErrorHandler(async () => {
  const user = await requireRole("student", "admin");
  const favorites = await db.favorite.findMany({
    where: { userId: user.id },
    include: { academy: true },
    orderBy: { date: "desc" },
  });
  return apiSuccess({ favorites });
});

/**
 * POST /api/favorites
 * Body: { academyId }
 * Toggle favorite on/off
 */
export const POST = withErrorHandler(async (req: NextRequest) => {
  const user = await requireRole("student", "admin");
  const body = await req.json();
  const existing = await db.favorite.findUnique({
    where: { userId_academyId: { userId: user.id, academyId: body.academyId } },
  });
  if (existing) {
    await db.favorite.delete({ where: { id: existing.id } });
    return apiSuccess({ favorited: false });
  }
  await db.favorite.create({
    data: { userId: user.id, academyId: body.academyId },
  });
  return apiSuccess({ favorited: true });
});
