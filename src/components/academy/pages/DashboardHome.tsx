"use client";

import { motion } from "framer-motion";
import {
  Users, GraduationCap, BookOpen, Wallet, Eye, Star, MessageSquare,
  UserPlus, ClipboardList, Megaphone, Upload, ArrowRight, TrendingUp,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { ChartCard, SimpleAreaChart, SimpleBarChart, MultiLineChart, SimplePieChart, ProgressBar } from "@/components/common/Charts";
import { LoadingDashboard } from "@/components/common/LoadingStates";
import { useApp } from "@/context/AppContext";
import { useMyAcademy } from "@/lib/hooks";
import { formatCurrency, formatDate, timeAgo } from "@/lib/storage";
import { MONTHLY_DATA, CATEGORY_DISTRIBUTION } from "@/lib/sampleData";

export function AcademyDashboardHome() {
  const { user, navigate } = useApp();
  const { data, isLoading } = useMyAcademy();
  const academy = data?.data?.academy;

  if (isLoading) return <LoadingDashboard />;
  if (!academy) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No academy found for your account.</p>
      </div>
    );
  }

  const courses = (academy as any).courses || [];
  const teachers = (academy as any).teachers || [];
  const reviews = (academy as any).reviews || [];
  const admissions = (academy as any).admissions || [];
  const inquiries = (academy as any).inquiries || [];
  const announcements = (academy as any).announcements || [];

  const monthlyRevenue = admissions.filter((a: any) => a.status === "confirmed").reduce((sum: number, a: any) => sum + a.fee, 0);
  const pendingInquiries = inquiries.filter((i: any) => i.status === "pending").length;

  const quickActions = [
    { label: "Add Student", icon: UserPlus, color: "from-blue-500 to-blue-700", action: () => navigate({ name: "academy", page: "students" }) },
    { label: "Add Teacher", icon: GraduationCap, color: "from-emerald-500 to-emerald-700", action: () => navigate({ name: "academy", page: "teachers" }) },
    { label: "Add Course", icon: BookOpen, color: "from-violet-500 to-purple-700", action: () => navigate({ name: "academy", page: "courses" }) },
    { label: "Announcement", icon: Megaphone, color: "from-amber-500 to-orange-600", action: () => navigate({ name: "academy", page: "announcements" }) },
    { label: "Upload Photos", icon: Upload, color: "from-pink-500 to-rose-600", action: () => navigate({ name: "academy", page: "gallery" }) },
    { label: "View Analytics", icon: TrendingUp, color: "from-cyan-500 to-blue-600", action: () => navigate({ name: "academy", page: "analytics" }) },
  ];

  const recentReviews = [...reviews].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3);
  const recentInquiries = [...inquiries].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 4);

  return (
    <div>
      <PageHeader
        title={`Welcome, ${user?.name?.split(" ")[0] || "Academy Owner"}!`}
        description={`Managing ${academy.name}`}
        actions={
          <Button className="gradient-emerald" onClick={() => navigate({ name: "academy", page: "students" })}>
            <UserPlus className="h-4 w-4 mr-1.5" /> Add Student
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Students" value={academy.totalStudents} icon={Users} change={12} gradient="royal" delay={0} />
        <StatCard title="Total Teachers" value={academy.totalTeachers} icon={GraduationCap} change={5} gradient="emerald" delay={0.05} />
        <StatCard title="Active Courses" value={courses.length} icon={BookOpen} gradient="violet" delay={0.1} />
        <StatCard title="Pending Inquiries" value={pendingInquiries} icon={MessageSquare} gradient="amber" delay={0.15} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Monthly Revenue" value={formatCurrency(monthlyRevenue)} icon={Wallet} change={18} gradient="emerald" delay={0.2} />
        <StatCard title="Profile Views" value={academy.profileViews} icon={Eye} change={8} gradient="royal" delay={0.25} />
        <StatCard title="Total Reviews" value={reviews.length} icon={Star} change={15} gradient="amber" delay={0.3} />
        <StatCard title="New Admissions" value={admissions.filter((a: any) => a.status === "pending").length} icon={ClipboardList} gradient="pink" delay={0.35} />
      </div>

      {/* Quick Actions */}
      <Card className="p-5 mb-6 border-border/60 shadow-card">
        <h3 className="font-semibold mb-4 text-sm">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action, i) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -2 }}
              onClick={action.action}
              className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border/60 hover:shadow-card transition-all group"
            >
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${action.color} text-white shadow-md group-hover:scale-110 transition-transform`}>
                <action.icon className="h-4 w-4" />
              </div>
              <span className="text-xs font-medium text-center">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </Card>

      {/* Charts row 1 */}
      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <ChartCard title="Monthly Admissions" description="Admissions over the last 10 months">
          <SimpleBarChart data={MONTHLY_DATA} xKey="month" yKey="admissions" color="#10B981" />
        </ChartCard>
        <ChartCard title="Revenue Trend" description="Monthly revenue in PKR">
          <SimpleAreaChart data={MONTHLY_DATA} xKey="month" yKey="revenue" color="#2563EB" />
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <ChartCard title="Course Enrollments" description="Students per course">
          <SimpleBarChart
            data={courses.slice(0, 6).map((c: any) => ({ name: c.name.slice(0, 12), value: c.enrolled }))}
            xKey="name"
            yKey="value"
            color="#8B5CF6"
          />
        </ChartCard>
        <ChartCard title="Growth Metrics" description="Multi-metric overview">
          <MultiLineChart
            data={MONTHLY_DATA}
            xKey="month"
            lines={[
              { key: "admissions", color: "#2563EB", name: "Admissions" },
              { key: "enrollments", color: "#10B981", name: "Enrollments" },
              { key: "views", color: "#F59E0B", name: "Profile Views" },
            ]}
          />
        </ChartCard>
      </div>

      {/* Attendance & Performance */}
      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <ChartCard title="Course Categories" description="Distribution">
          <SimplePieChart data={CATEGORY_DISTRIBUTION} height={240} />
        </ChartCard>
        <Card className="p-5 border-border/60 shadow-card">
          <h3 className="font-semibold mb-4">Attendance Rate</h3>
          <div className="flex items-center justify-around mb-4">
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">87%</div>
              <div className="text-xs text-muted-foreground">This Week</div>
            </div>
          </div>
          <div className="space-y-2">
            {courses.slice(0, 3).map((c: any) => (
              <ProgressBar key={c.id} value={80 + Math.floor(Math.random() * 15)} label={c.name.slice(0, 20)} color="#10B981" />
            ))}
          </div>
        </Card>
        <Card className="p-5 border-border/60 shadow-card">
          <h3 className="font-semibold mb-4">Rating Trend</h3>
          <div className="space-y-3">
            {[
              { month: "This Month", rating: academy.rating.toFixed(1), change: "+0.2" },
              { month: "Last Month", rating: "4.6", change: "+0.1" },
              { month: "2 Months Ago", rating: "4.5", change: "0" },
              { month: "3 Months Ago", rating: "4.5", change: "-0.1" },
            ].map((r) => (
              <div key={r.month} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40">
                <div>
                  <div className="text-xs font-medium">{r.month}</div>
                  <div className="text-lg font-bold">{r.rating} ★</div>
                </div>
                <Badge variant={r.change.startsWith("+") ? "default" : r.change === "0" ? "secondary" : "destructive"} className="text-[10px]">
                  {r.change}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Inquiries & Reviews */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-5 border-border/60 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-amber-500" /> Recent Inquiries
            </h3>
            <Button variant="ghost" size="sm" onClick={() => navigate({ name: "academy", page: "admissions" })}>
              View All
            </Button>
          </div>
          {recentInquiries.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">No inquiries yet</div>
          ) : (
            <div className="space-y-3">
              {recentInquiries.map((inq: any) => (
                <div key={inq.id} className="flex items-start gap-3 p-3 rounded-lg border border-border/60">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold flex-shrink-0">
                    {inq.studentName.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-semibold text-sm truncate">{inq.studentName}</div>
                      <Badge
                        variant={inq.status === "pending" ? "outline" : inq.status === "responded" ? "secondary" : "default"}
                        className="text-[10px] capitalize"
                      >
                        {inq.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">{inq.course}</div>
                    <p className="text-xs mt-1 line-clamp-1">{inq.message}</p>
                    <div className="text-[10px] text-muted-foreground mt-1">{timeAgo(inq.date)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-5 border-border/60 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-500" /> Recent Reviews
            </h3>
            <Button variant="ghost" size="sm" onClick={() => navigate({ name: "academy", page: "reviews" })}>
              View All
            </Button>
          </div>
          {recentReviews.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">No reviews yet</div>
          ) : (
            <div className="space-y-3">
              {recentReviews.map((r: any) => (
                <div key={r.id} className="p-3 rounded-lg border border-border/60">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-sm">{r.studentName}</div>
                    <div className="flex">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{r.comment}</p>
                  <div className="text-[10px] text-muted-foreground mt-1">{timeAgo(r.date)}</div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
