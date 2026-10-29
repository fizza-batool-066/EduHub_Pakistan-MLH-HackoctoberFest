import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import {
  hashPassword, verifyPassword, setAuthCookie, getAuthUser,
} from "@/lib/auth";
import { apiSuccess, apiError, withErrorHandler } from "@/lib/api-utils";
import { Role } from "@/lib/types";

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = await req.json();
  const { email, password, role } = body as { email: string; password: string; role?: Role };

  if (!email || !password) {
    return apiError("Email and password are required", 400, "VALIDATION");
  }

  const user = await db.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user || !verifyPassword(password, user.password)) {
    return apiError("Invalid email or password", 401, "INVALID_CREDENTIALS");
  }

  if (role && user.role !== role) {
    return apiError(`This account is not a ${role} account`, 403, "ROLE_MISMATCH");
  }

  const authUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as Role,
    phone: user.phone,
    avatar: user.avatar,
  };

  await setAuthCookie(authUser);

  return apiSuccess({ user: authUser });
});

export const GET = withErrorHandler(async () => {
  const authUser = await getAuthUser();
  if (!authUser) {
    return apiSuccess({ user: null });
  }
  return apiSuccess({ user: authUser });
});
