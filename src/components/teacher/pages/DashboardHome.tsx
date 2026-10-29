"use client";

import { motion } from "framer-motion";
import {
  Users, Calendar, ClipboardCheck, TrendingUp, Activity, Clock,
  BookOpen, CheckCircle2, XCircle, AlertCircle, GraduationCap,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { ChartCard, SimpleBarChart, SimpleAreaChart, ProgressBar, RadialProgress } from "@/components/common/Charts";
import { DataTable } from "@/components/common/DataTable";
import { LoadingDashboard } from "@/components/common/LoadingStates";
import { useApp } from "@/context/AppContext";
import { useTeacherStudents } from "@/lib/hooks";
import { Student } from "@/lib/types";
import { MONTHLY_DATA } from "@/lib/sampleData";

export function TeacherDashboardHome({ initialTab = "dashboard" }: { initialTab?: string }) {
  const { user } = useApp();
  const { data, isLoading } = useTeacherStudents();
  const students: Student[] = data?.data?.students || [];

  if (isLoading) return <LoadingDashboard />;

  const todayClasses = [
    { id: 1, course: students[0]?.course || "Class", time: "9:00 AM - 11:00 AM", room: "Lab 1", students: students.length, status: "completed" },
    { id: 2, course: students[0]?.course || "Class", time: "1:00 PM - 3:00 PM", room: "Lab 2", students: Math.max(1, Math.floor(students.length / 2)), status: "ongoing" },
    { id: 3, course: students[0]?.course || "Class", time: "5:00 PM - 7:00 PM", room: "Lab 1", students: students.length, status: "upcoming" },
  ];

  const recentActivities = [
    { id: 1, type: "assignment", title: "Graded 15 assignments", time: "2 hours ago", icon: CheckCircle2, color: "text-emerald-500" },
    { id: 2, type: "attendance", title: "Marked attendance for morning batch", time: "4 hours ago", icon: ClipboardCheck, color: "text-blue-500" },
    { id: 3, type: "student", title: `${students.length} students assigned to you`, time: "1 day ago", icon: Users, color: "text-violet-500" },
    { id: 4, type: "alert", title: "3 students absent today", time: "1 day ago", icon: AlertCircle, color: "text-amber-500" },
    { id: 5, type: "assignment", title: "Created new assignment: Module 3 Quiz", time: "2 days ago", icon: BookOpen, color: "text-blue-500" },
  ];

  const studentColumns = [
    {
      key: "name" as const,
      header: "Student",
      render: (s: Student) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs text-white" style={{ background: "linear-gradient(135deg, #8B5CF6, #6D28D9)" }}>
              {s.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold text-sm">{s.name}</div>
            <div className="text-xs text-muted-foreground">{s.rollNumber}</div>
          </div>
        </div>
      ),
    },
    { key: "course" as const, header: "Course" },
    { key: "phone" as const, header: "Phone" },
    {
      key: "status" as const,
      header: "Status",
      render: (s: Student) => (
        <Badge variant="outline" className="capitalize text-[10px]">{s.status}</Badge>
      ),
    },
    {
      key: "progress" as const,
      header: "Progress",
      render: (s: Student) => (
        <div className="w-32">
          <ProgressBar value={s.progress || 75} color="#8B5CF6" />
        </div>
      ),
    },
    {
      key: "attendance" as const,
      header: "Attendance",
      render: (s: Student) => (
        <div className="w-24">
          <ProgressBar value={s.attendance || 85} color="#10B981" />
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title={`Hello, ${user?.name?.split(" ")[0] || "Teacher"}!`}
        description="Your teaching dashboard — manage assigned students, attendance, and performance"
        icon={GraduationCap}
      />

      <Tabs defaultValue={initialTab === "dashboard" ? "overview" : initialTab}>
        <TabsList className="w-full justify-start overflow-x-auto scrollbar-thin h-auto mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">My Students</TabsTrigger>
          <TabsTrigger value="classes">Today's Classes</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="My Students" value={students.length} icon={Users} gradient="violet" />
            <StatCard title="Today's Classes" value={todayClasses.length} icon={Calendar} gradient="royal" />
            <StatCard title="Active Courses" value={new Set(students.map(s => s.course)).size} icon={BookOpen} gradient="emerald" />
            <StatCard title="Avg Attendance" value="87%" icon={ClipboardCheck} gradient="amber" />
          </div>

          <div className="grid lg:grid-cols-3 gap-4">
            <ChartCard title="Student Progress" description="Class average performance" className="lg:col-span-2">
              <SimpleAreaChart data={MONTHLY_DATA.slice(0, 6)} xKey="month" yKey="enrollments" color="#8B5CF6" />
            </ChartCard>
            <Card className="p-5 border-border/60 shadow-card">
              <h3 className="font-semibold mb-4">Class Average</h3>
              <div className="flex justify-center mb-3">
                <RadialProgress value={82} color="#8B5CF6" label="Performance" />
              </div>
              <div className="text-center text-xs text-muted-foreground">
                <span className="text-emerald-600 font-semibold">+4%</span> from last month
              </div>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <Card className="p-5 border-border/60 shadow-card">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" /> Today's Classes
              </h3>
              <div className="space-y-2">
                {todayClasses.map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-3 rounded-lg border border-border/60">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-violet-500/10 text-violet-500">
                        <BookOpen className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{c.course}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {c.time} · {c.room}
                        </div>
                      </div>
                    </div>
                    <Badge variant={c.status === "completed" ? "secondary" : c.status === "ongoing" ? "default" : "outline"} className="text-[10px] capitalize">
                      {c.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5 border-border/60 shadow-card">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Activity className="h-4 w-4 text-emerald-500" /> Recent Activities
              </h3>
              <div className="space-y-3">
                {recentActivities.slice(0, 5).map((a) => (
                  <div key={a.id} className="flex items-start gap-2">
                    <a.icon className={`h-4 w-4 ${a.color} mt-0.5 flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm">{a.title}</div>
                      <div className="text-xs text-muted-foreground">{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Students */}
        <TabsContent value="students">
          <Card className="p-5 mb-4 border-border/60 shadow-card">
            <div className="flex items-start gap-3">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-white text-xl" style={{ background: "linear-gradient(135deg, #8B5CF6, #6D28D9)" }}>
                  {user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2) || "T"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold text-lg">{user?.name}</h3>
                <p className="text-sm text-muted-foreground">Teacher account</p>
                <div className="text-xs text-muted-foreground mt-1">Access limited to students assigned to you</div>
              </div>
            </div>
          </Card>
          <DataTable
            data={students}
            columns={studentColumns}
            searchKeys={["name", "rollNumber", "course"]}
            exportFilename="my-students.csv"
            emptyMessage="No students assigned to you yet"
          />
        </TabsContent>

        {/* Classes */}
        <TabsContent value="classes" className="space-y-4">
          <h3 className="text-lg font-semibold">Today's Schedule</h3>
          {todayClasses.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="p-5 border-border/60 shadow-card">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-3 rounded-xl bg-violet-500/10 text-violet-500">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{c.course}</h4>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <Clock className="h-3.5 w-3.5" /> {c.time}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{c.room} · {c.students} students</div>
                    </div>
                  </div>
                  <Badge variant={c.status === "completed" ? "secondary" : c.status === "ongoing" ? "default" : "outline"} className="capitalize">
                    {c.status}
                  </Badge>
                </div>
                {c.status === "ongoing" && (
                  <Button size="sm" className="mt-3 text-white" style={{ background: "linear-gradient(135deg, #8B5CF6, #6D28D9)" }}>
                    <ClipboardCheck className="h-3.5 w-3.5 mr-1.5" /> Mark Attendance
                  </Button>
                )}
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        {/* Attendance */}
        <TabsContent value="attendance" className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Present Today" value={Math.max(0, students.length - 3)} icon={CheckCircle2} gradient="emerald" />
            <StatCard title="Absent" value={Math.min(3, students.length)} icon={XCircle} gradient="pink" />
            <StatCard title="Late" value={2} icon={Clock} gradient="amber" />
            <StatCard title="Rate" value="87%" icon={TrendingUp} gradient="royal" />
          </div>
          <Card className="p-5 border-border/60 shadow-card">
            <h3 className="font-semibold mb-4">Weekly Attendance</h3>
            <SimpleBarChart
              data={[
                { day: "Mon", value: Math.max(1, students.length - 2) }, { day: "Tue", value: Math.max(1, students.length - 3) },
                { day: "Wed", value: students.length }, { day: "Thu", value: Math.max(1, students.length - 1) },
                { day: "Fri", value: Math.max(1, students.length - 4) }, { day: "Sat", value: Math.max(1, students.length - 5) },
              ]}
              xKey="day"
              yKey="value"
              color="#8B5CF6"
            />
          </Card>
        </TabsContent>

        {/* Performance */}
        <TabsContent value="performance" className="space-y-4">
          <div className="grid lg:grid-cols-3 gap-4">
            <Card className="p-5 border-border/60 shadow-card">
              <h3 className="font-semibold mb-4">Class Average</h3>
              <RadialProgress value={82} color="#8B5CF6" label="Performance" />
            </Card>
            <Card className="p-5 border-border/60 shadow-card">
              <h3 className="font-semibold mb-4">Assignment Submission</h3>
              <RadialProgress value={91} color="#10B981" label="On Time" />
            </Card>
            <Card className="p-5 border-border/60 shadow-card">
              <h3 className="font-semibold mb-4">Student Satisfaction</h3>
              <RadialProgress value={94} color="#2563EB" label="Rating" />
            </Card>
          </div>
          <ChartCard title="Student Progress Over Time" description="Average scores by month">
            <SimpleAreaChart data={MONTHLY_DATA} xKey="month" yKey="enrollments" color="#8B5CF6" />
          </ChartCard>
        </TabsContent>

        {/* Activities */}
        <TabsContent value="activities">
          <Card className="p-5 border-border/60 shadow-card">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-500" /> Recent Activities
            </h3>
            <div className="space-y-3">
              {recentActivities.map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3 p-3 rounded-lg border border-border/60"
                >
                  <div className={`p-2 rounded-lg bg-muted ${a.color}`}>
                    <a.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{a.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{a.time}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
