"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Plus, Edit2, Trash2, UserPlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { LoadingCards } from "@/components/common/LoadingStates";
import { useApp } from "@/context/AppContext";
import {
  useMyAcademy, useStudents, useTeachers, useCreateStudent, useUpdateStudent, useDeleteStudent,
} from "@/lib/hooks";
import { formatDate } from "@/lib/storage";
import { Student } from "@/lib/types";

interface StudentFormData {
  name: string;
  rollNumber: string;
  course: string;
  teacherId: string;
  teacher: string;
  phone: string;
  email: string;
  gender: "male" | "female" | "other";
  address: string;
  admissionDate: string;
  status: "active" | "inactive" | "graduated";
}

const emptyForm: StudentFormData = {
  name: "", rollNumber: "", course: "", teacherId: "", teacher: "", phone: "", email: "",
  gender: "male", address: "", admissionDate: new Date().toISOString().slice(0, 10), status: "active",
};

export function StudentsManagement() {
  const { addNotification } = useApp();
  const myAcademyQ = useMyAcademy();
  const academy = myAcademyQ.data?.data?.academy;
  const academyId = academy?.id || "";

  const studentsQ = useStudents(academyId || null);
  const teachersQ = useTeachers(academyId || null);
  const createMutation = useCreateStudent();
  const updateMutation = useUpdateStudent();
  const deleteMutation = useDeleteStudent();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<StudentFormData>(emptyForm);

  const students = studentsQ.data?.data?.students || [];
  const teachers = teachersQ.data?.data?.teachers || [];

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (student: any) => {
    setEditingId(student.id);
    setForm({
      name: student.name,
      rollNumber: student.rollNumber,
      course: student.course,
      teacherId: student.teacherId || "",
      teacher: student.teacherName || "",
      phone: student.phone,
      email: student.email,
      gender: student.gender,
      address: student.address || "",
      admissionDate: student.admissionDate,
      status: student.status,
    });
    setDialogOpen(true);
  };

  const save = () => {
    if (!form.name || !form.rollNumber || !form.email || !academyId) return;
    const teacher = teachers.find((t: any) => t.id === form.teacherId);
    const payload = {
      ...form,
      academyId,
      teacher: teacher?.name || form.teacher,
    };
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: payload }, { onSuccess: () => setDialogOpen(false) });
    } else {
      createMutation.mutate(payload, { onSuccess: () => setDialogOpen(false) });
    }
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId);
    setDeleteId(null);
  };

  const columns = [
    {
      key: "name" as const,
      header: "Student",
      render: (s: any) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center text-xs font-semibold">
            {s.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
          </div>
          <div>
            <div className="font-semibold text-sm">{s.name}</div>
            <div className="text-xs text-muted-foreground">{s.email}</div>
          </div>
        </div>
      ),
    },
    { key: "rollNumber" as const, header: "Roll #" },
    { key: "course" as const, header: "Course" },
    { key: "teacherName" as const, header: "Teacher", render: (s: any) => <span className="text-xs">{s.teacherName || "—"}</span> },
    {
      key: "gender" as const,
      header: "Gender",
      render: (s: any) => <span className="capitalize">{s.gender}</span>,
    },
    {
      key: "status" as const,
      header: "Status",
      render: (s: any) => (
        <Badge
          variant={s.status === "active" ? "default" : s.status === "graduated" ? "secondary" : "outline"}
          className="capitalize text-[10px]"
        >
          {s.status}
        </Badge>
      ),
    },
    {
      key: "actions" as const,
      header: "Actions",
      render: (s: any) => (
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={(e) => { e.stopPropagation(); openEdit(s); }}>
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive" onClick={(e) => { e.stopPropagation(); setDeleteId(s.id); }}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  if (myAcademyQ.isLoading || studentsQ.isLoading) return <LoadingCards count={4} />;

  return (
    <div>
      <PageHeader
        title="Student Management"
        description={`${students.length} students enrolled`}
        icon={Users}
        actions={
          <Button className="gradient-emerald" onClick={openAdd}>
            <UserPlus className="h-4 w-4 mr-1.5" /> Add Student
          </Button>
        }
      />

      <DataTable
        data={students}
        columns={columns}
        searchKeys={["name", "email", "rollNumber", "course"]}
        exportFilename="students.csv"
        emptyMessage="No students found"
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Student" : "Add New Student"}</DialogTitle>
            <DialogDescription>
              {editingId ? "Update student information" : "Fill in the student details to enroll them"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid sm:grid-cols-2 gap-4 py-2">
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label>Roll Number *</Label>
              <Input value={form.rollNumber} onChange={(e) => setForm({ ...form, rollNumber: e.target.value })} placeholder="COR-2024-001" />
            </div>
            <div className="space-y-2">
              <Label>Course</Label>
              <Input value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} placeholder="e.g. CCNA Routing" />
            </div>
            <div className="space-y-2">
              <Label>Assigned Teacher</Label>
              <Select value={form.teacherId} onValueChange={(v) => setForm({ ...form, teacherId: v })}>
                <SelectTrigger><SelectValue placeholder="Select teacher" /></SelectTrigger>
                <SelectContent>
                  {teachers.map((t: any) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+92 300 1234567" />
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="student@example.com" />
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select value={form.gender} onValueChange={(v: any) => setForm({ ...form, gender: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v: any) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="graduated">Graduated</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Address</Label>
              <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="House #, Street, Area, City" />
            </div>
            <div className="space-y-2">
              <Label>Admission Date</Label>
              <Input type="date" value={form.admissionDate} onChange={(e) => setForm({ ...form, admissionDate: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button
              className="gradient-emerald"
              onClick={save}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {editingId ? "Update Student" : "Add Student"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        trigger={null}
        title="Delete Student?"
        description="This will permanently remove the student record."
        confirmText="Delete"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
