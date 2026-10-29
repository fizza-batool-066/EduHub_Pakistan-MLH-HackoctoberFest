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
  const student = await db.student.findUnique({ where: { id }, include: { academy: true } });
  if (!student) return apiError("Student not found", 404, "NOT_FOUND");
  if (user.role === "academy" && student.academy?.ownerId !== user.id) {
    return apiError("Forbidden", 403, "FORBIDDEN");
  }
  const allowedFields = ["name", "rollNumber", "course", "teacherName", "teacherId", "phone", "email", "gender", "address", "admissionDate", "status", "attendance", "progress"];
  const updateData: any = {};
  for (const key of allowedFields) {
    if (body[key] !== undefined) updateData[key] = body[key];
  }
  const updated = await db.student.update({ where: { id }, data: updateData });
  return apiSuccess({ student: updated });
});

export const DELETE = withErrorHandler(async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const user = await requireRole("academy", "admin");
  const student = await db.student.findUnique({ where: { id }, include: { academy: true } });
  if (!student) return apiError("Student not found", 404, "NOT_FOUND");
  if (user.role === "academy" && student.academy?.ownerId !== user.id) {
    return apiError("Forbidden", 403, "FORBIDDEN");
  }
  await db.student.delete({ where: { id } });
  if (student.academyId) {
    await db.academy.update({
      where: { id: student.academyId },
      data: { totalStudents: { decrement: 1 } },
    });
  }
  return apiSuccess({ success: true });
});
