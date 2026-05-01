"use client";

import Link from "next/link";

const roboticArmImage = "/robotic-hand-pointing-against-black.png";
const pointingHandImage = "/copy-space-hand-pointing-1.png";

const textureStyle = {
  backgroundColor: "#f6f1e6",
  backgroundImage:
    "linear-gradient(180deg, rgba(255,255,255,0.78) 0%, rgba(246,241,230,0.92) 100%), repeating-linear-gradient(0deg, rgba(23,19,13,0.04) 0 1px, transparent 1px 12px), repeating-linear-gradient(90deg, rgba(23,19,13,0.04) 0 1px, transparent 1px 12px), repeating-linear-gradient(45deg, rgba(255,255,255,0.34) 0 2px, transparent 2px 12px)",
  backgroundSize: "100% 100%, 12px 12px, 12px 12px, 18px 18px"
} as const;

export function CtaSection() {
  return (
    <section className="pro-section overflow-hidden pb-14 pt-12 md:pb-20 md:pt-16">
      <div className="pro-container">
        <div
          className="relative overflow-hidden rounded-[24px] px-5 py-16 md:px-8 md:py-20 lg:min-h-[620px] lg:px-10 lg:py-24"
          style={textureStyle}
        >
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(17,17,17,0.03))]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-black/8" />

          <img
            alt=""
            aria-hidden
            className="pointer-events-none absolute bottom-[-1%] left-[-3%] z-0 hidden w-[41%] max-w-[560px] select-none drop-shadow-[0_30px_60px_rgba(17,17,17,0.16)] md:block"
            loading="lazy"
            src={roboticArmImage}
            style={{ transform: "rotate(-2deg)" }}
          />
          <img
            alt=""
            aria-hidden
            className="pointer-events-none absolute bottom-[1%] right-[-4%] z-0 hidden w-[35%] max-w-[460px] select-none drop-shadow-[0_28px_54px_rgba(17,17,17,0.14)] md:block"
            loading="lazy"
            src={pointingHandImage}
            style={{ transform: "rotate(-2deg)" }}
          />

          <div className="relative z-10 mx-auto flex max-w-[760px] flex-col items-center text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/68 px-3 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#5f5a4f] shadow-[0_10px_22px_rgba(12,16,22,0.05)]">
              Waitlist Open
            </span>

            <h2 className="mt-6 max-w-[720px] font-display text-[clamp(1.7rem,3.4vw,2.7rem)] font-extrabold leading-[0.96] tracking-[-0.05em] text-[#111111]">
              Join Early.
            </h2>

            <p className="mx-auto mt-4 max-w-[620px] text-[clamp(0.98rem,1.45vw,1.08rem)] leading-[1.72] text-[#5a554a]">
              Capture briefs, lock creator matches, keep approvals moving, and protect every payout from one
              calm operating layer.
            </p>

            <div className="mt-8">
              <div className="relative inline-flex">
                <span className="absolute inset-[-6px] -z-10 rounded-full bg-[linear-gradient(90deg,rgba(234,255,112,0.58),rgba(76,58,255,0.55),rgba(255,118,208,0.42))] blur-[14px]" />
                <Link
                  className="inline-flex min-h-[58px] items-center rounded-full border border-black/14 bg-[#111111] px-7 py-3 text-base font-semibold text-white shadow-[0_22px_40px_rgba(17,17,17,0.18)] transition hover:-translate-y-0.5"
                  href="#"
                  onClick={(e) => e.preventDefault()}
                >
                  Join the Waitlist
                  <span className="ml-2 text-[#d4ff7f]">*</span>
                </Link>
              </div>
            </div>

            <p className="mt-4 text-sm text-[#6a6457]">Early access opens in small batches for operators first.</p>

            <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[0.94rem] font-medium text-[#585246]">
              <span>Priority beta seats</span>
              <span className="text-black/16">{"\u2022"}</span>
              <span>Founding team onboarding</span>
              <span className="text-black/16">{"\u2022"}</span>
              <span>First access to launch workflows</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
