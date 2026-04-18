"use client";

import { CheckCircle2, Clock3, Eye, FileText, Sparkles, WalletCards, BadgeCheck } from "lucide-react";
import { useCurrency } from "@/components/preferences/CurrencyProvider";
import { PaginationControls } from "@/components/ui/PaginationControls";
import { usePagination } from "@/hooks/usePagination";

const creatorOpportunities = [
  { name: "Streetwear Promo 2026", brand: "NeoMode", budgetUsd: 300000 / 1550, fit: "92%" },
  { name: "Fintech Explainer Series", brand: "Mintwise", budgetUsd: 220000 / 1550, fit: "88%" },
  { name: "Campus Creator Sprint", brand: "PulsePay", budgetUsd: 180000 / 1550, fit: "84%" },
  { name: "Wellness Product Story", brand: "VitaDrop", budgetUsd: 240000 / 1550, fit: "90%" },
  { name: "Street Vibe Reels", brand: "SnapMode", budgetUsd: 200000 / 1550, fit: "86%" },
  { name: "Creator Weekly Picks", brand: "TrendLift", budgetUsd: 260000 / 1550, fit: "89%" }
];

const creatorPipeline = [
  { stage: "Submitted", count: 14, tone: "text-pro-accent" },
  { stage: "In Review", count: 8, tone: "text-pro-warning" },
  { stage: "Approved", count: 5, tone: "text-pro-success" },
  { stage: "Rejected", count: 2, tone: "text-pro-muted" }
];

const pipelineActivity = [
  ["NeoMode Streetwear Promo", "Submitted 2h ago"],
  ["PulsePay Campus Sprint", "In Review - 1 day ago"],
  ["Mintwise Product Story", "Approved - 2 days ago"],
  ["Campus Style Week", "Submitted - 3 days ago"],
  ["Glow Skin Reel", "In Review - 4 days ago"],
  ["Eco Brand Story", "Approved - 5 days ago"]
] as const;

type CreatorDashboardViewProps = {
  hasInfluencerBadge: boolean;
};

export function CreatorDashboardView({ hasInfluencerBadge }: CreatorDashboardViewProps) {
  const { formatDualFromUsd } = useCurrency();
  const activeEscrow = formatDualFromUsd(640000 / 1550);
  const opportunitiesPagination = usePagination(creatorOpportunities, 10);
  const pipelineActivityPagination = usePagination(pipelineActivity, 5);

  return (
    <div className="space-y-5">
      <section className="workspace-card p-4 md:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-pro-accent text-xs uppercase tracking-[0.12em]">Creator Command Center</p>
            <h2 className="font-display mt-1 text-[clamp(1.5rem,3.2vw,2.3rem)] font-bold">Discovery, Pitches, and Monetization</h2>
            <p className="text-pro-muted mt-2 text-sm">
              Manage open briefs, proposal pipeline, payout velocity, and content approvals in one place.
            </p>
          </div>
          <div className="workspace-card-soft grid min-w-[260px] gap-2 p-3 text-sm">
            <p className="inline-flex items-center gap-1.5">
              <Sparkles size={14} className="text-pro-accent" />
              AI Match Precision: <span className="mono-stat text-pro-main">91%</span>
            </p>
            <p className="inline-flex items-center gap-1.5">
              <WalletCards size={14} className="text-pro-success" />
              Active Escrow: <span className="mono-stat text-pro-main">{activeEscrow.local}</span>
            </p>
            {activeEscrow.usd ? <p className="text-xs text-pro-muted">{activeEscrow.usd}</p> : null}
            <p className={`inline-flex items-center gap-1.5 ${hasInfluencerBadge ? "text-pro-success" : "text-pro-muted"}`}>
              <BadgeCheck size={14} />
              {hasInfluencerBadge ? "Verified Influencer Badge Active" : "Influencer Badge Pending Manual Review"}
            </p>
          </div>
        </div>
      </section>

      <section className="workspace-card p-4 md:p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-xl font-semibold">Recommended Opportunities</h3>
          <button className="text-sm text-pro-accent">View all briefs</button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {opportunitiesPagination.pageItems.map((brief) => (
            <article className="workspace-card-soft p-4" key={brief.name}>
              <p className="font-semibold">{brief.name}</p>
              <p className="text-pro-muted mt-1 text-xs">{brief.brand}</p>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="workspace-badge border-pro-primary/25 bg-pro-primary/12">
                  Budget {formatDualFromUsd(brief.budgetUsd).local}
                </span>
                <span className="text-pro-success">{brief.fit} fit</span>
              </div>
              <div className="mt-3 flex gap-2">
                <button className="btn-pro-primary h-9 px-3 py-0 text-xs">Submit Pitch</button>
                <button className="btn-pro-secondary h-9 px-3 py-0 text-xs">Preview</button>
              </div>
            </article>
          ))}
        </div>
        <PaginationControls
          fromItem={opportunitiesPagination.fromItem}
          onPageChange={opportunitiesPagination.setPage}
          onPageSizeChange={opportunitiesPagination.setPageSize}
          page={opportunitiesPagination.page}
          pageSize={opportunitiesPagination.pageSize}
          toItem={opportunitiesPagination.toItem}
          totalItems={opportunitiesPagination.totalItems}
          totalPages={opportunitiesPagination.totalPages}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_1fr]">
        <article className="workspace-card p-4">
          <h3 className="font-display text-xl font-semibold">Proposal Pipeline</h3>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {creatorPipeline.map((item) => (
              <div className="workspace-card-soft p-3" key={item.stage}>
                <p className="text-pro-muted text-xs">{item.stage}</p>
                <p className={`mono-stat mt-1 text-2xl font-bold ${item.tone}`}>{item.count}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 divide-y workspace-divider">
            {pipelineActivityPagination.pageItems.map(([title, meta]) => (
              <article className="py-2.5" key={title}>
                <p className="text-sm">{title}</p>
                <p className="text-pro-muted text-xs">{meta}</p>
              </article>
            ))}
          </div>
          <PaginationControls
            fromItem={pipelineActivityPagination.fromItem}
            onPageChange={pipelineActivityPagination.setPage}
            onPageSizeChange={pipelineActivityPagination.setPageSize}
            page={pipelineActivityPagination.page}
            pageSize={pipelineActivityPagination.pageSize}
            toItem={pipelineActivityPagination.toItem}
            totalItems={pipelineActivityPagination.totalItems}
            totalPages={pipelineActivityPagination.totalPages}
          />
        </article>

        <article className="workspace-card p-4">
          <h3 className="font-display text-xl font-semibold">Creator Operations</h3>
          <div className="mt-3 space-y-2">
            {[
              { icon: CheckCircle2, label: "Approved Deliverables", value: "19" },
              { icon: Clock3, label: "Pending Reviews", value: "6" },
              { icon: Eye, label: "Average Reach / Post", value: "86K" },
              { icon: FileText, label: "Media Kit Views", value: "312" }
            ].map((item) => (
              <div className="workspace-card-soft flex items-center justify-between p-3" key={item.label}>
                <p className="inline-flex items-center gap-2 text-sm">
                  <item.icon size={14} className="text-pro-accent" />
                  {item.label}
                </p>
                <span className="mono-stat text-sm">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button className="btn-pro-secondary h-10 px-3 py-0 text-sm">Upload Content</button>
            <button className="btn-pro-primary h-10 px-3 py-0 text-sm">Update Portfolio</button>
          </div>
        </article>
      </section>
    </div>
  );
}
