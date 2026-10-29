import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, apiError, withErrorHandler } from "@/lib/api-utils";
import { requireRole, getOwnedAcademy } from "@/lib/auth";

/**
 * GET /api/courses?academyId=xxx
 * Public — list courses for an academy
 */
export const GET = withErrorHandler(async (req: NextRequest) => {
  const url = new URL(req.url);
  const academyId = url.searchParams.get("academyId");
  if (!academyId) return apiError("academyId is required", 400, "VALIDATION");
  const courses = await db.course.findMany({
    where: { academyId },
    orderBy: { createdAt: "desc" },
  });
  return apiSuccess({ courses });
});

/**
 * POST /api/courses
 * Academy owner only
 */
export const POST = withErrorHandler(async (req: NextRequest) => {
  const user = await requireRole("academy", "admin");
  const body = await req.json();
  const academy = await getOwnedAcademy(user);

  const course = await db.course.create({
    data: {
      academyId: academy.id,
      name: body.name,
      duration: body.duration,
      fee: body.fee,
      description: body.description,
      instructor: body.instructor,
      seats: body.seats || 30,
      enrolled: 0,
      status: body.status || "active",
      category: body.category || "General",
    },
  });

  // Update academy's coursesListJson denormalized field
  const academyCourses = await db.course.findMany({ where: { academyId: academy.id }, select: { name: true } });
  await db.academy.update({
    where: { id: academy.id },
    data: { coursesListJson: JSON.stringify(academyCourses.map((c) => c.name)) },
  });

  return apiSuccess({ course }, 201);
});
