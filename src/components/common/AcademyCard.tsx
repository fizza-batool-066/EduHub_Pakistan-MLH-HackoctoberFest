"use client";

import { motion } from "framer-motion";
import { Star, MapPin, Bookmark, BookmarkCheck, GitCompare, ArrowRight, BadgeCheck, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Academy } from "@/lib/types";
import { useApp } from "@/context/AppContext";
import { useToggleFavorite, useFavorites } from "@/lib/hooks";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AcademyCardProps {
  academy: Academy;
  delay?: number;
  compact?: boolean;
}

export function AcademyCard({ academy, delay = 0, compact = false }: AcademyCardProps) {
  const { navigate, user } = useApp();
  const toggleFav = useToggleFavorite();
  const favoritesQuery = useFavorites();

  const favorites = favoritesQuery.data?.data?.favorites || [];
  const isSaved = favorites.some((f: any) => f.academyId === academy.id);

  const toggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Please login to save academies");
      navigate({ name: "auth", tab: "student-login" });
      return;
    }
    toggleFav.mutate(academy.id, {
      onSuccess: (res: any) => {
        toast.success(res?.data?.favorited ? "Added to saved" : "Removed from saved");
      },
    });
  };

  // Parse JSON fields safely
  const facilities: string[] = (() => {
    try { return JSON.parse((academy as any).facilitiesJson || "[]"); } catch { return []; }
  })();
  const coursesList: string[] = (() => {
    try { return JSON.parse((academy as any).coursesListJson || "[]"); } catch { return []; }
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4 }}
      onClick={() => navigate({ name: "academy-details", academyId: academy.id })}
      className="cursor-pointer"
    >
      <Card className="overflow-hidden border-border/60 shadow-card hover:shadow-glow transition-all duration-300 group">
        <div
          className="h-24 relative"
          style={{ background: (academy as any).coverColor || academy.logo }}
        >
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute top-3 right-3 flex gap-1.5">
            {academy.verified && (
              <Badge className="bg-white/90 text-emerald-700 hover:bg-white/90 border-0 gap-1">
                <BadgeCheck className="h-3 w-3" /> Verified
              </Badge>
            )}
          </div>
        </div>
        <div className="p-5 pt-0 -mt-8 relative">
          <div className="flex items-end justify-between mb-3">
            <div className="h-14 w-14 rounded-2xl bg-white dark:bg-card border-4 border-card shadow-md flex items-center justify-center text-2xl">
              {academy.logo}
            </div>
            <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 px-2 py-1 rounded-lg text-sm font-semibold">
              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
              {academy.rating}
              <span className="text-xs font-normal opacity-70">({academy.reviewsCount})</span>
            </div>
          </div>
          <h3 className="font-bold text-base mb-1 group-hover:text-primary transition-colors">{academy.name}</h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
            <MapPin className="h-3 w-3" />
            {academy.area}, {academy.city} · {academy.distance} km
          </div>
          {!compact && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{academy.description}</p>
          )}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {coursesList.slice(0, 3).map((c) => (
              <Badge key={c} variant="secondary" className="text-[10px] font-medium">{c}</Badge>
            ))}
            {coursesList.length > 3 && (
              <Badge variant="outline" className="text-[10px]">+{coursesList.length - 3}</Badge>
            )}
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
            <span className="font-semibold text-foreground">{academy.feeRange}</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {academy.timings}</span>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="flex-1 h-9"
              onClick={(e) => {
                e.stopPropagation();
                navigate({ name: "academy-details", academyId: academy.id });
              }}
            >
              View Details <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-9 w-9 p-0"
              onClick={(e) => {
                e.stopPropagation();
                navigate({ name: "student", page: "compare" });
              }}
              title="Compare"
            >
              <GitCompare className="h-4 w-4" />
            </Button>
            {user?.role === "student" && (
              <Button
                size="sm"
                variant="outline"
                className={cn("h-9 w-9 p-0", isSaved && "border-amber-500 text-amber-500")}
                onClick={toggleSave}
                title="Save"
              >
                {isSaved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
