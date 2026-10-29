"use client";

import dynamic from "next/dynamic";
import { useApp } from "@/context/AppContext";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingPage } from "@/components/landing/LandingPage";
import { ArrowLeft, Search as SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const AuthPage = dynamic(() =>
  import("@/components/auth/AuthPage").then((module) => module.AuthPage)
);
const StudentDashboard = dynamic(() =>
  import("@/components/student/StudentDashboard").then((module) => module.StudentDashboard)
);
const AcademyDashboard = dynamic(() =>
  import("@/components/academy/AcademyDashboard").then((module) => module.AcademyDashboard)
);
const TeacherDashboard = dynamic(() =>
  import("@/components/teacher/TeacherDashboard").then((module) => module.TeacherDashboard)
);
const AdminDashboard = dynamic(() =>
  import("@/components/admin/AdminDashboard").then((module) => module.AdminDashboard)
);
const AcademyDetails = dynamic(() =>
  import("@/components/search/AcademyDetails").then((module) => module.AcademyDetails)
);
const SearchAcademies = dynamic(() =>
  import("@/components/student/pages/SearchAcademies").then((module) => module.SearchAcademies)
);

export default function Home() {
  const { route, navigate, user, goBack } = useApp();

  // Public routes that don't require auth
  if (route.name === "landing") {
    return <LandingPage />;
  }

  if (route.name === "auth") {
    return <AuthPage initialTab={route.tab} />;
  }

  if (route.name === "academy-details") {
    return <AcademyDetails academyId={route.academyId} />;
  }

  // Search route — public, but with navbar
  if (route.name === "search") {
    return (
      <div className="min-h-screen flex flex-col">
        <LandingNavbar />
        <main className="flex-1 pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <button
              onClick={goBack}
              className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <SearchAcademies />
          </div>
        </main>
      </div>
    );
  }

  // Protected routes — require auth
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="h-16 w-16 mx-auto mb-4 rounded-2xl gradient-royal flex items-center justify-center">
            <SearchIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Authentication Required</h1>
          <p className="text-muted-foreground mb-6">
            Please sign in to access your dashboard.
          </p>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" onClick={() => navigate({ name: "landing" })}>
              Back to Home
            </Button>
            <Button className="gradient-royal" onClick={() => navigate({ name: "auth", tab: "student-login" })}>
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Role-based dashboards
  if (route.name === "student" && user.role === "student") {
    return <StudentDashboard />;
  }

  if (route.name === "academy" && user.role === "academy") {
    return <AcademyDashboard />;
  }

  if (route.name === "teacher" && user.role === "teacher") {
    return <TeacherDashboard />;
  }

  if (route.name === "admin" && user.role === "admin") {
    return <AdminDashboard />;
  }

  // Wrong role — redirect to their own dashboard
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You don't have access to this section. Please use your own dashboard.
          </p>
          <Button className="gradient-royal" onClick={() => navigate({ name: user.role as any, page: "dashboard" })}>
            Go to My Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return <LandingPage />;
}
