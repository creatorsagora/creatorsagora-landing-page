"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, ShieldCheck, Sparkles, Users, X } from "lucide-react";

const navItems = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "About", href: "#about" }
];

const rotatingPhrases = ["Match Creators", "Launch Campaigns"];

const trustBadges = [
  { label: "Verified talent pools", icon: Users },
  { label: "Escrow-protected payouts", icon: ShieldCheck },
  { label: "AI brief matching", icon: Sparkles }
];

const proofAvatars = [
  "https://i.pravatar.cc/96?img=12",
  "https://i.pravatar.cc/96?img=32",
  "https://i.pravatar.cc/96?img=47"
];

const heroBackgroundImage =
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1800&q=80";

export function HeroSection() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true);
  const [phraseState, setPhraseState] = useState({ active: 0, leaving: null as number | null });

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 18);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setPrefersReducedMotion(mediaQuery.matches);

    syncPreference();
    mediaQuery.addEventListener?.("change", syncPreference);

    return () => mediaQuery.removeEventListener?.("change", syncPreference);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const interval = window.setInterval(() => {
      setPhraseState((current) => ({
        active: (current.active + 1) % rotatingPhrases.length,
        leaving: current.active
      }));
    }, 3000);

    return () => window.clearInterval(interval);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (phraseState.leaving === null) return;

    const timeout = window.setTimeout(() => {
      setPhraseState((current) => ({ ...current, leaving: null }));
    }, 650);

    return () => window.clearTimeout(timeout);
  }, [phraseState.leaving]);

  const activePhrase = rotatingPhrases[phraseState.active];
  const leavingPhrase = phraseState.leaving === null ? null : rotatingPhrases[phraseState.leaving];

  return (
    <section
      className="pro-section overflow-hidden bg-[#f7f1df] pb-8 pt-4 md:pb-10"
      id="home"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(247, 241, 223, 0.9) 0%, rgba(247, 241, 223, 0.74) 32%, rgba(247, 241, 223, 0.92) 100%), url(${heroBackgroundImage})`,
        backgroundPosition: "center",
        backgroundSize: "cover"
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(13,107,87,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.4),transparent_28%)]" />

      <div
        className={`fixed left-0 right-0 z-50 transition-[top,padding] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isScrolled ? "top-3 px-3 sm:px-4" : "top-0 px-0"
        }`}
      >
        <nav
          className={`mx-auto flex items-center justify-between gap-3 transition-[max-width,border-radius,background-color,box-shadow,padding,border-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isScrolled
              ? "max-w-[860px] rounded-[8px] border border-black/10 bg-white/88 px-3 py-2.5 shadow-[0_18px_40px_rgba(10,14,22,0.12)] backdrop-blur-xl md:px-4"
              : "w-full max-w-none rounded-none border-b border-black/10 bg-white/40 px-4 py-4 backdrop-blur-md md:px-8"
          }`}
        >
          <a className="inline-flex items-center gap-3 text-base font-extrabold tracking-[-0.03em] text-[#121212]" href="#home">
            <Image
              alt="CreatorsAgora logo"
              className="object-contain"
              height={96}
              src="/brand/logo-light-full.png"
              width={96}
            />
          </a>

          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <a
                className="rounded-[8px] px-3 py-2 text-sm font-semibold text-[#4a463c] transition hover:bg-white/55 hover:text-[#121212]"
                href={item.href}
                key={item.label}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <Link className="hero-pill-action min-h-10 px-3 py-2" href="/auth/login">
              Log In
            </Link>
            <Link className="hero-pill-action hero-pill-action--accent min-h-10 px-4 py-2" href="/auth/signup">
              Get Started
            </Link>
          </div>

          <button
            className="grid size-11 place-items-center rounded-[8px] border border-black/8 bg-white text-[#121212] transition hover:-translate-y-0.5 md:hidden"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            type="button"
          >
            <Menu size={18} />
          </button>
        </nav>
      </div>

      <div className="pro-container relative z-10">
        {mobileMenuOpen ? (
          <div
            className="fixed inset-0 z-[70] bg-[#0a0b10]/35 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
            role="presentation"
          >
            <aside
              className="absolute right-0 top-0 h-full w-[84%] max-w-[350px] border-l border-black/10 bg-[#fffaf0] px-5 pb-6 pt-5 text-[#121212] shadow-[0_28px_60px_rgba(8,11,16,0.16)]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6f6a5d]">Menu</span>
                <button
                  className="grid size-10 place-items-center rounded-[8px] border border-black/10 bg-white text-xs text-[#111111] transition hover:-translate-y-0.5"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close navigation menu"
                  type="button"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="mt-7 grid gap-2">
                {navItems.map((item) => (
                  <a
                    className="rounded-[8px] border border-black/8 bg-white px-3 py-3 text-sm font-semibold text-[#1b1b17] transition hover:border-black/15"
                    key={`mobile-${item.label}`}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
              </div>

              <div className="mt-7 rounded-[8px] border border-black/8 bg-white px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6f6a5d]">Why teams switch</p>
                <div className="mt-4 grid gap-3">
                  {trustBadges.map((badge) => (
                    <div className="flex items-center gap-2.5 text-sm text-[#23231f]" key={badge.label}>
                      <badge.icon className="text-[#0e7561]" size={15} />
                      <span>{badge.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-7 grid gap-2">
                <Link
                  className="hero-pill-action hero-pill-action--accent h-12 w-full"
                  href="/auth/signup"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
                <Link
                  className="hero-pill-action h-12 w-full"
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log In
                </Link>
              </div>
            </aside>
          </div>
        ) : null}

        <div className="mx-auto flex min-h-[72vh] max-w-[1120px] flex-col items-center justify-center px-1 pb-10 pt-24 text-center md:min-h-[68vh] md:pb-12 md:pt-28 lg:min-h-[660px]">
          <span className="inline-flex items-center gap-2 rounded-[8px] border border-black/8 bg-white/70 px-3 py-2 text-sm font-semibold text-[#4d4b42]">
            <Sparkles className="text-[#0d6b57]" size={14} />
            AI creator marketplace
          </span>

          <h1 className="mt-7 max-w-[1120px] font-display text-[clamp(1.95rem,3.9vw,3.55rem)] font-extrabold leading-[0.98] tracking-[-0.045em] text-[#121212]">
            <span className="flex flex-col items-center justify-center gap-3 md:flex-row md:flex-nowrap md:items-end md:justify-center md:gap-5">
              <span className="hero-word-shell">
                {leavingPhrase ? (
                  <span className="animate-hero-word-out absolute inset-0 flex items-center justify-center">
                    {leavingPhrase}
                  </span>
                ) : null}
                <span
                  className={`${phraseState.leaving !== null && !prefersReducedMotion ? "animate-hero-word-in" : ""} relative flex items-center justify-center`}
                >
                  {activePhrase}
                </span>
                {!prefersReducedMotion ? <span className="animate-hero-shine hero-word-shine" /> : null}
              </span>
              <span className="whitespace-nowrap text-center leading-[0.95] md:text-left">At Scale Without</span>
            </span>
            <span className="mt-3 block whitespace-nowrap">Workflow Friction.</span>
          </h1>

          <p className="mt-5 max-w-[680px] text-[clamp(0.98rem,1.45vw,1.12rem)] leading-[1.7] text-[#3f3c33]">
            Brief once, match faster, protect payouts, and keep every creator campaign moving from one clear
            control center.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
            {trustBadges.map((badge) => (
              <span
                className="inline-flex min-h-[40px] items-center gap-2 rounded-[8px] border border-black/8 bg-white/68 px-3 py-2 text-[0.92rem] font-semibold text-[#23211d]"
                key={badge.label}
              >
                <badge.icon className="text-[#0d6b57]" size={15} />
                {badge.label}
              </span>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-4 text-[clamp(0.9rem,1.2vw,1rem)] font-semibold text-[#161616]">
            <span className="text-[#5a564b]">Trusted by more than</span>
            <div className="flex items-center -space-x-2">
              {proofAvatars.map((avatar, index) => (
                <img
                  alt=""
                  className="size-11 rounded-full border-2 border-[#f7f1df] object-cover shadow-[0_8px_18px_rgba(17,17,17,0.08)]"
                  key={avatar}
                  loading={index === 0 ? "eager" : "lazy"}
                  src={avatar}
                />
              ))}
            </div>
            <span className="inline-flex min-h-[44px] items-center rounded-[8px] bg-white px-4 py-2 shadow-[0_14px_28px_rgba(12,16,22,0.08)]">
              14,000+
            </span>
            <span className="text-[#5a564b]">brands building creator pipelines faster.</span>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link className="hero-pill-action hero-pill-action--accent min-w-[184px]" href="/auth/signup">
              Start Free
            </Link>
            <Link className="hero-pill-action min-w-[184px]" href="/dashboard">
              Open Dashboard
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
