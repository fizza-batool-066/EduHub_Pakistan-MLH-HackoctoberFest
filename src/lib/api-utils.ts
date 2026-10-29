import { NextResponse } from "next/server";

/**
 * Standardized API success response
 */
export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

/**
 * Standardized API error response
 */
export function apiError(message: string, status = 400, code?: string) {
  return NextResponse.json(
    { success: false, error: { message, code: code || "ERROR" } },
    { status }
  );
}

/**
 * Wrap an async API handler with try/catch and auth error mapping.
 */
export function withErrorHandler<T extends any[]>(
  handler: (...args: T) => Promise<any>
) {
  return async (...args: T) => {
    try {
      return await handler(...args);
    } catch (e: any) {
      const msg = e?.message || "Internal server error";
      if (msg === "Unauthorized") {
        return apiError("Unauthorized — please log in", 401, "UNAUTHORIZED");
      }
      if (msg.startsWith("Forbidden")) {
        return apiError(msg, 403, "FORBIDDEN");
      }
      console.error("[API Error]", e);
      return apiError(msg, 500, "INTERNAL_ERROR");
    }
  };
}

/**
 * Parse pagination params from a URL.
 */
export function parsePagination(url: URL) {
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "20", 10)));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

/**
 * Standard pagination meta shape
 */
export function paginationMeta(total: number, page: number, limit: number) {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    hasMore: page * limit < total,
  };
}
