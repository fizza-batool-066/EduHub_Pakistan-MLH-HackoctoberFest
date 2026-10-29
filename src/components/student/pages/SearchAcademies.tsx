"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search as SearchIcon, MapPin, Star, SlidersHorizontal, X, Grid3x3, List,
  Bookmark, BookmarkCheck, GitCompare, ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { PageHeader } from "@/components/common/PageHeader";
import { AcademyCard } from "@/components/common/AcademyCard";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingCards } from "@/components/common/LoadingStates";
import { useApp } from "@/context/AppContext";
import { useAcademies } from "@/lib/hooks";
import { cn } from "@/lib/utils";

export function SearchAcademies() {
  const { searchQuery, setSearchQuery } = useApp();
  const [filters, setFilters] = useState({
    city: "",
    area: "",
    course: "",
    minRating: 0,
    maxBudget: 350000,
    maxDistance: 15,
    category: "",
  });
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("rating");
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Build query filters
  const queryFilters = useMemo(() => {
    return {
      q: searchQuery || undefined,
      city: filters.city || undefined,
      area: filters.area || undefined,
      course: filters.course || undefined,
      category: filters.category || undefined,
      minRating: filters.minRating > 0 ? filters.minRating : undefined,
      maxBudget: filters.maxBudget < 350000 ? filters.maxBudget : undefined,
      maxDistance: filters.maxDistance < 15 ? filters.maxDistance : undefined,
      sortBy,
      limit: 50,
    };
  }, [searchQuery, filters, sortBy]);

  const { data, isLoading } = useAcademies(queryFilters);
  const academies = data?.data?.academies || [];

  // Cities/areas/courses come from a separate "all academies" call (cheap)
  const allAcademiesQ = useAcademies({ limit: 100 });
  const allAcademies = allAcademiesQ.data?.data?.academies || [];
  const cities = useMemo(() => Array.from(new Set(allAcademies.map((a: any) => a.city))), [allAcademies]);
  const areas = useMemo(() => Array.from(new Set(allAcademies.map((a: any) => a.area))), [allAcademies]);
  const courses = useMemo(() => Array.from(new Set(allAcademies.flatMap((a: any) => {
    try { return JSON.parse(a.coursesListJson || "[]"); } catch { return []; }
  }))), [allAcademies]);
  const categories = useMemo(() => Array.from(new Set(allAcademies.map((a: any) => a.category))), [allAcademies]);
  const timings = ["Morning", "Afternoon", "Evening", "Flexible"];

  const clearFilters = () => {
    setFilters({
      city: "", area: "", course: "", minRating: 0, maxBudget: 350000, maxDistance: 15, category: "",
    });
    setSearchQuery("");
  };

  const activeFilterCount = [
    filters.city, filters.area, filters.course, filters.category,
    filters.minRating > 0 ? "rating" : "",
    filters.maxBudget < 350000 ? "budget" : "",
    filters.maxDistance < 15 ? "distance" : "",
  ].filter(Boolean).length;

  const FilterContent = () => (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wider">City</Label>
        <Select value={filters.city || "all"} onValueChange={(v) => setFilters({ ...filters, city: v === "all" ? "" : v })}>
          <SelectTrigger className="h-9"><SelectValue placeholder="All cities" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All cities</SelectItem>
            {cities.map((c: string) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wider">Area</Label>
        <Select value={filters.area || "all"} onValueChange={(v) => setFilters({ ...filters, area: v === "all" ? "" : v })}>
          <SelectTrigger className="h-9"><SelectValue placeholder="All areas" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All areas</SelectItem>
            {areas.map((a: string) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wider">Course</Label>
        <Select value={filters.course || "all"} onValueChange={(v) => setFilters({ ...filters, course: v === "all" ? "" : v })}>
          <SelectTrigger className="h-9"><SelectValue placeholder="All courses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All courses</SelectItem>
            {courses.map((c: string) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wider">Category</Label>
        <Select value={filters.category || "all"} onValueChange={(v) => setFilters({ ...filters, category: v === "all" ? "" : v })}>
          <SelectTrigger className="h-9"><SelectValue placeholder="All categories" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c: string) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wider">Minimum Rating</Label>
        <div className="flex gap-1">
          {[0, 3, 3.5, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => setFilters({ ...filters, minRating: r })}
              className={cn(
                "flex-1 h-9 rounded-lg text-xs font-semibold transition-all border",
                filters.minRating === r
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/40 border-border hover:bg-muted"
              )}
            >
              {r === 0 ? "Any" : `${r}+`}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="text-xs font-semibold uppercase tracking-wider">Max Budget</Label>
          <span className="text-xs font-semibold text-primary">Rs {filters.maxBudget.toLocaleString()}</span>
        </div>
        <Slider
          value={[filters.maxBudget]}
          onValueChange={([v]) => setFilters({ ...filters, maxBudget: v })}
          max={350000}
          min={5000}
          step={5000}
          className="py-2"
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="text-xs font-semibold uppercase tracking-wider">Max Distance</Label>
          <span className="text-xs font-semibold text-primary">{filters.maxDistance} km</span>
        </div>
        <Slider
          value={[filters.maxDistance]}
          onValueChange={([v]) => setFilters({ ...filters, maxDistance: v })}
          max={15}
          min={1}
          step={0.5}
          className="py-2"
        />
      </div>

      <Button variant="outline" className="w-full" onClick={clearFilters}>
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <div>
      <PageHeader
        title="Search Academies"
        description={`Found ${academies.length} academies matching your criteria`}
        icon={SearchIcon}
        actions={
          <div className="flex gap-2">
            <Sheet open={showFiltersMobile} onOpenChange={setShowFiltersMobile}>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <SlidersHorizontal className="h-4 w-4 mr-1.5" /> Filters
                  {activeFilterCount > 0 && (
                    <Badge className="ml-1.5 h-5 w-5 p-0 text-[10px]">{activeFilterCount}</Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:w-96 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Top Rated</SelectItem>
                <SelectItem value="distance">Nearest</SelectItem>
                <SelectItem value="fee-low">Fee: Low to High</SelectItem>
                <SelectItem value="fee-high">Fee: High to Low</SelectItem>
                <SelectItem value="reviews">Most Reviewed</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex border border-border rounded-lg overflow-hidden">
              <Button
                variant="ghost"
                size="sm"
                className={cn("rounded-none h-9 w-9 p-0", view === "grid" && "bg-primary text-primary-foreground hover:bg-primary")}
                onClick={() => setView("grid")}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn("rounded-none h-9 w-9 p-0", view === "list" && "bg-primary text-primary-foreground hover:bg-primary")}
                onClick={() => setView("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        }
      />

      <div className="flex gap-6">
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <Card className="p-5 border-border/60 shadow-card sticky top-20">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" /> Filters
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="text-[10px]">{activeFilterCount}</Badge>
                )}
              </h3>
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="text-xs text-muted-foreground hover:text-foreground">
                  Clear
                </button>
              )}
            </div>
            <FilterContent />
          </Card>
        </aside>

        <div className="flex-1 min-w-0">
          {isLoading ? (
            <LoadingCards count={6} />
          ) : academies.length === 0 ? (
            <EmptyState
              icon={SearchIcon}
              title="No academies found"
              description="Try adjusting your search or filters to find more options."
              action={<Button onClick={clearFilters} variant="outline">Clear Filters</Button>}
            />
          ) : view === "grid" ? (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {academies.map((a: any, i: number) => (
                <AcademyCard key={a.id} academy={a} delay={i * 0.04} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {academies.map((a: any, i: number) => (
                <AcademyListItem key={a.id} academy={a} delay={i * 0.03} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AcademyListItem({ academy, delay = 0 }: { academy: any; delay?: number }) {
  const { navigate } = useApp();
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ x: 4 }}
      onClick={() => navigate({ name: "academy-details", academyId: academy.id })}
      className="cursor-pointer"
    >
      <Card className="p-4 border-border/60 shadow-card hover:shadow-glow transition-all flex gap-4">
        <div className="h-20 w-20 rounded-xl flex items-center justify-center text-3xl flex-shrink-0" style={{ background: academy.coverColor }}>
          {academy.logo}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="min-w-0">
              <h3 className="font-bold truncate">{academy.name}</h3>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" /> {academy.area}, {academy.city} · {academy.distance} km
              </div>
            </div>
            <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 px-2 py-1 rounded-lg text-xs font-semibold flex-shrink-0">
              <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> {academy.rating}
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-sm font-semibold text-primary">{academy.feeRange}</span>
            <Button size="sm" className="h-7 text-xs">
              Details <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
