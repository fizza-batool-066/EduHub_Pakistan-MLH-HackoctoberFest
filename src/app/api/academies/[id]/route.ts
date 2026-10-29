import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, apiError, withErrorHandler } from "@/lib/api-utils";
import { requireRole, getOwnedAcademy } from "@/lib/auth";

/**
 * GET /api/academies/[id]
 * Public — fetch academy detail with related courses, teachers, reviews, announcements
 */
export const GET = withErrorHandler(async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const academy = await db.academy.findUnique({
    where: { id },
    include: {
      courses: { orderBy: { createdAt: "desc" } },
      teachers: true,
      reviews: { orderBy: { date: "desc" }, take: 50 },
      announcements: { where: { published: true }, orderBy: { date: "desc" } },
    },
  });

  if (!academy || academy.status !== "active") {
    return apiError("Academy not found", 404, "NOT_FOUND");
  }

  // Increment profile views (fire and forget)
  db.academy.update({
    where: { id },
    data: { profileViews: { increment: 1 } },
  }).catch(() => {});

  return apiSuccess({ academy });
});

/**
 * PATCH /api/academies/[id]
 * Academy owner or admin only
 */
export const PATCH = withErrorHandler(async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const user = await requireRole("academy", "admin");
  const body = await req.json();

  const academy = await db.academy.findUnique({ where: { id } });
  if (!academy) return apiError("Academy not found", 404, "NOT_FOUND");

  // Ownership check
  if (user.role === "academy" && academy.ownerId !== user.id) {
    return apiError("Forbidden: you do not own this academy", 403, "FORBIDDEN");
  }

  const allowedFields = [
    "name", "logo", "coverColor", "city", "area", "address", "phone", "email",
    "website", "description", "category", "feeRange", "minFee", "maxFee",
    "distance", "timings", "latitude", "longitude",
  ];
  const updateData: any = {};
  for (const key of allowedFields) {
    if (body[key] !== undefined) updateData[key] = body[key];
  }
  if (body.facilities !== undefined) {
    updateData.facilitiesJson = JSON.stringify(body.facilities);
  }
  if (body.coursesList !== undefined) {
    updateData.coursesListJson = JSON.stringify(body.coursesList);
  }
  if (body.gallery !== undefined) {
    updateData.galleryJson = JSON.stringify(body.gallery);
  }
  // Update slug if name changed
  if (body.name) {
    updateData.slug = (body.name as string).toLowerCase().replace(/\s+/g, "-") + "-" + academy.ownerId.slice(-6);
  }

  const updated = await db.academy.update({
    where: { id },
    data: updateData,
  });

  return apiSuccess({ academy: updated });
});

/**
 * DELETE /api/academies/[id]
 * Admin only (academy owners can suspend but not delete)
 */
export const DELETE = withErrorHandler(async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const user = await requireRole("admin");
  await db.academy.delete({ where: { id } });
  return apiSuccess({ success: true });
});

