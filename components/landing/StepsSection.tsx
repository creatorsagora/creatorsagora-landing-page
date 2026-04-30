import Link from "next/link";

const workflowSteps = [
  {
    number: "01",
    label: "Brief",
    title: "Drop the campaign goal once.",
    text: "Add your objective, budget, audience, guardrails, and launch window without rebuilding the brief across tools."
  },
  {
    number: "02",
    label: "Match",
    title: "Get a creator shortlist built for fit.",
    text: "Creator matches are ranked by audience overlap, channel strength, brand safety, and campaign readiness."
  },
  {
    number: "03",
    label: "Launch",
    title: "Move approvals, escrow, and tracking together.",
    text: "Lock payout milestones, keep decisions visible, and monitor live performance from the same control layer."
  }
];

const launchMetrics = [
  ["Creator fit", "94%"],
  ["Brief score", "A+"],
  ["Launch risk", "Low"]
];

export function StepsSection() {
  return (
    <section className="pro-section py-14 md:py-20" id="how-it-works">
      <div className="pro-container">
        <div className="grid items-center gap-10 border-t border-black/8 pt-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="max-w-[560px]">
            <span className="text-[0.76rem] font-semibold uppercase tracking-[0.16em] text-[#6b6459]">
              How It Works
            </span>
            <h2 className="mt-4 font-display text-[clamp(2.15rem,4.4vw,4.35rem)] font-extrabold leading-[0.94] tracking-[-0.06em] text-[#111111]">
              From brief to launch without the messy middle.
            </h2>
            <p className="mt-5 text-[clamp(1rem,1.45vw,1.12rem)] leading-[1.82] text-[#554f44]">
              CreatorsAgora turns planning, matching, approvals, escrow, and reporting into one controlled flow
              your team can run without chasing screenshots or spreadsheet updates.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <span className="inline-flex min-h-[40px] items-center rounded-[8px] border border-black/10 bg-white/68 px-3 py-2 text-[0.92rem] font-semibold text-[#23211d]">
                AI shortlist
              </span>
              <span className="inline-flex min-h-[40px] items-center rounded-[8px] border border-black/10 bg-white/68 px-3 py-2 text-[0.92rem] font-semibold text-[#23211d]">
                Escrow milestones
              </span>
              <span className="inline-flex min-h-[40px] items-center rounded-[8px] border border-black/10 bg-white/68 px-3 py-2 text-[0.92rem] font-semibold text-[#23211d]">
                Live reporting
              </span>
            </div>

            <Link
              className="mt-8 inline-flex min-h-[52px] items-center justify-center rounded-[8px] bg-[#111111] px-6 py-3 text-sm font-semibold text-[#fff8e8] shadow-[0_18px_38px_rgba(17,17,17,0.16)] transition hover:-translate-y-0.5"
              href="/auth/signup"
            >
              Start Your Campaign
            </Link>
          </div>

          <div className="relative min-h-[500px] overflow-hidden rounded-[8px] border border-[#24223c] bg-[#0d1020] p-4 shadow-[0_28px_70px_rgba(17,17,17,0.18)] md:p-5">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_74%_18%,rgba(76,58,255,0.34),transparent_26%),radial-gradient(circle_at_8%_88%,rgba(34,211,238,0.18),transparent_28%)]" />
            <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8f8aa8]">Launch Flow</p>
                <h3 className="mt-1 text-[clamp(1.35rem,2.2vw,2.1rem)] font-bold tracking-[-0.04em] text-white">
                  Campaign control room
                </h3>
              </div>
              <span className="rounded-[8px] border border-[#4C3AFF]/50 bg-[#4C3AFF]/18 px-3 py-2 text-xs font-semibold text-[#ded9ff]">
                Live
              </span>
            </div>

            <div className="relative z-10 mt-5 grid gap-3 md:grid-cols-3">
              {launchMetrics.map(([label, value]) => (
                <div className="rounded-[8px] border border-white/10 bg-white/[0.04] p-4" key={label}>
                  <p className="text-xs text-[#8f8aa8]">{label}</p>
                  <strong className="mt-2 block text-2xl font-bold tracking-[-0.04em] text-white">{value}</strong>
                </div>
              ))}
            </div>

            <div className="relative z-10 mt-5 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-[8px] border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8f8aa8]">Creator Match</span>
                  <span className="text-xs font-semibold text-[#17d7ff]">Ranked</span>
                </div>
                <div className="mt-4 space-y-3">
                  {["Lifestyle operators", "Short-form specialists", "Commerce creators"].map((creator, index) => (
                    <div className="rounded-[8px] border border-white/10 bg-[#12162a] p-3" key={creator}>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold text-white">{creator}</span>
                        <span className="text-xs text-[#9a91ff]">{92 - index * 4}%</span>
                      </div>
                      <span className="mt-3 block h-2 overflow-hidden rounded-full bg-white/10">
                        <span
                          className="block h-full rounded-full bg-[linear-gradient(90deg,#17d7ff,#7f70ff)]"
                          style={{ width: `${92 - index * 4}%` }}
                        />
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[8px] border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8f8aa8]">Launch Timeline</span>
                  <span className="text-xs font-semibold text-[#d8ff78]">3 steps</span>
                </div>

                <div className="mt-5 space-y-5">
                  {workflowSteps.map((step, index) => (
                    <div className="grid grid-cols-[44px_1fr] gap-3" key={`preview-${step.number}`}>
                      <div className="relative">
                        <span className="grid size-9 place-items-center rounded-[8px] border border-[#4C3AFF]/60 bg-[#4C3AFF]/22 text-xs font-bold text-[#e7e3ff]">
                          {step.number}
                        </span>
                        {index < workflowSteps.length - 1 ? (
                          <span className="absolute left-[17px] top-10 h-[34px] w-px bg-white/14" />
                        ) : null}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{step.label}</p>
                        <p className="mt-1 text-xs leading-5 text-[#a9a5ba]">{step.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {workflowSteps.map((step) => (
            <article className="border-t border-black/10 pt-5" key={step.number}>
              <span className="text-[0.74rem] font-bold uppercase tracking-[0.16em] text-[#4C3AFF]">
                {step.number} / {step.label}
              </span>
              <h3 className="mt-3 max-w-[360px] text-[clamp(1.25rem,2vw,1.7rem)] font-bold leading-[1.08] tracking-[-0.04em] text-[#151515]">
                {step.title}
              </h3>
              <p className="mt-3 max-w-[390px] leading-7 text-[#625c50]">{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
