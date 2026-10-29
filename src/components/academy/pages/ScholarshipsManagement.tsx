"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Award, Plus, Edit2, Trash2, Calendar, Users, Gift } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import {
  useMyAcademy, useScholarships, useCreateScholarship, useUpdateScholarship, useDeleteScholarship,
} from "@/lib/hooks";

interface ScholarshipForm {
  title: string;
  description: string;
  amount: string;
  eligibility: string;
  deadline: string;
  status: string;
}

const emptyForm: ScholarshipForm = {
  title: "", description: "", amount: "", eligibility: "", deadline: "", status: "active",
};

export function ScholarshipsManagement() {
  const myAcademyQ = useMyAcademy();
  const academy = myAcademyQ.data?.data?.academy;
  const { data, isLoading } = useScholarships(academy?.id || null);
  const createM = useCreateScholarship();
  const updateM = useUpdateScholarship();
  const deleteM = useDeleteScholarship();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<ScholarshipForm>(emptyForm);

  const scholarships = data?.data?.scholarships || [];

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (s: any) => {
    setEditingId(s.id);
    setForm({
      title: s.title, description: s.description, amount: s.amount,
      eligibility: s.eligibility, deadline: s.deadline, status: s.status,
    });
    setDialogOpen(true);
  };

  const save = () => {
    if (!form.title || !form.amount || !form.description) {
      return;
    }
    const payload = { ...form, academyId: academy?.id };
    if (editingId) {
      updateM.mutate({ id: editingId, data: form }, { onSuccess: () => setDialogOpen(false) });
    } else {
      createM.mutate(payload, { onSuccess: () => setDialogOpen(false) });
    }
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    deleteM.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
  };

  if (isLoading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="h-48 animate-pulse bg-muted/40" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Scholarships & Financial Aid"
        description={`${scholarships.length} scholarship offers published`}
        icon={Award}
        actions={
          <Button className="gradient-emerald" onClick={openAdd}>
            <Plus className="h-4 w-4 mr-1.5" /> Add Scholarship
          </Button>
        }
      />

      {scholarships.length === 0 ? (
        <EmptyState
          icon={Gift}
          title="No scholarships yet"
          description="Offer scholarships to attract talented students and build your academy's reputation."
          action={<Button className="gradient-emerald" onClick={openAdd}>Add First Scholarship</Button>}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {scholarships.map((s: any, i: number) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="p-5 border-border/60 shadow-card hover:shadow-glow transition-all h-full flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 text-white shadow-md">
                    <Award className="h-5 w-5" />
                  </div>
                  <Badge variant={s.status === "active" ? "default" : "outline"} className="text-[10px] capitalize">
                    {s.status}
                  </Badge>
                </div>
                <h4 className="font-bold text-sm mb-1">{s.title}</h4>
                <div className="text-lg font-bold gradient-text mb-2">{s.amount}</div>
                <p className="text-xs text-muted-foreground flex-1 mb-3 line-clamp-2">{s.description}</p>
                <div className="space-y-1.5 text-xs mb-3 pb-3 border-b border-border/60">
                  <div className="flex items-start gap-1.5">
                    <Users className="h-3 w-3 text-muted-foreground mt-0.5" />
                    <span>{s.eligibility}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span>Deadline: {s.deadline}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 h-8 text-xs" onClick={() => openEdit(s)}>
                    <Edit2 className="h-3 w-3 mr-1" /> Edit
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-destructive" onClick={() => setDeleteId(s.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Scholarship" : "Add Scholarship"}</DialogTitle>
            <DialogDescription>
              {editingId ? "Update scholarship details" : "Create a new scholarship offer for students"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Scholarship Title *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Merit Scholarship 2024" />
            </div>
            <div className="space-y-2">
              <Label>Amount / Discount *</Label>
              <Input value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="e.g. 50% Fee Waiver" />
            </div>
            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Describe the scholarship..." />
            </div>
            <div className="space-y-2">
              <Label>Eligibility Criteria</Label>
              <Input value={form.eligibility} onChange={(e) => setForm({ ...form, eligibility: e.target.value })} placeholder="e.g. 85%+ marks in matric" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Deadline</Label>
                <Input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <select
                  className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button className="gradient-emerald" onClick={save} disabled={createM.isPending || updateM.isPending}>
              {editingId ? "Update" : "Add Scholarship"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        trigger={null}
        title="Delete Scholarship?"
        description="This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
