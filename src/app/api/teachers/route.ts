import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, apiError, withErrorHandler } from "@/lib/api-utils";
import { requireRole, getOwnedAcademy } from "@/lib/auth";

export const GET = withErrorHandler(async (req: NextRequest) => {
  const url = new URL(req.url);
  const academyId = url.searchParams.get("academyId");
  if (!academyId) return apiError("academyId is required", 400, "VALIDATION");
  const teachers = await db.teacher.findMany({
    where: { academyId },
    include: { _count: { select: { students: true } } },
    orderBy: { createdAt: "desc" },
  });
  return apiSuccess({ teachers });
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const user = await requireRole("academy", "admin");
  const body = await req.json();
  const academy = await getOwnedAcademy(user);

  const teacher = await db.teacher.create({
    data: {
      academyId: academy.id,
      name: body.name,
      qualification: body.qualification,
      experience: body.experience,
      specialization: body.specialization,
      phone: body.phone,
      email: body.email,
      assignedCourseIdsJson: JSON.stringify(body.assignedCourses || []),
    },
  });

  // Increment academy teacher count
  await db.academy.update({
    where: { id: academy.id },
    data: { totalTeachers: { increment: 1 } },
  });

  return apiSuccess({ teacher }, 201);
});
