"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap, School, BookOpen, Shield, ArrowLeft, ArrowRight,
  Mail, Lock, User as UserIcon, Phone, Eye, EyeOff, Sparkles, CheckCircle2, Sun, Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useApp } from "@/context/AppContext";
import { useLogin, useSignup } from "@/lib/hooks";
import { Role } from "@/lib/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type AuthTab =
  | "student-login"
  | "student-signup"
  | "academy-login"
  | "academy-signup"
  | "teacher-login"
  | "admin-login";

const roleConfig: Record<AuthTab, {
  role: Role;
  isSignup: boolean;
  title: string;
  subtitle: string;
  icon: any;
  gradient: string;
  benefits: string[];
  demoEmail: string;
}> = {
  "student-login": {
    role: "student",
    isSignup: false,
    title: "Welcome Back, Student",
    subtitle: "Sign in to access your dashboard and saved academies",
    icon: GraduationCap,
    gradient: "from-blue-500 to-blue-700",
    benefits: ["Track saved academies", "Get AI recommendations", "Manage reviews", "Compare options"],
    demoEmail: "student@eduhub.pk",
  },
  "student-signup": {
    role: "student",
    isSignup: true,
    title: "Start Your Journey",
    subtitle: "Create a student account to discover your perfect academy",
    icon: GraduationCap,
    gradient: "from-blue-500 to-blue-700",
    benefits: ["Free forever", "AI-powered matching", "Save & compare academies", "Read verified reviews"],
    demoEmail: "",
  },
  "academy-login": {
    role: "academy",
    isSignup: false,
    title: "Academy Owner Portal",
    subtitle: "Sign in to manage your academy, students, and courses",
    icon: School,
    gradient: "from-emerald-500 to-emerald-700",
    benefits: ["Manage students & teachers", "Track admissions", "Publish announcements", "View analytics"],
    demoEmail: "academy@eduhub.pk",
  },
  "academy-signup": {
    role: "academy",
    isSignup: true,
    title: "Register Your Academy",
    subtitle: "Join 1,250+ academies on Pakistan's #1 education platform",
    icon: School,
    gradient: "from-emerald-500 to-emerald-700",
    benefits: ["Reach 48K+ students", "Free academy listing", "Powerful dashboard", "Verified badge"],
    demoEmail: "",
  },
  "teacher-login": {
    role: "teacher",
    isSignup: false,
    title: "Teacher Portal",
    subtitle: "Sign in to manage your classes and students",
    icon: BookOpen,
    gradient: "from-violet-500 to-purple-700",
    benefits: ["View assigned students", "Mark attendance", "Track progress", "Manage assignments"],
    demoEmail: "teacher@eduhub.pk",
  },
  "admin-login": {
    role: "admin",
    isSignup: false,
    title: "Admin Dashboard",
    subtitle: "Sign in to manage the EduHub platform",
    icon: Shield,
    gradient: "from-amber-500 to-orange-600",
    benefits: ["Manage all academies", "Verify listings", "View reports", "Platform analytics"],
    demoEmail: "admin@eduhub.pk",
  },
};

const tabs: { label: string; value: AuthTab; icon: any }[] = [
  { label: "Student Login", value: "student-login", icon: GraduationCap },
  { label: "Student Signup", value: "student-signup", icon: GraduationCap },
  { label: "Academy Login", value: "academy-login", icon: School },
  { label: "Academy Signup", value: "academy-signup", icon: School },
  { label: "Teacher Login", value: "teacher-login", icon: BookOpen },
  { label: "Admin Login", value: "admin-login", icon: Shield },
];

