"use client";

import { ClipboardList, Check, X, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { DataTable } from "@/components/common/DataTable";
import { LoadingCards } from "@/components/common/LoadingStates";
import {
  useMyAcademy, useAdmissions, useInquiries, useUpdateAdmission, useUpdateInquiry,
} from "@/lib/hooks";
import { formatDate } from "@/lib/storage";

export function AdmissionsManagement() {
  const myAcademyQ = useMyAcademy();
  const academy = myAcademyQ.data?.data?.academy;
  const academyId = academy?.id || "";

  const admissionsQ = useAdmissions(academyId || null);
  const inquiriesQ = useInquiries(academyId || null);
  const updateAdmission = useUpdateAdmission();
  const updateInquiry = useUpdateInquiry();

  const admissions = admissionsQ.data?.data?.admissions || [];
  const inquiries = inquiriesQ.data?.data?.inquiries || [];

  const pendingAdmissions = admissions.filter((a: any) => a.status === "pending").length;
  const confirmedAdmissions = admissions.filter((a: any) => a.status === "confirmed").length;
  const pendingInquiries = inquiries.filter((i: any) => i.status === "pending").length;

  if (myAcademyQ.isLoading || admissionsQ.isLoading) return <LoadingCards count={4} />;

  const admissionColumns = [
    {
      key: "studentName" as const,
      header: "Student",
      render: (a: any) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center text-xs font-semibold">
            {a.studentName.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
          </div>
          <span className="font-semibold text-sm">{a.studentName}</span>
        </div>
      ),
    },
    { key: "course" as const, header: "Course" },
    {
      key: "fee" as const,
      header: "Fee",
      render: (a: any) => <span className="font-semibold">Rs {a.fee.toLocaleString()}</span>,
    },
    {
      key: "status" as const,
      header: "Status",
      render: (a: any) => (
        <Badge variant={a.status === "confirmed" ? "default" : a.status === "pending" ? "outline" : "destructive"} className="capitalize text-[10px]">
          {a.status}
        </Badge>
      ),
    },
    { key: "date" as const, header: "Date", render: (a: any) => formatDate(a.date) },
    {
      key: "actions" as const,
      header: "Actions",
      render: (a: any) => a.status === "pending" ? (
        <div className="flex gap-1">
          <Button size="sm" variant="outline" className="h-7 text-xs text-emerald-600 border-emerald-600/30 hover:bg-emerald-50" onClick={(e) => { e.stopPropagation(); updateAdmission.mutate({ id: a.id, status: "confirmed" }); }}>
            <Check className="h-3 w-3 mr-1" /> Confirm
          </Button>
          <Button size="sm" variant="outline" className="h-7 text-xs text-destructive border-destructive/30 hover:bg-destructive/10" onClick={(e) => { e.stopPropagation(); updateAdmission.mutate({ id: a.id, status: "rejected" }); }}>
            <X className="h-3 w-3 mr-1" /> Reject
          </Button>
        </div>
      ) : <span className="text-xs text-muted-foreground">—</span>,
    },
  ];

  const inquiryColumns = [
    {
      key: "studentName" as const,
      header: "Inquirer",
      render: (i: any) => (
        <div>
          <div className="font-semibold text-sm">{i.studentName}</div>
          <div className="text-xs text-muted-foreground">{i.email}</div>
        </div>
      ),
    },
    { key: "course" as const, header: "Course" },
    {
      key: "message" as const,
      header: "Message",
      render: (i: any) => <span className="text-xs line-clamp-1">{i.message}</span>,
    },
    {
      key: "status" as const,
      header: "Status",
      render: (i: any) => (
        <Badge variant={i.status === "pending" ? "outline" : i.status === "responded" ? "secondary" : "default"} className="capitalize text-[10px]">
          {i.status}
        </Badge>
      ),
    },
    {
      key: "actions" as const,
      header: "Actions",
      render: (i: any) => i.status === "pending" ? (
        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={(e) => { e.stopPropagation(); updateInquiry.mutate({ id: i.id, status: "responded" }); }}>
          <Check className="h-3 w-3 mr-1" /> Mark Responded
        </Button>
      ) : <span className="text-xs text-muted-foreground">—</span>,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Admissions & Inquiries"
        description="Manage student admissions and inquiries"
        icon={ClipboardList}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Pending Admissions" value={pendingAdmissions} icon={Clock} gradient="amber" />
        <StatCard title="Confirmed Admissions" value={confirmedAdmissions} icon={Check} gradient="emerald" />
        <StatCard title="Pending Inquiries" value={pendingInquiries} icon={ClipboardList} gradient="royal" />
        <StatCard title="Total Inquiries" value={inquiries.length} icon={ClipboardList} gradient="violet" />
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Admissions</h3>
          <DataTable
            data={admissions}
            columns={admissionColumns}
            searchKeys={["studentName", "course"]}
            exportFilename="admissions.csv"
            emptyMessage="No admission requests"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Inquiries</h3>
          <DataTable
            data={inquiries}
            columns={inquiryColumns}
            searchKeys={["studentName", "course", "email"]}
            exportFilename="inquiries.csv"
            emptyMessage="No inquiries received"
          />
        </div>
      </div>
    </div>
  );
}
