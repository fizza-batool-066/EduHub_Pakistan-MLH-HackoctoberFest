"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target, Briefcase, GraduationCap, TrendingUp, Sparkles, ArrowRight,
  Lightbulb, Award, MapPin, DollarSign, Check,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/common/PageHeader";
import { useApp } from "@/context/AppContext";
import { useAICareer } from "@/lib/hooks";
import { cn } from "@/lib/utils";

export function CareerAdvisor() {
  const { navigate } = useApp();
  const aiCareer = useAICareer();
  const [result, setResult] = useState<any>(null);
  const [form, setForm] = useState({
    careerGoal: "Software Engineer",
    currentLevel: "Beginner",
    interests: "",
  });

  const generate = () => {
    aiCareer.mutate(form, {
      onSuccess: (res: any) => setResult(res?.data?.result),
    });
  };

  const careerGoals = [
    "Software Engineer", "Network Engineer", "Data Scientist", "Cybersecurity Expert",
    "Accountant", "Doctor (MBBS)", "Engineer", "Digital Marketer", "Entrepreneur", "Teacher",
    "Cloud Architect", "Mobile Developer", "AI Engineer", "Business Analyst",
  ];

  return (
    <div>
      <PageHeader
        title="AI Career Advisor"
        description="Get a personalized roadmap for your dream career"
        icon={Target}
      />

      {/* Hero */}
      <Card className="p-6 mb-6 border-violet-500/30 bg-gradient-to-br from-violet-500/5 via-primary/5 to-accent/5 shadow-card overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="relative flex items-start gap-4">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="p-3 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 text-white shadow-glow"
          >
            <Target className="h-7 w-7" />
          </motion.div>
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-1">Your AI Career Counselor</h2>
            <p className="text-sm text-muted-foreground mb-3">
              Tell us your career goal. Our AI will build a personalized roadmap with skills to learn, recommended academies, and salary insights specific to the Pakistani market.
            </p>
            <div className="flex flex-wrap gap-3 text-xs">
              <div className="flex items-center gap-1.5"><Lightbulb className="h-3.5 w-3.5 text-amber-500" /> Personalized roadmap</div>
              <div className="flex items-center gap-1.5"><GraduationCap className="h-3.5 w-3.5 text-emerald-500" /> Academy recommendations</div>
              <div className="flex items-center gap-1.5"><TrendingUp className="h-3.5 w-3.5 text-blue-500" /> Salary insights</div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input form */}
        <Card className="lg:col-span-1 p-6 border-border/60 shadow-card h-fit">
          <h3 className="font-semibold mb-5 flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" /> Your Goal
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs">Career Goal</Label>
              <Select value={form.careerGoal} onValueChange={(v) => setForm({ ...form, careerGoal: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {careerGoals.map((g) => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Current Level</Label>
              <Select value={form.currentLevel} onValueChange={(v) => setForm({ ...form, currentLevel: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner — just starting out</SelectItem>
                  <SelectItem value="Intermediate">Intermediate — some experience</SelectItem>
                  <SelectItem value="Advanced">Advanced — looking to specialize</SelectItem>
                  <SelectItem value="Career Switch">Career Switch — changing fields</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Interests (optional)</Label>
              <Input
                placeholder="e.g. mobile apps, AI, web design"
                value={form.interests}
                onChange={(e) => setForm({ ...form, interests: e.target.value })}
              />
            </div>

            <Button
              className="w-full gradient-royal shadow-glow"
              onClick={generate}
              disabled={aiCareer.isPending}
            >
              {aiCareer.isPending ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  AI is thinking...
                </span>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-1.5" /> Get Career Roadmap
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          {!result && !aiCareer.isPending && (
            <Card className="p-12 border-dashed border-border text-center">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-violet-500/10 to-primary/10 mb-4"
              >
                <Target className="h-8 w-8 text-violet-500" />
              </motion.div>
              <h3 className="font-bold text-lg mb-1">Discover Your Path</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Select your career goal and let our AI build a comprehensive roadmap with skills, courses, academies, and salary expectations.
              </p>
            </Card>
          )}

          {aiCareer.isPending && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-5 border-border/60">
                  <div className="h-4 w-1/3 bg-muted animate-pulse rounded mb-3" />
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-muted animate-pulse rounded" />
                    <div className="h-3 w-5/6 bg-muted animate-pulse rounded" />
                    <div className="h-3 w-4/6 bg-muted animate-pulse rounded" />
                  </div>
                </Card>
              ))}
              <div className="text-center text-sm text-muted-foreground py-2">
                <Sparkles className="h-4 w-4 inline-block mr-1 animate-pulse" />
                Building your personalized roadmap...
              </div>
            </div>
          )}

          <AnimatePresence>
            {result && !aiCareer.isPending && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <Check className="h-5 w-5 text-emerald-500" />
                      Roadmap for {result.careerGoal}
                    </h3>
                    <p className="text-xs text-muted-foreground">Personalized AI-generated career plan</p>
                  </div>
                  <Badge className="bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400">
                    <Sparkles className="h-3 w-3 mr-1" /> AI Powered
                  </Badge>
                </div>

                {/* Skills */}
                {result.skills && result.skills.length > 0 && (
                  <Card className="p-5 border-border/60 shadow-card">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Award className="h-4 w-4 text-amber-500" /> Skills You'll Need
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.skills.map((skill: string, i: number) => (
                        <Badge key={i} variant="secondary" className="text-xs">{skill}</Badge>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Roadmap */}
                {result.roadmap && result.roadmap.length > 0 && (
                  <Card className="p-5 border-border/60 shadow-card">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-500" /> Learning Roadmap
                    </h4>
                    <div className="space-y-3">
                      {result.roadmap.map((phase: any, i: number) => (
                        <div key={i} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                              {i + 1}
                            </div>
                            {i < result.roadmap.length - 1 && (
                              <div className="w-0.5 flex-1 bg-border mt-1" />
                            )}
                          </div>
                          <div className="flex-1 pb-3">
                            <div className="font-semibold text-sm">{phase.phase}</div>
                            <p className="text-xs text-muted-foreground mt-0.5">{phase.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Recommended Academies */}
                {result.academies && result.academies.length > 0 && (
                  <Card className="p-5 border-border/60 shadow-card">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-emerald-500" /> Recommended Academies
                    </h4>
                    <div className="space-y-2">
                      {result.academies.map((a: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border/60">
                          <div>
                            <div className="font-semibold text-sm">{a.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {a.rating && <span>{a.rating}★ · </span>}
                              {a.feeRange || a.fees}
                            </div>
                            {a.whyRecommended && (
                              <div className="text-xs text-primary mt-0.5">{a.whyRecommended}</div>
                            )}
                          </div>
                          {a.id && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs"
                              onClick={() => navigate({ name: "academy-details", academyId: a.id })}
                            >
                              View <ArrowRight className="h-3 w-3 ml-1" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Career Opportunities */}
                {result.opportunities && result.opportunities.length > 0 && (
                  <Card className="p-5 border-border/60 shadow-card">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-emerald-500" /> Career Opportunities
                    </h4>
                    <div className="grid sm:grid-cols-3 gap-3">
                      {result.opportunities.map((o: any, i: number) => (
                        <div key={i} className="p-3 rounded-lg bg-muted/40">
                          <div className="font-semibold text-sm">{o.role}</div>
                          <div className="text-xs text-primary font-semibold mt-1">{o.salaryRange}</div>
                          <div className="text-[10px] text-muted-foreground mt-1">
                            Growth: <span className="text-emerald-600 font-semibold">{o.growth}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Outlook */}
                {result.outlook && (
                  <Card className="p-5 border-violet-500/30 bg-violet-50/50 dark:bg-violet-950/10 shadow-card">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-violet-500" /> Career Outlook
                    </h4>
                    <p className="text-sm text-foreground leading-relaxed">{result.outlook}</p>
                  </Card>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
