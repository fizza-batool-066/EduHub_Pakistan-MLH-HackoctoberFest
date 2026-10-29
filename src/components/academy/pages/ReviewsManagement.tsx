"use client";

import { Star, MessageSquare, Reply } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingCards } from "@/components/common/LoadingStates";
import { useState } from "react";
import { useMyAcademy, useUpdateReview } from "@/lib/hooks";
import { timeAgo } from "@/lib/storage";
import { toast } from "sonner";

export function ReviewsManagement() {
  const myAcademyQ = useMyAcademy();
  const academy = myAcademyQ.data?.data?.academy;
  const reviews = (academy as any)?.reviews || [];
  const updateMutation = useUpdateReview();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const avgRating = academy?.rating || 0;
  const fiveStar = reviews.filter((r: any) => r.rating === 5).length;
  const replied = reviews.filter((r: any) => r.reply).length;

  const submitReply = (reviewId: string) => {
    if (!replyText.trim()) {
      toast.error("Please write a reply");
      return;
    }
    updateMutation.mutate({ id: reviewId, data: { reply: replyText } }, {
      onSuccess: () => {
        setReplyingTo(null);
        setReplyText("");
      },
    });
  };

  if (myAcademyQ.isLoading) return <LoadingCards count={3} />;

  return (
    <div>
      <PageHeader
        title="Reviews Management"
        description="View and respond to student reviews"
        icon={Star}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Reviews" value={reviews.length} icon={MessageSquare} gradient="royal" />
        <StatCard title="Average Rating" value={avgRating.toFixed(1)} icon={Star} gradient="amber" />
        <StatCard title="5 Star Reviews" value={fiveStar} icon={Star} gradient="emerald" />
        <StatCard title="Replied" value={replied} icon={Reply} gradient="violet" />
      </div>

      {reviews.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No reviews yet"
          description="Student reviews will appear here once they rate your academy."
        />
      ) : (
        <div className="space-y-3">
          {reviews.map((r: any) => (
            <Card key={r.id} className="p-5 border-border/60 shadow-card">
              <div className="flex items-start gap-3 mb-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="text-xs">
                    {r.studentName.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold text-sm">{r.studentName}</div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`h-3 w-3 ${i < r.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">{timeAgo(r.date)}</span>
                      </div>
                    </div>
                    {r.reply && <Badge variant="secondary" className="text-[10px]">Replied</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{r.comment}</p>

                  {r.reply && (
                    <div className="mt-3 p-3 rounded-lg bg-muted/40 border-l-2 border-primary">
                      <div className="text-xs font-semibold mb-1 flex items-center gap-1">
                        <Reply className="h-3 w-3" /> Academy Reply
                      </div>
                      <p className="text-xs text-muted-foreground">{r.reply}</p>
                    </div>
                  )}

                  {replyingTo === r.id ? (
                    <div className="mt-3 space-y-2">
                      <Textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        rows={2}
                        placeholder="Write your reply..."
                        className="text-sm"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" className="gradient-emerald h-7 text-xs" onClick={() => submitReply(r.id)}>
                          Post Reply
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => { setReplyingTo(null); setReplyText(""); }}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : !r.reply && (
                    <Button size="sm" variant="outline" className="mt-3 h-7 text-xs" onClick={() => setReplyingTo(r.id)}>
                      <Reply className="h-3 w-3 mr-1" /> Reply
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
