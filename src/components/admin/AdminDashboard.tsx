"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import {
  LayoutDashboard, Building2, Users, GraduationCap, Star,
  BookOpen, BarChart3, FileText, Settings as SettingsIcon, Shield, User as UserIcon, Tag,
} from "lucide-react";
import { DashboardLayout, NavItem } from "@/components/layout/DashboardLayout";
import { useApp } from "@/context/AppContext";
import { LoadingDashboard } from "@/components/common/LoadingStates";

// Lazy-load all admin page components
const AdminDashboardHome = lazy(() => import("./pages/DashboardHome").then(m => ({ default: m.AdminDashboardHome })));
const AdminAcademies = lazy(() => import("./pages/Academies").then(m => ({ default: m.AdminAcademies })));
const AdminCategories = lazy(() => import("./pages/Categories").then(m => ({ default: m.AdminCategories })));
const AdminStudents = lazy(() => import("./pages/Students").then(m => ({ default: m.AdminStudents })));
const AdminTeachers = lazy(() => import("./pages/Teachers").then(m => ({ default: m.AdminTeachers })));
const AdminReviews = lazy(() => import("./pages/Reviews").then(m => ({ default: m.AdminReviews })));
const AdminReports = lazy(() => import("./pages/Reports").then(m => ({ default: m.AdminReports })));
const AdminAnalytics = lazy(() => import("./pages/Analytics").then(m => ({ default: m.AdminAnalytics })));
const ProfilePage = lazy(() => import("@/components/student/pages/Profile").then(m => ({ default: m.ProfilePage })));
const SettingsPage = lazy(() => import("@/components/student/pages/Settings").then(m => ({ default: m.SettingsPage })));

export function AdminDashboard() {
  const { route } = useApp();
  const [activePage, setActivePage] = useState(
    route.name === "admin" ? route.page : "dashboard"
  );

  useEffect(() => {
    if (route.name === "admin") setActivePage(route.page);
  }, [route]);

  const navItems: NavItem[] = [
    { label: "Dashboard", icon: LayoutDashboard, page: "dashboard" },
    { label: "Academies", icon: Building2, page: "academies" },
    { label: "Categories", icon: Tag, page: "categories" },
    { label: "Students", icon: Users, page: "students" },
    { label: "Teachers", icon: GraduationCap, page: "teachers" },
    { label: "Reviews", icon: Star, page: "reviews" },
    { label: "Reports", icon: FileText, page: "reports" },
    { label: "Analytics", icon: BarChart3, page: "analytics" },
    { label: "Profile", icon: UserIcon, page: "profile" },
    { label: "Settings", icon: SettingsIcon, page: "settings" },
  ];

  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return <AdminDashboardHome />;
      case "academies": return <AdminAcademies />;
      case "categories": return <AdminCategories />;
      case "students": return <AdminStudents />;
      case "teachers": return <AdminTeachers />;
      case "reviews": return <AdminReviews />;
      case "reports": return <AdminReports />;
      case "analytics": return <AdminAnalytics />;
      case "profile": return <ProfilePage />;
      case "settings": return <SettingsPage />;
      default: return <AdminDashboardHome />;
    }
  };

  return (
    <DashboardLayout
      navItems={navItems}
      activePage={activePage}
      onPageChange={setActivePage}
      brandColor="amber"
      brandLabel="Admin"
      brandIcon={Shield}
    >
      <Suspense fallback={<LoadingDashboard />}>
        {renderPage()}
      </Suspense>
    </DashboardLayout>
  );
}
