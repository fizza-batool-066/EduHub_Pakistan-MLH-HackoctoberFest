"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";
import { AcademyCard } from "@/components/common/AcademyCard";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingCards } from "@/components/common/LoadingStates";
import { useApp } from "@/context/AppContext";
import { useFavorites, useAcademies } from "@/lib/hooks";

export function SavedAcademies() {
  const { user, navigate } = useApp();
  const favoritesQuery = useFavorites();
  const academiesQuery = useAcademies({ limit: 100 });

  const isLoading = favoritesQuery.isLoading || academiesQuery.isLoading;
  const favorites = favoritesQuery.data?.data?.favorites || [];
  const allAcademies = academiesQuery.data?.data?.academies || [];

  const savedAcademies = favorites
    .map((f: any) => allAcademies.find((a: any) => a.id === f.academyId))
    .filter(Boolean);

  return (
    <div>
      <PageHeader
        title="Saved Academies"
        description={`${savedAcademies.length} academies in your saved list`}
        icon={Bookmark}
        actions={
          savedAcademies.length > 0 && (
            <Button variant="outline" onClick={() => navigate({ name: "student", page: "compare" })}>
              Compare Saved
            </Button>
          )
        }
      />

      {isLoading ? (
        <LoadingCards count={3} />
      ) : savedAcademies.length === 0 ? (
        <EmptyState
          icon={BookmarkCheck}
          title="No saved academies yet"
          description="Save academies you're interested in to easily find them later."
          action={<Button className="gradient-royal" onClick={() => navigate({ name: "student", page: "search" })}>Browse Academies</Button>}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedAcademies.map((a: any, i: number) => (
            <AcademyCard key={a.id} academy={a} delay={i * 0.05} />
          ))}
        </div>
      )}
    </div>
  );
}
