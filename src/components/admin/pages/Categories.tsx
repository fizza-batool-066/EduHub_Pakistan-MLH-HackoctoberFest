"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Tag, Plus, Edit2, Trash2, Folder } from "lucide-react";
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
  useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory,
} from "@/lib/hooks";

const emojiChoices = ["💻", "📚", "📊", "🗣️", "🏛️", "🎓", "🎨", "✈️", "🎯", "🚀", "🏥", "⚖️"];
const colorChoices = ["#2563EB", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#06B6D4", "#EF4444", "#14B8A6"];

export function AdminCategories() {
  const { data, isLoading } = useCategories();
  const createM = useCreateCategory();
  const updateM = useUpdateCategory();
  const deleteM = useDeleteCategory();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", icon: "💻", color: "#2563EB", description: "" });

  const categories = data?.data?.categories || [];

  const openAdd = () => {
    setEditingId(null);
    setForm({ name: "", icon: "💻", color: "#2563EB", description: "" });
    setDialogOpen(true);
  };

  const openEdit = (c: any) => {
    setEditingId(c.id);
    setForm({ name: c.name, icon: c.icon, color: c.color, description: c.description || "" });
    setDialogOpen(true);
  };

  const save = () => {
    if (!form.name) return;
    if (editingId) {
      updateM.mutate({ id: editingId, data: form }, { onSuccess: () => setDialogOpen(false) });
    } else {
      createM.mutate(form, { onSuccess: () => setDialogOpen(false) });
    }
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    deleteM.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
  };

  if (isLoading) {
    return <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{[1, 2, 3, 4].map(i => <Card key={i} className="h-32 animate-pulse bg-muted/40" />)}</div>;
  }

  return (
    <div>
      <PageHeader
        title="Academy Categories"
        description={`${categories.length} categories configured`}
        icon={Tag}
        actions={
          <Button className="gradient-royal" onClick={openAdd}>
            <Plus className="h-4 w-4 mr-1.5" /> Add Category
          </Button>
        }
      />

      {categories.length === 0 ? (
        <EmptyState
          icon={Folder}
          title="No categories yet"
          description="Create categories to organize academies on the platform."
          action={<Button className="gradient-royal" onClick={openAdd}>Add First Category</Button>}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((c: any, i: number) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card className="p-5 border-border/60 shadow-card hover:shadow-glow transition-all h-full">
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="h-12 w-12 rounded-xl flex items-center justify-center text-2xl shadow-md"
                    style={{ background: `${c.color}20`, color: c.color }}
                  >
                    {c.icon}
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => openEdit(c)}>
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive" onClick={() => setDeleteId(c.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <h4 className="font-bold text-sm mb-1">{c.name}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{c.description}</p>
                <Badge variant="secondary" className="text-[10px]">
                  <span className="h-2 w-2 rounded-full mr-1" style={{ background: c.color }} />
                  {c.slug}
                </Badge>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Category" : "Add Category"}</DialogTitle>
            <DialogDescription>
              {editingId ? "Update category details" : "Create a new academy category"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Category Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. IT & Technology" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Brief description..." />
            </div>
            <div className="space-y-2">
              <Label>Icon</Label>
              <div className="flex flex-wrap gap-2">
                {emojiChoices.map((e) => (
                  <button
                    key={e}
                    onClick={() => setForm({ ...form, icon: e })}
                    className={`h-9 w-9 rounded-lg text-lg flex items-center justify-center border transition-all ${form.icon === e ? "border-primary bg-primary/10" : "border-border hover:bg-muted"}`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {colorChoices.map((c) => (
                  <button
                    key={c}
                    onClick={() => setForm({ ...form, color: c })}
                    className={`h-9 w-9 rounded-lg border-2 transition-all ${form.color === c ? "border-primary scale-110" : "border-transparent"}`}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button className="gradient-royal" onClick={save} disabled={createM.isPending || updateM.isPending}>
              {editingId ? "Update" : "Add Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        trigger={null}
        title="Delete Category?"
        description="This will permanently remove the category. Academies using it will need to be re-categorized."
        confirmText="Delete"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
