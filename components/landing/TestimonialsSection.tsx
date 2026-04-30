"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Star } from "lucide-react";

type Testimonial = {
  quote: string;
  miniQuote: string;
  name: string;
  role: string;
  date: string;
  avatar: string;
};

const testimonials: Testimonial[] = [
  {
    quote: '"Transformed our campaign performance overnight. ROI up 347% in first month."',
    miniQuote: "Campaign performance transformed",
    name: "Sarah Chen",
    role: "Head of Growth @ FintechCo",
    date: "2 weeks ago",
    avatar: "https://i.pravatar.cc/150?img=12"
  },
  {
    quote: '"Best platform we\'ve used for audience targeting. Precision is unmatched."',
    miniQuote: "Unmatched audience targeting",
    name: "Michael Rodriguez",
    role: "Marketing Director @ HealthTech",
    date: "1 month ago",
    avatar: "https://i.pravatar.cc/150?img=32"
  },
  {
    quote: '"Seamless integration, incredible results. Our engagement doubled instantly."',
    miniQuote: "Engagement doubled instantly",
    name: "Emma Wilson",
    role: "CMO @ SaaS Startup",
    date: "3 weeks ago",
    avatar: "https://i.pravatar.cc/150?img=47"
  },
  {
    quote: '"From setup to scale-up, everything works perfectly. Highly recommend!"',
    miniQuote: "Perfect from setup to scale-up",
    name: "David Kim",
    role: "Growth Lead @ Ecommerce",
    date: "4 days ago",
    avatar: "https://i.pravatar.cc/150?img=21"
  },
  {
    quote: '"Analytics are gold. Real-time insights changed how we optimize campaigns."',
    miniQuote: "Real-time insights changed everything",
    name: "Lisa Patel",
    role: "Performance Marketer @ Agency",
    date: "2 months ago",
    avatar: "https://i.pravatar.cc/150?img=38"
  },
  {
    quote: '"Support team is phenomenal. Went live in hours with zero headaches."',
    miniQuote: "Live in hours with zero headaches",
    name: "James O\'Connor",
    role: "Founder @ Creator Platform",
    date: "1 week ago",
    avatar: "https://i.pravatar.cc/150?img=5"
  }
];

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [phase, setPhase] = useState<"idle" | "card-out" | "beam" | "card-in">("idle");
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true);
  const timersRef = useRef<number[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  };

  const startTransition = (nextIndex: number) => {
    if (nextIndex === activeIndex) return;

    clearTimers();

    if (prefersReducedMotion) {
      setActiveIndex(nextIndex);
      setPhase("idle");
      return;
    }

    setPhase("card-out");

    timersRef.current.push(
      window.setTimeout(() => {
        setPhase("beam");
      }, 420)
    );

    timersRef.current.push(
      window.setTimeout(() => {
        setActiveIndex(nextIndex);
        setPhase("card-in");
      }, 1040)
    );

    timersRef.current.push(
      window.setTimeout(() => {
        setPhase("idle");
      }, 1960)
    );
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setPrefersReducedMotion(mediaQuery.matches);

    syncPreference();
    mediaQuery.addEventListener?.("change", syncPreference);

    return () => mediaQuery.removeEventListener?.("change", syncPreference);
  }, []);

  useEffect(() => {
    return () => clearTimers();
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || phase !== "idle") return;

    const timeout = window.setTimeout(() => {
      startTransition((activeIndex + 1) % testimonials.length);
    }, 3600);

    return () => window.clearTimeout(timeout);
  }, [activeIndex, phase, prefersReducedMotion]);

  const activeTestimonial = testimonials[activeIndex];
  const sideNotes = useMemo(
    () =>
      [1, 2, 3, 4].map((offset) => testimonials[(activeIndex + offset) % testimonials.length]),
    [activeIndex]
  );
  const beamClipPath = "polygon(0 0, 100% 5%, 38% 100%, 14% 11%)";
  const beamStyle = {
    clipPath: beamClipPath,
    background:
      "linear-gradient(118deg, rgba(11,8,25,0.98) 0%, rgba(24,15,54,0.98) 34%, rgba(72,45,171,0.96) 70%, rgba(150,129,255,0.94) 100%)"
  };
  const beamShadowStyle = {
    clipPath: beamClipPath,
    background:
      "radial-gradient(circle at 74% 24%, rgba(174,157,255,0.56) 0%, rgba(174,157,255,0.22) 18%, rgba(174,157,255,0) 40%), linear-gradient(118deg, rgba(92,70,209,0.42) 0%, rgba(76,58,255,0.18) 72%, rgba(76,58,255,0.03) 100%)"
  };
  const beamHighlightStyle = {
    clipPath: beamClipPath,
    background:
      "radial-gradient(circle at 72% 22%, rgba(206,192,255,0.42) 0%, rgba(206,192,255,0.12) 16%, rgba(206,192,255,0) 32%), linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(198,184,255,0.1) 62%, rgba(198,184,255,0.2) 100%)"
  };

  return (
    <section className="pro-section py-14 md:py-20" id="about">
      <div className="pro-container">
        <header className="mx-auto max-w-[780px] text-center">
          <span className="section-eyebrow">Social Proof</span>
          <h2 className="section-heading mt-5">What Teams Say After Going Live</h2>
        </header>

        <div className="relative mt-10 overflow-hidden rounded-[24px] bg-[#f1ecdf] px-4 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] md:px-6 md:py-7 lg:min-h-[640px] lg:px-8 lg:py-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(76,58,255,0.08),transparent_24%),radial-gradient(circle_at_92%_16%,rgba(76,58,255,0.05),transparent_24%),radial-gradient(circle_at_20%_82%,rgba(76,58,255,0.04),transparent_28%)]" />
          <div className="relative z-30 lg:min-h-[528px]">
            <div
              className={`pointer-events-none absolute left-[0.5%] top-0 hidden h-full w-[84%] origin-top-left transition-opacity duration-500 lg:block ${
                phase === "card-out" ? "opacity-0" : "opacity-100"
              } ${
                phase === "beam" ? "animate-testimonial-beam-drop" : ""
              }`}
            >
              <div className="absolute inset-0 opacity-85 blur-[62px]" style={beamShadowStyle} />
              <div className="absolute inset-0 opacity-85 blur-[24px]" style={beamHighlightStyle} />
              <div className="absolute inset-0 shadow-[0_42px_96px_rgba(76,58,255,0.2)]" style={beamStyle} />
            </div>

            <div className="absolute left-6 top-3 z-20 hidden w-[268px] flex-col gap-2.5 lg:flex">
              {sideNotes.map((note, index) => (
                <article
                  className="animate-testimonial-chip rounded-[16px] border border-white/75 bg-white/96 px-3.5 py-3 text-left shadow-[0_18px_42px_rgba(76,58,255,0.14),0_12px_28px_rgba(13,17,24,0.06)]"
                  key={`${note.name}-${note.date}`}
                  style={{ animationDelay: `${index * 120}ms`, marginLeft: `${index * 10}px` }}
                >
                  <div className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className="block size-10 shrink-0 rounded-full border border-white bg-cover bg-center bg-no-repeat shadow-[0_8px_20px_rgba(76,58,255,0.2)]"
                      style={{ backgroundImage: `url(${note.avatar})` }}
                    />
                    <div className="min-w-0">
                      <p className="text-[0.8rem] font-semibold leading-5 text-[#5e584b]">{note.name}</p>
                      <p className="mt-1 text-[0.79rem] leading-[1.45] text-[#1d1d19]/92">{note.miniQuote}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="relative mx-auto flex w-full justify-end">
              <article
                className={`w-full rounded-[28px] border border-[#4C3AFF]/28 bg-[#fffdfa] p-6 shadow-[0_28px_96px_rgba(76,58,255,0.15),0_18px_44px_rgba(12,16,22,0.06)] md:p-8 lg:mr-[0.6%] lg:min-h-[528px] lg:w-[67%] lg:p-10 ${
                  phase === "card-out"
                    ? "animate-testimonial-card-out"
                    : phase === "card-in"
                      ? "animate-testimonial-card-in"
                      : ""
                }`}
                key={`${activeTestimonial.name}-${activeTestimonial.date}`}
                style={
                  phase === "beam"
                    ? {
                        opacity: 0,
                        transform: "translate3d(28px, 12px, 0) scale(0.985)",
                        filter: "blur(12px)"
                      }
                    : undefined
                }
              >
                <div className="flex h-full flex-col justify-between gap-10">
                  <p className="max-w-[16ch] text-[clamp(1.8rem,3.2vw,3.35rem)] font-semibold leading-[1.06] tracking-[-0.05em] text-[#1f1f1b]">
                    {activeTestimonial.quote}
                  </p>

                  <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-[28rem]">
                      <strong className="block text-[clamp(1.3rem,2vw,2rem)] font-semibold tracking-[-0.04em] text-[#1f1f1b]">
                        {activeTestimonial.name}
                      </strong>
                      <p className="mt-1 text-sm text-[#6d6658]">{activeTestimonial.role}</p>
                      <p className="text-sm text-[#6d6658]">{activeTestimonial.date}</p>
                      <span className="mt-5 block h-px w-full max-w-[30rem] border-b border-dashed border-[#7b776d]" />
                    </div>

                    <span className="inline-flex gap-1.5 self-start text-[#4C3AFF] md:self-auto">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star key={`star-${activeTestimonial.name}-${index}`} size={20} fill="currentColor" />
                      ))}
                    </span>
                  </div>
                </div>
              </article>
            </div>
          </div>

          <div className="relative z-30 mt-6 flex justify-center gap-2">
            {testimonials.map((testimonial, index) => (
              <button
                aria-label={`Show testimonial from ${testimonial.name}`}
                className={`h-2.5 rounded-full transition-all ${
                  index === activeIndex ? "w-9 bg-[#4C3AFF]" : "w-2.5 bg-black/15 hover:bg-black/25"
                }`}
                key={`dot-${testimonial.name}`}
                onClick={() => startTransition(index)}
                type="button"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
