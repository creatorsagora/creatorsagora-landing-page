"use client";

import { CheckCircle2, Clock3, Eye, FileText } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useCurrency } from "@/components/preferences/CurrencyProvider";
import { PaginationControls } from "@/components/ui/PaginationControls";
import { usePagination } from "@/hooks/usePagination";
import { fetchDashboardRequest, readAuthSession, type DashboardOverviewResponse } from "@/lib/auth-client";

type Opportunity = {
  id: string;
  name: string;
  category: string;
  budgetUsd: number;
  status: string;
  fit: string;
};

function statusFit(status: string) {
  if (status === "running") return "96%";
  if (status === "pending" || status === "draft") return "88%";
  if (status === "completed") return "93%";
  return "80%";
}

function statusLabel(status: string) {
  if (!status) return "Pending";
  return `${status.charAt(0).toUpperCase()}${status.slice(1)}`;
}

function relativeTime(value?: string) {
  if (!value) return "Just now";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Just now";
  const minutes = Math.max(1, Math.floor((Date.now() - date.getTime()) / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function CreatorDashboardView() {
  const { formatDualFromUsd } = useCurrency();
  const [data, setData] = useState<DashboardOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadCreatorDashboard = async () => {
      const session = readAuthSession();
      if (!session?.token) {
        if (active) {
          setError("Please sign in to load creator dashboard.");
          setLoading(false);
        }
        return;
      }

      try {
        const response = await fetchDashboardRequest(session.token);
        if (!active) return;
        setData(response);
        setError("");
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Unable to load creator dashboard");
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadCreatorDashboard();
    return () => {
      active = false;
    };
  }, []);

  const opportunities = useMemo<Opportunity[]>(() => {
    return (data?.campaigns ?? []).map((campaign) => ({
      id: campaign._id,
      name: campaign.title || "Untitled Campaign",
      category: campaign.status ? statusLabel(campaign.status) : "Campaign",
      budgetUsd: Number(campaign.budgetUsd ?? 0),
      status: campaign.status ?? "pending",
      fit: statusFit(campaign.status ?? "pending")
    }));
  }, [data]);

  const creatorPipeline = useMemo(
    () => [
      {
        stage: "Submitted",
        count: opportunities.filter((item) => item.status === "pending" || item.status === "draft").length,
        tone: "text-pro-warning"
      },
      {
        stage: "In Review",
        count: opportunities.filter((item) => item.status === "running").length,
        tone: "text-pro-accent"
      },
      {
        stage: "Approved",
        count: opportunities.filter((item) => item.status === "completed").length,
        tone: "text-pro-success"
      },
      {
        stage: "Rejected",
        count: opportunities.filter((item) => item.status === "cancelled").length,
        tone: "text-pro-muted"
      }
    ],
    [opportunities]
  );

  const pipelineActivity = useMemo(
    () =>
      (data?.campaigns ?? []).map((campaign) => [
        campaign.title || "Untitled Campaign",
        `${statusLabel(campaign.status ?? "pending")} · ${relativeTime(campaign.updatedAt)}`
      ]) as Array<[string, string]>,
    [data]
  );

  const averageReach = useMemo(() => {
    const reachValues = (data?.campaigns ?? []).map((campaign) => Number(campaign.metrics?.reach ?? 0)).filter((reach) => reach > 0);
    if (reachValues.length === 0) return 0;
    const total = reachValues.reduce((sum, value) => sum + value, 0);
    return Math.round(total / reachValues.length);
  }, [data]);

  const averageEngagement = useMemo(() => {
    const values = (data?.campaigns ?? []).map((campaign) => Number(campaign.metrics?.engagement ?? 0)).filter((value) => value > 0);
    if (values.length === 0) return 0;
    const total = values.reduce((sum, value) => sum + value, 0);
    return total / values.length;
  }, [data]);

  const opportunitiesPagination = usePagination(opportunities, 10);
  const pipelineActivityPagination = usePagination(pipelineActivity, 5);

  return (
    <div className="space-y-5">
      <section className="workspace-card p-4 md:p-5">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <p className="text-pro-accent text-xs uppercase tracking-[0.12em]">Creator Command Center</p>
            <h2 className="font-display mt-1 text-[clamp(1.5rem,3.2vw,2.3rem)] font-bold">Discovery, Pitches, and Monetization</h2>
            <p className="text-pro-muted mt-2 text-sm">
              Manage open briefs, proposal pipeline, payout velocity, and content approvals in one place.
            </p>
          </div>
        </div>
      </section>

      {error ? <section className="rounded-xl border border-[#ff4d6d66] bg-[#ff4d6d1a] px-4 py-3 text-sm text-[#ff8b9e]">{error}</section> : null}

      <section className="workspace-card p-4 md:p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-xl font-semibold">Available Campaigns</h3>
          <span className="text-sm text-pro-accent">{loading ? "Syncing..." : `${opportunities.length} total`}</span>
        </div>
        {opportunitiesPagination.pageItems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/15 p-6 text-center">
            <p className="text-sm text-pro-muted">No campaign assignments available yet.</p>
            <p className="mt-1 text-xs text-pro-muted/80">Once campaigns are assigned, they will appear here in realtime.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {opportunitiesPagination.pageItems.map((brief) => (
              <article className="workspace-card-soft p-4" key={brief.id}>
                <p className="font-semibold">{brief.name}</p>
                <p className="text-pro-muted mt-1 text-xs">{brief.category}</p>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="workspace-badge border-pro-primary/25 bg-pro-primary/12">
                    Budget {formatDualFromUsd(brief.budgetUsd).local}
                  </span>
                  <span className="text-pro-success">{brief.fit} fit</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="btn-pro-primary h-9 px-3 py-0 text-xs">Open</button>
                  <button className="btn-pro-secondary h-9 px-3 py-0 text-xs">Preview</button>
                </div>
              </article>
            ))}
          </div>
        )}
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
            {pipelineActivityPagination.pageItems.length === 0 ? (
              <p className="py-2.5 text-sm text-pro-muted">No campaign activity yet.</p>
            ) : (
              pipelineActivityPagination.pageItems.map(([title, meta]) => (
                <article className="py-2.5" key={title}>
                  <p className="text-sm">{title}</p>
                  <p className="text-pro-muted text-xs">{meta}</p>
                </article>
              ))
            )}
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
              { icon: CheckCircle2, label: "Approved Deliverables", value: creatorPipeline.find((item) => item.stage === "Approved")?.count ?? 0 },
              { icon: Clock3, label: "Pending Reviews", value: creatorPipeline.find((item) => item.stage === "In Review")?.count ?? 0 },
              { icon: Eye, label: "Average Reach / Post", value: averageReach > 0 ? averageReach.toLocaleString() : "0" },
              { icon: FileText, label: "Average Engagement", value: `${averageEngagement.toFixed(2)}%` }
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
