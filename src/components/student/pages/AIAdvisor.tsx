"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, MapPin, Wallet, BookOpen, Target, Clock, Navigation,
  Star, CheckCircle2, ArrowRight, TrendingUp, Zap, Brain,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { PageHeader } from "@/components/common/PageHeader";
import { useApp } from "@/context/AppContext";
import { useAIRecommend } from "@/lib/hooks";
import { cn } from "@/lib/utils";

export function AIAdvisor() {
  const { navigate } = useApp();
  const aiRecommend = useAIRecommend();
  const [results, setResults] = useState<any[] | null>(null);
  const [form, setForm] = useState({
    city: "Lahore",
    budget: 100000,
    course: "",
    careerGoal: "",
    timings: "Morning",
    distance: 5,
  });

  const generateRecommendations = () => {
    aiRecommend.mutate(form, {
      onSuccess: (res: any) => {
        setResults(res?.data?.recommendations || []);
      },
    });
  };

  const careerGoals = [
    "Software Engineer", "Network Engineer", "Data Scientist", "Cybersecurity Expert",
    "Accountant", "Doctor (MBBS)", "Engineer", "Digital Marketer", "Entrepreneur", "Teacher",
  ];

  return (
    <div>
      <PageHeader
        title="AI Advisor"
        description="Get personalized academy recommendations powered by AI"
        icon={Sparkles}
      />

      <Card className="p-6 mb-6 border-primary/30 bg-gradient-to-br from-primary/5 via-violet-500/5 to-accent/5 shadow-card overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="relative flex items-start gap-4">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="p-3 rounded-2xl gradient-royal text-white shadow-glow"
          >
            <Brain className="h-7 w-7" />
          </motion.div>
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-1">Your AI-Powered Education Counselor</h2>
            <p className="text-sm text-muted-foreground mb-3">
              Tell us about your goals, budget, and preferences. Our AI will analyze academies and recommend the best matches for you.
            </p>
            <div className="flex flex-wrap gap-3 text-xs">
              <div className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-amber-500" /> Instant results</div>
              <div className="flex items-center gap-1.5"><Target className="h-3.5 w-3.5 text-emerald-500" /> 95% accuracy</div>
              <div className="flex items-center gap-1.5"><TrendingUp className="h-3.5 w-3.5 text-blue-500" /> Career insights</div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 p-6 border-border/60 shadow-card h-fit">
          <h3 className="font-semibold mb-5 flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" /> Your Preferences
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs flex items-center gap-1"><MapPin className="h-3 w-3" /> City</Label>
              <Select value={form.city} onValueChange={(v) => setForm({ ...form, city: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Multan"].map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-xs flex items-center gap-1"><Wallet className="h-3 w-3" /> Budget</Label>
                <span className="text-xs font-semibold text-primary">Rs {form.budget.toLocaleString()}</span>
              </div>
              <Slider
                value={[form.budget]}
                onValueChange={([v]) => setForm({ ...form, budget: v })}
                max={350000}
                min={10000}
                step={5000}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs flex items-center gap-1"><BookOpen className="h-3 w-3" /> Preferred Course</Label>
              <Input
                placeholder="e.g. Software Engineering"
                value={form.course}
                onChange={(e) => setForm({ ...form, course: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs flex items-center gap-1"><Target className="h-3 w-3" /> Career Goal</Label>
              <Select value={form.careerGoal} onValueChange={(v) => setForm({ ...form, careerGoal: v })}>
                <SelectTrigger><SelectValue placeholder="Select career goal" /></SelectTrigger>
                <SelectContent>
                  {careerGoals.map((g) => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs flex items-center gap-1"><Clock className="h-3 w-3" /> Preferred Timings</Label>
              <Select value={form.timings} onValueChange={(v) => setForm({ ...form, timings: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Morning", "Afternoon", "Evening", "Flexible"].map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-xs flex items-center gap-1"><Navigation className="h-3 w-3" /> Max Distance</Label>
                <span className="text-xs font-semibold text-primary">{form.distance} km</span>
              </div>
              <Slider
                value={[form.distance]}
                onValueChange={([v]) => setForm({ ...form, distance: v })}
                max={15}
                min={1}
                step={0.5}
              />
            </div>

            <Button
              className="w-full gradient-royal shadow-glow"
              onClick={generateRecommendations}
              disabled={aiRecommend.isPending}
            >
              {aiRecommend.isPending ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  AI is analyzing...
                </span>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-1.5" /> Generate Recommendation
                </>
              )}
            </Button>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          {!results && !aiRecommend.isPending && <EmptyResults />}

          {aiRecommend.isPending && <LoadingState />}

          <AnimatePresence>
            {results && !aiRecommend.isPending && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      AI Recommendations
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {results.length} academies match your preferences with 90%+ accuracy
                    </p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                    <Sparkles className="h-3 w-3 mr-1" /> AI Powered
                  </Badge>
                </div>

                {results.length === 0 ? (
                  <Card className="p-8 text-center border-border/60">
                    <Target className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm text-muted-foreground">No academies match your criteria. Try widening your filters.</p>
                  </Card>
                ) : (
                  results.map((rec: any, i: number) => (
                    <motion.div
                      key={rec.academy.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Card className="p-5 border-border/60 shadow-card hover:shadow-glow transition-all">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="h-16 w-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0" style={{ background: rec.academy.coverColor }}>
                            {rec.academy.logo}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <div className="min-w-0">
                                <h4 className="font-bold truncate">{rec.academy.name}</h4>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <MapPin className="h-3 w-3" /> {rec.academy.area}, {rec.academy.city}
                                </div>
                              </div>
                              <div className="flex-shrink-0">
                                <div className={cn(
                                  "px-2.5 py-1 rounded-lg text-xs font-bold",
                                  rec.matchScore >= 90 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" :
                                  rec.matchScore >= 80 ? "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400" :
                                  "bg-muted text-muted-foreground"
                                )}>
                                  {rec.matchScore}% Match
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 text-xs">
                              <span className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                {rec.academy.rating}
                              </span>
                              <span className="font-semibold text-primary">{rec.academy.feeRange}</span>
                              <span>{rec.academy.distance} km away</span>
                            </div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Why this matches you</div>
                          <div className="space-y-1.5">
                            {(rec.reasons || []).map((reason: string, idx: number) => (
                              <div key={idx} className="flex items-start gap-2 text-xs">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                                <span>{reason}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mb-4">
                          <div className="p-2.5 rounded-lg bg-muted/40">
                            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Outcome</div>
                            <div className="text-xs font-semibold line-clamp-2">{rec.predictedOutcome}</div>
                          </div>
                          <div className="p-2.5 rounded-lg bg-muted/40">
                            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Salary Range</div>
                            <div className="text-xs font-semibold">{rec.salaryRange}</div>
                          </div>
                          <div className="p-2.5 rounded-lg bg-muted/40">
                            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Growth</div>
                            <div className="text-xs font-semibold text-emerald-600">{rec.growthRate}</div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            className="flex-1 gradient-royal"
                            onClick={() => navigate({ name: "academy-details", academyId: rec.academy.id })}
                          >
                            View Details <ArrowRight className="h-3.5 w-3.5 ml-1" />
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => navigate({ name: "student", page: "compare" })}
                          >
                            Compare
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function EmptyResults() {
  return (
    <Card className="p-12 border-dashed border-border text-center">
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 mb-4"
      >
        <Sparkles className="h-8 w-8 text-primary" />
      </motion.div>
      <h3 className="font-bold text-lg mb-1">Ready when you are</h3>
      <p className="text-sm text-muted-foreground max-w-sm mx-auto">
        Fill in your preferences on the left and click "Generate Recommendation" to get personalized academy suggestions powered by AI.
      </p>
    </Card>
  );
}

function LoadingState() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="p-5 border-border/60">
          <div className="flex items-start gap-4 mb-4">
            <div className="h-16 w-16 rounded-2xl bg-muted animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 bg-muted animate-pulse rounded" />
              <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
              <div className="h-3 w-2/3 bg-muted animate-pulse rounded" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 w-full bg-muted animate-pulse rounded" />
            <div className="h-3 w-5/6 bg-muted animate-pulse rounded" />
            <div className="h-3 w-4/6 bg-muted animate-pulse rounded" />
          </div>
        </Card>
      ))}
      <div className="text-center text-sm text-muted-foreground py-2">
        <Sparkles className="h-4 w-4 inline-block mr-1 animate-pulse" />
        Analyzing academies with AI...
      </div>
    </div>
  );
}
