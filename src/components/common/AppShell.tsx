"use client";

import { useApp } from "@/context/AppContext";
import { LoadingScreen } from "@/components/common/LoadingScreen";

/**
 * Client-side shell that conditionally shows the loading screen on first visit.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const { showSplash } = useApp();
  return (
    <>
      {showSplash && <LoadingScreen onDone={() => {}} />}
      {children}
    </>
  );
}
