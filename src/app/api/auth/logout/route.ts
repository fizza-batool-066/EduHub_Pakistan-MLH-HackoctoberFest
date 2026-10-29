import { clearAuthCookie } from "@/lib/auth";
import { apiSuccess, withErrorHandler } from "@/lib/api-utils";

export const POST = withErrorHandler(async () => {
  await clearAuthCookie();
  return apiSuccess({ success: true });
});
