import { NextRequest } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { apiSuccess, apiError, withErrorHandler } from "@/lib/api-utils";
import { requireAuth } from "@/lib/auth";
import { randomUUID } from "crypto";

/**
 * POST /api/upload
 * Multipart form-data with field "file" (image/* only, max 5MB)
 * Returns: { url: "/uploads/xxx.jpg", filename: "xxx.jpg" }
 */
export const POST = withErrorHandler(async (req: NextRequest) => {
  await requireAuth();

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return apiError("No file provided", 400, "NO_FILE");
  }

  // Validate type
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
  if (!allowedTypes.includes(file.type)) {
    return apiError(`File type ${file.type} not allowed. Use JPEG, PNG, WebP, GIF, or SVG.`, 400, "INVALID_TYPE");
  }

  // Validate size (5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return apiError("File too large. Max 5MB.", 400, "FILE_TOO_LARGE");
  }

  // Ensure uploads dir exists
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  // Generate unique filename preserving extension
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeExt = ["jpg", "jpeg", "png", "webp", "gif", "svg"].includes(ext) ? ext : "jpg";
  const filename = `${randomUUID()}.${safeExt}`;
  const filePath = path.join(uploadDir, filename);

  // Write file
  const bytes = await file.arrayBuffer();
  await writeFile(filePath, Buffer.from(bytes));

  // Return URL (relative path so it works in any environment)
  return apiSuccess({
    url: `/uploads/${filename}`,
    filename,
    size: file.size,
    type: file.type,
  });
});

export const GET = withErrorHandler(async () => {
  return apiSuccess({ ok: true, message: "Upload endpoint. Send POST with multipart form-data." });
});
