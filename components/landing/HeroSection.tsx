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
  const [getStartedDropdownOpen, setGetStartedDropdownOpen] = useState(false);

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
              : "w-full rounded-none border-b border-black/10 bg-white/40 px-6 py-4 backdrop-blur-md"
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

          <div className="hidden flex-1 items-center justify-center md:flex">
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

          <div className="hidden flex-shrink-0 items-center gap-2 sm:flex">
            <Link className="hero-pill-action min-h-10 px-3 py-2" href="#" onClick={(e) => e.preventDefault()}>
              Log In
            </Link>
            <div className="relative">
              <button
                className="hero-pill-action hero-pill-action--accent min-h-10 px-4 py-2 flex items-center gap-1.5"
                onClick={() => setGetStartedDropdownOpen(!getStartedDropdownOpen)}
                type="button"
              >
                Get Started
                <svg className={`w-4 h-4 transition-transform duration-200 ${getStartedDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {getStartedDropdownOpen && (
                <div className="absolute right-0 top-full z-50 mt-3 w-80 overflow-hidden rounded-3xl border border-black/5 bg-[#fefcf6] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15),0_0_0_1px_rgba(0,0,0,0.04)]">
                  {/* Decorative top bar */}
                  <div className="relative h-1.5 bg-gradient-to-r from-[#8b5cf6] via-[#a78bfa] to-[#c4b5fd]" />
                  
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] shadow-lg shadow-purple-500/25">
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#1a1a2e]">Contact Admin</p>
                        <p className="text-xs text-[#6b7280]">Get help with access</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2.5">
                      <a
                        className="group flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-4 transition-all duration-300 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-0.5"
                        href="mailto:hamenhenry@gmail.com"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-violet-50 group-hover:from-purple-200 group-hover:to-violet-100 transition-colors">
                          <svg className="h-6 w-6 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-[#1a1a2e]">Email</p>
                          <p className="text-xs text-[#6b7280]">hamenhenry@gmail.com</p>
                        </div>
                        <svg className="h-5 w-5 text-purple-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                      
                      <a
                        className="group flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-4 transition-all duration-300 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-0.5"
                        href="https://wa.me/233206479582"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-100 to-emerald-50 group-hover:from-green-200 group-hover:to-emerald-100 transition-colors">
                          <svg className="h-6 w-6 text-[#10b981]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-[#1a1a2e]">WhatsApp</p>
                          <p className="text-xs text-[#6b7280]">+233206479582</p>
                        </div>
                        <svg className="h-5 w-5 text-green-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-purple-50/50 py-2.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#8b5cf6] animate-pulse" />
                      <p className="text-xs font-medium text-[#8b5cf6]">Typically replies within 1 hour</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile Get Started with dropdown */}
            <div className="relative md:hidden">
              <button
                className="hero-pill-action hero-pill-action--accent min-h-9 px-3 py-1.5 text-sm flex items-center gap-1"
                onClick={() => setGetStartedDropdownOpen(!getStartedDropdownOpen)}
                type="button"
              >
                Get Started
                <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${getStartedDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {getStartedDropdownOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-black/5 bg-[#fefcf6] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)]">
                  <div className="relative h-1.5 bg-gradient-to-r from-[#8b5cf6] via-[#a78bfa] to-[#c4b5fd]" />
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed]">
                        <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#1a1a2e]">Contact Admin</p>
                        <p className="text-xs text-[#6b7280]">Get help with access</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <a
                        className="flex items-center gap-3 rounded-xl border border-black/5 bg-white p-3 transition hover:border-purple-300"
                        href="mailto:hamenhenry@gmail.com"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                          <svg className="h-5 w-5 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#1a1a2e]">Email</p>
                          <p className="text-xs text-[#6b7280]">hamenhenry@gmail.com</p>
                        </div>
                      </a>
                      <a
                        className="flex items-center gap-3 rounded-xl border border-black/5 bg-white p-3 transition hover:border-green-300"
                        href="https://wa.me/233206479582"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                          <svg className="h-5 w-5 text-[#10b981]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#1a1a2e]">WhatsApp</p>
                          <p className="text-xs text-[#6b7280]">+233206479582</p>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <button
              className="grid size-11 place-items-center rounded-[8px] border border-black/8 bg-white text-[#121212] transition hover:-translate-y-0.5 md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              type="button"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
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
                  className="hero-pill-action h-12 w-full"
                  href="#"
                  onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); }}
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
            <Link className="hero-pill-action hero-pill-action--accent min-w-[184px]" href="#" onClick={(e) => e.preventDefault()}>
              Start Free
            </Link>
            <Link className="hero-pill-action min-w-[184px]" href="#" onClick={(e) => e.preventDefault()}>
              Open Dashboard
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
