import { db } from "@/lib/db";
import { apiSuccess, apiError, withErrorHandler } from "@/lib/api-utils";
import { requireRole } from "@/lib/auth";

/**
 * GET /api/me/academy
 * Academy role — returns the academy owned by the current user, with full details
 */
export const GET = withErrorHandler(async () => {
  const user = await requireRole("academy");
  const academy = await db.academy.findUnique({
    where: { ownerId: user.id },
    include: {
      courses: { orderBy: { createdAt: "desc" } },
      teachers: true,
      reviews: { orderBy: { date: "desc" }, take: 10 },
      announcements: { orderBy: { date: "desc" } },
      admissions: { orderBy: { date: "desc" } },
      inquiries: { orderBy: { date: "desc" } },
      _count: { select: { students: true, teachers: true, courses: true, reviews: true } },
    },
  });
  if (!academy) return apiError("No academy found for your account", 404, "NO_ACADEMY");
  return apiSuccess({ academy });
});
