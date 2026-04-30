"use client";

import { Check, Clock3 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useCurrency } from "@/components/preferences/CurrencyProvider";
import { PaginationControls } from "@/components/ui/PaginationControls";
import { usePagination } from "@/hooks/usePagination";
import { fetchCampaignsRequest, readAuthSession, type CampaignListResponse } from "@/lib/auth-client";

type Campaign = CampaignListResponse["campaigns"][number];

type AssignmentRow = {
  id: string;
  label: string;
  status: string;
  payoutUsd: number;
  engagementRate: number;
};

function formatDate(value?: string | null) {
  if (!value) return "Not set";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not set";
  return date.toLocaleDateString();
}

function statusBadgeClass(status: string) {
  const normalized = status.toLowerCase();
  if (normalized === "running") return "border-pro-success/30 bg-pro-success/10 text-pro-success";
  if (normalized === "pending" || normalized === "draft") return "border-pro-warning/35 bg-pro-warning/10 text-pro-warning";
  if (normalized === "completed") return "border-pro-accent/30 bg-pro-accent/12 text-pro-accent";
  if (normalized === "cancelled") return "border-[#ff4d6d66] bg-[#ff4d6d1a] text-[#ff8b9e]";
  return "border-pro-primary/35 bg-pro-primary/15 text-pro-main";
}

function statusLabel(status: string) {
  if (!status) return "Pending";
  return `${status.charAt(0).toUpperCase()}${status.slice(1)}`;
}

function buildTimeline(status: string) {
  const normalized = status.toLowerCase();
  const order = ["draft", "pending", "running", "completed"];
  const currentIndex = order.indexOf(normalized);

  const labels = [
    { key: "draft", label: "Created" },
    { key: "pending", label: "AI Assigned" },
    { key: "running", label: "Campaign Live" },
    { key: "completed", label: "Completed" }
  ];

  return labels.map((item, index) => ({
    ...item,
    active: currentIndex >= 0 ? index <= currentIndex : index === 0
  }));
}

