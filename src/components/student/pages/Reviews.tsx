"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Plus, Edit2, Trash2, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useApp } from "@/context/AppContext";
import { getItem, setItem, generateId, formatDate, timeAgo } from "@/lib/storage";
import { Academy, Review } from "@/lib/types";
import { toast } from "sonner";

export function ReviewsPage() {
  const { user, navigate } = useApp();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [academies, setAcademies] = useState<Academy[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ academyId: "", rating: 5, comment: "" });

  const refresh = () => {
    const allReviews = getItem<Review[]>("reviews") || [];
    setReviews(allReviews.filter((r) => r.studentName === user?.name));
    setAcademies(getItem<Academy[]>("academies") || []);
  };

  useEffect(() => { refresh(); }, [user]);

  const openAdd = () => {
    setEditingReview(null);
    setForm({ academyId: "", rating: 5, comment: "" });
    setDialogOpen(true);
  };

  const openEdit = (review: Review) => {
    setEditingReview(review);
    setForm({ academyId: review.academyId, rating: review.rating, comment: review.comment });
    setDialogOpen(true);
  };

  const save = () => {
    if (!form.academyId || !form.comment.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    const allReviews = getItem<Review[]>("reviews") || [];
    if (editingReview) {
      const updated = allReviews.map((r) => r.id === editingReview.id ? { ...r, ...form } : r);
      setItem("reviews", updated);
      toast.success("Review updated");
    } else {
      const newReview: Review = {
        id: generateId("rv_"),
        academyId: form.academyId,
        studentName: user!.name,
        rating: form.rating,
        comment: form.comment,
        date: new Date().toISOString(),
      };
      setItem("reviews", [newReview, ...allReviews]);
      toast.success("Review added");
    }
    setDialogOpen(false);
    refresh();
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    const allReviews = getItem<Review[]>("reviews") || [];
    setItem("reviews", allReviews.filter((r) => r.id !== deleteId));
    setDeleteId(null);
    toast.success("Review deleted");
    refresh();
  };

  return (
    <div>
      <PageHeader
        title="My Reviews"
        description={`${reviews.length} reviews written by you`}
        icon={Star}
        actions={
          <Button className="gradient-royal" onClick={openAdd}>
            <Plus className="h-4 w-4 mr-1.5" /> Add Review
          </Button>
        }
      />

      {reviews.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No reviews yet"
          description="Share your experience with academies to help other students make informed decisions."
          action={<Button className="gradient-royal" onClick={openAdd}>Write Your First Review</Button>}
        />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {reviews.map((r, i) => {
            const academy = academies.find((a) => a.id === r.academyId);
            return (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="p-5 border-border/60 shadow-card h-full flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <button
                      onClick={() => academy && navigate({ name: "academy-details", academyId: academy.id })}
                      className="flex items-center gap-3 text-left"
                    >
                      {academy && (
                        <div className="h-10 w-10 rounded-xl flex items-center justify-center text-lg" style={{ background: academy.cover }}>
                          {academy.logo}
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-sm">{academy?.name || "Unknown Academy"}</div>
                        <div className="text-xs text-muted-foreground">{formatDate(r.date)}</div>
                      </div>
                    </button>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          className={`h-4 w-4 ${idx < r.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground flex-1 mb-3">{r.comment}</p>
                  <div className="flex gap-2 justify-end">
                    <Button size="sm" variant="outline" onClick={() => openEdit(r)}>
                      <Edit2 className="h-3.5 w-3.5 mr-1" /> Edit
                    </Button>
                    <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => setDeleteId(r.id)}>
                      <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingReview ? "Edit Review" : "Write a Review"}</DialogTitle>
            <DialogDescription>
              Share your honest experience to help other students.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Academy</Label>
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto scrollbar-thin">
                {academies.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setForm({ ...form, academyId: a.id })}
                    className={`flex items-center gap-3 p-2.5 rounded-lg border text-left transition-all ${form.academyId === a.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/40"}`}
                  >
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center text-sm" style={{ background: a.cover }}>
                      {a.logo}
                    </div>
                    <div className="text-sm font-medium">{a.name}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button
                    key={r}
                    onClick={() => setForm({ ...form, rating: r })}
                    className="p-1"
                  >
                    <Star
                      className={`h-6 w-6 transition-all ${r <= form.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40 hover:text-amber-400"}`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Your Review</Label>
              <Textarea
                placeholder="Share your experience..."
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button className="gradient-royal" onClick={save}>
              {editingReview ? "Update Review" : "Submit Review"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        trigger={null}
        title="Delete Review?"
        description="This action cannot be undone. The review will be permanently removed."
        confirmText="Delete"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
