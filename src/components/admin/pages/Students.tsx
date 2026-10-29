"use client";

import { useEffect, useState } from "react";
import { Users, GraduationCap } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import { StatCard } from "@/components/common/StatCard";
import { getItem, formatDate } from "@/lib/storage";
import { Student, Academy } from "@/lib/types";

export function AdminStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [academies, setAcademies] = useState<Academy[]>([]);

  useEffect(() => {
    setStudents(getItem<Student[]>("students") || []);
    setAcademies(getItem<Academy[]>("academies") || []);
  }, []);

  const columns = [
    {
      key: "name" as const,
      header: "Student",
      render: (s: Student) => (
        <div>
          <div className="font-semibold text-sm">{s.name}</div>
          <div className="text-xs text-muted-foreground">{s.email}</div>
        </div>
      ),
    },
    { key: "rollNumber" as const, header: "Roll #" },
    { key: "course" as const, header: "Course" },
    {
      key: "academyId" as const,
      header: "Academy",
      render: (s: Student) => {
        const a = academies.find((ac) => ac.id === s.academyId);
        return <span className="text-xs">{a?.name || "—"}</span>;
      },
    },
    { key: "phone" as const, header: "Phone" },
    {
      key: "status" as const,
      header: "Status",
      render: (s: Student) => (
        <span className="text-xs capitalize px-2 py-1 rounded bg-muted">{s.status}</span>
      ),
    },
    {
      key: "admissionDate" as const,
      header: "Admission",
      render: (s: Student) => formatDate(s.admissionDate),
    },
  ];

  return (
    <div>
      <PageHeader title="All Students" description={`${students.length} students across platform`} icon={Users} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Students" value={students.length} icon={Users} gradient="royal" />
        <StatCard title="Active" value={students.filter(s => s.status === "active").length} icon={Users} gradient="emerald" />
        <StatCard title="Graduated" value={students.filter(s => s.status === "graduated").length} icon={GraduationCap} gradient="violet" />
        <StatCard title="Inactive" value={students.filter(s => s.status === "inactive").length} icon={Users} gradient="amber" />
      </div>
      <DataTable
        data={students}
        columns={columns}
        searchKeys={["name", "email", "rollNumber", "course"]}
        exportFilename="all-students.csv"
      />
    </div>
  );
}
