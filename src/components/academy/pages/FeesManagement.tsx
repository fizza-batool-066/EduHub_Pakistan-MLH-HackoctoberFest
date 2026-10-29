"use client";

import { Wallet, Download, TrendingUp, DollarSign, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { ChartCard, SimpleAreaChart, SimpleBarChart } from "@/components/common/Charts";
import { DataTable } from "@/components/common/DataTable";
import { LoadingCards } from "@/components/common/LoadingStates";
import { useMyAcademy, useAdmissions, useCourses } from "@/lib/hooks";
import { formatCurrency, formatDate } from "@/lib/storage";
import { MONTHLY_DATA } from "@/lib/sampleData";

export function FeesManagement() {
  const myAcademyQ = useMyAcademy();
  const academy = myAcademyQ.data?.data?.academy;
  const academyId = academy?.id || "";

  const admissionsQ = useAdmissions(academyId || null);
  const coursesQ = useCourses(academyId || null);

  const admissions = admissionsQ.data?.data?.admissions || [];
  const courses = coursesQ.data?.data?.courses || [];

  const totalRevenue = admissions.filter((a: any) => a.status === "confirmed").reduce((sum: number, a: any) => sum + a.fee, 0);
  const pendingRevenue = admissions.filter((a: any) => a.status === "pending").reduce((sum: number, a: any) => sum + a.fee, 0);
  const avgFee = courses.length ? courses.reduce((sum: number, c: any) => sum + c.fee, 0) / courses.length : 0;

  const feeData = courses.slice(0, 6).map((c: any) => ({ name: c.name.slice(0, 10), value: c.fee }));

  const columns = [
    {
      key: "studentName" as const,
      header: "Student",
      render: (a: any) => <span className="font-semibold text-sm">{a.studentName}</span>,
    },
    { key: "course" as const, header: "Course" },
    {
      key: "fee" as const,
      header: "Fee",
      render: (a: any) => <span className="font-semibold text-primary">{formatCurrency(a.fee)}</span>,
    },
    {
      key: "status" as const,
      header: "Payment Status",
      render: (a: any) => (
        <Badge variant={a.status === "confirmed" ? "default" : a.status === "pending" ? "outline" : "destructive"} className="capitalize text-[10px]">
          {a.status === "confirmed" ? "Paid" : a.status === "pending" ? "Pending" : "Rejected"}
        </Badge>
      ),
    },
    {
      key: "date" as const,
      header: "Date",
      render: (a: any) => formatDate(a.date),
    },
  ];

  if (myAcademyQ.isLoading || admissionsQ.isLoading) return <LoadingCards count={4} />;

  return (
    <div>
      <PageHeader
        title="Fees & Revenue"
        description="Track fee collections and revenue"
        icon={Wallet}
        actions={
          <Button variant="outline">
            <Download className="h-4 w-4 mr-1.5" /> Export Report
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Revenue" value={formatCurrency(totalRevenue)} icon={DollarSign} change={18} gradient="emerald" />
        <StatCard title="Pending Payments" value={formatCurrency(pendingRevenue)} icon={Wallet} change={-5} gradient="amber" />
        <StatCard title="Average Course Fee" value={formatCurrency(Math.round(avgFee))} icon={TrendingUp} gradient="royal" />
        <StatCard title="Active Subscriptions" value={admissions.filter((a: any) => a.status === "confirmed").length} icon={ArrowUpRight} gradient="violet" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <ChartCard title="Revenue Trend" description="Monthly revenue">
          <SimpleAreaChart data={MONTHLY_DATA} xKey="month" yKey="revenue" color="#10B981" />
        </ChartCard>
        <ChartCard title="Course Fees Comparison" description="Fee structure across courses">
          <SimpleBarChart data={feeData} xKey="name" yKey="value" color="#2563EB" />
        </ChartCard>
      </div>

      <DataTable
        data={admissions}
        columns={columns}
        searchKeys={["studentName", "course"]}
        exportFilename="fees.csv"
        emptyMessage="No fee records"
      />
    </div>
  );
}
