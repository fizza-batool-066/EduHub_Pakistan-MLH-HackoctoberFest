"use client";

import { useState } from "react";
import { Building2, Star, Users, MapPin, BadgeCheck, Eye, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import { LoadingCards } from "@/components/common/LoadingStates";
import { useApp } from "@/context/AppContext";
import { useAcademies } from "@/lib/hooks";
import { api } from "@/lib/api-client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function AdminAcademies() {
  const { navigate } = useApp();
  const qc = useQueryClient();
  const { data, isLoading } = useAcademies({ limit: 100 });
  const academies = data?.data?.academies || [];

  const toggleVerify = async (id: string, current: boolean) => {
    try {
      await api.patch(`/academies/${id}`, { verified: !current });
      toast.success("Verification status updated");
      qc.invalidateQueries({ queryKey: ["academies"] });
    } catch (e: any) {
      toast.error(e.message || "Failed to update");
    }
  };

  const columns = [
    {
      key: "name" as const,
      header: "Academy",
      render: (a: any) => (
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg flex items-center justify-center text-base" style={{ background: a.coverColor }}>
            {a.logo}
          </div>
          <div>
            <div className="font-semibold text-sm">{a.name}</div>
            <div className="text-xs text-muted-foreground">{a.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "city" as const,
      header: "Location",
      render: (a: any) => (
        <div className="flex items-center gap-1 text-xs">
          <MapPin className="h-3 w-3 text-muted-foreground" /> {a.area}, {a.city}
        </div>
      ),
    },
    { key: "category" as const, header: "Category" },
    {
      key: "rating" as const,
      header: "Rating",
      render: (a: any) => (
        <div className="flex items-center gap-1 text-xs">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {a.rating} ({a.reviewsCount})
        </div>
      ),
    },
    {
      key: "totalStudents" as const,
      header: "Students",
      render: (a: any) => (
        <div className="flex items-center gap-1 text-xs">
          <Users className="h-3 w-3 text-muted-foreground" /> {a.totalStudents}
        </div>
      ),
    },
    {
      key: "verified" as const,
      header: "Status",
      render: (a: any) => (
        <Badge variant={a.verified ? "default" : "outline"} className="text-[10px]">
          {a.verified ? "Verified" : "Pending"}
        </Badge>
      ),
    },
    {
      key: "actions" as const,
      header: "Actions",
      render: (a: any) => (
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" title="View" onClick={(e) => { e.stopPropagation(); navigate({ name: "academy-details", academyId: a.id }); }}>
            <Eye className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs"
            onClick={(e) => { e.stopPropagation(); toggleVerify(a.id, a.verified); }}
          >
            <ShieldCheck className="h-3 w-3 mr-1" /> {a.verified ? "Unverify" : "Verify"}
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) return <LoadingCards count={4} />;

  return (
    <div>
      <PageHeader
        title="Academies Management"
        description={`${academies.length} academies · ${academies.filter((a: any) => a.verified).length} verified`}
        icon={Building2}
      />
      <DataTable
        data={academies}
        columns={columns}
        searchKeys={["name", "city", "area", "category"]}
        exportFilename="academies.csv"
        emptyMessage="No academies registered"
      />
    </div>
  );
}
