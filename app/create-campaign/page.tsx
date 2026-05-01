"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowLeft, CheckCircle2, Send } from "lucide-react";
import { FooterSection } from "@/components/landing/FooterSection";

export default function CreateCampaignLeadPage() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      setSubmitted(true);
      event.currentTarget.reset();
    }, 900);
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(110%_90%_at_0%_0%,#fbf6e8_0%,#f7f1df_42%,#f2e8d2_100%)] px-4 py-8 sm:py-12">
      <div className="mx-auto w-full max-w-[980px]">
        <Link
          className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-medium text-[#1a1a1a] transition hover:-translate-y-0.5"
          href="/"
        >
          <ArrowLeft size={14} />
          Back to Home
        </Link>

        <section className="mt-5 overflow-hidden rounded-[28px] border border-black/10 bg-white/65 shadow-[0_28px_60px_rgba(12,16,22,0.08)] backdrop-blur-sm">
          <div className="h-1.5 w-full bg-gradient-to-r from-[#4C3AFF] via-[#7C3AED] to-[#22D3EE]" />
          <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-[1.1fr_1fr] md:gap-10 md:p-10">
            <div>
              <span className="inline-flex rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#5d5a51]">
                Campaign Intake
              </span>
              <h1 className="mt-4 font-display text-[clamp(2rem,5.4vw,3.4rem)] font-extrabold leading-[1.03] tracking-[-0.03em] text-[#111111]">
                Let&apos;s Build Your
                <br />
                Next Campaign
              </h1>
              <p className="mt-4 max-w-[540px] text-[1.02rem] leading-7 text-[#444035]">
                If you&apos;re looking for a partner who brings deep expertise, strong creator community, and proven results,
                we&apos;d love to collaborate with you.
              </p>

              <div className="mt-7 space-y-2.5 text-sm text-[#3a352c]">
                <p className="rounded-xl border border-black/10 bg-white/70 px-3 py-2">Response time: typically within 1 hour.</p>
                <p className="rounded-xl border border-black/10 bg-white/70 px-3 py-2">You can request brand awareness, viral or sales-focused campaigns.</p>
              </div>
            </div>

            <form className="space-y-4 rounded-2xl border border-black/10 bg-white/85 p-4 shadow-[0_20px_40px_rgba(12,16,22,0.06)] sm:p-5" onSubmit={onSubmit}>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm font-semibold text-[#1c1b17]">
                  First Name <span className="text-[#b42318]">*</span>
                  <input className="mt-1.5 input-pro border-black/15 bg-white text-[#131313]" name="firstName" required />
                </label>
                <label className="text-sm font-semibold text-[#1c1b17]">
                  Last Name <span className="text-[#b42318]">*</span>
                  <input className="mt-1.5 input-pro border-black/15 bg-white text-[#131313]" name="lastName" required />
                </label>
              </div>

              <label className="block text-sm font-semibold text-[#1c1b17]">
                Email <span className="text-[#b42318]">*</span>
                <input className="mt-1.5 input-pro border-black/15 bg-white text-[#131313]" name="email" required type="email" />
              </label>

              <label className="block text-sm font-semibold text-[#1c1b17]">
                Comment or Message
                <textarea
                  className="mt-1.5 input-pro h-40 resize-none border-black/15 bg-white py-3 text-[#131313]"
                  name="message"
                  placeholder="Tell us what you want to promote, expected budget, and timeline..."
                />
              </label>

              <button
                className="inline-flex h-11 items-center justify-center gap-2 rounded-[10px] bg-[#101218] px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#181b24] disabled:opacity-70"
                disabled={sending}
                type="submit"
              >
                {sending ? "Submitting..." : "Submit"}
                <Send size={14} />
              </button>

              {submitted ? (
                <p className="inline-flex items-center gap-1.5 rounded-lg border border-[#16a34a55] bg-[#16a34a14] px-3 py-2 text-xs font-medium text-[#157a41]">
                  <CheckCircle2 size={14} />
                  Request received. We&apos;ll contact you shortly.
                </p>
              ) : null}
            </form>
          </div>
        </section>
      </div>

      <div className="mt-10">
        <FooterSection />
      </div>
    </main>
  );
}
