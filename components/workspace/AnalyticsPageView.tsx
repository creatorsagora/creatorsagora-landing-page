"use client";

import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";
import { useCurrency } from "@/components/preferences/CurrencyProvider";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { PaginationControls } from "@/components/ui/PaginationControls";
import { usePagination } from "@/hooks/usePagination";
import { fetchCampaignsRequest, readAuthSession, type CampaignListResponse } from "@/lib/auth-client";

type Campaign = CampaignListResponse["campaigns"][number];

type CampaignRow = {
  id: string;
  name: string;
  roi: string;
  cpeUsd: number | null;
  engagement: string;
};

type TrendPoint = {
  date: string;
  reach: number;
  engagement: number;
};

type StatusKey = "running" | "pending" | "draft" | "completed" | "cancelled";

type StatusMixPoint = {
  key: StatusKey;
  name: string;
  value: number;
};

const trendChartConfig = {
  reach: {
    label: "Reach",
    theme: { light: "#5A4BE0", dark: "#4C3AFF" }
  },
  engagement: {
    label: "Engagement %",
    theme: { light: "#0098BF", dark: "#00D1FF" }
  }
} satisfies ChartConfig;

const statusChartConfig = {
  running: { label: "Running", theme: { light: "#00A778", dark: "#00C896" } },
  pending: { label: "Pending", theme: { light: "#E89B27", dark: "#FFB020" } },
  draft: { label: "Draft", theme: { light: "#7A68FF", dark: "#8A7CFF" } },
  completed: { label: "Completed", theme: { light: "#00B8DD", dark: "#00D1FF" } },
  cancelled: { label: "Cancelled", theme: { light: "#ff6f8c", dark: "#ff8ca2" } }
} satisfies ChartConfig;

