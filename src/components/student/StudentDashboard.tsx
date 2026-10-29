"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import dynamic from "next/dynamic";
import {
  LayoutDashboard, Search, MapPin, GitCompare, Bookmark, Sparkles, Target,
  Star, User as UserIcon, Settings,
} from "lucide-react";
import { DashboardLayout, NavItem } from "@/components/layout/DashboardLayout";
import { useApp } from "@/context/AppContext";
import { useFavorites } from "@/lib/hooks";
import { LoadingDashboard } from "@/components/common/LoadingStates";

// Lazy-load all page components for code splitting.
// Only the active page's code is loaded, reducing initial bundle.
const StudentDashboardHome = lazy(() => import("./pages/DashboardHome").then(m => ({ default: m.StudentDashboardHome })));
const SearchAcademies = lazy(() => import("./pages/SearchAcademies").then(m => ({ default: m.SearchAcademies })));
const NearbyAcademies = lazy(() => import("./pages/NearbyAcademies").then(m => ({ default: m.NearbyAcademies })));
const CompareAcademies = lazy(() => import("./pages/CompareAcademies").then(m => ({ default: m.CompareAcademies })));
const SavedAcademies = lazy(() => import("./pages/SavedAcademies").then(m => ({ default: m.SavedAcademies })));
const AIAdvisor = lazy(() => import("./pages/AIAdvisor").then(m => ({ default: m.AIAdvisor })));
const CareerAdvisor = lazy(() => import("./pages/CareerAdvisor").then(m => ({ default: m.CareerAdvisor })));
const ReviewsPage = lazy(() => import("./pages/Reviews").then(m => ({ default: m.ReviewsPage })));
const ProfilePage = lazy(() => import("./pages/Profile").then(m => ({ default: m.ProfilePage })));
const SettingsPage = lazy(() => import("./pages/Settings").then(m => ({ default: m.SettingsPage })));

export function StudentDashboard() {
  const { route } = useApp();
  const [activePage, setActivePage] = useState(
    route.name === "student" ? route.page : "dashboard"
  );

  useEffect(() => {
    if (route.name === "student") {
      setActivePage(route.page);
    }
  }, [route]);

  const favoritesQuery = useFavorites();
  const favorites = favoritesQuery.data?.data?.favorites || [];
  const savedCount = favorites.length;

  const navItems: NavItem[] = [
    { label: "Dashboard", icon: LayoutDashboard, page: "dashboard" },
    { label: "Search Academies", icon: Search, page: "search" },
    { label: "Nearby Academies", icon: MapPin, page: "nearby" },
    { label: "Compare", icon: GitCompare, page: "compare" },
    { label: "Saved", icon: Bookmark, page: "saved", badge: savedCount || undefined },
    { label: "AI Advisor", icon: Sparkles, page: "ai-advisor" },
    { label: "Career Advisor", icon: Target, page: "career-advisor" },
    { label: "Reviews", icon: Star, page: "reviews" },
    { label: "Profile", icon: UserIcon, page: "profile" },
    { label: "Settings", icon: Settings, page: "settings" },
  ];

  const handlePageChange = (page: string) => {
    setActivePage(page);
  };

  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return <StudentDashboardHome />;
      case "search": return <SearchAcademies />;
      case "nearby": return <NearbyAcademies />;
      case "compare": return <CompareAcademies />;
      case "saved": return <SavedAcademies />;
      case "ai-advisor": return <AIAdvisor />;
      case "career-advisor": return <CareerAdvisor />;
      case "reviews": return <ReviewsPage />;
      case "profile": return <ProfilePage />;
      case "settings": return <SettingsPage />;
      default: return <StudentDashboardHome />;
    }
  };

  return (
    <DashboardLayout
      navItems={navItems}
      activePage={activePage}
      onPageChange={handlePageChange}
      brandColor="royal"
      brandLabel="Student"
      brandIcon={UserIcon}
    >
      <Suspense fallback={<LoadingDashboard />}>
        {renderPage()}
      </Suspense>
    </DashboardLayout>
  );
}
