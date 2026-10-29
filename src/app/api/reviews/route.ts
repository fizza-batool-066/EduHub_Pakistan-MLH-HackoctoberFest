import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, apiError, withErrorHandler } from "@/lib/api-utils";
import { requireRole, getAuthUser } from "@/lib/auth";

/**
 * GET /api/reviews?academyId=xxx
 * Public — list reviews for an academy
 */
export const GET = withErrorHandler(async (req: NextRequest) => {
  const url = new URL(req.url);
  const academyId = url.searchParams.get("academyId");
  if (!academyId) return apiError("academyId is required", 400, "VALIDATION");
  const reviews = await db.review.findMany({
    where: { academyId },
    orderBy: { date: "desc" },
  });
  return apiSuccess({ reviews });
});

/**
 * POST /api/reviews
 * Student role only — submit a review
 */
export const POST = withErrorHandler(async (req: NextRequest) => {
  const user = await requireRole("student", "admin");
  const body = await req.json();
  if (!body.academyId || !body.comment || !body.rating) {
    return apiError("Missing required fields", 400, "VALIDATION");
  }
  if (body.rating < 1 || body.rating > 5) {
    return apiError("Rating must be between 1 and 5", 400, "VALIDATION");
  }
  const review = await db.review.create({
    data: {
      academyId: body.academyId,
      userId: user.id,
      studentName: body.studentName || user.name,
      rating: body.rating,
      comment: body.comment,
    },
  });

  // Recalculate academy rating and reviewsCount
  const allReviews = await db.review.findMany({ where: { academyId: body.academyId } });
  const avgRating = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
  await db.academy.update({
    where: { id: body.academyId },
    data: { rating: Math.round(avgRating * 10) / 10, reviewsCount: allReviews.length },
  });

  return apiSuccess({ review }, 201);
});
