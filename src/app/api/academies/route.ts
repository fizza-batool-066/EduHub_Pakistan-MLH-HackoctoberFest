import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, withErrorHandler, parsePagination, paginationMeta } from "@/lib/api-utils";
import { getAuthUser, requireRole } from "@/lib/auth";

/**
 * GET /api/academies
 * Query params: q (search), city, area, course, category, minRating, maxBudget, maxDistance, sortBy, page, limit, nearby
 * Public endpoint
 */
export const GET = withErrorHandler(async (req: NextRequest) => {
  const url = new URL(req.url);
  const q = url.searchParams.get("q") || "";
  const city = url.searchParams.get("city") || "";
  const area = url.searchParams.get("area") || "";
  const course = url.searchParams.get("course") || "";
  const category = url.searchParams.get("category") || "";
  const minRating = parseFloat(url.searchParams.get("minRating") || "0");
  const maxBudget = parseInt(url.searchParams.get("maxBudget") || "0", 10);
  const maxDistance = parseFloat(url.searchParams.get("maxDistance") || "0");
  const sortBy = url.searchParams.get("sortBy") || "rating";
  const nearby = url.searchParams.get("nearby") === "true";
  const { page, limit, skip } = parsePagination(url);

  const where: any = { status: "active" };
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { description: { contains: q } },
      { coursesListJson: { contains: q } },
    ];
  }
  if (city) where.city = city;
  if (area) where.area = area;
  if (category) where.category = category;
  if (course) where.coursesListJson = { contains: course };
  if (minRating > 0) where.rating = { gte: minRating };
  if (maxBudget > 0) where.minFee = { lte: maxBudget };
  if (maxDistance > 0) where.distance = { lte: maxDistance };

  let orderBy: any = { rating: "desc" };
  if (sortBy === "fee-low") orderBy = { minFee: "asc" };
  else if (sortBy === "fee-high") orderBy = { maxFee: "desc" };
  else if (sortBy === "distance" || nearby) orderBy = { distance: "asc" };
  else if (sortBy === "reviews") orderBy = { reviewsCount: "desc" };

  const [academies, total] = await Promise.all([
    db.academy.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    }),
    db.academy.count({ where }),
  ]);

  return apiSuccess({
    academies,
    pagination: paginationMeta(total, page, limit),
  });
});

/**
 * POST /api/academies
 * Academy role only — create a new academy (most owners already have one from signup)
 */
export const POST = withErrorHandler(async (req: NextRequest) => {
  const user = await requireRole("academy", "admin");
  const body = await req.json();

  // Check if user already has an academy
  const existing = await db.academy.findUnique({ where: { ownerId: user.id } });
  if (existing && user.role === "academy") {
    return apiSuccess({ academy: existing });
  }

  const academy = await db.academy.create({
    data: {
      ownerId: user.id,
      name: body.name,
      slug: (body.name as string).toLowerCase().replace(/\s+/g, "-") + "-" + user.id.slice(-6),
      logo: body.logo || "🏫",
      coverColor: body.coverColor || "linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)",
      city: body.city,
      area: body.area,
      address: body.address,
      phone: body.phone,
      email: body.email,
      website: body.website || null,
      description: body.description,
      category: body.category,
      feeRange: body.feeRange || "Rs 0 - Rs 0",
      minFee: body.minFee || 0,
      maxFee: body.maxFee || 0,
      timings: body.timings || "9:00 AM - 5:00 PM",
      facilitiesJson: JSON.stringify(body.facilities || []),
      coursesListJson: JSON.stringify(body.coursesList || []),
      verified: false,
    },
  });

  return apiSuccess({ academy }, 201);
});

