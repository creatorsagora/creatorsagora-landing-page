"use client";

import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PaginationControls } from "@/components/ui/PaginationControls";
import { useCurrency } from "@/components/preferences/CurrencyProvider";
import { fetchDashboardRequest, readAuthSession, type DashboardOverviewResponse } from "@/lib/auth-client";
import { usePagination } from "@/hooks/usePagination";

type DashboardCampaign = {
  id: string;
  name: string;
  status: string;
  progress: number;
  spentUsd: number;
  budgetUsd: number;
  reach: number;
};

type Activity = {
  id: string;
  title: string;
  time: string;
  action: string;
  amountUsd: number;
};

function statusColor(status: string): string {
  const normalized = status.toLowerCase();
  if (normalized === "running") return "bg-pro-success/20 text-pro-success border-pro-success/30";
  if (normalized === "pending" || normalized === "draft") return "bg-pro-warning/20 text-pro-warning border-pro-warning/30";
  if (normalized === "completed") return "bg-pro-accent/20 text-pro-accent border-pro-accent/30";
  return "bg-pro-primary/20 text-pro-main border-pro-primary/40";
}

function statusLabel(status: string): string {
  if (!status) return "Pending";
  return `${status.charAt(0).toUpperCase()}${status.slice(1)}`;
}

function transactionTypeLabel(type: string): string {
  if (type === "deposit") return "Wallet Deposit";
  if (type === "withdrawal") return "Wallet Withdrawal";
  if (type === "campaign_spend") return "Campaign Spend";
  if (type === "earning") return "Campaign Earning";
  if (type === "fee") return "Platform Fee";
  return "Wallet Activity";
}

