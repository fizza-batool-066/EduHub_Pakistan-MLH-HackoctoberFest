"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitCompare, X, Star, MapPin, Check, Sparkles, ArrowRight, ThumbsUp, ThumbsDown, Lightbulb, Brain } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingCards } from "@/components/common/LoadingStates";
import { useApp } from "@/context/AppContext";
import { useAcademies, useAICompare } from "@/lib/hooks";

export function CompareAcademies() {
  const { navigate, user } = useApp();
  const academiesQuery = useAcademies({ limit: 50 });
  const aiCompare = useAICompare();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showSelector, setShowSelector] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);

  const academies = academiesQuery.data?.data?.academies || [];
  const selected = academies.filter((a: any) => selectedIds.includes(a.id));

  const toggleAcademy = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else if (selectedIds.length < 4) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const generateAIAnalysis = () => {
    if (selectedIds.length < 2) return;
    aiCompare.mutate(
      { academyIds: selectedIds, studentContext: { careerGoal: "Software Engineer" } },
      { onSuccess: (res: any) => setAiAnalysis(res?.data?.analysis) }
    );
  };

  const comparisonRows: { label: string; key: (a: any) => React.ReactNode; highlight?: boolean }[] = [
    { label: "Rating", key: (a) => <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {a.rating} ({a.reviewsCount})</span>, highlight: true },
    { label: "City", key: (a) => `${a.city}` },
    { label: "Area", key: (a) => <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {a.area}</span> },
    { label: "Distance", key: (a) => `${a.distance} km`, highlight: true },
    { label: "Address", key: (a) => <span className="text-xs">{a.address}</span> },
    { label: "Fees", key: (a) => <span className="font-semibold text-primary">{a.feeRange}</span>, highlight: true },
    { label: "Timings", key: (a) => a.timings },
    { label: "Category", key: (a) => <Badge variant="outline" className="text-[10px]">{a.category}</Badge> },
    { label: "Total Students", key: (a) => a.totalStudents.toLocaleString() },
    { label: "Total Teachers", key: (a) => a.totalTeachers },
    { label: "Courses", key: (a) => {
      const courses = (() => { try { return JSON.parse(a.coursesListJson || "[]"); } catch { return []; } })();
      return <div className="flex flex-wrap gap-1">{courses.slice(0, 3).map((c: string) => <Badge key={c} variant="secondary" className="text-[10px]">{c}</Badge>)}{courses.length > 3 && <Badge variant="outline" className="text-[10px]">+{courses.length - 3}</Badge>}</div>;
    } },
    { label: "Facilities", key: (a) => {
      const facilities = (() => { try { return JSON.parse(a.facilitiesJson || "[]"); } catch { return []; } })();
      return <div className="flex flex-wrap gap-1">{facilities.slice(0, 4).map((f: string) => <span key={f} className="text-[10px] px-1.5 py-0.5 rounded bg-muted">{f}</span>)}</div>;
    } },
    { label: "Verified", key: (a) => a.verified ? <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 gap-1 text-[10px]"><Check className="h-2.5 w-2.5" /> Yes</Badge> : <Badge variant="outline" className="text-[10px]">No</Badge> },
  ];

  if (academiesQuery.isLoading) return <LoadingCards count={4} />;

  return (
    <div>
      <PageHeader
        title="Compare Academies"
        description="Compare up to 4 academies side-by-side with AI analysis"
        icon={GitCompare}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowSelector(!showSelector)}>
              {showSelector ? "Hide Selector" : "Add Academies"}
            </Button>
            {selected.length >= 2 && (
              <Button className="gradient-royal" onClick={generateAIAnalysis} disabled={aiCompare.isPending}>
                {aiCompare.isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Analyzing...
                  </span>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-1.5" /> AI Analysis
                  </>
                )}
              </Button>
            )}
          </div>
        }
      />

      {/* Academy selector */}
      {showSelector && (
        <Card className="p-4 mb-6 border-border/60 shadow-card">
          <h3 className="font-semibold mb-3 text-sm">Select academies to compare ({selectedIds.length}/4)</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2 max-h-72 overflow-y-auto scrollbar-thin">
            {academies.map((a: any) => (
              <button
                key={a.id}
                onClick={() => toggleAcademy(a.id)}
                className={`flex items-center gap-2 p-2.5 rounded-lg border text-left transition-all ${selectedIds.includes(a.id) ? "border-primary bg-primary/5" : "border-border hover:bg-muted/40"}`}
              >
                <div className="h-8 w-8 rounded-lg flex items-center justify-center text-base" style={{ background: a.coverColor }}>
                  {a.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold truncate">{a.name}</div>
                  <div className="text-[10px] text-muted-foreground">{a.city}</div>
                </div>
                {selectedIds.includes(a.id) && <Check className="h-4 w-4 text-primary" />}
              </button>
            ))}
          </div>
        </Card>
      )}

      {selected.length === 0 ? (
        <EmptyState
          icon={GitCompare}
          title="No academies selected"
          description="Click 'Add Academies' above to select academies for comparison."
          action={<Button className="gradient-royal" onClick={() => setShowSelector(true)}>Add Academies</Button>}
        />
      ) : (
        <div className="space-y-6">
          {/* AI Analysis */}
          <AnimatePresence>
            {aiAnalysis && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-5 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5 shadow-card">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-2.5 rounded-xl gradient-royal text-white">
                      <Brain className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1 flex items-center gap-2">
                        AI Analysis <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 text-[10px]"><Sparkles className="h-3 w-3 mr-1" />AI Powered</Badge>
                      </h3>
                      <p className="text-sm text-muted-foreground">{aiAnalysis.summary}</p>
                    </div>
                  </div>

                  {aiAnalysis.bestPick && (
                    <div className="mb-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/20">
                      <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-2">Best Pick</div>
                      <div className="font-bold mb-2">{aiAnalysis.bestPick.academyName}</div>
                      <ul className="space-y-1">
                        {(aiAnalysis.bestPick.reasons || []).map((r: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-xs">
                            <ThumbsUp className="h-3 w-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {aiAnalysis.comparisons && (
                    <div className="grid sm:grid-cols-2 gap-3 mb-4">
                      {aiAnalysis.comparisons.map((c: any, i: number) => (
                        <div key={i} className="p-3 rounded-lg bg-muted/40">
                          <div className="font-semibold text-sm mb-2">{c.academyName}</div>
                          <div className="mb-2">
                            <div className="text-[10px] text-emerald-600 font-semibold mb-1">Strengths</div>
                            <ul className="space-y-0.5">
                              {(c.strengths || []).map((s: string, idx: number) => (
                                <li key={idx} className="text-xs">• {s}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <div className="text-[10px] text-red-600 font-semibold mb-1">Weaknesses</div>
                            <ul className="space-y-0.5">
                              {(c.weaknesses || []).map((w: string, idx: number) => (
                                <li key={idx} className="text-xs">• {w}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {aiAnalysis.recommendation && (
                    <div className="p-3 rounded-lg bg-violet-50 dark:bg-violet-950/20 border border-violet-500/20">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-violet-700 dark:text-violet-400 mb-1.5">
                        <Lightbulb className="h-3 w-3" /> Recommendation
                      </div>
                      <p className="text-xs text-foreground">{aiAnalysis.recommendation}</p>
                    </div>
                  )}
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Comparison table */}
          <Card className="border-border/60 shadow-card overflow-hidden">
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/30">
                    <th className="text-left font-semibold px-4 py-4 text-xs uppercase tracking-wider text-muted-foreground sticky left-0 bg-muted/30 z-10 min-w-[140px]">
                      Feature
                    </th>
                    {selected.map((a: any) => (
                      <th key={a.id} className="text-left px-4 py-4 min-w-[200px]">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="h-12 w-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: a.coverColor }}>
                              {a.logo}
                            </div>
                            <button
                              onClick={() => toggleAcademy(a.id)}
                              className="p-1 rounded hover:bg-muted transition-colors"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <div className="font-bold text-sm">{a.name}</div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full h-7 text-xs"
                            onClick={() => navigate({ name: "academy-details", academyId: a.id })}
                          >
                            View Details
                          </Button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, i) => (
                    <tr key={row.label} className={i % 2 === 0 ? "bg-muted/20" : ""}>
                      <td className={`px-4 py-3 text-sm font-medium text-muted-foreground sticky left-0 z-10 ${i % 2 === 0 ? "bg-muted/20" : "bg-card"}`}>
                        {row.label}
                      </td>
                      {selected.map((a) => (
                        <td key={a.id} className={`px-4 py-3 text-sm ${row.highlight ? "font-semibold" : ""}`}>
                          {row.key(a)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
