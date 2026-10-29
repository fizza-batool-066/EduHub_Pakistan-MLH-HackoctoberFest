"use client";

import { motion } from "framer-motion";
import {
  Search, GitCompare, Bookmark, Sparkles, Star,
  Clock, ArrowRight, Building2, Bell, MapPin,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { AcademyCard } from "@/components/common/AcademyCard";
import { ChartCard, SimplePieChart, SimpleAreaChart } from "@/components/common/Charts";
import { LoadingCards, LoadingDashboard } from "@/components/common/LoadingStates";
import { EmptyState } from "@/components/common/EmptyState";
import { useApp } from "@/context/AppContext";
import {
  useAcademies, useFavorites, useReviews, useAnnouncements,
} from "@/lib/hooks";
import { CATEGORY_DISTRIBUTION, MONTHLY_DATA } from "@/lib/sampleData";
import { timeAgo } from "@/lib/storage";

export function StudentDashboardHome() {
  const { user, navigate } = useApp();

  const academiesQuery = useAcademies({ limit: 20 });
  const favoritesQuery = useFavorites();
  const reviewsQuery = useReviews(null);
  // For dashboard we want all recent reviews across academies — use a hack: fetch one academy at a time? Simpler: skip and use announcements only.
  const announcementsQuery = useAnnouncements(null, true);

  const isLoading = academiesQuery.isLoading;
  const academies = academiesQuery.data?.data?.academies || [];
  const favorites = favoritesQuery.data?.data?.favorites || [];
  // Reviews query is disabled (no academyId), so just use empty array
  const reviews: any[] = [];
  const allAnnouncements: any[] = [];

  // Recommended: top-rated academies
  const recommendedAcademies = [...academies].sort((a, b) => b.rating - a.rating).slice(0, 3);
  const savedAcademyDetails = favorites
    .map((f: any) => academies.find((a) => a.id === f.academyId))
    .filter(Boolean)
    .slice(0, 3) as any[];
  const nearbyAcademies = [...academies].sort((a, b) => a.distance - b.distance).slice(0, 3);

  const quickActions = [
    { label: "Search", icon: Search, color: "from-blue-500 to-blue-700", action: () => navigate({ name: "student", page: "search" }) },
    { label: "Compare", icon: GitCompare, color: "from-emerald-500 to-emerald-700", action: () => navigate({ name: "student", page: "compare" }) },
    { label: "Favorites", icon: Bookmark, color: "from-amber-500 to-orange-600", action: () => navigate({ name: "student", page: "saved" }) },
    { label: "AI Recs", icon: Sparkles, color: "from-violet-500 to-purple-700", action: () => navigate({ name: "student", page: "ai-advisor" }) },
  ];

  if (isLoading) return <LoadingDashboard />;

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.name?.split(" ")[0] || "Student"}!`}
        description="Here's what's happening with your academy search"
        actions={
          <Button className="gradient-royal" onClick={() => navigate({ name: "student", page: "search" })}>
            <Search className="h-4 w-4 mr-1.5" /> Find Academies
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Saved Academies" value={favorites.length} icon={Bookmark} gradient="royal" delay={0} />
        <StatCard title="Reviews Written" value={0} icon={Star} gradient="amber" delay={0.1} />
        <StatCard title="Available Academies" value={academies.length} icon={Building2} gradient="violet" delay={0.15} />
        <StatCard title="Compare List" value={0} icon={GitCompare} gradient="emerald" delay={0.2} />
      </div>

      {/* Quick Actions */}
      <Card className="p-5 mb-6 border-border/60 shadow-card">
        <h3 className="font-semibold mb-4 text-sm">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((action, i) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -2 }}
              onClick={action.action}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border/60 hover:shadow-card transition-all group"
            >
              <div className={`p-3 rounded-xl bg-gradient-to-br ${action.color} text-white shadow-md group-hover:scale-110 transition-transform`}>
                <action.icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </Card>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <ChartCard title="Academies by Category" description="Distribution across Pakistan">
          <SimplePieChart data={CATEGORY_DISTRIBUTION} />
        </ChartCard>
        <ChartCard title="Admissions Trend" description="Monthly academy admissions">
          <SimpleAreaChart data={MONTHLY_DATA} xKey="month" yKey="admissions" color="#2563EB" />
        </ChartCard>
      </div>

      {/* Recommended */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> Recommended for You
            </h2>
            <p className="text-xs text-muted-foreground">Based on your search history and preferences</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate({ name: "student", page: "search" })}>
            View All <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>
        {recommendedAcademies.length === 0 ? (
          <EmptyState icon={Building2} title="No academies available" />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedAcademies.map((a, i) => (
              <AcademyCard key={a.id} academy={a} delay={i * 0.05} />
            ))}
          </div>
        )}
      </div>

      {/* Two columns: Saved + Nearby */}
      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <Card className="p-5 border-border/60 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Bookmark className="h-4 w-4 text-amber-500" /> Saved Academies
            </h3>
            <Button variant="ghost" size="sm" onClick={() => navigate({ name: "student", page: "saved" })}>
              View All
            </Button>
          </div>
          {savedAcademyDetails.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              <Bookmark className="h-8 w-8 mx-auto mb-2 opacity-30" />
              No saved academies yet
            </div>
          ) : (
            <div className="space-y-3">
              {savedAcademyDetails.map((a) => (
                <button
                  key={a.id}
                  onClick={() => navigate({ name: "academy-details", academyId: a.id })}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-border/60 hover:shadow-soft transition-all text-left"
                >
                  <div className="h-10 w-10 rounded-lg flex items-center justify-center text-lg" style={{ background: a.coverColor }}>
                    {a.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{a.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{a.area}, {a.city}</div>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {a.rating}
                  </div>
                </button>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-5 border-border/60 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4 text-emerald-500" /> Nearby Academies
            </h3>
            <Button variant="ghost" size="sm" onClick={() => navigate({ name: "student", page: "nearby" })}>
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {nearbyAcademies.map((a) => (
              <button
                key={a.id}
                onClick={() => navigate({ name: "academy-details", academyId: a.id })}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-border/60 hover:shadow-soft transition-all text-left"
              >
                <div className="h-10 w-10 rounded-lg flex items-center justify-center text-lg" style={{ background: a.coverColor }}>
                  {a.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{a.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{a.area}, {a.city}</div>
                </div>
                <Badge variant="secondary" className="text-[10px]">{a.distance} km</Badge>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
