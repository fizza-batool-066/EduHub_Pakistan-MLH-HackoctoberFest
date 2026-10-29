"use client";

import { LandingNavbar } from "./LandingNavbar";
import { Hero } from "./Hero";
import {
  Features,
  HowItWorks,
  AIFeatures,
  Benefits,
  Testimonials,
  FAQ,
  CTASection,
  Footer,
} from "./Sections";

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingNavbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <AIFeatures />
        <Benefits />
        <Testimonials />
        <FAQ />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
