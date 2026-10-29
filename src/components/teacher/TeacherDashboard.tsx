"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import {
  LayoutDashboard, Users, Calendar, BookOpen, ClipboardCheck,
  TrendingUp, Activity, User as UserIcon, Settings as SettingsIcon,
} from "lucide-react";
import { DashboardLayout, NavItem } from "@/components/layout/DashboardLayout";
import { useApp } from "@/context/AppContext";
import { LoadingDashboard } from "@/components/common/LoadingStates";

// Lazy-load page components
const TeacherDashboardHome = lazy(() => import("./pages/DashboardHome").then(m => ({ default: m.TeacherDashboardHome })));
const ProfilePage = lazy(() => import("@/components/student/pages/Profile").then(m => ({ default: m.ProfilePage })));
const SettingsPage = lazy(() => import("@/components/student/pages/Settings").then(m => ({ default: m.SettingsPage })));

export function TeacherDashboard() {
  const { route } = useApp();
  const [activePage, setActivePage] = useState(
    route.name === "teacher" ? route.page : "dashboard"
  );

  useEffect(() => {
    if (route.name === "teacher") setActivePage(route.page);
  }, [route]);

  const navItems: NavItem[] = [
    { label: "Dashboard", icon: LayoutDashboard, page: "dashboard" },
    { label: "My Students", icon: Users, page: "students" },
    { label: "Today's Classes", icon: Calendar, page: "classes" },
    { label: "Attendance", icon: ClipboardCheck, page: "attendance" },
    { label: "Performance", icon: TrendingUp, page: "performance" },
    { label: "Activities", icon: Activity, page: "activities" },
    { label: "Profile", icon: UserIcon, page: "profile" },
    { label: "Settings", icon: SettingsIcon, page: "settings" },
  ];

  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return <TeacherDashboardHome />;
      case "students": return <TeacherDashboardHome initialTab="students" />;
      case "classes": return <TeacherDashboardHome initialTab="classes" />;
      case "attendance": return <TeacherDashboardHome initialTab="attendance" />;
      case "performance": return <TeacherDashboardHome initialTab="performance" />;
      case "activities": return <TeacherDashboardHome initialTab="activities" />;
      case "profile": return <ProfilePage />;
      case "settings": return <SettingsPage />;
      default: return <TeacherDashboardHome />;
    }
  };

  return (
    <DashboardLayout
      navItems={navItems}
      activePage={activePage}
      onPageChange={setActivePage}
      brandColor="violet"
      brandLabel="Teacher"
      brandIcon={BookOpen}
    >
      <Suspense fallback={<LoadingDashboard />}>
        {renderPage()}
      </Suspense>
    </DashboardLayout>
  );
}
