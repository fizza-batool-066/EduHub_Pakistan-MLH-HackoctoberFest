import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, withErrorHandler } from "@/lib/api-utils";
import { requireRole } from "@/lib/auth";

/**
 * GET /api/admin/stats
 * Platform-wide stats for admin dashboard
 */
export const GET = withErrorHandler(async () => {
  await requireRole("admin");

  const [
    totalAcademies, verifiedAcademies, totalStudents, totalTeachers,
    totalCourses, totalReviews, totalUsers, totalAdmissions, totalInquiries,
    recentAcademies, recentStudents, topAcademies, recentReviews,
  ] = await Promise.all([
    db.academy.count(),
    db.academy.count({ where: { verified: true } }),
    db.student.count(),
    db.teacher.count(),
    db.course.count(),
    db.review.count(),
    db.user.count(),
    db.admission.count(),
    db.inquiry.count(),
    db.academy.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
    db.student.findMany({ take: 5, orderBy: { createdAt: "desc" }, include: { academy: true } }),
    db.academy.findMany({ take: 8, orderBy: { rating: "desc" } }),
    db.review.findMany({ take: 5, orderBy: { date: "desc" }, include: { academy: true } }),
  ]);

  // Category distribution
  const academies = await db.academy.findMany({ select: { category: true, rating: true } });
  const categoryMap: Record<string, number> = {};
  for (const a of academies) {
    categoryMap[a.category] = (categoryMap[a.category] || 0) + 1;
  }
  const categoryDistribution = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

  // Rating distribution
  const reviews = await db.review.findMany({ select: { rating: true } });
  const ratingMap: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const r of reviews) {
    ratingMap[r.rating] = (ratingMap[r.rating] || 0) + 1;
  }
  const ratingDistribution = [
    { name: "5 Star", value: ratingMap[5] || 0, color: "#10B981" },
    { name: "4 Star", value: ratingMap[4] || 0, color: "#2563EB" },
    { name: "3 Star", value: ratingMap[3] || 0, color: "#F59E0B" },
    { name: "2 Star", value: ratingMap[2] || 0, color: "#FB923C" },
    { name: "1 Star", value: ratingMap[1] || 0, color: "#EF4444" },
  ];

  return apiSuccess({
    stats: {
      totalAcademies, verifiedAcademies, totalStudents, totalTeachers,
      totalCourses, totalReviews, totalUsers, totalAdmissions, totalInquiries,
    },
    recentAcademies,
    recentStudents,
    topAcademies,
    recentReviews,
    categoryDistribution,
    ratingDistribution,
  });
});
