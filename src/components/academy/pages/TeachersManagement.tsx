"use client";

import { useState, useEffect } from "react";
import { GraduationCap, UserPlus, Edit2, Trash2, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { LoadingCards } from "@/components/common/LoadingStates";
import {
  useMyAcademy, useTeachers, useStudents, useCreateTeacher, useUpdateTeacher, useDeleteTeacher,
} from "@/lib/hooks";

export function TeachersManagement() {
  const myAcademyQ = useMyAcademy();
  const academy = myAcademyQ.data?.data?.academy;
  const academyId = academy?.id || "";

  const teachersQ = useTeachers(academyId || null);
  const studentsQ = useStudents(academyId || null);
  const createMutation = useCreateTeacher();
  const updateMutation = useUpdateTeacher();
  const deleteMutation = useDeleteTeacher();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewStudentsOpen, setViewStudentsOpen] = useState(false);
  const [viewingTeacher, setViewingTeacher] = useState<any>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "", qualification: "", experience: "", specialization: "",
    phone: "", email: "",
  });

  const teachers = teachersQ.data?.data?.teachers || [];
  const students = studentsQ.data?.data?.students || [];

  const openAdd = () => {
    setEditingId(null);
    setForm({ name: "", qualification: "", experience: "", specialization: "", phone: "", email: "" });
    setDialogOpen(true);
  };

  const openEdit = (t: any) => {
    setEditingId(t.id);
    setForm({
      name: t.name, qualification: t.qualification, experience: t.experience,
      specialization: t.specialization, phone: t.phone, email: t.email,
    });
    setDialogOpen(true);
  };

  const save = () => {
    if (!form.name || !form.email || !academyId) return;
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: form }, { onSuccess: () => setDialogOpen(false) });
    } else {
      createMutation.mutate({ ...form, academyId }, { onSuccess: () => setDialogOpen(false) });
    }
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId);
    setDeleteId(null);
  };

  const viewStudents = (t: any) => {
    setViewingTeacher(t);
    setViewStudentsOpen(true);
  };

  const teacherStudents = viewingTeacher
    ? students.filter((s: any) => s.teacherId === viewingTeacher.id || s.teacherName === viewingTeacher.name)
    : [];

  const columns = [
    {
      key: "name" as const,
      header: "Teacher",
      render: (t: any) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="gradient-emerald text-white text-xs">
              {t.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold text-sm">{t.name}</div>
            <div className="text-xs text-muted-foreground">{t.email}</div>
          </div>
        </div>
      ),
    },
    { key: "specialization" as const, header: "Specialization" },
    { key: "qualification" as const, header: "Qualification" },
    { key: "experience" as const, header: "Experience" },
    {
      key: "students" as const,
      header: "Students",
      render: (t: any) => {
        const count = students.filter((s: any) => s.teacherId === t.id || s.teacherName === t.name).length;
        return <span className="text-xs">{count} students</span>;
      },
    },
    {
      key: "actions" as const,
      header: "Actions",
      render: (t: any) => (
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" title="View Students" onClick={(e) => { e.stopPropagation(); viewStudents(t); }}>
            <Eye className="h-3.5 w-3.5" />
          </Button>
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={(e) => { e.stopPropagation(); openEdit(t); }}>
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive" onClick={(e) => { e.stopPropagation(); setDeleteId(t.id); }}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  if (myAcademyQ.isLoading || teachersQ.isLoading) return <LoadingCards count={4} />;

  return (
    <div>
      <PageHeader
        title="Teacher Management"
        description={`${teachers.length} teachers in your academy`}
        icon={GraduationCap}
        actions={
          <Button className="gradient-emerald" onClick={openAdd}>
            <UserPlus className="h-4 w-4 mr-1.5" /> Add Teacher
          </Button>
        }
      />

      <DataTable
        data={teachers}
        columns={columns}
        searchKeys={["name", "email", "specialization"]}
        exportFilename="teachers.csv"
        emptyMessage="No teachers added yet"
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Teacher" : "Add New Teacher"}</DialogTitle>
            <DialogDescription>
              {editingId ? "Update teacher information" : "Fill in the teacher details"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid sm:grid-cols-2 gap-4 py-2">
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Dr. John Doe" />
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="teacher@academy.edu" />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+92 300 1234567" />
            </div>
            <div className="space-y-2">
              <Label>Specialization</Label>
              <Input value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} placeholder="e.g. Cybersecurity" />
            </div>
            <div className="space-y-2">
              <Label>Qualification</Label>
              <Input value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} placeholder="MS Computer Science" />
            </div>
            <div className="space-y-2">
              <Label>Experience</Label>
              <Input value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} placeholder="10 years" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button className="gradient-emerald" onClick={save} disabled={createMutation.isPending || updateMutation.isPending}>
              {editingId ? "Update Teacher" : "Add Teacher"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={viewStudentsOpen} onOpenChange={setViewStudentsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Students Assigned to {viewingTeacher?.name}</DialogTitle>
            <DialogDescription>
              Teachers can only view and manage students assigned to them
            </DialogDescription>
          </DialogHeader>
          {teacherStudents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">No students assigned to this teacher</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[60vh] overflow-y-auto scrollbar-thin">
              {teacherStudents.map((s: any) => (
                <div key={s.id} className="flex items-center gap-3 p-3 rounded-lg border border-border/60">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center text-xs font-semibold">
                    {s.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{s.name}</div>
                    <div className="text-xs text-muted-foreground">{s.rollNumber} · {s.course}</div>
                  </div>
                  <Badge variant="outline" className="text-[10px] capitalize">{s.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        trigger={null}
        title="Remove Teacher?"
        description="This will remove the teacher from your academy."
        confirmText="Remove"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
