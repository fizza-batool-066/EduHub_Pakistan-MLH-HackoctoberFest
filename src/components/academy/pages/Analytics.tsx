"use client";

import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, Users, Eye, Star, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { ChartCard, SimpleAreaChart, SimpleBarChart, MultiLineChart, SimplePieChart, ProgressBar, RadialProgress } from "@/components/common/Charts";
import { getItem } from "@/lib/storage";
import { Student, Course, Review } from "@/lib/types";
import { MONTHLY_DATA, CATEGORY_DISTRIBUTION } from "@/lib/sampleData";

export function AnalyticsPage({ academyId }: { academyId: string }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    setStudents((getItem<Student[]>("students") || []).filter((s) => s.academyId === academyId));
    setCourses((getItem<Course[]>("courses") || []).filter((c) => c.academyId === academyId));
    setReviews((getItem<Review[]>("reviews") || []).filter((r) => r.academyId === academyId));
  }, [academyId]);

  const avgRating = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
  const courseEnrollments = courses.slice(0, 6).map(c => ({ name: c.name.slice(0, 10), value: c.enrolled }));

  return (
    <div>
      <PageHeader
        title="Analytics & Insights"
        description="Deep dive into your academy performance"
        icon={BarChart3}
        actions={
          <Button variant="outline">
            <Download className="h-4 w-4 mr-1.5" /> Export Report
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Profile Views" value="14,250" icon={Eye} change={22} gradient="royal" />
        <StatCard title="Conversion Rate" value="3.8%" icon={TrendingUp} change={1.2} gradient="emerald" />
        <StatCard title="Avg. Rating" value={avgRating.toFixed(1)} icon={Star} gradient="amber" />
        <StatCard title="Active Students" value={students.length} icon={Users} change={15} gradient="violet" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <ChartCard title="Student Growth" description="Monthly new admissions" className="lg:col-span-2">
          <SimpleAreaChart data={MONTHLY_DATA} xKey="month" yKey="admissions" color="#2563EB" />
        </ChartCard>
        <Card className="p-5 border-border/60 shadow-card">
          <h3 className="font-semibold mb-4">Attendance Rate</h3>
          <div className="flex justify-center mb-3">
            <RadialProgress value={87} label="This Month" />
          </div>
          <div className="text-center text-xs text-muted-foreground">
            <span className="text-emerald-600 font-semibold">+5%</span> from last month
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <ChartCard title="Course Enrollments" description="Students per course">
          <SimpleBarChart data={courseEnrollments} xKey="name" yKey="value" color="#8B5CF6" />
        </ChartCard>
        <ChartCard title="Performance Trends" description="Multi-metric overview">
          <MultiLineChart
            data={MONTHLY_DATA}
            xKey="month"
            lines={[
              { key: "admissions", color: "#2563EB", name: "Admissions" },
              { key: "views", color: "#10B981", name: "Views" },
            ]}
          />
        </ChartCard>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <ChartCard title="Course Categories" description="Distribution">
          <SimplePieChart data={CATEGORY_DISTRIBUTION} height={240} />
        </ChartCard>
        <Card className="p-5 border-border/60 shadow-card">
          <h3 className="font-semibold mb-4">Rating Distribution</h3>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter(r => r.rating === star).length;
              const pct = reviews.length ? (count / reviews.length) * 100 : 0;
              return (
                <ProgressBar
                  key={star}
                  value={pct}
                  label={`${star} Star`}
                  color={star >= 4 ? "#10B981" : star === 3 ? "#F59E0B" : "#EF4444"}
                />
              );
            })}
          </div>
        </Card>
        <Card className="p-5 border-border/60 shadow-card">
          <h3 className="font-semibold mb-4">Profile Views</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">This Week</span>
              <span className="font-bold">3,420</span>
            </div>
            <ProgressBar value={68} color="#2563EB" />
            <div className="flex justify-between text-sm pt-2">
              <span className="text-muted-foreground">This Month</span>
              <span className="font-bold">14,250</span>
            </div>
            <ProgressBar value={82} color="#10B981" />
            <div className="flex justify-between text-sm pt-2">
              <span className="text-muted-foreground">All Time</span>
              <span className="font-bold">128,500</span>
            </div>
            <ProgressBar value={95} color="#8B5CF6" />
          </div>
        </Card>
      </div>

      <Card className="p-5 border-border/60 shadow-card">
        <h3 className="font-semibold mb-4">Course Performance Matrix</h3>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 text-xs uppercase tracking-wider text-muted-foreground">
                <th className="text-left font-semibold py-2">Course</th>
                <th className="text-left font-semibold py-2">Enrolled</th>
                <th className="text-left font-semibold py-2">Capacity</th>
                <th className="text-left font-semibold py-2">Utilization</th>
                <th className="text-left font-semibold py-2">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => {
                const utilization = (c.enrolled / c.seats) * 100;
                return (
                  <tr key={c.id} className="border-b border-border/40">
                    <td className="py-3 font-medium">{c.name}</td>
                    <td className="py-3">{c.enrolled}</td>
                    <td className="py-3">{c.seats}</td>
                    <td className="py-3 w-48">
                      <ProgressBar value={utilization} color={utilization > 80 ? "#EF4444" : utilization > 50 ? "#F59E0B" : "#10B981"} />
                    </td>
                    <td className="py-3 font-semibold">Rs {(c.fee * c.enrolled).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