function formatCompact(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${Math.round(value / 1_000)}k`;
  return value.toString();
}

function formatDateShort(value?: string) {
  if (!value) return "Unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function normalizeStatus(status?: string): StatusKey {
  if (status === "running") return "running";
  if (status === "completed") return "completed";
  if (status === "cancelled") return "cancelled";
  if (status === "draft") return "draft";
  return "pending";
}

export function AnalyticsPageView() {
  const { formatDualFromUsd } = useCurrency();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadAnalytics = async () => {
      const session = readAuthSession();
      if (!session?.token) {
        if (active) {
          setError("Please sign in to view analytics.");
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
        setError(err instanceof Error ? err.message : "Unable to load analytics");
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadAnalytics();
    return () => {
      active = false;
    };
  }, []);

  const summary = useMemo(() => {
    const totalReach = campaigns.reduce((sum, campaign) => sum + Number(campaign.metrics?.reach ?? campaign.aiPlan?.estimatedReach ?? 0), 0);
    const totalSpent = campaigns.reduce((sum, campaign) => sum + Number(campaign.spentUsd ?? 0), 0);
    const engagementValues = campaigns.map((campaign) => Number(campaign.metrics?.engagement ?? 0)).filter((value) => value > 0);
    const averageEngagement = engagementValues.length > 0 ? engagementValues.reduce((sum, value) => sum + value, 0) / engagementValues.length : 0;

    const totalEngagementActions = campaigns.reduce((sum, campaign) => {
      const reach = Number(campaign.metrics?.reach ?? campaign.aiPlan?.estimatedReach ?? 0);
      const engagement = Number(campaign.metrics?.engagement ?? 0);
      if (reach <= 0 || engagement <= 0) return sum;
      return sum + (reach * engagement) / 100;
    }, 0);

    const cpeUsd = totalEngagementActions > 0 ? totalSpent / totalEngagementActions : null;
    const roi = totalSpent > 0 ? totalReach / totalSpent : null;

    return {
      totalReach,
      averageEngagement,
      cpeUsd,
      roi
    };
  }, [campaigns]);

  const trendData = useMemo<TrendPoint[]>(() => {
    const grouped = new Map<string, { date: string; reach: number; engagementSum: number; engagementCount: number }>();

    for (const campaign of campaigns) {
      const stamp = campaign.updatedAt ?? campaign.createdAt;
      if (!stamp) continue;
      const key = formatDateShort(stamp);
      if (!grouped.has(key)) {
        grouped.set(key, { date: key, reach: 0, engagementSum: 0, engagementCount: 0 });
      }
      const row = grouped.get(key);
      if (!row) continue;
      row.reach += Number(campaign.metrics?.reach ?? campaign.aiPlan?.estimatedReach ?? 0);
      const engagement = Number(campaign.metrics?.engagement ?? 0);
      if (engagement > 0) {
        row.engagementSum += engagement;
        row.engagementCount += 1;
      }
    }

    return Array.from(grouped.values())
      .map((entry) => ({
        date: entry.date,
        reach: Math.round(entry.reach),
        engagement: entry.engagementCount > 0 ? Number((entry.engagementSum / entry.engagementCount).toFixed(2)) : 0
      }))
      .slice(-7);
  }, [campaigns]);

  const statusMix = useMemo<StatusMixPoint[]>(() => {
    const counts: Record<StatusKey, number> = {
      running: 0,
      pending: 0,
      draft: 0,
      completed: 0,
      cancelled: 0
    };
    for (const campaign of campaigns) {
      counts[normalizeStatus(campaign.status)] += 1;
    }
    return [
      { key: "running", name: "Running", value: counts.running },
      { key: "pending", name: "Pending", value: counts.pending },
      { key: "draft", name: "Draft", value: counts.draft },
      { key: "completed", name: "Completed", value: counts.completed },
      { key: "cancelled", name: "Cancelled", value: counts.cancelled }
    ];
  }, [campaigns]);

  const statusMixTotal = statusMix.reduce((sum, entry) => sum + entry.value, 0);

  const rows = useMemo<CampaignRow[]>(() => {
    return campaigns.map((campaign) => {
      const spent = Number(campaign.spentUsd ?? 0);
      const reach = Number(campaign.metrics?.reach ?? campaign.aiPlan?.estimatedReach ?? 0);
      const engagement = Number(campaign.metrics?.engagement ?? 0);
      const engagementActions = reach > 0 && engagement > 0 ? (reach * engagement) / 100 : 0;
      const cpeUsd = engagementActions > 0 ? spent / engagementActions : null;
      const roi = spent > 0 ? reach / spent : null;

      return {
        id: campaign._id,
        name: campaign.title || "Untitled Campaign",
        roi: roi !== null ? `${roi.toFixed(2)}x` : "—",
        cpeUsd,
        engagement: engagement > 0 ? `${engagement.toFixed(2)}%` : "—"
      };
    });
  }, [campaigns]);

  const campaignPagination = usePagination(rows, 5);
  const hasAnalyticsData = campaigns.length > 0;

  const kpis = [
    {
      label: "Total Reach",
      value: summary.totalReach > 0 ? formatCompact(summary.totalReach) : "0",
      change: hasAnalyticsData ? "Live data" : "No data yet"
    },
    {
      label: "Engagement",
      value: summary.averageEngagement > 0 ? `${summary.averageEngagement.toFixed(2)}%` : "0%",
      change: hasAnalyticsData ? "Live data" : "No data yet"
    },
    {
      label: "Cost per Engagement",
      value: summary.cpeUsd !== null ? formatDualFromUsd(summary.cpeUsd).local : "—",
      change: hasAnalyticsData ? "Live data" : "No data yet"
    },
    {
      label: "ROI",
      value: summary.roi !== null ? `${summary.roi.toFixed(2)}x` : "—",
      change: hasAnalyticsData ? "Live data" : "No data yet"
    }
  ];

  return (
    <div className="space-y-5">
      {error ? <section className="rounded-xl border border-[#ff4d6d66] bg-[#ff4d6d1a] px-4 py-3 text-sm text-[#ff8b9e]">{error}</section> : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <article className="workspace-card p-4" key={kpi.label}>
            <p className="text-pro-muted text-xs">{loading ? "Syncing..." : kpi.change}</p>
            <p className="mono-stat mt-2 text-3xl font-bold">{kpi.value}</p>
            <p className="text-pro-muted mt-1 text-sm">{kpi.label}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <article className="workspace-card p-4">
          <h2 className="font-display text-xl font-semibold">Reach and Engagement</h2>
          <p className="text-pro-muted mt-1 text-xs">Daily trend across live campaigns</p>
          <div className="bg-pro-panel mt-4 rounded-xl border border-pro-surface p-3">
            {trendData.length === 0 ? (
              <div className="grid h-[280px] place-items-center text-sm text-pro-muted">No trend data yet.</div>
            ) : (
              <ChartContainer className="h-[280px]" config={trendChartConfig}>
                <AreaChart data={trendData} margin={{ left: 2, right: 10, top: 6, bottom: 0 }}>
                  <defs>
                    <linearGradient id="reachFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-reach)" stopOpacity={0.32} />
                      <stop offset="100%" stopColor="var(--color-reach)" stopOpacity={0.03} />
                    </linearGradient>
                    <linearGradient id="engagementFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-engagement)" stopOpacity={0.28} />
                      <stop offset="100%" stopColor="var(--color-engagement)" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} />
                  <XAxis axisLine={false} dataKey="date" tickLine={false} />
                  <YAxis axisLine={false} dataKey="reach" tickFormatter={formatCompact} tickLine={false} width={44} />
                  <YAxis axisLine={false} dataKey="engagement" orientation="right" tickFormatter={(value) => `${value}%`} tickLine={false} width={34} yAxisId="right" />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        labelFormatter={(label) => <span>{label}</span>}
                        valueFormatter={(value, dataKey) => (dataKey === "engagement" ? `${value}%` : formatCompact(Number(value)))}
                      />
                    }
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Area dataKey="reach" fill="url(#reachFill)" stroke="var(--color-reach)" strokeWidth={2.5} type="monotone" />
                  <Area dataKey="engagement" fill="url(#engagementFill)" stroke="var(--color-engagement)" strokeWidth={2.2} type="monotone" yAxisId="right" />
                </AreaChart>
              </ChartContainer>
            )}
          </div>
        </article>

        <article className="workspace-card p-4">
          <h2 className="font-display text-xl font-semibold">Campaign Status Mix</h2>
          <p className="text-pro-muted mt-1 text-xs">Distribution by live campaign status</p>
          <div className="bg-pro-panel mt-4 rounded-xl border border-pro-surface p-3">
            {statusMixTotal === 0 ? (
              <div className="grid h-[280px] place-items-center text-sm text-pro-muted">No status data yet.</div>
            ) : (
              <ChartContainer className="h-[280px]" config={statusChartConfig}>
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent valueFormatter={(value) => `${value} campaigns`} />} />
                  <Pie data={statusMix} dataKey="value" innerRadius={70} nameKey="name" outerRadius={98} paddingAngle={3} stroke="transparent">
                    {statusMix.map((entry) => (
                      <Cell fill={`var(--color-${entry.key})`} key={entry.key} />
                    ))}
                  </Pie>
                  <ChartLegend content={<ChartLegendContent className="justify-center" />} />
                </PieChart>
              </ChartContainer>
            )}
          </div>
        </article>
      </section>

      <section className="workspace-card p-4">
        <h2 className="font-display text-xl font-semibold">Campaign Comparison</h2>
        {campaignPagination.pageItems.length === 0 ? (
          <p className="mt-3 text-sm text-pro-muted">No campaign records to compare yet.</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-pro-muted">
                <tr>
                  <th className="pb-2">Campaign</th>
                  <th className="pb-2">ROI</th>
                  <th className="pb-2">Cost/Engagement</th>
                  <th className="pb-2">Engagement</th>
                </tr>
              </thead>
              <tbody className="divide-y workspace-divider">
                {campaignPagination.pageItems.map((campaign) => (
                  <tr key={campaign.id}>
                    <td className="py-2">{campaign.name}</td>
                    <td className="py-2">{campaign.roi}</td>
                    <td className="py-2">{campaign.cpeUsd !== null ? formatDualFromUsd(campaign.cpeUsd).local : "—"}</td>
                    <td className="py-2">{campaign.engagement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
    </div>
  );
}
