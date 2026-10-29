import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, setAuthCookie } from "@/lib/auth";
import { apiSuccess, apiError, withErrorHandler } from "@/lib/api-utils";
import { Role } from "@/lib/types";

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = await req.json();
  const { email, password, name, phone, role } = body as {
    email: string;
    password: string;
    name: string;
    phone?: string;
    role: Role;
  };

  if (!email || !password || !name || !role) {
    return apiError("Missing required fields", 400, "VALIDATION");
  }

  if (!["student", "academy", "teacher", "admin"].includes(role)) {
    return apiError("Invalid role", 400, "VALIDATION");
  }

  if (password.length < 6) {
    return apiError("Password must be at least 6 characters", 400, "VALIDATION");
  }

  const existing = await db.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) {
    return apiError("Email already registered", 409, "EMAIL_EXISTS");
  }

  const user = await db.user.create({
    data: {
      email: email.toLowerCase(),
      password: hashPassword(password),
      name,
      phone: phone || null,
      role,
    },
  });

  // If academy role, create a stub academy record they can later edit
  if (role === "academy") {
    await db.academy.create({
      data: {
        ownerId: user.id,
        name: `${name}'s Academy`,
        slug: `${name.toLowerCase().replace(/\s+/g, "-")}-${user.id.slice(-6)}`,
        city: "Lahore",
        area: "—",
        address: "—",
        phone: phone || "—",
        email: user.email,
        description: "Welcome to our academy. Please update this description from your dashboard.",
        category: "General",
        feeRange: "Rs 0 - Rs 0",
        timings: "9:00 AM - 5:00 PM",
        verified: false,
        rating: 0,
        reviewsCount: 0,
      },
    });
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

  return apiSuccess({ user: authUser }, 201);
});
