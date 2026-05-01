"use client";

import { useMemo, useState } from "react";
import { PlayCircle } from "lucide-react";

type ShowcaseMode = "promoter" | "creator";

type MediaItem = {
  type: "video" | "image";
  src: string;
  poster?: string;
  alt: string;
  title: string;
  note: string;
};

const promoterMedia: MediaItem[] = [
  {
    type: "video",
    src: "/promoter video.mp4",
    poster: "/feature-reach-engagement.png",
    alt: "Promoter workspace preview video",
    title: "Create a Campaign",
    note: "Build your campaign brief and budget in one clean flow."
  },
  {
    type: "image",
    src: "/authimg4.jpg",
    alt: "Promoter analytics panel preview",
    title: "Hire an Influencer",
    note: "Match high-fit creators with quality audience signals."
  },
  {
    type: "image",
    src: "/authimg1.jpg",
    alt: "Promoter creator challenge preview",
    title: "Create a Challenge",
    note: "Launch UGC-style campaigns and track participation."
  }
];

const creatorMedia: MediaItem[] = [
  {
    type: "video",
    src: "/creatorvideo1.mp4",
    poster: "/authimg2.jpg",
    alt: "Creator dashboard preview video",
    title: "Pitch to Campaigns",
    note: "Apply to briefs that match your niche and content strength."
  },
  {
    type: "image",
    src: "/authimg3.jpg",
    alt: "Creator profile and opportunities preview",
    title: "Become a Creator",
    note: "Set your profile and social proof so brands can find you."
  },
  {
    type: "video",
    src: "/creatorvideo2.mp4",
    poster: "/feature-reach-engagement.png",
    alt: "Creator performance timeline video",
    title: "Track Creator Growth",
    note: "See engagement trends and payout milestones as you grow."
  }
];

function mediaCardGlow(index: number) {
  if (index === 0) return "from-[#4C3AFF]/26 via-[#7C3AED]/16 to-transparent";
  if (index === 1) return "from-[#22D3EE]/20 via-[#4C3AFF]/10 to-transparent";
  return "from-[#7C3AED]/22 via-[#22D3EE]/12 to-transparent";
}

export function RoleShowcaseSection() {
  const [mode, setMode] = useState<ShowcaseMode>("promoter");
  const media = useMemo(() => (mode === "promoter" ? promoterMedia : creatorMedia), [mode]);

  return (
    <section className="pro-section py-12 md:py-16" id="how-it-works">
      <div className="pro-container">
        <div className="rounded-[24px] border border-black/10 bg-white/72 p-4 shadow-[0_20px_48px_rgba(12,16,22,0.08)] sm:p-6 md:p-7">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/8 pb-5">
            <div>
              <span className="text-[0.76rem] font-semibold uppercase tracking-[0.16em] text-[#6b6459]">Live Product Preview</span>
              <h2 className="mt-2 font-display text-[clamp(1.55rem,3.3vw,2.65rem)] font-extrabold tracking-[-0.04em] text-[#141414]">
                Built for Promoters and Creators
              </h2>
              <p className="mt-2 max-w-[640px] text-sm leading-6 text-[#575145] sm:text-[0.98rem]">
                Switch view to explore how each side operates inside CreatorsAgora.
              </p>
            </div>

            <div className="inline-flex rounded-[12px] border border-black/10 bg-[#f7f1df] p-1">
              <button
                className={`rounded-[10px] px-4 py-2 text-sm font-semibold transition ${
                  mode === "promoter"
                    ? "bg-gradient-to-r from-[#4C3AFF] via-[#7C3AED] to-[#22D3EE] text-white shadow-[0_10px_24px_rgba(76,58,255,0.35)]"
                    : "text-[#554f44] hover:bg-white/70"
                }`}
                onClick={() => setMode("promoter")}
                type="button"
              >
                Promoters
              </button>
              <button
                className={`rounded-[10px] px-4 py-2 text-sm font-semibold transition ${
                  mode === "creator"
                    ? "bg-gradient-to-r from-[#4C3AFF] via-[#7C3AED] to-[#22D3EE] text-white shadow-[0_10px_24px_rgba(76,58,255,0.35)]"
                    : "text-[#554f44] hover:bg-white/70"
                }`}
                onClick={() => setMode("creator")}
                type="button"
              >
                Creators
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {media.map((item, index) => (
              <article
                className="group relative overflow-hidden rounded-[18px] border border-black/10 bg-white shadow-[0_12px_28px_rgba(12,16,22,0.08)]"
                key={`${mode}-${item.title}`}
              >
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${mediaCardGlow(index)} opacity-0 transition duration-300 group-hover:opacity-100`} />

                <div className="relative aspect-[16/10] overflow-hidden border-b border-black/8 bg-[#101320]">
                  {item.type === "video" ? (
                    <>
                      <video
                        autoPlay
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                        loop
                        muted
                        playsInline
                        poster={item.poster}
                        preload="metadata"
                        src={item.src}
                      />
                      <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/45 px-2.5 py-1 text-[11px] font-medium text-white">
                        <PlayCircle size={12} />
                        Live Clip
                      </span>
                    </>
                  ) : (
                    <img alt={item.alt} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" loading="lazy" src={item.src} />
                  )}
                </div>

                <div className="relative p-3.5">
                  <p className="text-sm font-semibold text-[#1a1a1a]">{item.title}</p>
                  <p className="mt-1 text-xs text-[#5f584b]">{item.note}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
