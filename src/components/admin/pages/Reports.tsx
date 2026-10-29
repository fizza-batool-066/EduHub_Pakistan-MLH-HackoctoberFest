"use client";

import { useEffect, useState } from "react";
import { FileText, Users, GraduationCap, Star, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { ChartCard, SimpleBarChart, SimplePieChart } from "@/components/common/Charts";
import { getItem } from "@/lib/storage";
import { Academy, Student, Teacher, Course, Review } from "@/lib/types";
import { CATEGORY_DISTRIBUTION, RATING_DISTRIBUTION } from "@/lib/sampleData";

export function AdminReports() {
  const [academies, setAcademies] = useState<Academy[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    setAcademies(getItem<Academy[]>("academies") || []);
    setStudents(getItem<Student[]>("students") || []);
    setTeachers(getItem<Teacher[]>("teachers") || []);
    setCourses(getItem<Course[]>("courses") || []);
    setReviews(getItem<Review[]>("reviews") || []);
  }, []);

  return (
    <div>
      <PageHeader title="Platform Reports" description="Comprehensive platform statistics" icon={FileText} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Academies" value={academies.length} icon={BookOpen} gradient="royal" />
        <StatCard title="Students" value={students.length} icon={Users} gradient="emerald" />
        <StatCard title="Teachers" value={teachers.length} icon={GraduationCap} gradient="violet" />
        <StatCard title="Reviews" value={reviews.length} icon={Star} gradient="amber" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <ChartCard title="Rating Distribution" description="All platform reviews">
          <SimpleBarChart data={RATING_DISTRIBUTION} xKey="name" yKey="value" color="#F59E0B" />
        </ChartCard>
        <ChartCard title="Academy Categories" description="Distribution">
          <SimplePieChart data={CATEGORY_DISTRIBUTION} />
        </ChartCard>
      </div>

      <Card className="p-5 mt-4 border-border/60 shadow-card">
        <h3 className="font-semibold mb-4">Top Academies by Students</h3>
        <div className="space-y-3">
          {[...academies].sort((a, b) => b.totalStudents - a.totalStudents).slice(0, 8).map((a, i) => (
            <div key={a.id} className="flex items-center gap-3">
              <div className="text-sm font-bold w-6">#{i + 1}</div>
              <div className="h-8 w-8 rounded-lg flex items-center justify-center text-sm" style={{ background: a.cover }}>
                {a.logo}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm">{a.name}</div>
                <div className="text-xs text-muted-foreground">{a.city}</div>
              </div>
              <div className="text-sm font-bold">{a.totalStudents}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
