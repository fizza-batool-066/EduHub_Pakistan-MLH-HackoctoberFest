"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Route, User, Notification, Role } from "@/lib/types";
import { api } from "@/lib/api-client";
import { QueryProvider } from "./QueryProvider";

interface AppContextValue {
  // routing
  route: Route;
  navigate: (route: Route) => void;
  goBack: () => void;
  // auth
  user: User | null;
  login: (user: User) => void; // post-login callback from hook
  signup: (user: User) => void; // post-signup callback
  logout: () => void;
  authLoading: boolean;
  // theme
  theme: string | undefined;
  toggleTheme: () => void;
  // notifications (UI-only state; data fetched via hooks)
  // search
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  // loading screen
  showSplash: boolean;
  // mounted (for hydration-safe rendering)
  mounted: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

const SPLASH_KEY = "eduhub_splash_shown";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme();
  const [route, setRoute] = useState<Route>({ name: "landing" });
  const [history, setHistory] = useState<Route[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [showSplash, setShowSplash] = useState(false);

  // First-mount: check if splash should show (only first visit per session)
  useEffect(() => {
    setMounted(true);
    try {
      const shown = sessionStorage.getItem(SPLASH_KEY);
      if (!shown) {
        setShowSplash(true);
        sessionStorage.setItem(SPLASH_KEY, "1");
      }
    } catch {
      // sessionStorage might be unavailable
    }

    // Restore session
    api.get<{ success: boolean; data: { user: User | null } }>("/auth/me")
      .then((res) => {
        if (res?.data?.user) setUser(res.data.user);
      })
      .catch(() => {})
      .finally(() => setAuthLoading(false));
  }, []);

  const navigate = useCallback((newRoute: Route) => {
    setHistory((prev) => [...prev, route]);
    setRoute(newRoute);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [route]);

  const goBack = useCallback(() => {
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const newHistory = [...prev];
      const last = newHistory.pop()!;
      setRoute(last);
      return newHistory;
    });
  }, []);

  const login = useCallback((user: User) => {
    setUser(user);
    if (user.role === "student") setRoute({ name: "student", page: "dashboard" });
    else if (user.role === "academy") setRoute({ name: "academy", page: "dashboard" });
    else if (user.role === "teacher") setRoute({ name: "teacher", page: "dashboard" });
    else if (user.role === "admin") setRoute({ name: "admin", page: "dashboard" });
    setHistory([]);
    toast.success(`Welcome back, ${user.name}!`);
  }, []);

  const signup = useCallback((user: User) => {
    setUser(user);
    if (user.role === "student") setRoute({ name: "student", page: "dashboard" });
    else if (user.role === "academy") setRoute({ name: "academy", page: "dashboard" });
    setHistory([]);
    toast.success(`Account created! Welcome, ${user.name}`);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {}
    setUser(null);
    setRoute({ name: "landing" });
    setHistory([]);
    toast.success("Logged out");
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return (
    <QueryProvider>
      <AppContext.Provider
        value={{
          route,
          navigate,
          goBack,
          user,
          login,
          signup,
          logout,
          authLoading,
          theme,
          toggleTheme,
          searchQuery,
          setSearchQuery,
          showSplash,
          mounted,
        }}
      >
        {children}
      </AppContext.Provider>
    </QueryProvider>
  );
}
