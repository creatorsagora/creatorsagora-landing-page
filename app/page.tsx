import { CtaSection } from "@/components/landing/CtaSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { FooterSection } from "@/components/landing/FooterSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { StatsStripSection } from "@/components/landing/StatsStripSection";
import { StepsSection } from "@/components/landing/StepsSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";

export default function HomePage() {
  return (
    <main className="relative overflow-hidden bg-[#f7f4ea] text-[#111111]">
      <HeroSection />
      <StatsStripSection />
      <FeaturesSection />
      {/* <StepsSection /> */}
      <TestimonialsSection />
      <CtaSection />
      <FooterSection />
    </main>
  );
}
