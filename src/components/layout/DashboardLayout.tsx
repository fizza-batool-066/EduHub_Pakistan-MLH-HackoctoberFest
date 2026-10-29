"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  GraduationCap, Menu, X, Sun, Moon, Bell, Search, LogOut,
  ChevronDown, User as UserIcon, Settings, Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useApp } from "@/context/AppContext";
import { useNotifications, useMarkNotificationRead, useLogout } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/storage";

export interface NavItem {
  label: string;
  icon: any;
  page: string;
  badge?: number | string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  activePage: string;
  onPageChange: (page: string) => void;
  brandColor?: "royal" | "emerald" | "violet" | "amber";
  brandLabel: string;
  brandIcon: any;
}

const colorMap = {
  royal: "gradient-royal",
  emerald: "gradient-emerald",
  violet: "bg-gradient-to-br from-violet-500 to-purple-700",
  amber: "bg-gradient-to-br from-amber-500 to-orange-600",
};

export function DashboardLayout({
  children,
  navItems,
  activePage,
  onPageChange,
  brandColor = "royal",
  brandLabel,
  brandIcon: BrandIcon,
}: DashboardLayoutProps) {
  const { user, navigate, theme, toggleTheme, searchQuery, setSearchQuery } = useApp();
  const logoutMutation = useLogout();
  const notificationsQuery = useNotifications();
  const markReadMutation = useMarkNotificationRead();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const notifications = notificationsQuery.data?.data?.notifications || [];
  const unreadCount = notifications.filter((n: any) => !n.read).length;
  const initials = user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "U";

  const handleNavigate = (page: string) => {
    onPageChange(page);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col bg-sidebar border-r border-sidebar-border z-40">
        <div className="p-5 border-b border-sidebar-border">
          <button
            onClick={() => navigate({ name: "landing" })}
            className="flex items-center gap-2 group"
          >
            <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform", colorMap[brandColor])}>
              <BrandIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-sm leading-tight">EduHub</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{brandLabel}</div>
            </div>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => handleNavigate(item.page)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative group",
                activePage === item.page
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <item.icon className={cn("h-4 w-4 flex-shrink-0", activePage === item.page ? "" : "text-muted-foreground group-hover:text-foreground")} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge !== undefined && item.badge !== 0 && (
                <Badge variant={activePage === item.page ? "secondary" : "outline"} className="text-[10px] px-1.5 py-0">
                  {item.badge}
                </Badge>
              )}
              {activePage === item.page && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute -left-3 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-primary"
                />
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <button
            onClick={() => navigate({ name: "landing" })}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-sidebar-accent transition-all"
          >
            <Home className="h-4 w-4" /> Back to Home
          </button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed inset-y-0 left-0 w-72 bg-sidebar border-r border-sidebar-border z-50 flex flex-col"
            >
              <div className="p-5 border-b border-sidebar-border flex items-center justify-between">
                <button onClick={() => navigate({ name: "landing" })} className="flex items-center gap-2">
                  <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center shadow-lg", colorMap[brandColor])}>
                    <BrandIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-sm leading-tight">EduHub</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{brandLabel}</div>
                  </div>
                </button>
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <nav className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.page}
                    onClick={() => handleNavigate(item.page)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                      activePage === item.page
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-sidebar-foreground hover:bg-sidebar-accent"
                    )}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge !== undefined && item.badge !== 0 && (
                      <Badge variant={activePage === item.page ? "secondary" : "outline"} className="text-[10px]">
                        {item.badge}
                      </Badge>
                    )}
                  </button>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 glass border-b border-border/40">
          <div className="flex items-center gap-3 px-4 lg:px-6 h-16">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>

            <div className="flex-1 max-w-md hidden sm:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search academies, courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && searchQuery.trim()) {
                      navigate({ name: "search", query: searchQuery });
                    }
                  }}
                  className="pl-9 h-9"
                />
              </div>
            </div>

            <div className="flex items-center gap-1.5 ml-auto">
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
                {mounted && (theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />)}
              </Button>

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full relative">
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="flex items-center justify-between px-2 py-1.5">
                    <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => markReadMutation.mutate({ markAll: true })}
                        className="text-xs text-primary hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  <div className="max-h-80 overflow-y-auto scrollbar-thin">
                    {notifications.length === 0 ? (
                      <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                        No notifications yet
                      </div>
                    ) : (
                      notifications.slice(0, 8).map((n: any) => (
                        <button
                          key={n.id}
                          onClick={() => markReadMutation.mutate({ id: n.id })}
                          className={cn(
                            "w-full flex items-start gap-2 px-3 py-2.5 hover:bg-muted/60 transition-colors text-left",
                            !n.read && "bg-primary/5"
                          )}
                        >
                          <div className={cn(
                            "h-2 w-2 rounded-full mt-1.5 flex-shrink-0",
                            n.type === "success" ? "bg-emerald-500" :
                            n.type === "warning" ? "bg-amber-500" :
                            n.type === "error" ? "bg-red-500" : "bg-blue-500"
                          )} />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold truncate">{n.title}</div>
                            <div className="text-xs text-muted-foreground line-clamp-2">{n.message}</div>
                            <div className="text-[10px] text-muted-foreground mt-1">{timeAgo(n.date)}</div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted/60 transition-colors">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className={cn("text-white text-xs", colorMap[brandColor])}>
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block text-left">
                      <div className="text-xs font-semibold leading-tight">{user?.name}</div>
                      <div className="text-[10px] text-muted-foreground capitalize">{user?.role}</div>
                    </div>
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="font-semibold">{user?.name}</div>
                    <div className="text-xs font-normal text-muted-foreground">{user?.email}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onPageChange("profile")}>
                    <UserIcon className="h-4 w-4 mr-2" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onPageChange("settings")}>
                    <Settings className="h-4 w-4 mr-2" /> Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                    <LogOut className="h-4 w-4 mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
