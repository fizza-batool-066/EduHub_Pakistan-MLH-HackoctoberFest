import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, apiError, withErrorHandler } from "@/lib/api-utils";
import { requireRole, getOwnedAcademy } from "@/lib/auth";

/**
 * GET /api/admissions?academyId=xxx
 * Academy owner: their academy admissions
 */
export const GET = withErrorHandler(async (req: NextRequest) => {
  const url = new URL(req.url);
  const user = await requireRole("academy", "admin");
  let academyId = url.searchParams.get("academyId");
  if (user.role === "academy") {
    const academy = await getOwnedAcademy(user);
    academyId = academy.id;
  }
  if (!academyId) return apiError("academyId is required", 400, "VALIDATION");
  const admissions = await db.admission.findMany({
    where: { academyId },
    orderBy: { date: "desc" },
  });
  return apiSuccess({ admissions });
});

/**
 * POST /api/admissions
 * Student: apply for admission
 */
export const POST = withErrorHandler(async (req: NextRequest) => {
  const user = await requireRole("student", "academy", "admin");
  const body = await req.json();
  const admission = await db.admission.create({
    data: {
      academyId: body.academyId,
      userId: user.id,
      studentName: body.studentName || user.name,
      course: body.course,
      fee: body.fee || 0,
      status: "pending",
    },
  });
  return apiSuccess({ admission }, 201);
});

/**
 * PATCH /api/admissions
 * Academy: update admission status (confirm/reject)
 * Body: { id, status }
 */
export const PATCH = withErrorHandler(async (req: NextRequest) => {
  const user = await requireRole("academy", "admin");
  const body = await req.json();
  const admission = await db.admission.findUnique({ where: { id: body.id }, include: { academy: true } });
  if (!admission) return apiError("Admission not found", 404, "NOT_FOUND");
  if (user.role === "academy" && admission.academy.ownerId !== user.id) {
    return apiError("Forbidden", 403, "FORBIDDEN");
  }
  const updated = await db.admission.update({
    where: { id: body.id },
    data: { status: body.status },
  });
  return apiSuccess({ admission: updated });
});
