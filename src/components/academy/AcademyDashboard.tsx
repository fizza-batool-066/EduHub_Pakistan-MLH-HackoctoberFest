"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, Wallet,
  ClipboardList, Megaphone, Image as ImageIcon, Star, BarChart3, Award,
  Settings as SettingsIcon, User as UserIcon,
} from "lucide-react";
import { DashboardLayout, NavItem } from "@/components/layout/DashboardLayout";
import { useApp } from "@/context/AppContext";
import { LoadingDashboard } from "@/components/common/LoadingStates";

// Lazy-load all page components for code splitting
const AcademyDashboardHome = lazy(() => import("./pages/DashboardHome").then(m => ({ default: m.AcademyDashboardHome })));
const StudentsManagement = lazy(() => import("./pages/StudentsManagement").then(m => ({ default: m.StudentsManagement })));
const TeachersManagement = lazy(() => import("./pages/TeachersManagement").then(m => ({ default: m.TeachersManagement })));
const CoursesManagement = lazy(() => import("./pages/CoursesManagement").then(m => ({ default: m.CoursesManagement })));
const FeesManagement = lazy(() => import("./pages/FeesManagement").then(m => ({ default: m.FeesManagement })));
const AdmissionsManagement = lazy(() => import("./pages/AdmissionsManagement").then(m => ({ default: m.AdmissionsManagement })));
const ScholarshipsManagement = lazy(() => import("./pages/ScholarshipsManagement").then(m => ({ default: m.ScholarshipsManagement })));
const AnnouncementsManagement = lazy(() => import("./pages/AnnouncementsManagement").then(m => ({ default: m.AnnouncementsManagement })));
const GalleryManagement = lazy(() => import("./pages/GalleryManagement").then(m => ({ default: m.GalleryManagement })));
const ReviewsManagement = lazy(() => import("./pages/ReviewsManagement").then(m => ({ default: m.ReviewsManagement })));
const AnalyticsPage = lazy(() => import("./pages/Analytics").then(m => ({ default: m.AnalyticsPage })));
const ProfilePage = lazy(() => import("@/components/student/pages/Profile").then(m => ({ default: m.ProfilePage })));
const SettingsPage = lazy(() => import("@/components/student/pages/Settings").then(m => ({ default: m.SettingsPage })));

export function AcademyDashboard() {
  const { route } = useApp();
  const [activePage, setActivePage] = useState(
    route.name === "academy" ? route.page : "dashboard"
  );

  useEffect(() => {
    if (route.name === "academy") setActivePage(route.page);
  }, [route]);

  const navItems: NavItem[] = [
    { label: "Dashboard", icon: LayoutDashboard, page: "dashboard" },
    { label: "Students", icon: Users, page: "students" },
    { label: "Teachers", icon: GraduationCap, page: "teachers" },
    { label: "Courses", icon: BookOpen, page: "courses" },
    { label: "Fees", icon: Wallet, page: "fees" },
    { label: "Admissions", icon: ClipboardList, page: "admissions" },
    { label: "Scholarships", icon: Award, page: "scholarships" },
    { label: "Announcements", icon: Megaphone, page: "announcements" },
    { label: "Gallery", icon: ImageIcon, page: "gallery" },
    { label: "Reviews", icon: Star, page: "reviews" },
    { label: "Analytics", icon: BarChart3, page: "analytics" },
    { label: "Profile", icon: UserIcon, page: "profile" },
    { label: "Settings", icon: SettingsIcon, page: "settings" },
  ];

  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return <AcademyDashboardHome />;
      case "students": return <StudentsManagement />;
      case "teachers": return <TeachersManagement />;
      case "courses": return <CoursesManagement />;
      case "fees": return <FeesManagement />;
      case "admissions": return <AdmissionsManagement />;
      case "scholarships": return <ScholarshipsManagement />;
      case "announcements": return <AnnouncementsManagement />;
      case "gallery": return <GalleryManagement />;
      case "reviews": return <ReviewsManagement />;
      case "analytics": return <AnalyticsPage />;
      case "profile": return <ProfilePage />;
      case "settings": return <SettingsPage />;
      default: return <AcademyDashboardHome />;
    }
  };

  return (
    <DashboardLayout
      navItems={navItems}
      activePage={activePage}
      onPageChange={setActivePage}
      brandColor="emerald"
      brandLabel="Academy"
      brandIcon={GraduationCap}
    >
      <Suspense fallback={<LoadingDashboard />}>
        {renderPage()}
      </Suspense>
    </DashboardLayout>
  );
}
