import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, apiError, withErrorHandler } from "@/lib/api-utils";
import { requireRole } from "@/lib/auth";

export const PATCH = withErrorHandler(async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const user = await requireRole("student", "academy", "admin");
  const body = await req.json();
  const review = await db.review.findUnique({ where: { id }, include: { academy: true } });
  if (!review) return apiError("Review not found", 404, "NOT_FOUND");

  // Student can edit only their own; academy can reply
  if (user.role === "student" && review.userId !== user.id) {
    return apiError("Forbidden", 403, "FORBIDDEN");
  }
  if (user.role === "academy" && review.academy.ownerId !== user.id) {
    return apiError("Forbidden", 403, "FORBIDDEN");
  }

  const updateData: any = {};
  if (body.reply !== undefined) updateData.reply = body.reply;
  if (body.comment !== undefined && review.userId === user.id) updateData.comment = body.comment;
  if (body.rating !== undefined && review.userId === user.id) updateData.rating = body.rating;

  const updated = await db.review.update({ where: { id }, data: updateData });

  if (body.rating !== undefined && review.userId === user.id) {
    // Recalculate academy rating
    const allReviews = await db.review.findMany({ where: { academyId: review.academyId } });
    const avgRating = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
    await db.academy.update({
      where: { id: review.academyId },
      data: { rating: Math.round(avgRating * 10) / 10 },
    });
  }

  return apiSuccess({ review: updated });
});

export const DELETE = withErrorHandler(async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const user = await requireRole("student", "academy", "admin");
  const review = await db.review.findUnique({ where: { id }, include: { academy: true } });
  if (!review) return apiError("Review not found", 404, "NOT_FOUND");
  if (user.role === "student" && review.userId !== user.id) {
    return apiError("Forbidden", 403, "FORBIDDEN");
  }
  if (user.role === "academy" && review.academy.ownerId !== user.id) {
    return apiError("Forbidden", 403, "FORBIDDEN");
  }
  await db.review.delete({ where: { id } });

  // Recalculate academy rating
  const allReviews = await db.review.findMany({ where: { academyId: review.academyId } });
  const avgRating = allReviews.length ? allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length : 0;
  await db.academy.update({
    where: { id: review.academyId },
    data: { rating: Math.round(avgRating * 10) / 10, reviewsCount: allReviews.length },
  });

  return apiSuccess({ success: true });
});