export function CampaignDetailsPageView() {
  const { formatDualFromUsd } = useCurrency();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadCampaigns = async () => {
      const session = readAuthSession();
      if (!session?.token) {
        if (active) {
          setError("Please sign in to view campaigns.");
          setLoading(false);
        }
        return;
      }

      try {
        const response = await fetchCampaignsRequest(session.token);
        if (!active) return;
        setCampaigns(response.campaigns ?? []);
        setError("");
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Unable to load campaign details");
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadCampaigns();
    return () => {
      active = false;
    };
  }, []);

  const campaign = campaigns[0] ?? null;
  const timeline = useMemo(() => buildTimeline(campaign?.status ?? "draft"), [campaign?.status]);

  const budgetUsd = Number(campaign?.budgetUsd ?? 0);
  const spentUsd = Number(campaign?.spentUsd ?? 0);
  const remainingUsd = Math.max(0, budgetUsd - spentUsd);
  const progressPercent = budgetUsd > 0 ? Math.min(100, Math.round((spentUsd / budgetUsd) * 100)) : 0;

  const assignments = useMemo<AssignmentRow[]>(() => {
    return (campaign?.assignments ?? []).map((assignment, index) => ({
      id: `${assignment.creator}-${index}`,
      label: `Creator ${index + 1}`,
      status: assignment.status ?? "invited",
      payoutUsd: Number(assignment.payoutUsd ?? 0),
      engagementRate: Number(assignment.engagementRate ?? 0)
    }));
  }, [campaign?.assignments]);

  const assignmentPagination = usePagination(assignments, 5);

  const reach = Number(campaign?.metrics?.reach ?? campaign?.aiPlan?.estimatedReach ?? 0);
  const engagement = Number(campaign?.metrics?.engagement ?? 0);
  const conversion = Number(campaign?.metrics?.conversion ?? 0);
  const assignedCount = campaign?.assignments?.length ?? 0;

  if (loading) {
    return (
      <section className="workspace-card p-6">
        <p className="text-pro-muted text-sm">Loading campaign data...</p>
      </section>
    );
  }

  return (
    <div className="space-y-5">
      {error ? <section className="rounded-xl border border-[#ff4d6d66] bg-[#ff4d6d1a] px-4 py-3 text-sm text-[#ff8b9e]">{error}</section> : null}

      {!campaign ? (
        <section className="workspace-card p-6">
          <h2 className="font-display text-xl font-semibold">No Campaigns Yet</h2>
          <p className="mt-2 text-sm text-pro-muted">
            This account has no campaign records yet. Create a campaign to see live details and performance here.
          </p>
        </section>
      ) : (
        <>
          <section className="workspace-card p-4 md:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs text-pro-accent">Campaign ID: {campaign._id.slice(-8).toUpperCase()}</p>
                <h2 className="mt-1 font-display text-3xl font-bold">{campaign.title}</h2>
                <p className="mt-2 max-w-3xl text-sm text-pro-muted">{campaign.description}</p>
              </div>
              <span className={`workspace-badge border ${statusBadgeClass(campaign.status)}`}>{statusLabel(campaign.status)}</span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Total Budget", value: formatDualFromUsd(budgetUsd) },
                { label: "Amount Spent", value: formatDualFromUsd(spentUsd) },
                { label: "Remaining", value: formatDualFromUsd(remainingUsd) },
                { label: "Budget Progress", value: { local: `${progressPercent}%`, usd: null as string | null } }
              ].map((card) => (
                <article className="workspace-card-soft p-3" key={card.label}>
                  <p className="text-pro-muted text-xs">{card.label}</p>
                  <p className="mono-stat mt-1 text-lg font-semibold">{card.value.local}</p>
                  {card.value.usd ? <p className="text-xs text-pro-muted">{card.value.usd}</p> : null}
                </article>
              ))}
            </div>

            <div className="mt-5">
              <h3 className="font-semibold">Campaign Timeline</h3>
              <div className="workspace-card-soft mt-3 p-3 md:p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm text-pro-muted">
                    <span className="text-pro-main font-semibold">{timeline.filter((step) => step.active).length}</span> of{" "}
                    <span className="text-pro-main font-semibold">{timeline.length}</span> stages complete
                  </p>
                  <p className="mono-stat text-sm font-semibold text-pro-accent">{progressPercent}%</p>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full border border-pro-surface bg-pro-primary/10">
                  <span
                    className="block h-full rounded-full bg-gradient-to-r from-pro-primary via-[#7C3AED] to-pro-accent transition-all duration-700 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="mt-3 grid gap-2 md:grid-cols-4">
                {timeline.map((step, index) => (
                  <div className="workspace-card-soft relative overflow-hidden p-3" key={step.key}>
                    <span
                      className={`pointer-events-none absolute inset-x-0 top-0 h-1 ${
                        step.active ? "bg-gradient-to-r from-pro-primary via-[#7C3AED] to-pro-accent" : "bg-pro-primary/10"
                      }`}
                    />
                    <span
                      className={`inline-flex size-5 items-center justify-center rounded-full text-[10px] ${
                        step.active ? "bg-pro-primary text-white" : "bg-pro-primary/10 text-pro-muted"
                      }`}
                    >
                      {step.active ? <Check size={12} /> : <Clock3 size={12} />}
                    </span>
                    <p className="mt-2 text-sm font-semibold">
                      {index + 1}. {step.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-4">
            {[
              { label: "Total Reach", value: reach.toLocaleString() },
              { label: "Engagement", value: `${engagement.toFixed(2)}%` },
              { label: "Conversion", value: `${conversion.toFixed(2)}%` },
              { label: "Assigned Creators", value: assignedCount.toLocaleString() }
            ].map((metric) => (
              <article className="workspace-card p-4" key={metric.label}>
                <p className="text-pro-muted text-xs">{metric.label}</p>
                <p className="mono-stat mt-2 text-3xl font-bold">{metric.value}</p>
              </article>
            ))}
          </section>

          <section className="grid gap-4 xl:grid-cols-2">
            <article className="workspace-card p-4">
              <h3 className="font-display text-xl font-semibold">Assigned Creators</h3>
              {assignmentPagination.pageItems.length === 0 ? (
                <p className="mt-3 text-sm text-pro-muted">No creators assigned yet.</p>
              ) : (
                <div className="mt-3 space-y-2">
                  {assignmentPagination.pageItems.map((entry) => (
                    <div className="workspace-card-soft p-3" key={entry.id}>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold">{entry.label}</p>
                        <span className="workspace-badge capitalize">{entry.status}</span>
                      </div>
                      <p className="mt-1 text-xs text-pro-muted">Payout: {formatDualFromUsd(entry.payoutUsd).local}</p>
                      <p className="text-xs text-pro-muted">Engagement Rate: {entry.engagementRate.toFixed(2)}%</p>
                    </div>
                  ))}
                </div>
              )}
              <PaginationControls
                fromItem={assignmentPagination.fromItem}
                onPageChange={assignmentPagination.setPage}
                onPageSizeChange={assignmentPagination.setPageSize}
                page={assignmentPagination.page}
                pageSize={assignmentPagination.pageSize}
                toItem={assignmentPagination.toItem}
                totalItems={assignmentPagination.totalItems}
                totalPages={assignmentPagination.totalPages}
              />
            </article>

            <article className="workspace-card p-4">
              <h3 className="font-display text-xl font-semibold">Campaign Meta</h3>
              <div className="mt-3 grid gap-2">
                <div className="workspace-card-soft p-3">
                  <p className="text-xs text-pro-muted">Category</p>
                  <p className="text-sm font-semibold">{campaign.category}</p>
                </div>
                <div className="workspace-card-soft p-3">
                  <p className="text-xs text-pro-muted">Goal</p>
                  <p className="text-sm font-semibold">{campaign.goal}</p>
                </div>
                <div className="workspace-card-soft p-3">
                  <p className="text-xs text-pro-muted">Start Date</p>
                  <p className="text-sm font-semibold">{formatDate(campaign.startDate)}</p>
                </div>
                <div className="workspace-card-soft p-3">
                  <p className="text-xs text-pro-muted">End Date</p>
                  <p className="text-sm font-semibold">{formatDate(campaign.endDate)}</p>
                </div>
              </div>
            </article>
          </section>
        </>
      )}
    </div>
  );
}
