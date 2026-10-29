import { NextRequest } from "next/server";
import { apiSuccess, withErrorHandler } from "@/lib/api-utils";
import { requireRole } from "@/lib/auth";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

/**
 * POST /api/admin/reset
 * Re-runs the seed script — wipes and re-creates sample data
 */
export const POST = withErrorHandler(async () => {
  await requireRole("admin");
  try {
    const { stdout, stderr } = await execAsync("bun run scripts/seed.ts", {
      cwd: "/home/z/my-project",
      timeout: 30000,
    });
    console.log("Reset stdout:", stdout);
    if (stderr) console.log("Reset stderr:", stderr);
    return apiSuccess({ success: true, message: "Database reset to sample data" });
  } catch (e: any) {
    console.error("Reset failed:", e);
    return apiSuccess({ success: false, error: e.message });
  }
});