function formatRelativeTime(isoDate: string): string {
  const createdAt = new Date(isoDate);
  if (Number.isNaN(createdAt.getTime())) return "Just now";

  const minutes = Math.max(1, Math.floor((Date.now() - createdAt.getTime()) / 60000));
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function DashboardPageView() {
  const { formatDualFromUsd, formatSignedDualFromUsd } = useCurrency();
  const [data, setData] = useState<DashboardOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      const session = readAuthSession();
      if (!session?.token) {
        if (active) {
          setError("Please sign in to view dashboard.");
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
        setError(err instanceof Error ? err.message : "Unable to load dashboard data");
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const availableFunds = useMemo(() => formatDualFromUsd(data?.wallet.availableUsd ?? 0), [data, formatDualFromUsd]);
  const escrowFunds = useMemo(() => formatDualFromUsd(data?.wallet.escrowUsd ?? 0), [data, formatDualFromUsd]);

  const campaigns = useMemo<DashboardCampaign[]>(() => {
    const source = data?.campaigns ?? [];
    return source.map((campaign) => {
      const budgetUsd = Number(campaign.budgetUsd ?? 0);
      const spentUsd = Number(campaign.spentUsd ?? 0);
      const rawProgress = budgetUsd > 0 ? Math.round((spentUsd / budgetUsd) * 100) : 0;
      const progress = Math.max(0, Math.min(100, rawProgress));
      const reach = Number(campaign.metrics?.reach ?? campaign.aiPlan?.estimatedReach ?? 0);

      return {
        id: campaign._id,
        name: campaign.title || "Untitled Campaign",
        status: campaign.status || "pending",
        progress,
        spentUsd,
        budgetUsd,
        reach
      };
    });
  }, [data]);

  const activities = useMemo<Activity[]>(() => {
    const source = data?.recentTransactions ?? [];
    return source.map((transaction) => {
      const amountUsd = Number(transaction.amountUsd ?? 0);
      return {
        id: transaction._id,
        title: transaction.description?.trim() || transactionTypeLabel(transaction.type),
        time: formatRelativeTime(transaction.createdAt),
        action: transaction.status === "pending" ? "Pending" : "View Transaction",
        amountUsd
      };
    });
  }, [data]);

  const campaignPagination = usePagination(campaigns, 5);
  const activityPagination = usePagination(activities, 5);

  return (
    <div className="space-y-5">
      <section className="balance-gradient-card workspace-card relative overflow-hidden p-5">
        <span className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
        <span className="pointer-events-none absolute -right-16 top-6 size-44 rounded-full bg-pro-accent/25 blur-3xl" />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-white/80">Available Funds</p>
            <p className="mono-stat mt-2 text-[clamp(1.9rem,5vw,3rem)] font-extrabold">{availableFunds.local}</p>
            {availableFunds.usd ? <p className="mt-1 text-xs text-white/80">{availableFunds.usd}</p> : null}
            {loading ? <p className="mt-1 text-[11px] text-white/70">Syncing realtime balances...</p> : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2 text-sm font-semibold text-[#1e1f2b]" type="button">
              <ArrowDownLeft size={14} />
              Add Funds
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-full border border-white/35 bg-white/15 px-5 py-2 text-sm font-semibold text-white" type="button">
              <ArrowUpRight size={14} />
              Withdraw
            </button>
          </div>
        </div>
      </section>

      {error ? <section className="rounded-xl border border-[#ff4d6d66] bg-[#ff4d6d1a] px-4 py-3 text-sm text-[#ff8b9e]">{error}</section> : null}

      <section className="workspace-card p-4 md:p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Active Campaigns</h2>
          <button className="text-sm text-pro-accent" type="button">View All</button>
        </div>

        {campaigns.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/15 p-6 text-center">
            <p className="text-sm text-pro-muted">No active campaigns yet.</p>
            <p className="mt-1 text-xs text-pro-muted/80">Create your first campaign to start tracking progress here.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 lg:grid-cols-3">
              {campaignPagination.pageItems.map((campaign) => (
                <article className="workspace-card-soft p-4" key={campaign.id}>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold">{campaign.name}</h3>
                    <span className={`workspace-badge border ${statusColor(campaign.status)}`}>{statusLabel(campaign.status)}</span>
                  </div>
                  <div className="mt-3 h-1.5 rounded-full bg-white/10">
                    <span className="block h-1.5 rounded-full bg-gradient-to-r from-pro-primary to-pro-accent" style={{ width: `${campaign.progress}%` }} />
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-pro-muted">
                    <p>
                      Budget Spent
                      <span className="mt-1 block text-sm text-pro-main">{formatDualFromUsd(campaign.spentUsd).local}</span>
                    </p>
                    <p>
                      Total Budget
                      <span className="mt-1 block text-sm text-pro-main">{formatDualFromUsd(campaign.budgetUsd).local}</span>
                    </p>
                    <p className="col-span-2">
                      Est. Reach
                      <span className="mt-1 block text-sm text-pro-main">{campaign.reach.toLocaleString()}</span>
                    </p>
                  </div>
                </article>
              ))}
            </div>
            <PaginationControls
              fromItem={campaignPagination.fromItem}
              onPageChange={campaignPagination.setPage}
              onPageSizeChange={campaignPagination.setPageSize}
              page={campaignPagination.page}
              pageSize={campaignPagination.pageSize}
              toItem={campaignPagination.toItem}
              totalItems={campaignPagination.totalItems}
              totalPages={campaignPagination.totalPages}
            />
          </>
        )}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="workspace-card p-4">
          <p className="text-sm text-pro-muted">Total Campaigns</p>
          <p className="mono-stat mt-2 text-3xl font-bold">{(data?.stats.totalCampaigns ?? 0).toLocaleString()}</p>
        </article>
        <article className="workspace-card p-4">
          <p className="text-sm text-pro-muted">Unread Alerts</p>
          <p className="mono-stat mt-2 text-3xl font-bold">{(data?.stats.unreadMessages ?? 0).toLocaleString()}</p>
        </article>
        <article className="workspace-card p-4">
          <p className="text-sm text-pro-muted">Funds In Escrow</p>
          <p className="mono-stat mt-2 text-3xl font-bold">{escrowFunds.local}</p>
          {escrowFunds.usd ? <p className="mt-1 text-xs text-pro-muted">{escrowFunds.usd}</p> : null}
        </article>
        <article className="workspace-card p-4">
          <p className="text-sm text-pro-muted">Recent Transactions</p>
          <p className="mono-stat mt-2 text-3xl font-bold">{activities.length.toLocaleString()}</p>
        </article>
      </section>

      <section className="workspace-card p-4 md:p-5">
        <h2 className="font-display text-xl font-semibold">Recent Activity</h2>
        {activityPagination.pageItems.length === 0 ? (
          <p className="mt-4 text-sm text-pro-muted">No recent wallet activity yet.</p>
        ) : (
          <div className="mt-4 divide-y workspace-divider">
            {activityPagination.pageItems.map((activity) => {
              const signedAmount = formatSignedDualFromUsd(activity.amountUsd);
              return (
                <article className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between" key={activity.id}>
                  <div>
                    <p className="text-sm text-pro-main">{activity.title}</p>
                    <p className="text-pro-muted text-xs">{activity.time}</p>
                    <p className={`mt-1 text-xs ${activity.amountUsd < 0 ? "text-[#ff8b9e]" : "text-pro-success"}`}>{signedAmount.local}</p>
                    {signedAmount.usd ? <p className="text-[11px] text-pro-muted">{signedAmount.usd}</p> : null}
                  </div>
                  <button className="text-sm text-pro-accent" type="button">{activity.action}</button>
                </article>
              );
            })}
          </div>
        )}
        <PaginationControls
          fromItem={activityPagination.fromItem}
          onPageChange={activityPagination.setPage}
          onPageSizeChange={activityPagination.setPageSize}
          page={activityPagination.page}
          pageSize={activityPagination.pageSize}
          toItem={activityPagination.toItem}
          totalItems={activityPagination.totalItems}
          totalPages={activityPagination.totalPages}
        />
      </section>
    </div>
  );
}