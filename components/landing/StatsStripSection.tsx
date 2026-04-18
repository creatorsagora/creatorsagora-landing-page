"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type StatItem = {
  id: string;
  label: string;
  target: number;
  suffix: "M+" | "K+" | "+" | "%";
  trend: string;
};

const stats: StatItem[] = [
  { id: "reach", label: "Total Reach Delivered", target: 500, suffix: "M+", trend: "+18%" },
  { id: "campaigns", label: "Campaigns Launched", target: 10, suffix: "K+", trend: "+22%" },
  { id: "creators", label: "Active Creators", target: 2_000, suffix: "+", trend: "+31%" },
  { id: "satisfaction", label: "Client Satisfaction", target: 95, suffix: "%", trend: "+9%" }
];

function formatStatValue(value: number, stat: StatItem) {
  const rounded = Math.round(value);

  if (stat.suffix === "M+") return `${rounded.toLocaleString()}M+`;
  if (stat.suffix === "K+") return `${rounded.toLocaleString()}K+`;
  if (stat.suffix === "%") return `${rounded}%`;
  return `${rounded.toLocaleString()}+`;
}

export function StatsStripSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [progress, setProgress] = useState(0);

  const values = useMemo(() => {
    const eased = 1 - Math.pow(1 - progress, 3);
    return stats.reduce<Record<string, number>>((acc, stat) => {
      acc[stat.id] = stat.target * eased;
      return acc;
    }, {});
  }, [progress]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.28 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(1);
      return;
    }

    const duration = 1700;
    let rafId = 0;
    const startedAt = performance.now();

    const step = (now: number) => {
      const nextProgress = Math.min((now - startedAt) / duration, 1);
      setProgress(nextProgress);
      if (nextProgress < 1) {
        rafId = window.requestAnimationFrame(step);
      }
    };

    rafId = window.requestAnimationFrame(step);

    return () => window.cancelAnimationFrame(rafId);
  }, [hasAnimated]);

  return (
    <section className="pro-section px-4 pb-4 pt-12 sm:px-6 md:pt-14 lg:px-10 lg:pt-16 xl:px-16" id="stats-section" ref={sectionRef}>
      <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-12">
        {stats.map((stat) => (
          <article className="flex flex-col items-center justify-center px-2 text-center" key={stat.id}>
            <strong className="mono-stat block text-[clamp(1.85rem,3.8vw,2.9rem)] leading-none tracking-[-0.04em] text-[#24231f]">
              {formatStatValue(values[stat.id] ?? 0, stat)}
            </strong>
            <span className="mt-3 block text-[clamp(0.88rem,1.05vw,0.98rem)] font-medium text-[#847d6d]">
              {stat.label}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}


