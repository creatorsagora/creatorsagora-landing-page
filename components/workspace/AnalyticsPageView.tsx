"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis
} from "recharts";
import { useCurrency } from "@/components/preferences/CurrencyProvider";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { PaginationControls } from "@/components/ui/PaginationControls";
import { usePagination } from "@/hooks/usePagination";

const campaigns = [
  { name: "Summer Fashion Launch", roi: "4.2x", cpeUsd: 38 / 1550, engagement: "8.7%" },
  { name: "Tech Product Review", roi: "3.1x", cpeUsd: 46 / 1550, engagement: "7.4%" },
  { name: "Fitness Challenge", roi: "3.9x", cpeUsd: 41 / 1550, engagement: "9.6%" }
];

const trendData = [
  { date: "Mar 01", reach: 92000, engagement: 5.1 },
  { date: "Mar 05", reach: 124000, engagement: 5.8 },
  { date: "Mar 10", reach: 181000, engagement: 6.6 },
  { date: "Mar 15", reach: 233000, engagement: 7.1 },
  { date: "Mar 20", reach: 302000, engagement: 7.8 },
  { date: "Mar 25", reach: 389000, engagement: 8.4 },
  { date: "Mar 30", reach: 468000, engagement: 9.1 }
];

const channelMix = [
  { key: "instagram", name: "Instagram", value: 38 },
  { key: "tiktok", name: "TikTok", value: 27 },
  { key: "youtube", name: "YouTube", value: 19 },
  { key: "x", name: "X", value: 16 }
];

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

const channelChartConfig = {
  instagram: { label: "Instagram", theme: { light: "#7A68FF", dark: "#8A7CFF" } },
  tiktok: { label: "TikTok", theme: { light: "#00B8DD", dark: "#00D1FF" } },
  youtube: { label: "YouTube", theme: { light: "#FF6A8B", dark: "#FF7F9A" } },
  x: { label: "X", theme: { light: "#7A8DAF", dark: "#95A4C1" } }
} satisfies ChartConfig;

function formatCompact(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${Math.round(value / 1_000)}k`;
  return value.toString();
}

export function AnalyticsPageView() {
  const { formatDualFromUsd } = useCurrency();
  const campaignPagination = usePagination(campaigns, 5);

  const kpis = [
    { label: "Total Reach", value: "4.8M", change: "+14%" },
    { label: "Engagement", value: "9.1%", change: "+3.4%" },
    { label: "Cost per Engagement", value: formatDualFromUsd(42 / 1550).local, change: "-6.2%" },
    { label: "ROI", value: "3.8x", change: "+18%" }
  ];

  return (
    <div className="space-y-5">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <article className="workspace-card p-4" key={kpi.label}>
            <p className="text-pro-muted text-xs">{kpi.change}</p>
            <p className="mono-stat mt-2 text-3xl font-bold">{kpi.value}</p>
            <p className="text-pro-muted mt-1 text-sm">{kpi.label}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <article className="workspace-card p-4">
          <h2 className="font-display text-xl font-semibold">Reach and Engagement</h2>
          <p className="text-pro-muted mt-1 text-xs">Daily trend across active campaigns</p>
          <div className="bg-pro-panel mt-4 rounded-xl border border-pro-surface p-3">
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
          </div>
        </article>

        <article className="workspace-card p-4">
          <h2 className="font-display text-xl font-semibold">Channel Performance Mix</h2>
          <p className="text-pro-muted mt-1 text-xs">Reach distribution by platform</p>
          <div className="bg-pro-panel mt-4 rounded-xl border border-pro-surface p-3">
            <ChartContainer className="h-[280px]" config={channelChartConfig}>
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent valueFormatter={(value) => `${value}%`} />} />
                <Pie
                  data={channelMix}
                  dataKey="value"
                  innerRadius={70}
                  nameKey="name"
                  outerRadius={98}
                  paddingAngle={3}
                  stroke="transparent"
                >
                  {channelMix.map((entry) => (
                    <Cell fill={`var(--color-${entry.key})`} key={entry.key} />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent className="justify-center" />} />
              </PieChart>
            </ChartContainer>
          </div>
        </article>
      </section>

      <section className="workspace-card p-4">
        <h2 className="font-display text-xl font-semibold">Campaign Comparison</h2>
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
                <tr key={campaign.name}>
                  <td className="py-2">{campaign.name}</td>
                  <td className="py-2">{campaign.roi}</td>
                  <td className="py-2">{formatDualFromUsd(campaign.cpeUsd).local}</td>
                  <td className="py-2">{campaign.engagement}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
    </div>
  );
}
