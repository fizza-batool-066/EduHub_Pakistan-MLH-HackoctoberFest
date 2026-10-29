"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Megaphone, Plus, Edit2, Trash2, Send, Eye, EyeOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/common/PageHeader";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingCards } from "@/components/common/LoadingStates";
import {
  useMyAcademy, useAnnouncements, useCreateAnnouncement, useUpdateAnnouncement, useDeleteAnnouncement,
} from "@/lib/hooks";
import { formatDate, timeAgo } from "@/lib/storage";

export function AnnouncementsManagement() {
  const myAcademyQ = useMyAcademy();
  const academy = myAcademyQ.data?.data?.academy;
  const academyId = academy?.id || "";

  const announcementsQ = useAnnouncements(academyId || null);
  const createMutation = useCreateAnnouncement();
  const updateMutation = useUpdateAnnouncement();
  const deleteMutation = useDeleteAnnouncement();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", content: "", published: true });

  const announcements = announcementsQ.data?.data?.announcements || [];

  const openAdd = () => {
    setEditingId(null);
    setForm({ title: "", content: "", published: true });
    setDialogOpen(true);
  };

  const openEdit = (a: any) => {
    setEditingId(a.id);
    setForm({ title: a.title, content: a.content, published: a.published });
    setDialogOpen(true);
  };

  const save = () => {
    if (!form.title || !form.content || !academyId) return;
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

  if (myAcademyQ.isLoading || announcementsQ.isLoading) return <LoadingCards count={3} />;

  return (
    <div>
      <PageHeader
        title="Announcements"
        description={`${announcements.length} announcements · ${announcements.filter((a: any) => a.published).length} published`}
        icon={Megaphone}
        actions={
          <Button className="gradient-emerald" onClick={openAdd}>
            <Plus className="h-4 w-4 mr-1.5" /> New Announcement
          </Button>
        }
      />

      {announcements.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="No announcements yet"
          description="Keep your students informed about new batches, schedule changes, and events."
          action={<Button className="gradient-emerald" onClick={openAdd}>Create First Announcement</Button>}
        />
      ) : (
        <div className="space-y-3">
          {announcements.map((a: any, i: number) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="p-5 border-border/60 shadow-card">
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-xl ${a.published ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"}`}>
                    <Megaphone className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-semibold text-sm">{a.title}</h4>
                      <Badge variant={a.published ? "default" : "outline"} className="text-[10px]">
                        {a.published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{a.content}</p>
                    <div className="text-xs text-muted-foreground">{timeAgo(a.date)} · {formatDate(a.date)}</div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0"
                      title={a.published ? "Unpublish" : "Publish"}
                      onClick={() => updateMutation.mutate({ id: a.id, data: { published: !a.published } })}
                    >
                      {a.published ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => openEdit(a)}>
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive" onClick={() => setDeleteId(a.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Announcement" : "New Announcement"}</DialogTitle>
            <DialogDescription>
              {editingId ? "Update announcement details" : "Create a new announcement for your students"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. New Batch Starting Nov 1st" />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={4} placeholder="Write your announcement..." />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-border/60">
              <div>
                <Label className="cursor-pointer">Publish immediately</Label>
                <p className="text-xs text-muted-foreground">Students will see this announcement</p>
              </div>
              <Switch checked={form.published} onCheckedChange={(v) => setForm({ ...form, published: v })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button className="gradient-emerald" onClick={save} disabled={createMutation.isPending || updateMutation.isPending}>
              <Send className="h-4 w-4 mr-1.5" /> {editingId ? "Update" : "Publish"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        trigger={null}
        title="Delete Announcement?"
        description="This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
