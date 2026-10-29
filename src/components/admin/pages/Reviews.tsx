"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import { getItem, formatDate } from "@/lib/storage";
import { Review, Academy } from "@/lib/types";

export function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [academies, setAcademies] = useState<Academy[]>([]);

  useEffect(() => {
    setReviews(getItem<Review[]>("reviews") || []);
    setAcademies(getItem<Academy[]>("academies") || []);
  }, []);

  const columns = [
    {
      key: "studentName" as const,
      header: "Student",
      render: (r: Review) => <span className="font-semibold text-sm">{r.studentName}</span>,
    },
    {
      key: "academyId" as const,
      header: "Academy",
      render: (r: Review) => {
        const a = academies.find((ac) => ac.id === r.academyId);
        return <span className="text-xs">{a?.name || "—"}</span>;
      },
    },
    {
      key: "rating" as const,
      header: "Rating",
      render: (r: Review) => (
        <div className="flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`h-3 w-3 ${i < r.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
          ))}
        </div>
      ),
    },
    {
      key: "comment" as const,
      header: "Comment",
      render: (r: Review) => <span className="text-xs line-clamp-1">{r.comment}</span>,
    },
    {
      key: "date" as const,
      header: "Date",
      render: (r: Review) => formatDate(r.date),
    },
  ];

  return (
    <div>
      <PageHeader title="All Reviews" description={`${reviews.length} reviews on platform`} icon={Star} />
      <DataTable
        data={reviews}
        columns={columns}
        searchKeys={["studentName", "comment"]}
        exportFilename="all-reviews.csv"
      />
    </div>
  );
}
