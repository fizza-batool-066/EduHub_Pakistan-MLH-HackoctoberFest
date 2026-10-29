import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, apiError, withErrorHandler } from "@/lib/api-utils";
import { requireRole, getOwnedAcademy } from "@/lib/auth";

export const PATCH = withErrorHandler(async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const user = await requireRole("academy", "admin");
  const body = await req.json();

  const course = await db.course.findUnique({ where: { id }, include: { academy: true } });
  if (!course) return apiError("Course not found", 404, "NOT_FOUND");

  if (user.role === "academy" && course.academy.ownerId !== user.id) {
    return apiError("Forbidden", 403, "FORBIDDEN");
  }

  const allowedFields = ["name", "duration", "fee", "description", "instructor", "seats", "enrolled", "status", "category"];
  const updateData: any = {};
  for (const key of allowedFields) {
    if (body[key] !== undefined) updateData[key] = body[key];
  }
  const updated = await db.course.update({ where: { id }, data: updateData });

  // Update denormalized coursesListJson on academy
  const academyCourses = await db.course.findMany({ where: { academyId: course.academyId }, select: { name: true } });
  await db.academy.update({
    where: { id: course.academyId },
    data: { coursesListJson: JSON.stringify(academyCourses.map((c) => c.name)) },
  });

  return apiSuccess({ course: updated });
});

export const DELETE = withErrorHandler(async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const user = await requireRole("academy", "admin");
  const course = await db.course.findUnique({ where: { id }, include: { academy: true } });
  if (!course) return apiError("Course not found", 404, "NOT_FOUND");

  if (user.role === "academy" && course.academy.ownerId !== user.id) {
    return apiError("Forbidden", 403, "FORBIDDEN");
  }

  await db.course.delete({ where: { id } });

  // Update denormalized
  const academyCourses = await db.course.findMany({ where: { academyId: course.academyId }, select: { name: true } });
  await db.academy.update({
    where: { id: course.academyId },
    data: { coursesListJson: JSON.stringify(academyCourses.map((c) => c.name)) },
  });

  return apiSuccess({ success: true });
});
