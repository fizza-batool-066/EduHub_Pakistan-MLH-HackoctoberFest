import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/context/ThemeProvider";
import { AppProvider } from "@/context/AppContext";
import { AppShell } from "@/components/common/AppShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EduHub Pakistan — Find the Best Academy for Your Future",
  description:
    "Discover, compare and choose educational institutes across Pakistan with AI-powered recommendations.",
  keywords: [
    "EduHub Pakistan",
    "academy",
    "education",
    "Pakistan",
    "AI recommendations",
    "courses",
  ],
  authors: [{ name: "EduHub Pakistan" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AppProvider>
            <AppShell>{children}</AppShell>
            <Toaster />
            <SonnerToaster richColors position="top-right" />
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
