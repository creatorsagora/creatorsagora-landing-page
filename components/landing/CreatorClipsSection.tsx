"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";

type Mode = "promoter" | "creator";

type ClipItem = {
  type: "video" | "image";
  src: string;
  poster?: string;
  alt: string;
};

const promoterClips: ClipItem[] = [
  {
    type: "video",
    src: "/promoter%20video.mp4",
    poster: "/authimg1.jpg",
    alt: "Promoter creator campaign clip"
  },
  {
    type: "image",
    src: "/authimg1.jpg",
    alt: "Promoter auth visual one"
  },
  {
    type: "image",
    src: "/authimg2.jpg",
    alt: "Promoter auth visual two"
  }
];

const creatorClips: ClipItem[] = [
  {
    type: "video",
    src: "/creatorvideo1.mp4",
    poster: "/authimg3.jpg",
    alt: "Creator performance clip one"
  },
  {
    type: "image",
    src: "/authimg4.jpg",
    alt: "Creator auth visual"
  },
  {
    type: "video",
    src: "/creatorvideo2.mp4",
    poster: "/authimg2.jpg",
    alt: "Creator performance clip two"
  }
];

const contentByMode: Record<Mode, { eyebrow: string; title: string; subtitle: string; buttonLabel: string }> = {
  promoter: {
    eyebrow: "Promoter Experience",
    title: "Plan, Match, and Scale Creator Campaigns Faster",
    subtitle: "Watch how promoter workflows move from brief to creator execution with cleaner control and visibility.",
    buttonLabel: "Start as Promoter"
  },
  creator: {
    eyebrow: "Creator Experience",
    title: "Showcase Talent and Win Better Brand Collaborations",
    subtitle: "See how creators discover briefs, submit content, and grow engagement with structured campaign support.",
    buttonLabel: "Join as Creator"
  }
};

export function CreatorClipsSection() {
  const [mode, setMode] = useState<Mode>("promoter");

  const clips = useMemo(() => (mode === "promoter" ? promoterClips : creatorClips), [mode]);
  const loopedClips = useMemo(() => [...clips, ...clips], [clips]);
  const content = contentByMode[mode];

  return (
    <section className="w-full min-h-[600px] py-12 md:py-16 bg-black">
      <div className="max-w-6xl mx-auto px-4">
        <div className="overflow-hidden rounded-[24px] border border-black/40 bg-black p-4 shadow-[0_20px_48px_rgba(0,0,0,0.5)] sm:p-6 md:p-7">
          <div className="mt-5 grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
            <div className="flex h-full flex-col rounded-[18px] border border-white/10 bg-black p-5">
              <span className="text-[0.76rem] font-semibold uppercase tracking-[0.16em] text-white/70">{content.eyebrow}</span>
              <h3 className="mt-3 font-display text-[clamp(1.4rem,3vw,2.2rem)] font-extrabold leading-[1.04] tracking-[-0.03em] text-white">
                {content.title}
              </h3>
              <p className="mt-3 text-[0.96rem] leading-7 text-white/80">{content.subtitle}</p>
              <button
                className="mt-auto inline-flex h-11 w-fit items-center gap-2 px-5 py-0 text-sm rounded-full bg-white text-black font-semibold shadow hover:bg-neutral-200 transition"
                type="button"
              >
                {content.buttonLabel}
                <ArrowUpRight size={14} />
              </button>
            </div>
            <div className="relative overflow-hidden rounded-[18px] border border-white/10 bg-black p-3">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-gradient-to-r from-black to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-black to-transparent" />
              <div className="creator-clips-track flex w-max gap-3 pr-3">
                {loopedClips.map((clip, index) => (
                  <div className="h-[250px] w-[170px] shrink-0 overflow-hidden rounded-[14px] border border-white/10 bg-black sm:h-[300px] sm:w-[200px]" key={`${mode}-clip-${index}`}>
                    {clip.type === "video" ? (
                      <video
                        autoPlay
                        className="pointer-events-none h-full w-full object-cover"
                        loop
                        muted
                        playsInline
                        poster={clip.poster}
                        preload="metadata"
                        src={clip.src}
                      />
                    ) : (
                      <img alt={clip.alt} className="h-full w-full object-cover" loading="lazy" src={clip.src} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .creator-clips-track {
          animation: creatorClipsSlide 30s linear infinite;
        }
        @keyframes creatorClipsSlide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-50% - 6px));
          }
        }
      `}</style>
    </section>
  );
}
