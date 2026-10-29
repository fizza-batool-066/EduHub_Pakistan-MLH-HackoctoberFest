"use client";

import { motion } from "framer-motion";
import { Search, MapPin, Star, Users, Building2, GraduationCap, ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useApp } from "@/context/AppContext";
import { AnimatedCounter } from "@/components/common/AnimatedCounter";

export function Hero() {
  const { navigate } = useApp();

  const stats = [
    { icon: Building2, label: "Academies", value: 1250, color: "text-blue-500" },
    { icon: Users, label: "Students", value: 48000, color: "text-emerald-500" },
    { icon: GraduationCap, label: "Courses", value: 8600, color: "text-violet-500" },
    { icon: Star, label: "Reviews", value: 12400, color: "text-amber-500" },
  ];

  return (
    <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/15 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6"
            >
              <Sparkles className="h-3.5 w-3.5" />
              AI-Powered Academy Discovery Platform
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
              Find the Best{" "}
              <span className="gradient-text">Academy</span>{" "}
              for Your Future
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              Discover, compare and choose educational institutes across Pakistan with AI-powered recommendations tailored to your goals, budget, and location.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Button size="lg" className="gradient-royal shadow-glow h-12 px-6" onClick={() => navigate({ name: "search" })}>
                <Search className="h-5 w-5 mr-2" /> Explore Academies
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-6" onClick={() => navigate({ name: "auth", tab: "academy-signup" })}>
                Register Academy <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-12"
            >
              {stats.map((stat, i) => (
                <Card key={stat.label} className="p-4 text-center border-border/60 shadow-card hover:shadow-glow transition-shadow">
                  <stat.icon className={`h-5 w-5 mx-auto mb-1.5 ${stat.color}`} />
                  <div className="text-xl font-bold tracking-tight">
                    <AnimatedCounter value={stat.value} formatValue={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}K+` : `${v}+`} />
                  </div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </Card>
              ))}
            </motion.div>
          </motion.div>

          {/* Right visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Main visual card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10"
              >
                <Card className="p-6 shadow-2xl border-border/60 backdrop-blur-xl bg-card/90">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Top Rated Academy</div>
                      <div className="font-bold text-lg">Corvit Systems</div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" /> Gulberg III, Lahore
                      </div>
                    </div>
                    <div className="h-12 w-12 rounded-xl gradient-royal flex items-center justify-center text-2xl">🎓</div>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-sm font-semibold">4.8</span>
                    <span className="text-xs text-muted-foreground">(1,240 reviews)</span>
                  </div>
                  <div className="space-y-2 mb-4">
                    {["CCNA", "Ethical Hacking", "AWS Cloud"].map((c) => (
                      <div key={c} className="flex items-center justify-between text-sm py-2 px-3 rounded-lg bg-muted/50">
                        <span className="font-medium">{c}</span>
                        <span className="text-primary font-semibold">Rs 75K - 120K</span>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full gradient-royal">
                    View Details <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Card>
              </motion.div>

              {/* Floating AI badge */}
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -top-6 -left-6 z-20"
              >
                <Card className="p-3 shadow-xl border-border/60 backdrop-blur-xl bg-card/95">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-lg gradient-emerald flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">AI Match</div>
                      <div className="text-sm font-bold">98% Match</div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Floating stats */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-4 -right-4 z-20"
              >
                <Card className="p-3 shadow-xl border-border/60 backdrop-blur-xl bg-card/95">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-lg bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">This Week</div>
                      <div className="text-sm font-bold">+245 Admissions</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
