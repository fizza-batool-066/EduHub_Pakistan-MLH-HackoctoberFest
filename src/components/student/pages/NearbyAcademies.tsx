"use client";

import { MapPin, Navigation, Star, Building2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/PageHeader";
import { AcademyCard } from "@/components/common/AcademyCard";
import { LoadingCards } from "@/components/common/LoadingStates";
import { EmptyState } from "@/components/common/EmptyState";
import { useApp } from "@/context/AppContext";
import { useAcademies } from "@/lib/hooks";

export function NearbyAcademies() {
  const { navigate } = useApp();
  const { data, isLoading } = useAcademies({ sortBy: "distance", limit: 50 });
  const academies = (data?.data?.academies || []).slice().sort((a: any, b: any) => a.distance - b.distance);

  return (
    <div>
      <PageHeader
        title="Nearby Academies"
        description="Academies sorted by distance from your location"
        icon={MapPin}
      />

      {/* Map placeholder */}
      <Card className="p-0 mb-6 border-border/60 shadow-card overflow-hidden">
        <div className="relative h-64 bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-blue-950/30 dark:to-emerald-950/30 overflow-hidden">
          <div className="absolute inset-0">
            <svg className="w-full h-full" preserveAspectRatio="xMidYMid slice">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(37,99,235,0.1)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              <path d="M0,80 Q200,60 400,120 T800,100" stroke="rgba(37,99,235,0.3)" strokeWidth="6" fill="none" />
              <path d="M50,250 L750,180" stroke="rgba(16,185,129,0.3)" strokeWidth="4" fill="none" />
              <path d="M200,0 L180,300" stroke="rgba(245,158,11,0.3)" strokeWidth="4" fill="none" />
              <path d="M0,200 L800,220" stroke="rgba(139,92,246,0.3)" strokeWidth="4" fill="none" />
              <path d="M0,150 Q300,180 800,140" stroke="rgba(6,182,212,0.4)" strokeWidth="12" fill="none" />
            </svg>
          </div>

          {academies.slice(0, 6).map((a: any, i: number) => {
            const positions = [
              { top: "20%", left: "15%" },
              { top: "30%", left: "60%" },
              { top: "60%", left: "25%" },
              { top: "50%", left: "75%" },
              { top: "75%", left: "50%" },
              { top: "15%", left: "85%" },
            ];
            const pos = positions[i] || positions[0];
            return (
              <button
                key={a.id}
                onClick={() => navigate({ name: "academy-details", academyId: a.id })}
                className="absolute group"
                style={pos}
              >
                <div className="relative">
                  <div className="absolute -inset-2 bg-primary/20 rounded-full animate-ping" />
                  <div className="relative h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-xs shadow-lg group-hover:scale-110 transition-transform">
                    {a.logo}
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 bg-card border border-border rounded-lg px-2 py-1 text-[10px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                    {a.name}
                  </div>
                </div>
              </button>
            );
          })}

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="absolute -inset-3 bg-emerald-500/30 rounded-full animate-ping" />
              <div className="relative h-4 w-4 rounded-full bg-emerald-500 border-2 border-white shadow-lg" />
            </div>
          </div>

          <Button className="absolute bottom-4 right-4 gradient-royal shadow-lg">
            <Navigation className="h-4 w-4 mr-1.5" /> View on Google Maps
          </Button>

          <div className="absolute top-4 left-4 bg-card/80 backdrop-blur border border-border rounded-lg px-3 py-1.5 text-xs font-semibold">
            📍 Your Location: Lahore
          </div>
        </div>
      </Card>

      {isLoading ? (
        <LoadingCards count={6} />
      ) : academies.length === 0 ? (
        <EmptyState icon={MapPin} title="No academies found nearby" />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {academies.map((a: any, i: number) => (
            <AcademyCard key={a.id} academy={a} delay={i * 0.04} />
          ))}
        </div>
      )}
    </div>
  );
}
