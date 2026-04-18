"use client";

import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { PaginationControls } from "@/components/ui/PaginationControls";
import { useCurrency } from "@/components/preferences/CurrencyProvider";
import { usePagination } from "@/hooks/usePagination";

const campaigns = [
  {
    name: "Summer Fashion Launch",
    status: "Running",
    progress: 78,
    spentUsd: 450000 / 1550,
    budgetUsd: 580000 / 1550,
    reach: "125,840"
  },
  {
    name: "Tech Product Review",
    status: "Pending",
    progress: 23,
    spentUsd: 180000 / 1550,
    budgetUsd: 780000 / 1550,
    reach: "98,560"
  },
  {
    name: "Fitness Challenge",
    status: "Completed",
    progress: 100,
    spentUsd: 320000 / 1550,
    budgetUsd: 320000 / 1550,
    reach: "156,230"
  }
];

const metrics = [
  { value: "2.4M", label: "Total Reach", trend: "+12.5%", isMoney: false },
  { value: "8.7%", label: "Engagement Rate", trend: "+3.2%", isMoney: false },
  { value: 1200000 / 1550, label: "Total Earnings", trend: "-1.8%", isMoney: true },
  { value: "247", label: "Active Creators", trend: "+7.3%", isMoney: false }
];

type Activity = {
  title: string;
  time: string;
  action: string;
  amountUsd?: number;
};

const activities: Activity[] = [
  { title: 'Campaign "Summer Fashion Launch" completed successfully', time: "2 hours ago", action: "View Campaign" },
  { title: "New creator @sarah_lifestyle joined your campaign", time: "4 hours ago", action: "View Profile" },
  {
    title: "Payment received for completed campaign",
    time: "1 day ago",
    action: "View Transaction",
    amountUsd: 450000 / 1550
  },
  { title: "3 new messages from potential collaborators", time: "2 days ago", action: "View Messages" },
  { title: 'Campaign "Tech Product Review" requires your approval', time: "3 days ago", action: "Review Campaign" }
];

function statusColor(status: string): string {
  if (status === "Running") return "bg-pro-success/20 text-pro-success border-pro-success/30";
  if (status === "Pending") return "bg-pro-warning/20 text-pro-warning border-pro-warning/30";
  return "bg-pro-primary/20 text-pro-main border-pro-primary/40";
}

export function DashboardPageView() {
  const { formatDualFromUsd } = useCurrency();
  const availableFunds = formatDualFromUsd(2847650 / 1550);
  const earnings = formatDualFromUsd(1200000 / 1550);
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
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2 text-sm font-semibold text-[#1e1f2b]">
              <ArrowDownLeft size={14} />
              Add Funds
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-full border border-white/35 bg-white/15 px-5 py-2 text-sm font-semibold text-white">
              <ArrowUpRight size={14} />
              Withdraw
            </button>
          </div>
        </div>
      </section>

      <section className="workspace-card p-4 md:p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Active Campaigns</h2>
          <button className="text-sm text-pro-accent">View All</button>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {campaignPagination.pageItems.map((campaign) => (
            <article className="workspace-card-soft p-4" key={campaign.name}>
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold">{campaign.name}</h3>
                <span className={`workspace-badge border ${statusColor(campaign.status)}`}>{campaign.status}</span>
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
                  <span className="mt-1 block text-sm text-pro-main">{campaign.reach}</span>
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
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <article className="workspace-card p-4" key={metric.label}>
            <p className="text-xs text-pro-muted">{metric.trend}</p>
            <p className="mono-stat mt-2 text-3xl font-bold">{metric.isMoney ? earnings.local : metric.value}</p>
            {metric.isMoney && earnings.usd ? <p className="mt-0.5 text-xs text-pro-muted">{earnings.usd}</p> : null}
            <p className="text-pro-muted mt-1 text-sm">{metric.label}</p>
          </article>
        ))}
      </section>

      <section className="workspace-card p-4 md:p-5">
        <h2 className="font-display text-xl font-semibold">Recent Activity</h2>
        <div className="mt-4 divide-y workspace-divider">
          {activityPagination.pageItems.map((activity) => (
            <article className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between" key={activity.title}>
              <div>
                <p className="text-sm text-pro-main">
                  {activity.title}
                  {activity.amountUsd !== undefined ? ` (${formatDualFromUsd(activity.amountUsd).local})` : ""}
                </p>
                <p className="text-pro-muted text-xs">{activity.time}</p>
              </div>
              <button className="text-sm text-pro-accent">{activity.action}</button>
            </article>
          ))}
        </div>
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