export function AuthPage({ initialTab }: { initialTab: AuthTab }) {
  const { navigate, theme, toggleTheme } = useApp();
  const loginMutation = useLogin();
  const signupMutation = useSignup();

  const [activeTab, setActiveTab] = useState<AuthTab>(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const config = roleConfig[activeTab];
  const loading = loginMutation.isPending || signupMutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (config.isSignup) {
      signupMutation.mutate(
        {
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          role: config.role,
        },
        {
          onError: (e: any) => toast.error(e.message || "Signup failed"),
        }
      );
    } else {
      loginMutation.mutate(
        {
          email: form.email,
          password: form.password,
          role: config.role,
        },
        {
          onError: (e: any) => toast.error(e.message || "Login failed"),
        }
      );
    }
  };

  const useDemo = () => {
    setForm({
      name: config.role === "student" ? "Ahsan Khan" : config.role === "academy" ? "Corvit Admin" : config.role === "teacher" ? "Engr. Ahmed Raza" : "Admin",
      email: config.demoEmail,
      password: "123456",
      phone: "+92 300 1234567",
    });
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Hero */}
      <div className={cn("lg:w-1/2 relative overflow-hidden p-8 lg:p-12 flex flex-col justify-between text-white", `bg-gradient-to-br ${config.gradient}`)}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-white blur-3xl animate-float" />
          <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-white blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        </div>

        <div className="relative z-10">
          <button
            onClick={() => navigate({ name: "landing" })}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-12"
          >
            <ArrowLeft className="h-4 w-4" /> Back to home
          </button>

          <div className="flex items-center gap-2 mb-12">
            <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div className="font-bold text-xl">EduHub Pakistan</div>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex p-3 rounded-2xl bg-white/20 backdrop-blur mb-6">
              <config.icon className="h-8 w-8" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-3">{config.title}</h1>
            <p className="text-white/80 text-base mb-8">{config.subtitle}</p>
            <div className="space-y-3">
              {config.benefits.map((b, i) => (
                <motion.div
                  key={b}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="flex items-center gap-2 text-sm"
                >
                  <CheckCircle2 className="h-4 w-4 text-white/90" />
                  {b}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 text-sm text-white/60">
          © 2024 EduHub Pakistan. Trusted by 48,000+ students.
        </div>
      </div>

      {/* Right side - Form */}
      <div className="lg:w-1/2 flex flex-col">
        <div className="flex justify-between items-center p-4 lg:p-6">
          <div className="flex gap-1 overflow-x-auto scrollbar-thin">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => {
                  setActiveTab(tab.value);
                  setForm({ name: "", email: "", password: "", phone: "" });
                }}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap",
                  activeTab === tab.value
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full ml-2 flex-shrink-0">
            {mounted && (theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />)}
          </Button>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md"
          >
            <Card className="p-6 lg:p-8 shadow-card border-border/60">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-1">
                  {config.isSignup ? "Create Account" : "Sign In"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {config.isSignup ? "Fill in your details to get started" : "Enter your credentials to continue"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <AnimatePresence mode="wait">
                  {config.isSignup && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          required
                          placeholder="John Doe"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="pl-9"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="pl-9"
                    />
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {config.isSignup && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          required
                          placeholder="+92 300 1234567"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="pl-9"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="pl-9 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full gradient-royal shadow-glow"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Please wait...
                    </span>
                  ) : (
                    <>
                      {config.isSignup ? "Create Account" : "Sign In"} <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              {config.demoEmail && (
                <div className="mt-6 p-3 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border/60">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    <span className="font-semibold">Demo Account</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Email: <span className="font-mono">{config.demoEmail}</span> · Password: <span className="font-mono">123456</span>
                  </p>
                  <Button type="button" variant="outline" size="sm" className="w-full text-xs h-8" onClick={useDemo}>
                    Use Demo Credentials
                  </Button>
                </div>
              )}

              <p className="text-xs text-center text-muted-foreground mt-6">
                By continuing, you agree to EduHub Pakistan's{" "}
                <a className="text-primary hover:underline">Terms of Service</a> and{" "}
                <a className="text-primary hover:underline">Privacy Policy</a>
              </p>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
