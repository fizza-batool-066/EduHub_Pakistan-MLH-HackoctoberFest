"use client";

import { useEffect, useState } from "react";
import { GraduationCap } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import { getItem } from "@/lib/storage";
import { Teacher, Academy } from "@/lib/types";

export function AdminTeachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [academies, setAcademies] = useState<Academy[]>([]);

  useEffect(() => {
    setTeachers(getItem<Teacher[]>("teachers") || []);
    setAcademies(getItem<Academy[]>("academies") || []);
  }, []);

  const columns = [
    {
      key: "name" as const,
      header: "Teacher",
      render: (t: Teacher) => (
        <div>
          <div className="font-semibold text-sm">{t.name}</div>
          <div className="text-xs text-muted-foreground">{t.email}</div>
        </div>
      ),
    },
    { key: "specialization" as const, header: "Specialization" },
    {
      key: "academyId" as const,
      header: "Academy",
      render: (t: Teacher) => {
        const a = academies.find((ac) => ac.id === t.academyId);
        return <span className="text-xs">{a?.name || "—"}</span>;
      },
    },
    { key: "experience" as const, header: "Experience" },
    {
      key: "assignedCourses" as const,
      header: "Courses",
      render: (t: Teacher) => <span className="text-xs">{t.assignedCourses.length} courses</span>,
    },
    {
      key: "assignedStudents" as const,
      header: "Students",
      render: (t: Teacher) => <span className="text-xs">{t.assignedStudents.length} students</span>,
    },
  ];

  return (
    <div>
      <PageHeader title="All Teachers" description={`${teachers.length} teachers across platform`} icon={GraduationCap} />
      <DataTable
        data={teachers}
        columns={columns}
        searchKeys={["name", "email", "specialization"]}
        exportFilename="all-teachers.csv"
      />
    </div>
  );
}
