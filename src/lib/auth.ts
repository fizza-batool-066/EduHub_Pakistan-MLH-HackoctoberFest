import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import type { Role } from "@/lib/types";

const JWT_SECRET = process.env.JWT_SECRET || "eduhub-pakistan-secret-key-change-in-production";
const TOKEN_COOKIE_NAME = "eduhub_token";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  phone?: string | null;
  avatar?: string | null;
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export function signToken(payload: AuthUser): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return decoded;
  } catch {
    return null;
  }
}

export async function setAuthCookie(user: AuthUser) {
  const token = signToken(user);
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
  return token;
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_COOKIE_NAME);
}

export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getAuthUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requireRole(...roles: Role[]): Promise<AuthUser> {
  const user = await requireAuth();
  if (!roles.includes(user.role)) {
    throw new Error("Forbidden: insufficient role");
  }
  return user;
}

/**
 * Get the academy owned by the current academy user.
 * Throws if user is not academy role or has no academy.
 */
export async function getOwnedAcademy(user: AuthUser) {
  if (user.role !== "academy") {
    throw new Error("Forbidden: academy role required");
  }
  const academy = await db.academy.findUnique({
    where: { ownerId: user.id },
  });
  if (!academy) {
    throw new Error("Academy not found for this user");
  }
  return academy;
}

/**
 * Get the teacher record linked to the current teacher user.
 */
export async function getTeacherRecord(user: AuthUser) {
  if (user.role !== "teacher") {
    throw new Error("Forbidden: teacher role required");
  }
  const teacher = await db.teacher.findUnique({
    where: { userId: user.id },
  });
  if (!teacher) {
    throw new Error("Teacher record not found");
  }
  return teacher;
}
