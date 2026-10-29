import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, apiError, withErrorHandler } from "@/lib/api-utils";
import { requireRole, getOwnedAcademy, getAuthUser } from "@/lib/auth";

/**
 * GET /api/inquiries?academyId=xxx
 * Academy owner: their academy inquiries
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
  const inquiries = await db.inquiry.findMany({
    where: { academyId },
    orderBy: { date: "desc" },
  });
  return apiSuccess({ inquiries });
});

/**
 * POST /api/inquiries
 * Student: submit an inquiry
 */
export const POST = withErrorHandler(async (req: NextRequest) => {
  const user = await getAuthUser();
  const body = await req.json();
  const inquiry = await db.inquiry.create({
    data: {
      academyId: body.academyId,
      userId: user?.id || null,
      studentName: body.studentName || user?.name || "Anonymous",
      email: body.email || user?.email || "",
      phone: body.phone || "",
      course: body.course || "",
      message: body.message,
      status: "pending",
    },
  });
  return apiSuccess({ inquiry }, 201);
});

/**
 * PATCH /api/inquiries
 * Academy: update inquiry status
 */
export const PATCH = withErrorHandler(async (req: NextRequest) => {
  const user = await requireRole("academy", "admin");
  const body = await req.json();
  const inquiry = await db.inquiry.findUnique({ where: { id: body.id }, include: { academy: true } });
  if (!inquiry) return apiError("Inquiry not found", 404, "NOT_FOUND");
  if (user.role === "academy" && inquiry.academy.ownerId !== user.id) {
    return apiError("Forbidden", 403, "FORBIDDEN");
  }
  const updated = await db.inquiry.update({
    where: { id: body.id },
    data: { status: body.status },
  });
  return apiSuccess({ inquiry: updated });
});
