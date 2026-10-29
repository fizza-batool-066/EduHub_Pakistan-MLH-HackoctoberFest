import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, apiError, withErrorHandler } from "@/lib/api-utils";
import { requireRole, getOwnedAcademy } from "@/lib/auth";

/**
 * GET /api/announcements?academyId=xxx&published=true
 */
export const GET = withErrorHandler(async (req: NextRequest) => {
  const url = new URL(req.url);
  const academyId = url.searchParams.get("academyId");
  if (!academyId) return apiError("academyId is required", 400, "VALIDATION");
  const published = url.searchParams.get("published");
  const where: any = { academyId };
  if (published === "true") where.published = true;
  const announcements = await db.announcement.findMany({
    where,
    orderBy: { date: "desc" },
  });
  return apiSuccess({ announcements });
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const user = await requireRole("academy", "admin");
  const body = await req.json();
  const academy = await getOwnedAcademy(user);

  const announcement = await db.announcement.create({
    data: {
      academyId: academy.id,
      title: body.title,
      content: body.content,
      published: body.published !== false,
    },
  });
  return apiSuccess({ announcement }, 201);
});
