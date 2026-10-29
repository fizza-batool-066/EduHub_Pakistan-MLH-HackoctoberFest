import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, apiError, withErrorHandler } from "@/lib/api-utils";
import { requireAuth, getOwnedAcademy } from "@/lib/auth";

export const PATCH = withErrorHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const user = await requireAuth();
  const academy = await getOwnedAcademy(user);
  const { id } = await params;

  const existing = await db.scholarship.findUnique({ where: { id } });
  if (!existing || existing.academyId !== academy.id) {
    return apiError("Scholarship not found", 404, "NOT_FOUND");
  }

  const body = await req.json();
  const updated = await db.scholarship.update({
    where: { id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.amount !== undefined && { amount: body.amount }),
      ...(body.eligibility !== undefined && { eligibility: body.eligibility }),
      ...(body.deadline !== undefined && { deadline: body.deadline }),
      ...(body.status !== undefined && { status: body.status }),
    },
  });

  return apiSuccess({ scholarship: updated });
});

export const DELETE = withErrorHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const user = await requireAuth();
  const academy = await getOwnedAcademy(user);
  const { id } = await params;

  const existing = await db.scholarship.findUnique({ where: { id } });
  if (!existing || existing.academyId !== academy.id) {
    return apiError("Scholarship not found", 404, "NOT_FOUND");
  }

  await db.scholarship.delete({ where: { id } });
  return apiSuccess({ deleted: true });
});
