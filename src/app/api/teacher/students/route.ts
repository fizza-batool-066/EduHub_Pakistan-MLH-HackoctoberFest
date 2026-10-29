import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, withErrorHandler, parsePagination, paginationMeta } from "@/lib/api-utils";
import { requireRole } from "@/lib/auth";

/**
 * GET /api/teacher/students
 * Teacher role — returns only students assigned to this teacher
 */
export const GET = withErrorHandler(async (req: NextRequest) => {
  const url = new URL(req.url);
  const user = await requireRole("teacher");
  const { page, limit, skip } = parsePagination(url);
  const teacher = await db.teacher.findUnique({ where: { userId: user.id } });
  if (!teacher) return apiSuccess({ students: [], pagination: paginationMeta(0, page, limit) });
  const where = { teacherId: teacher.id };
  const [students, total] = await Promise.all([
    db.student.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
    db.student.count({ where }),
  ]);
  return apiSuccess({ students, pagination: paginationMeta(total, page, limit) });
});
