"use client";

import { motion } from "framer-motion";
import {
  Building2, Users, GraduationCap, Star, BookOpen, TrendingUp,
  BadgeCheck, AlertTriangle, ArrowUpRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { ChartCard, SimpleAreaChart, SimpleBarChart, MultiLineChart, SimplePieChart } from "@/components/common/Charts";
import { LoadingDashboard } from "@/components/common/LoadingStates";
import { useApp } from "@/context/AppContext";
import { useAdminStats } from "@/lib/hooks";
import { formatCurrency } from "@/lib/storage";
import { MONTHLY_DATA, CATEGORY_DISTRIBUTION } from "@/lib/sampleData";

export function AdminDashboardHome() {
  const { navigate } = useApp();
  const { data, isLoading } = useAdminStats();
  const stats = data?.data?.stats;
  const recentAcademies = data?.data?.recentAcademies || [];
  const topAcademies = data?.data?.topAcademies || [];
  const categoryDistribution = data?.data?.categoryDistribution || [];
  const ratingDistribution = data?.data?.ratingDistribution || [];

  if (isLoading) return <LoadingDashboard />;

  return (
    <div>
      <PageHeader
        title="Platform Overview"
        description="Manage and monitor EduHub Pakistan platform"
        icon={Building2}
        actions={
          <Button className="bg-gradient-to-br from-amber-500 to-orange-600 text-white">
            <BadgeCheck className="h-4 w-4 mr-1.5" /> Verify Pending
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Academies" value={stats?.totalAcademies || 0} icon={Building2} change={12} gradient="royal" />
        <StatCard title="Verified" value={stats?.verifiedAcademies || 0} icon={BadgeCheck} change={8} gradient="emerald" />
        <StatCard title="Total Students" value={stats?.totalStudents || 0} icon={Users} change={22} gradient="violet" />
        <StatCard title="Total Teachers" value={stats?.totalTeachers || 0} icon={GraduationCap} change={15} gradient="amber" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Active Courses" value={stats?.totalCourses || 0} icon={BookOpen} gradient="cyan" />
        <StatCard title="Total Reviews" value={stats?.totalReviews || 0} icon={Star} gradient="pink" />
        <StatCard title="Total Users" value={stats?.totalUsers || 0} icon={Users} gradient="royal" />
        <StatCard title="Total Inquiries" value={stats?.totalInquiries || 0} icon={AlertTriangle} gradient="amber" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <ChartCard title="Platform Growth" description="Multi-metric trend">
          <MultiLineChart
            data={MONTHLY_DATA}
            xKey="month"
            lines={[
              { key: "admissions", color: "#2563EB", name: "Admissions" },
              { key: "enrollments", color: "#10B981", name: "Enrollments" },
              { key: "views", color: "#F59E0B", name: "Views" },
            ]}
          />
        </ChartCard>
        <ChartCard title="Platform Activity" description="Monthly admissions">
          <SimpleAreaChart data={MONTHLY_DATA} xKey="month" yKey="admissions" color="#2563EB" />
        </ChartCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-5 border-border/60 shadow-card">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" /> Top Performing Academies
          </h3>
          <div className="space-y-3">
            {topAcademies.map((a: any, i: number) => (
              <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg border border-border/60">
                <div className="text-xs font-bold text-muted-foreground w-4">#{i + 1}</div>
                <div className="h-9 w-9 rounded-lg flex items-center justify-center text-base" style={{ background: a.coverColor }}>
                  {a.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{a.name}</div>
                  <div className="text-xs text-muted-foreground">{a.city} · {a.totalStudents} students</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold">{a.rating} ★</div>
                  <div className="text-[10px] text-muted-foreground">{a.reviewsCount} reviews</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 border-border/60 shadow-card">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-500" /> Review Distribution
          </h3>
          <SimpleBarChart data={ratingDistribution} xKey="name" yKey="value" color="#F59E0B" />
        </Card>
      </div>
    </div>
  );
}
