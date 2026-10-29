import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, apiError, withErrorHandler } from "@/lib/api-utils";
import { requireAuth } from "@/lib/auth";

/**
 * GET /api/categories — public
 */
export const GET = withErrorHandler(async () => {
  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });
  return apiSuccess({ categories });
});

/**
 * POST /api/categories — admin only
 */
export const POST = withErrorHandler(async (req: NextRequest) => {
  const user = await requireAuth();
  if (user.role !== "admin") {
    return apiError("Forbidden: admin only", 403, "FORBIDDEN");
  }

  const body = await req.json();
  const { name, icon, color, description } = body;

  if (!name) {
    return apiError("Name is required", 400, "VALIDATION");
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const existing = await db.category.findUnique({ where: { slug } });
  if (existing) {
    return apiError("Category already exists", 409, "DUPLICATE");
  }

  const category = await db.category.create({
    data: {
      name,
      slug,
      icon: icon || "📚",
      color: color || "#2563EB",
      description: description || "",
    },
  });

  return apiSuccess({ category }, 201);
});
