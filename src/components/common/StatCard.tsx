"use client";

import { motion } from "framer-motion";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: number;
  changeLabel?: string;
  gradient?: "royal" | "emerald" | "amber" | "violet" | "pink" | "cyan";
  delay?: number;
}

const gradientMap = {
  royal: "from-blue-500 to-blue-700",
  emerald: "from-emerald-500 to-emerald-700",
  amber: "from-amber-500 to-orange-600",
  violet: "from-violet-500 to-purple-700",
  pink: "from-pink-500 to-rose-600",
  cyan: "from-cyan-500 to-blue-600",
};

export function StatCard({
  title,
  value,
  icon: Icon,
  change,
  changeLabel,
  gradient = "royal",
  delay = 0,
}: StatCardProps) {
  const isPositive = (change ?? 0) >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4 }}
    >
      <Card className="p-5 shadow-card border-border/60 relative overflow-hidden group">
        <div className={cn("absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br opacity-10 group-hover:opacity-20 transition-opacity", gradientMap[gradient])} />
        <div className="flex items-start justify-between relative">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
          </div>
          <div className={cn("p-2.5 rounded-xl bg-gradient-to-br text-white shadow-lg", gradientMap[gradient])}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        {change !== undefined && (
          <div className="flex items-center gap-1.5 mt-3 text-xs">
            <span className={cn(
              "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md font-semibold",
              isPositive ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40" : "text-red-600 bg-red-50 dark:bg-red-950/40"
            )}>
              {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(change)}%
            </span>
            <span className="text-muted-foreground">{changeLabel || "vs last month"}</span>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
