"use client";

import { CtaSection } from "@/components/landing/CtaSection";
import { CreatorClipsSection } from "@/components/landing/CreatorClipsSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { FooterSection } from "@/components/landing/FooterSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { RoleShowcaseSection } from "@/components/landing/RoleShowcaseSection";
import { StatsStripSection } from "@/components/landing/StatsStripSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";

export default function HomePage() {
  return (
    <main className="relative overflow-hidden bg-[#f7f4ea] text-[#111111]">
      <HeroSection />
      <StatsStripSection />
      <CreatorClipsSection />
      <FeaturesSection />
      <RoleShowcaseSection />
      <TestimonialsSection />
      <CtaSection />
      <FooterSection />
    </main>
  );
}
