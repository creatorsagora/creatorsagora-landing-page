"use client";

import Image from "next/image";

const footerColumns = [
  {
    title: "Products",
    links: ["Brand Console", "Creator Network", "Escrow Wallet", "Campaign Intelligence"]
  },
  {
    title: "Company",
    links: ["About", "Careers", "Journal", "Contact"]
  },
  {
    title: "Security",
    links: ["Privacy", "Terms", "Brand Safety", "Compliance"]
  },
  {
    title: "Integration",
    links: ["API", "Partners", "Support Desk", "Status"]
  }
];

const footerWordmark = "CREATORSAGORA";

export function FooterSection() {
  return (
    <footer className="pro-section overflow-hidden bg-[#05060b] text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(143,243,238,0.7),rgba(255,255,255,0.28),transparent)]" />

      <div className="pro-container relative pb-8 pt-12 md:pb-10 md:pt-14">
        <div className="mb-10 flex flex-col gap-4 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="inline-flex rounded-[8px] border border-[#8ff3ee]/24 bg-[#8ff3ee]/8 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#8ff3ee]">
              Creator growth command center
            </span>
            <h2 className="mt-5 max-w-[620px] font-display text-[clamp(2rem,4vw,4.2rem)] font-extrabold leading-[0.96] tracking-[-0.055em]">
              Build the next campaign with cleaner control.
            </h2>
          </div>

          <a
            className="inline-flex min-h-[52px] items-center justify-center rounded-[8px] border border-white/16 bg-white px-5 py-3 text-sm font-bold text-[#05060b] shadow-[0_18px_44px_rgba(143,243,238,0.16)] transition hover:-translate-y-0.5"
            href="#"
            onClick={(e) => e.preventDefault()}
          >
            Start Free
          </a>
        </div>

        <div className="relative z-10 grid gap-10 lg:grid-cols-[1.18fr_repeat(4,minmax(0,1fr))]">
          <div className="max-w-[290px]">
            <a
              className="inline-flex items-center gap-3 text-[clamp(1rem,1.3vw,1.18rem)] font-extrabold tracking-[-0.035em]"
              href="#home"
            >
              <Image alt="CreatorsAgora logo" className="h-10 w-auto object-contain" height={133} src="/brand/logo-dark-full.png" width={325} />
            </a>

            <p className="mt-6 text-[0.98rem] leading-7 text-white/72">
              The operating system for creator-led growth teams that need faster matching, cleaner execution,
              and better control over every campaign.
            </p>
          </div>

          {footerColumns.map((column) => (
            <div className="relative lg:pl-7" key={column.title}>
              <span className="absolute left-0 top-0 hidden h-14 w-px bg-[linear-gradient(#8ff3ee,transparent)] lg:block" />
              <h3 className="font-display text-[clamp(1.25rem,1.8vw,1.85rem)] font-bold tracking-[-0.03em] text-white">
                {column.title}
              </h3>
              <ul className="mt-4 grid gap-3 text-[0.98rem]">
                {column.links.map((link) => (
                  <li key={link}>
                    <a className="text-white/58 transition-colors hover:text-[#8ff3ee]" href="#">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-y border-white/10 py-6 md:mt-14 md:py-8">
          <div className="relative w-full overflow-hidden">
            <strong
              aria-label={footerWordmark}
              className="relative z-10 block whitespace-nowrap text-center font-display text-[clamp(2.4rem,8.5vw,7.4rem)] font-extrabold leading-none tracking-[-0.085em] text-white/[0.12]"
            >
              {footerWordmark.split("").map((letter, index) => (
                <span
                  aria-hidden
                  className="animate-footer-letter inline-block will-change-transform"
                  key={`${letter}-${index}`}
                  style={{ animationDelay: `${index * 95}ms` }}
                >
                  {letter}
                </span>
              ))}
            </strong>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 text-sm text-white/46 sm:flex-row sm:items-center sm:justify-between">
          <span>(c) 2026 CREATORSAGORA. All rights reserved.</span>
          <span>English / NGN / Lagos</span>
        </div>
      </div>
    </footer>
  );
}
