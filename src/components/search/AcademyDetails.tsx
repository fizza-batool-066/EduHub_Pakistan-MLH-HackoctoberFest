"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Star, MapPin, Clock, Phone, Mail, Globe, Bookmark, BookmarkCheck,
  GitCompare, Navigation, BadgeCheck, Users, GraduationCap, Wallet, Calendar,
  MessageSquare, Share2, Send, Building2, Sparkles, ThumbsUp, ThumbsDown, Lightbulb,
  Award, Gift,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useApp } from "@/context/AppContext";
import { useAcademy, useCreateReview, useCreateInquiry, useToggleFavorite, useFavorites, useAISummarizeReviews, useScholarships } from "@/lib/hooks";
import { timeAgo, formatDate } from "@/lib/storage";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function AcademyDetails({ academyId }: { academyId: string }) {
  const { navigate, goBack, user } = useApp();
  const academyQuery = useAcademy(academyId);
  const favoritesQuery = useFavorites();
  const toggleFav = useToggleFavorite();
  const createReview = useCreateReview();
  const createInquiry = useCreateInquiry();
  const summarizeReviews = useAISummarizeReviews();
  const scholarshipsQuery = useScholarships(academyId);

  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [inquiry, setInquiry] = useState({ message: "" });
  const [activeTab, setActiveTab] = useState("overview");
  const [reviewSummary, setReviewSummary] = useState<any>(null);

  const academy = academyQuery.data?.data?.academy;
  const favorites = favoritesQuery.data?.data?.favorites || [];
  const isSaved = favorites.some((f: any) => f.academyId === academyId);

  if (academyQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!academy) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-muted-foreground mb-4">Academy not found</p>
          <Button onClick={() => navigate({ name: "search" })}>Browse Academies</Button>
        </div>
      </div>
    );
  }

  const toggleSave = () => {
    if (!user) {
      toast.error("Please login to save academies");
      navigate({ name: "auth", tab: "student-login" });
      return;
    }
    toggleFav.mutate(academyId, {
      onSuccess: (res: any) => toast.success(res?.data?.favorited ? "Added to saved" : "Removed from saved"),
    });
  };

  const submitReview = () => {
    if (!user) {
      toast.error("Please login to write a review");
      navigate({ name: "auth", tab: "student-login" });
      return;
    }
    if (!newReview.comment.trim()) {
      toast.error("Please write a comment");
      return;
    }
    createReview.mutate({
      academyId,
      studentName: user.name,
      rating: newReview.rating,
      comment: newReview.comment,
    }, {
      onSuccess: () => {
        setNewReview({ rating: 5, comment: "" });
      },
    });
  };

  const submitInquiry = () => {
    if (!inquiry.message.trim()) {
      toast.error("Please write a message");
      return;
    }
    createInquiry.mutate({
      academyId,
      studentName: user?.name || "Anonymous",
      email: user?.email || "",
      phone: user?.phone || "",
      message: inquiry.message,
    }, {
      onSuccess: () => {
        setInquiry({ message: "" });
      },
    });
  };

  const generateSummary = () => {
    summarizeReviews.mutate(academyId, {
      onSuccess: (res: any) => setReviewSummary(res?.data?.summary),
    });
  };

  const facilities: string[] = (() => {
    try { return JSON.parse((academy as any).facilitiesJson || "[]"); } catch { return []; }
  })();
  const coursesList: string[] = (() => {
    try { return JSON.parse((academy as any).coursesListJson || "[]"); } catch { return []; }
  })();
  const gallery: any[] = (() => {
    try { return JSON.parse((academy as any).galleryJson || "[]"); } catch { return []; }
  })();
  const courses = (academy as any).courses || [];
  const teachers = (academy as any).teachers || [];
  const reviews = (academy as any).reviews || [];
  const announcements = (academy as any).announcements || [];

  return (
    <div className="min-h-screen">
      <div className="glass border-b border-border/40 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 h-14 flex items-center justify-between">
          <button onClick={goBack} className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <div className="flex items-center gap-1.5">
            <Button size="sm" variant="ghost" onClick={() => toast.success("Link copied to clipboard")}>
              <Share2 className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => navigate({ name: "student", page: "compare" })}>
              <GitCompare className="h-4 w-4 mr-1.5" /> Compare
            </Button>
            {user?.role === "student" && (
              <Button size="sm" variant="outline" onClick={toggleSave} className={cn(isSaved && "border-amber-500 text-amber-500")}>
                {isSaved ? <BookmarkCheck className="h-4 w-4 mr-1.5" /> : <Bookmark className="h-4 w-4 mr-1.5" />}
                {isSaved ? "Saved" : "Save"}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="relative h-56 sm:h-72 lg:h-80" style={{ background: (academy as any).coverColor }}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="-mt-16 relative z-10 mb-6"
        >
          <Card className="p-6 border-border/60 shadow-card">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-card border-4 border-card shadow-xl flex items-center justify-center text-4xl sm:text-5xl flex-shrink-0">
                {academy.logo}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-2xl font-bold">{academy.name}</h1>
                      {academy.verified && (
                        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 gap-1">
                          <BadgeCheck className="h-3 w-3" /> Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4" /> {academy.address}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="font-semibold">{academy.rating}</span>
                        <span className="text-muted-foreground">({academy.reviewsCount} reviews)</span>
                      </div>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">{academy.category}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">{academy.distance} km away</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => toast.info("Opening Google Maps...")}>
                      <Navigation className="h-4 w-4 mr-1.5" /> Directions
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {facilities.map((f) => (
                    <Badge key={f} variant="secondary" className="text-[10px]">{f}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { icon: GraduationCap, label: "Courses", value: courses.length || coursesList.length, color: "text-blue-500" },
            { icon: Users, label: "Students", value: academy.totalStudents, color: "text-emerald-500" },
            { icon: Wallet, label: "Fee Range", value: academy.feeRange, color: "text-amber-500", isText: true },
            { icon: Clock, label: "Open", value: academy.timings, color: "text-violet-500", isText: true },
          ].map((stat, i) => (
            <Card key={i} className="p-4 border-border/60 shadow-card">
              <stat.icon className={`h-5 w-5 ${stat.color} mb-1.5`} />
              <div className={`font-bold ${stat.isText ? "text-xs" : "text-lg"}`}>{stat.value}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</div>
            </Card>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="w-full justify-start overflow-x-auto scrollbar-thin h-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
            <TabsTrigger value="teachers">Teachers</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="updates">Updates</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="p-6 border-border/60 shadow-card">
                  <h3 className="font-semibold mb-3">About {academy.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{academy.description}</p>
                </Card>
                <Card className="p-6 border-border/60 shadow-card">
                  <h3 className="font-semibold mb-3">Facilities</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {facilities.map((f) => (
                      <div key={f} className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/40">
                        <BadgeCheck className="h-4 w-4 text-emerald-500" />
                        <span className="text-sm">{f}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="p-0 border-border/60 shadow-card overflow-hidden">
                  <div className="relative h-48 bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-blue-950/30 dark:to-emerald-950/30">
                    <svg className="w-full h-full" preserveAspectRatio="xMidYMid slice">
                      <defs>
                        <pattern id="grid2" width="30" height="30" patternUnits="userSpaceOnUse">
                          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(37,99,235,0.15)" strokeWidth="1" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid2)" />
                      <path d="M0,60 Q150,40 300,80 T600,70" stroke="rgba(37,99,235,0.3)" strokeWidth="5" fill="none" />
                      <path d="M50,180 L550,140" stroke="rgba(16,185,129,0.3)" strokeWidth="3" fill="none" />
                    </svg>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="relative">
                        <div className="absolute -inset-2 bg-primary/20 rounded-full animate-ping" />
                        <div className="relative h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm shadow-lg">
                          {academy.logo}
                        </div>
                      </div>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 bg-card/90 backdrop-blur rounded-lg p-2">
                      <div className="text-xs font-semibold">{academy.name}</div>
                      <div className="text-[10px] text-muted-foreground">{academy.address}</div>
                    </div>
                  </div>
                  <div className="p-3">
                    <Button className="w-full gradient-royal" size="sm" onClick={() => toast.info("Google Maps integration coming soon!")}>
                      <Navigation className="h-4 w-4 mr-1.5" /> View on Google Maps
                    </Button>
                  </div>
                </Card>

                <Card className="p-6 border-border/60 shadow-card">
                  <h3 className="font-semibold mb-3">Quick Info</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">City</span>
                      <span className="font-medium">{academy.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Area</span>
                      <span className="font-medium">{academy.area}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category</span>
                      <span className="font-medium">{academy.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Timings</span>
                      <span className="font-medium">{academy.timings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Distance</span>
                      <span className="font-medium">{academy.distance} km</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="courses" className="mt-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.length === 0 ? (
                <Card className="p-6 sm:col-span-2 lg:col-span-3 text-center border-border/60">
                  <p className="text-sm text-muted-foreground">No courses listed yet. Contact academy for course details.</p>
                </Card>
              ) : courses.map((c: any, i: number) => (
                <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="p-5 border-border/60 shadow-card hover:shadow-glow transition-all h-full flex flex-col">
                    <Badge variant="secondary" className="text-[10px] self-start mb-2">{c.category}</Badge>
                    <h4 className="font-bold text-sm mb-2">{c.name}</h4>
                    <p className="text-xs text-muted-foreground flex-1 mb-3 line-clamp-2">{c.description}</p>
                    <div className="space-y-1.5 text-xs mb-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration</span>
                        <span className="font-medium">{c.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Instructor</span>
                        <span className="font-medium">{c.instructor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Seats</span>
                        <span className="font-medium">{c.enrolled}/{c.seats}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-border/60">
                      <div className="font-bold text-primary">Rs {c.fee.toLocaleString()}</div>
                      <Button size="sm" variant={c.status === "full" ? "outline" : "default"} disabled={c.status === "full"} className="h-7 text-xs gradient-royal">
                        {c.status === "full" ? "Full" : "Enroll"}
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Scholarships */}
          <TabsContent value="scholarships" className="mt-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(scholarshipsQuery.data?.data?.scholarships || []).length === 0 ? (
                <Card className="p-8 sm:col-span-2 lg:col-span-3 text-center border-border/60">
                  <Gift className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm text-muted-foreground">No scholarships currently offered by this academy.</p>
                </Card>
              ) : (scholarshipsQuery.data?.data?.scholarships || []).map((s: any, i: number) => (
                <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="p-5 border-border/60 shadow-card h-full flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 text-white shadow-md">
                        <Award className="h-5 w-5" />
                      </div>
                      <Badge variant={s.status === "active" ? "default" : "outline"} className="text-[10px] capitalize">
                        {s.status}
                      </Badge>
                    </div>
                    <h4 className="font-bold text-sm mb-1">{s.title}</h4>
                    <div className="text-lg font-bold gradient-text mb-2">{s.amount}</div>
                    <p className="text-xs text-muted-foreground flex-1 mb-3 line-clamp-3">{s.description}</p>
                    <div className="space-y-1.5 text-xs mb-3 pt-3 border-t border-border/60">
                      <div className="flex items-start gap-1.5">
                        <Users className="h-3 w-3 text-muted-foreground mt-0.5" />
                        <span>{s.eligibility}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span>Deadline: {s.deadline}</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="gradient-emerald w-full"
                      onClick={() => {
                        if (!user) {
                          toast.error("Please login to apply");
                          navigate({ name: "auth", tab: "student-login" });
                          return;
                        }
                        toast.success(`Application started for "${s.title}". Academy will contact you soon.`);
                      }}
                    >
                      Apply Now
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="teachers" className="mt-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {teachers.length === 0 ? (
                <Card className="p-6 sm:col-span-2 lg:col-span-3 text-center border-border/60">
                  <p className="text-sm text-muted-foreground">No teacher information available.</p>
                </Card>
              ) : teachers.map((t: any, i: number) => (
                <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="p-5 border-border/60 shadow-card text-center">
                    <Avatar className="h-16 w-16 mx-auto mb-3">
                      <AvatarFallback className="gradient-royal text-white">
                        {t.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <h4 className="font-bold text-sm">{t.name}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{t.specialization}</p>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div>{t.qualification}</div>
                      <div>{t.experience} experience</div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="gallery" className="mt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {(gallery.length > 0 ? gallery : [
                { emoji: "🎓", gradient: (academy as any).coverColor, title: "Graduation" },
                { emoji: "📚", gradient: "linear-gradient(135deg, #10B981, #059669)", title: "Library" },
                { emoji: "💻", gradient: "linear-gradient(135deg, #8B5CF6, #6D28D9)", title: "Lab" },
                { emoji: "🏛️", gradient: "linear-gradient(135deg, #F59E0B, #D97706)", title: "Building" },
                { emoji: "👩‍🏫", gradient: "linear-gradient(135deg, #EC4899, #BE185D)", title: "Classroom" },
                { emoji: "🏆", gradient: "linear-gradient(135deg, #06B6D4, #0891B2)", title: "Award" },
                { emoji: "🔬", gradient: "linear-gradient(135deg, #3B82F6, #1D4ED8)", title: "Lab" },
                { emoji: "🎯", gradient: "linear-gradient(135deg, #059669, #047857)", title: "Activity" },
              ]).map((img, i) => (
                <Card key={i} className="p-0 border-border/60 shadow-card overflow-hidden aspect-video group relative">
                  {img.url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={img.url} alt={img.title || `Photo ${i + 1}`} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl" style={{ background: img.gradient }}>
                      {img.emoji}
                    </div>
                  )}
                  {img.title && (
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="text-white text-xs font-medium">{img.title}</div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="p-6 border-border/60 shadow-card h-fit">
                <h3 className="font-semibold mb-4">Rating Breakdown</h3>
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold">{academy.rating}</div>
                  <div className="flex justify-center gap-0.5 my-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < Math.round(academy.rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground">{academy.reviewsCount} reviews</div>
                </div>

                {/* AI Summary Button */}
                <div className="border-t border-border/60 pt-4 mt-4">
                  <Button
                    className="w-full gradient-royal"
                    size="sm"
                    onClick={generateSummary}
                    disabled={summarizeReviews.isPending || reviews.length === 0}
                  >
                    {summarizeReviews.isPending ? (
                      <span className="flex items-center gap-2">
                        <span className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Analyzing...
                      </span>
                    ) : (
                      <>
                        <Sparkles className="h-3.5 w-3.5 mr-1.5" /> AI Review Summary
                      </>
                    )}
                  </Button>
                </div>

                <AnimatePresence>
                  {reviewSummary && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 space-y-3"
                    >
                      <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/20">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1.5">
                          <ThumbsUp className="h-3 w-3" /> Pros
                        </div>
                        <ul className="space-y-1">
                          {(reviewSummary.pros || []).map((p: string, i: number) => (
                            <li key={i} className="text-xs text-foreground">• {p}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-500/20">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-red-700 dark:text-red-400 mb-1.5">
                          <ThumbsDown className="h-3 w-3" /> Cons
                        </div>
                        <ul className="space-y-1">
                          {(reviewSummary.cons || []).map((c: string, i: number) => (
                            <li key={i} className="text-xs text-foreground">• {c}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3 rounded-lg bg-violet-50 dark:bg-violet-950/20 border border-violet-500/20">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-violet-700 dark:text-violet-400 mb-1.5">
                          <Lightbulb className="h-3 w-3" /> Verdict
                        </div>
                        <p className="text-xs text-foreground">{reviewSummary.verdict}</p>
                      </div>

                      {reviewSummary.sentiment && (
                        <div className="flex gap-1 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-500" style={{ width: `${reviewSummary.sentiment.positive}%` }} />
                          <div className="bg-amber-500" style={{ width: `${reviewSummary.sentiment.neutral}%` }} />
                          <div className="bg-red-500" style={{ width: `${reviewSummary.sentiment.negative}%` }} />
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>

              <div className="lg:col-span-2 space-y-4">
                <Card className="p-5 border-border/60 shadow-card">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" /> Write a Review
                  </h3>
                  <div className="space-y-3">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((r) => (
                        <button key={r} onClick={() => setNewReview({ ...newReview, rating: r })}>
                          <Star className={`h-6 w-6 transition-all ${r <= newReview.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40 hover:text-amber-400"}`} />
                        </button>
                      ))}
                    </div>
                    <Textarea
                      placeholder="Share your experience..."
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      rows={3}
                    />
                    <Button className="gradient-royal" onClick={submitReview} disabled={createReview.isPending}>
                      <Send className="h-4 w-4 mr-1.5" /> Submit Review
                    </Button>
                  </div>
                </Card>

                {reviews.map((r: any, i: number) => (
                  <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <Card className="p-5 border-border/60 shadow-card">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="text-xs">
                              {r.studentName.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold text-sm">{r.studentName}</div>
                            <div className="text-xs text-muted-foreground">{timeAgo(r.date)}</div>
                          </div>
                        </div>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star key={idx} className={`h-3.5 w-3.5 ${idx < r.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{r.comment}</p>
                      {r.reply && (
                        <div className="mt-3 p-3 rounded-lg bg-muted/40 border-l-2 border-primary">
                          <div className="text-xs font-semibold mb-1">Academy Reply</div>
                          <p className="text-xs text-muted-foreground">{r.reply}</p>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="updates" className="mt-6">
            <div className="space-y-3 max-w-3xl">
              {announcements.length === 0 ? (
                <Card className="p-8 text-center border-border/60">
                  <Calendar className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm text-muted-foreground">No recent announcements from this academy.</p>
                </Card>
              ) : announcements.map((a: any, i: number) => (
                <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="p-5 border-border/60 shadow-card">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{a.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{a.content}</p>
                        <div className="text-[10px] text-muted-foreground mt-2">{formatDate(a.date)}</div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="contact" className="mt-6">
            <div className="grid lg:grid-cols-2 gap-6 max-w-4xl">
              <Card className="p-6 border-border/60 shadow-card">
                <h3 className="font-semibold mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-500">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Address</div>
                      <div className="text-sm font-medium">{academy.address}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Phone</div>
                      <div className="text-sm font-medium">{academy.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-500">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Email</div>
                      <div className="text-sm font-medium">{academy.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-violet-500/10 text-violet-500">
                      <Globe className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Website</div>
                      <div className="text-sm font-medium">{academy.website || "—"}</div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-border/60 shadow-card">
                <h3 className="font-semibold mb-4">Send an Inquiry</h3>
                <div className="space-y-3">
                  <Textarea
                    placeholder="Your message..."
                    rows={4}
                    value={inquiry.message}
                    onChange={(e) => setInquiry({ message: e.target.value })}
                  />
                  <Button
                    className="w-full gradient-royal"
                    onClick={submitInquiry}
                    disabled={createInquiry.isPending}
                  >
                    <Send className="h-4 w-4 mr-1.5" /> Send Inquiry
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
