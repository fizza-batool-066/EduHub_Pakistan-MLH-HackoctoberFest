import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, apiError, withErrorHandler, parsePagination } from "@/lib/api-utils";
import { requireAuth, getOwnedAcademy } from "@/lib/auth";

/**
 * GET /api/scholarships?academyId=xxx
 * - Academy owner: fetch own academy's scholarships
 * - Public/student: fetch by academyId
 */
export const GET = withErrorHandler(async (req: NextRequest) => {
  const url = new URL(req.url);
  const academyId = url.searchParams.get("academyId");

  // Try to auth — but don't require it (students can view)
  let authUser = null;
  try {
    authUser = await requireAuth();
  } catch {}

  let targetAcademyId = academyId;

  // If academy owner with no academyId specified, use their own
  if (!targetAcademyId && authUser?.role === "academy") {
    const academy = await getOwnedAcademy(authUser);
    targetAcademyId = academy.id;
  }

  if (!targetAcademyId) {
    return apiError("academyId is required", 400, "VALIDATION");
  }

  const { skip, limit } = parsePagination(url);
  const [scholarships, total] = await Promise.all([
    db.scholarship.findMany({
      where: { academyId: targetAcademyId },
      orderBy: { date: "desc" },
      skip,
      take: limit,
    }),
    db.scholarship.count({ where: { academyId: targetAcademyId } }),
  ]);

  return apiSuccess({ scholarships, total });
});

/**
 * POST /api/scholarships — academy owner only
 */
export const POST = withErrorHandler(async (req: NextRequest) => {
  const user = await requireAuth();
  const academy = await getOwnedAcademy(user);

  const body = await req.json();
  const { title, description, amount, eligibility, deadline, status } = body;

  if (!title || !description || !amount) {
    return apiError("title, description, and amount are required", 400, "VALIDATION");
  }

  const scholarship = await db.scholarship.create({
    data: {
      academyId: academy.id,
      title,
      description,
      amount,
      eligibility: eligibility || "",
      deadline: deadline || "",
      status: status || "active",
    },
  });

  return apiSuccess({ scholarship }, 201);
});
