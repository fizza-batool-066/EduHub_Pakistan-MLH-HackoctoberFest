"use client";

import { motion } from "framer-motion";
import {
  Search, GitCompare, Sparkles, MapPin, Star, Bookmark, MessageSquare,
  ShieldCheck, Clock, BarChart3, GraduationCap, Wallet, Users, ArrowRight,
  CheckCircle2, Zap, Brain, Target, TrendingUp, Award,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/context/AppContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function Features() {
  const features = [
    {
      icon: Search,
      title: "Smart Search",
      description: "Find academies with advanced filters for city, area, course, budget, ratings, distance, and timings.",
      gradient: "from-blue-500 to-blue-700",
    },
    {
      icon: GitCompare,
      title: "Compare Academies",
      description: "Compare up to 4 academies side-by-side across fees, courses, ratings, facilities, and more.",
      gradient: "from-emerald-500 to-emerald-700",
    },
    {
      icon: Sparkles,
      title: "AI Advisor",
      description: "Get personalized academy recommendations based on your career goals, budget, and preferences.",
      gradient: "from-violet-500 to-purple-700",
    },
    {
      icon: MapPin,
      title: "Nearby Discovery",
      description: "Find academies close to your location with distance sorting and map placeholders.",
      gradient: "from-pink-500 to-rose-600",
    },
    {
      icon: Star,
      title: "Verified Reviews",
      description: "Read authentic reviews from students who have actually enrolled in the courses.",
      gradient: "from-amber-500 to-orange-600",
    },
    {
      icon: ShieldCheck,
      title: "Verified Academies",
      description: "Every listed academy goes through a verification process for authenticity and quality.",
      gradient: "from-cyan-500 to-blue-600",
    },
  ];

  return (
    <section id="features" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Features</Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Everything you need to find the{" "}
            <span className="gradient-text">perfect academy</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            From AI-powered recommendations to detailed comparisons, EduHub Pakistan provides all the tools you need to make the right educational choice.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{ y: -4 }}
            >
              <Card className="p-6 h-full border-border/60 shadow-card hover:shadow-glow transition-all duration-300 group">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${f.gradient} text-white shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    { icon: Search, title: "Search Academies", description: "Browse thousands of academies across Pakistan using powerful filters tailored to your needs.", color: "text-blue-500" },
    { icon: GitCompare, title: "Compare Options", description: "Shortlist and compare academies side-by-side on fees, courses, ratings, and facilities.", color: "text-emerald-500" },
    { icon: Sparkles, title: "Get AI Recommendations", description: "Let our AI Advisor suggest the best academies based on your career goals and budget.", color: "text-violet-500" },
    { icon: GraduationCap, title: "Enroll & Succeed", description: "Apply directly to your chosen academy and start your educational journey today.", color: "text-amber-500" },
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">How It Works</Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Find your academy in{" "}
            <span className="gradient-text">4 simple steps</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Our streamlined process helps you discover, compare, and enroll in the perfect academy in minutes.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative"
            >
              <Card className="p-6 border-border/60 shadow-card h-full text-center">
                <div className="relative inline-flex mb-4">
                  <div className={`p-4 rounded-2xl bg-muted/60 ${step.color}`}>
                    <step.icon className="h-7 w-7" />
                  </div>
                  <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full gradient-royal text-white text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </div>
                </div>
                <h3 className="font-bold text-base mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </Card>
              {i < steps.length - 1 && (
                <ArrowRight className="hidden lg:block absolute top-1/2 -right-3 h-5 w-5 text-muted-foreground/40 -translate-y-1/2" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AIFeatures() {
  const aiFeatures = [
    { icon: Brain, title: "Smart Matching", description: "Our AI analyzes your preferences, budget, and career goals to suggest the perfect academies with 95% accuracy." },
    { icon: Target, title: "Career Path Prediction", description: "Get insights on which courses align best with your dream career, with predicted salary ranges and growth prospects." },
    { icon: TrendingUp, title: "Trend Analysis", description: "AI-powered trend analysis shows which courses and academies are gaining popularity in your region." },
    { icon: Zap, title: "Instant Recommendations", description: "Get personalized recommendations in seconds — no waiting, no spam, just actionable insights." },
  ];

  return (
    <section id="ai-features" className="py-20 lg:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-transparent to-emerald-50 dark:from-violet-950/20 dark:to-emerald-950/20" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20">
              <Sparkles className="h-3 w-3 mr-1" /> AI-Powered
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              AI that understands your{" "}
              <span className="gradient-text">educational journey</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg mb-8">
              Our advanced AI engine processes data from thousands of academies, courses, and student outcomes to deliver recommendations that actually make sense for your future.
            </p>
            <div className="space-y-4">
              {aiFeatures.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 text-white">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{f.title}</h4>
                    <p className="text-sm text-muted-foreground">{f.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <Card className="p-6 shadow-2xl border-border/60 bg-card/90 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-2xl gradient-royal flex items-center justify-center animate-pulse-glow">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-lg">AI Advisor</div>
                  <div className="text-xs text-muted-foreground">Personalized for you</div>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Based on Career Goal", value: "Software Engineer", match: 98 },
                  { label: "Budget Match", value: "Rs 50K - 100K", match: 95 },
                  { label: "Location Preference", value: "Lahore", match: 100 },
                  { label: "Course Alignment", value: "Web Development", match: 92 },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="p-3 rounded-xl bg-muted/50 border border-border/40"
                  >
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-semibold">{item.match}% Match</span>
                    </div>
                    <div className="text-sm font-semibold mb-2">{item.value}</div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.match}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                        className="h-full gradient-royal rounded-full"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
              <Button className="w-full mt-6 gradient-royal">
                Try AI Advisor <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function Benefits() {
  const benefits = [
    { icon: Wallet, title: "Save Money", description: "Compare fees across academies and find the best value for your budget.", stat: "Save up to 40%" },
    { icon: Clock, title: "Save Time", description: "No more visiting dozens of academies — get all info in one place.", stat: "10x Faster" },
    { icon: Award, title: "Best Quality", description: "Make informed decisions with verified reviews and ratings.", stat: "95% Accuracy" },
    { icon: Users, title: "Join Community", description: "Connect with thousands of students who found their academy through EduHub.", stat: "48K+ Students" },
  ];

  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <Badge className="mb-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">Benefits</Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Why students choose{" "}
            <span className="gradient-text">EduHub Pakistan</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Card className="p-6 border-border/60 shadow-card hover:shadow-glow transition-all h-full text-center">
                <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white mb-4 shadow-lg">
                  <b.icon className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold gradient-text mb-2">{b.stat}</div>
                <h3 className="font-bold text-base mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground">{b.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Testimonials() {
  const testimonials = [
    { name: "Ahsan Khan", role: "CCNA Student, Lahore", avatar: "👨‍🎓", rating: 5, content: "EduHub Pakistan helped me find the perfect networking academy. The AI recommendations were spot on — I'm now CCNA certified and working at a top IT firm!" },
    { name: "Fatima Ali", role: "MDCAT Aspirant, Karachi", avatar: "👩‍🎓", rating: 5, content: "The comparison feature was a game-changer. I could see all the top MDCAT prep academies side by side and pick the one that fit my budget and learning style." },
    { name: "Bilal Ahmed", role: "Software Engineering Student", avatar: "👨‍💻", rating: 5, content: "I was confused about which programming bootcamp to join. The AI Advisor analyzed my goals and recommended Aptech — best decision of my career!" },
    { name: "Zainab Hassan", role: "Cybersecurity Professional", avatar: "👩‍💻", rating: 5, content: "From finding the academy to enrolling — EduHub made the whole process effortless. The reviews from real students gave me confidence in my choice." },
  ];

  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <Badge className="mb-4 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">Testimonials</Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Loved by students{" "}
            <span className="gradient-text">across Pakistan</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Join thousands of students who found their perfect academy through EduHub Pakistan.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{ y: -4 }}
            >
              <Card className="p-6 border-border/60 shadow-card h-full flex flex-col">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, idx) => (
                    <Star key={idx} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground flex-1 mb-4 italic">"{t.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-xl">{t.avatar}</div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FAQ() {
  const faqs = [
    { q: "Is EduHub Pakistan free to use for students?", a: "Yes! EduHub Pakistan is completely free for students. You can search, compare, and get AI recommendations without any cost. We believe educational discovery should be accessible to everyone." },
    { q: "How does the AI Advisor work?", a: "Our AI Advisor analyzes your inputs — city, budget, course preference, career goal, and timings — to match you with the most suitable academies. It uses data from thousands of academies and student outcomes to deliver personalized recommendations with high accuracy." },
    { q: "Are the academy listings verified?", a: "Yes, every academy on EduHub Pakistan goes through a verification process. Verified academies display a blue badge. We regularly update academy information to ensure accuracy of fees, courses, and contact details." },
    { q: "Can I register my academy on EduHub Pakistan?", a: "Absolutely! Click on 'Register Academy' and sign up as an academy owner. Once your registration is approved, you can list your academy, manage courses, students, teachers, and announcements — all from a beautiful dashboard." },
    { q: "How accurate are the reviews?", a: "Reviews on EduHub Pakistan are submitted by verified students who have enrolled in courses. We have a moderation system in place to ensure authenticity. Fake or spam reviews are removed promptly." },
    { q: "Does EduHub Pakistan work on mobile?", a: "Yes, our platform is fully responsive and works seamlessly on mobile devices, tablets, and desktops. You can access all features including search, comparison, and AI Advisor from any device." },
  ];

  return (
    <section id="faq" className="py-20 lg:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">FAQ</Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Frequently asked{" "}
            <span className="gradient-text">questions</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Everything you need to know about EduHub Pakistan.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="p-6 border-border/60 shadow-card">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

export function CTASection() {
  const { navigate } = useApp();
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="relative overflow-hidden p-8 sm:p-12 lg:p-16 text-center border-0">
            <div className="absolute inset-0 gradient-royal" />
            <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
                Ready to find your{" "}
                <span className="text-amber-300">perfect academy?</span>
              </h2>
              <p className="text-white/80 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
                Join 48,000+ students who have already discovered their ideal educational institute through EduHub Pakistan.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-primary hover:bg-white/90 h-12 px-8"
                  onClick={() => navigate({ name: "auth", tab: "student-signup" })}
                >
                  Get Started Free <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-white/30 text-white hover:bg-white/10 h-12 px-8"
                  onClick={() => navigate({ name: "search" })}
                >
                  Browse Academies
                </Button>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-white/80 text-sm">
                <div className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-amber-300" /> No credit card required</div>
                <div className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-amber-300" /> Free forever for students</div>
                <div className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-amber-300" /> 24/7 AI Advisor access</div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

export function Footer() {
  const { navigate } = useApp();
  const footerSections = [
    {
      title: "For Students",
      links: ["Search Academies", "Compare", "AI Advisor", "Reviews", "Saved Academies"],
    },
    {
      title: "For Academies",
      links: ["Register Academy", "Pricing", "Analytics", "Promote", "Resources"],
    },
    {
      title: "Company",
      links: ["About Us", "Careers", "Blog", "Press", "Contact"],
    },
    {
      title: "Support",
      links: ["Help Center", "Privacy Policy", "Terms of Service", "Cookie Policy", "Sitemap"],
    },
  ];

  return (
    <footer className="border-t border-border/60 bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-9 w-9 rounded-xl gradient-royal flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div className="font-bold text-lg">
                EduHub<span className="text-primary"> Pakistan</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs">
              Pakistan's #1 AI-powered academy discovery platform. Find, compare, and enroll in the best educational institutes across the country.
            </p>
            <div className="flex gap-2">
              {["📘", "🐦", "📷", "▶️", "💼"].map((emoji, i) => (
                <button
                  key={i}
                  className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-sm mb-4">{section.title}</h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link}>
                    <button
                      onClick={() => {
                        if (link === "Search Academies") navigate({ name: "search" });
                        else if (link === "Register Academy") navigate({ name: "auth", tab: "academy-signup" });
                      }}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors text-left"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 EduHub Pakistan. All rights reserved. Made with ❤️ in Pakistan.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>🇵🇰 Available in 12+ cities</span>
            <span>•</span>
            <span>48,000+ Active Students</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
