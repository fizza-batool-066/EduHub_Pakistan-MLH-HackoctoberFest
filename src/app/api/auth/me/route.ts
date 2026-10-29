import { db } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { apiSuccess, withErrorHandler } from "@/lib/api-utils";

export const GET = withErrorHandler(async () => {
  const authUser = await getAuthUser();
  if (!authUser) {
    return apiSuccess({ user: null });
  }
  // Fetch latest user data from DB
  const user = await db.user.findUnique({
    where: { id: authUser.id },
    select: {
      id: true, email: true, name: true, role: true,
      phone: true, avatar: true, bio: true, address: true,
    },
  });
  return apiSuccess({ user });
});
