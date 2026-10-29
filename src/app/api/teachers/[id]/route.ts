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
  const teacher = await db.teacher.findUnique({ where: { id }, include: { academy: true } });
  if (!teacher) return apiError("Teacher not found", 404, "NOT_FOUND");
  if (user.role === "academy" && teacher.academy.ownerId !== user.id) {
    return apiError("Forbidden", 403, "FORBIDDEN");
  }
  const allowedFields = ["name", "qualification", "experience", "specialization", "phone", "email"];
  const updateData: any = {};
  for (const key of allowedFields) {
    if (body[key] !== undefined) updateData[key] = body[key];
  }
  if (body.assignedCourses !== undefined) {
    updateData.assignedCourseIdsJson = JSON.stringify(body.assignedCourses);
  }
  const updated = await db.teacher.update({ where: { id }, data: updateData });
  return apiSuccess({ teacher: updated });
});

export const DELETE = withErrorHandler(async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const user = await requireRole("academy", "admin");
  const teacher = await db.teacher.findUnique({ where: { id }, include: { academy: true } });
  if (!teacher) return apiError("Teacher not found", 404, "NOT_FOUND");
  if (user.role === "academy" && teacher.academy.ownerId !== user.id) {
    return apiError("Forbidden", 403, "FORBIDDEN");
  }
  await db.teacher.delete({ where: { id } });
  await db.academy.update({
    where: { id: teacher.academyId },
    data: { totalTeachers: { decrement: 1 } },
  });
  return apiSuccess({ success: true });
});
