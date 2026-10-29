import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, apiError, withErrorHandler, parsePagination, paginationMeta } from "@/lib/api-utils";
import { requireRole, getOwnedAcademy } from "@/lib/auth";

/**
 * GET /api/students?academyId=xxx
 * Academy owner: their academy students
 * Teacher: only their assigned students
 * Admin: any academy via academyId query
 */
export const GET = withErrorHandler(async (req: NextRequest) => {
  const url = new URL(req.url);
  const user = await requireRole("academy", "teacher", "admin");

  let academyId = url.searchParams.get("academyId");
  const status = url.searchParams.get("status");
  const course = url.searchParams.get("course");
  const { page, limit, skip } = parsePagination(url);

  if (user.role === "academy") {
    const academy = await getOwnedAcademy(user);
    academyId = academy.id;
  } else if (user.role === "teacher") {
    // Teacher: only their assigned students
    const teacher = await db.teacher.findUnique({ where: { userId: user.id } });
    if (!teacher) return apiSuccess({ students: [], pagination: paginationMeta(0, page, limit) });
    const where: any = { teacherId: teacher.id };
    if (status) where.status = status;
    if (course) where.course = { contains: course };
    const [students, total] = await Promise.all([
      db.student.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
      db.student.count({ where }),
    ]);
    return apiSuccess({ students, pagination: paginationMeta(total, page, limit) });
  }

  if (!academyId) return apiError("academyId is required", 400, "VALIDATION");
  const where: any = { academyId };
  if (status) where.status = status;
  if (course) where.course = { contains: course };
  const [students, total] = await Promise.all([
    db.student.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
    db.student.count({ where }),
  ]);
  return apiSuccess({ students, pagination: paginationMeta(total, page, limit) });
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const user = await requireRole("academy", "admin");
  const body = await req.json();
  const academy = await getOwnedAcademy(user);

  // Check roll number uniqueness within academy
  const existing = await db.student.findFirst({
    where: { academyId: academy.id, rollNumber: body.rollNumber },
  });
  if (existing) return apiError("Roll number already exists", 409, "DUPLICATE");

  const student = await db.student.create({
    data: {
      academyId: academy.id,
      teacherId: body.teacherId || null,
      name: body.name,
      rollNumber: body.rollNumber,
      course: body.course,
      teacherName: body.teacher || null,
      phone: body.phone,
      email: body.email,
      gender: body.gender || "male",
      address: body.address || null,
      admissionDate: body.admissionDate || new Date().toISOString().slice(0, 10),
      status: body.status || "active",
      attendance: 0,
      progress: 0,
    },
  });

  await db.academy.update({
    where: { id: academy.id },
    data: { totalStudents: { increment: 1 } },
  });

  return apiSuccess({ student }, 201);
});
