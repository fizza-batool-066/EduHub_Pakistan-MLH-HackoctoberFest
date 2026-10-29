"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Plus, Edit2, Trash2, Users, Clock, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/common/PageHeader";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { LoadingCards } from "@/components/common/LoadingStates";
import { EmptyState } from "@/components/common/EmptyState";
import {
  useMyAcademy, useCourses, useTeachers, useCreateCourse, useUpdateCourse, useDeleteCourse,
} from "@/lib/hooks";
import { formatCurrency } from "@/lib/storage";

export function CoursesManagement() {
  const myAcademyQ = useMyAcademy();
  const academy = myAcademyQ.data?.data?.academy;
  const academyId = academy?.id || "";

  const coursesQ = useCourses(academyId || null);
  const teachersQ = useTeachers(academyId || null);
  const createMutation = useCreateCourse();
  const updateMutation = useUpdateCourse();
  const deleteMutation = useDeleteCourse();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "", duration: "", fee: 0, description: "", instructor: "",
    seats: 30, status: "active", category: "",
  });

  const courses = coursesQ.data?.data?.courses || [];
  const teachers = teachersQ.data?.data?.teachers || [];

  const openAdd = () => {
    setEditingId(null);
    setForm({ name: "", duration: "", fee: 0, description: "", instructor: "", seats: 30, status: "active", category: "" });
    setDialogOpen(true);
  };

  const openEdit = (c: any) => {
    setEditingId(c.id);
    setForm({
      name: c.name, duration: c.duration, fee: c.fee, description: c.description,
      instructor: c.instructor, seats: c.seats, status: c.status, category: c.category,
    });
    setDialogOpen(true);
  };

  const save = () => {
    if (!form.name || !form.duration || !academyId) return;
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

  if (myAcademyQ.isLoading || coursesQ.isLoading) return <LoadingCards count={3} />;

  return (
    <div>
      <PageHeader
        title="Course Management"
        description={`${courses.length} courses offered`}
        icon={BookOpen}
        actions={
          <Button className="gradient-emerald" onClick={openAdd}>
            <Plus className="h-4 w-4 mr-1.5" /> Add Course
          </Button>
        }
      />

      {courses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses added yet"
          description="Add courses to attract students"
          action={<Button className="gradient-emerald" onClick={openAdd}>Add First Course</Button>}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((c: any, i: number) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="p-5 border-border/60 shadow-card hover:shadow-glow transition-all h-full flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="secondary" className="text-[10px]">{c.category || "General"}</Badge>
                  <Badge
                    variant={c.status === "active" ? "default" : c.status === "full" ? "destructive" : "outline"}
                    className="text-[10px] capitalize"
                  >
                    {c.status}
                  </Badge>
                </div>
                <h4 className="font-bold text-sm mb-2">{c.name}</h4>
                <p className="text-xs text-muted-foreground flex-1 line-clamp-2 mb-3">{c.description}</p>
                <div className="space-y-1.5 text-xs mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-muted-foreground" /> {c.duration}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-3 w-3 text-muted-foreground" /> {c.enrolled}/{c.seats} enrolled
                  </div>
                  <div className="flex items-center gap-2">
                    <Wallet className="h-3 w-3 text-muted-foreground" /> <span className="font-semibold text-primary">{formatCurrency(c.fee)}</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mb-3 pb-3 border-b border-border/60">
                  Instructor: <span className="font-semibold text-foreground">{c.instructor}</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 h-8" onClick={() => openEdit(c)}>
                    <Edit2 className="h-3.5 w-3.5 mr-1" /> Edit
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-destructive" onClick={() => setDeleteId(c.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Course" : "Add New Course"}</DialogTitle>
            <DialogDescription>
              {editingId ? "Update course details" : "Create a new course offering"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Course Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. CCNA Routing" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Duration *</Label>
                <Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="6 months" />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Networking" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Fee (Rs)</Label>
                <Input type="number" value={form.fee} onChange={(e) => setForm({ ...form, fee: +e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Total Seats</Label>
                <Input type="number" value={form.seats} onChange={(e) => setForm({ ...form, seats: +e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Instructor</Label>
              <Select value={form.instructor} onValueChange={(v) => setForm({ ...form, instructor: v })}>
                <SelectTrigger><SelectValue placeholder="Select instructor" /></SelectTrigger>
                <SelectContent>
                  {teachers.map((t: any) => <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>)}
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
                  <SelectItem value="full">Full</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Course description..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button className="gradient-emerald" onClick={save} disabled={createMutation.isPending || updateMutation.isPending}>
              {editingId ? "Update Course" : "Add Course"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        trigger={null}
        title="Delete Course?"
        description="This will permanently remove the course."
        confirmText="Delete"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
