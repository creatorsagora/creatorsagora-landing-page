"use client";

import { Check, Clock3 } from "lucide-react";
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from "@/components/ui/chart";
import { useCurrency } from "@/components/preferences/CurrencyProvider";
import { PaginationControls } from "@/components/ui/PaginationControls";
import { usePagination } from "@/hooks/usePagination";

const timelineSteps = [
  { label: "Created", date: "Mar 15, 2026", active: true },
  { label: "AI Assigned", date: "Mar 16, 2026", active: true },
  { label: "Campaign Live", date: "Mar 18, 2026", active: true },
  { label: "Content Review", date: "Expected Mar 25", active: false },
  { label: "Completed", date: "Expected Mar 30", active: false }
];

const influencerCards = [
  { name: "@sarah_lifestyle", engagement: "8.4%", score: "89" },
  { name: "@mike_trends", engagement: "6.2%", score: "82" },
  { name: "@emma_beauty", engagement: "9.1%", score: "91" }
];

const tasks = [
  { title: "Instagram Post - Summer Collection", state: "Completed" },
  { title: "TikTok Video - Style Tips", state: "In Progress" },
  { title: "Beauty Tutorial Reel", state: "Pending" }
];

const activities = [
  "@sarah_lifestyle posted Instagram content",
  "Content submitted for approval by @mike_trends",
  "@emma_beauty accepted campaign invitation",
  "AI assigned 3 new influencers to campaign"
];

const performanceTrendData = [
  { day: "Mar 18", reach: 42000, engagement: 4.8 },
  { day: "Mar 19", reach: 56000, engagement: 5.2 },
  { day: "Mar 20", reach: 71000, engagement: 5.8 },
  { day: "Mar 21", reach: 89000, engagement: 6.4 },
  { day: "Mar 22", reach: 103000, engagement: 7.1 },
  { day: "Mar 23", reach: 117000, engagement: 7.5 },
  { day: "Mar 24", reach: 126000, engagement: 7.8 }
];

const deliveryMixData = [
  { key: "completed", name: "Completed", value: 13 },
  { key: "review", name: "In Review", value: 4 },
  { key: "pending", name: "Pending", value: 3 }
];

const trendChartConfig = {
  reach: { label: "Reach", theme: { light: "#5A4BE0", dark: "#4C3AFF" } },
  engagement: { label: "Engagement %", theme: { light: "#00A6D4", dark: "#00D1FF" } }
} satisfies ChartConfig;

const deliveryChartConfig = {
  completed: { label: "Completed", theme: { light: "#00A778", dark: "#00C896" } },
  review: { label: "In Review", theme: { light: "#5A4BE0", dark: "#4C3AFF" } },
  pending: { label: "Pending", theme: { light: "#E89B27", dark: "#FFB020" } }
} satisfies ChartConfig;

function formatCompact(value: number) {
  if (value >= 1000) return `${Math.round(value / 1000)}k`;
  return value.toString();
}

function stateClass(state: string): string {
  if (state === "Completed") return "bg-pro-success/15 text-pro-success";
  if (state === "In Progress") return "bg-pro-warning/15 text-pro-warning";
  return "bg-white/10 text-pro-main";
}

export function CampaignDetailsPageView() {
  const { formatDualFromUsd } = useCurrency();
  const influencerPagination = usePagination(influencerCards, 5);
  const taskPagination = usePagination(tasks, 5);
  const activityPagination = usePagination(activities, 5);
  const totalBudgetUsd = 580000 / 1550;
  const spentUsd = 450000 / 1550;
  const remainingUsd = 130000 / 1550;

  const summaryCards = [
    { label: "Total Budget", value: formatDualFromUsd(totalBudgetUsd) },
    { label: "Amount Spent", value: formatDualFromUsd(spentUsd) },
    { label: "Remaining", value: formatDualFromUsd(remainingUsd) },
    { label: "Budget Progress", value: { local: "78%", usd: null } }
  ];
  const completedStepCount = timelineSteps.filter((step) => step.active).length;
  const timelineProgressPercent = Math.round((completedStepCount / timelineSteps.length) * 100);
  const currentStageLabel = timelineSteps[Math.max(completedStepCount - 1, 0)]?.label ?? "Not started";

  return (
    <div className="space-y-5">
      <section className="workspace-card p-4 md:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs text-pro-accent">Campaign ID: CF-284-001</p>
            <h2 className="mt-1 font-display text-3xl font-bold">Summer Fashion Launch</h2>
          </div>
          <span className="workspace-badge border-pro-success/30 bg-pro-success/10 text-pro-success">Live</span>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
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
                <span className="text-pro-main font-semibold">{completedStepCount}</span> of{" "}
                <span className="text-pro-main font-semibold">{timelineSteps.length}</span> stages complete
              </p>
              <p className="mono-stat text-sm font-semibold text-pro-accent">{timelineProgressPercent}%</p>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full border border-pro-surface bg-pro-primary/10">
              <span
                className="block h-full rounded-full bg-gradient-to-r from-pro-primary via-[#7C3AED] to-pro-accent transition-all duration-700 ease-out"
                style={{ width: `${timelineProgressPercent}%` }}
              />
            </div>
            <p className="text-pro-muted mt-2 text-xs">
              Current stage: <span className="font-semibold text-pro-main">{currentStageLabel}</span>
            </p>
          </div>

          <div className="mt-3 grid gap-2 md:grid-cols-5">
            {timelineSteps.map((step, index) => (
              <div className="workspace-card-soft relative overflow-hidden p-3" key={step.label}>
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
                <p className="text-pro-muted text-xs">{step.date}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        {[
          { value: "125.8K", label: "Total Reach", trend: "+4.2%" },
          { value: "7.8%", label: "Engagement Rate", trend: "+1.3%" },
          { value: "13/20", label: "Content Delivered", trend: "65% complete" },
          { value: "3.2x", label: "ROI Estimate", trend: "+18%" },
          { value: formatDualFromUsd(spentUsd).local, label: "Budget Used", trend: "78%" },
          { value: formatDualFromUsd(remainingUsd).local, label: "Budget Remaining", trend: "22%" }
        ].map((metric) => (
          <article className="workspace-card p-4" key={metric.label}>
            <p className="text-pro-muted text-xs">{metric.trend}</p>
            <p className="mono-stat mt-2 text-3xl font-bold">{metric.value}</p>
            <p className="text-pro-muted mt-1 text-sm">{metric.label}</p>
          </article>
        ))}
      </section>

      <section className="workspace-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-xl font-semibold">Assigned Creators</h3>
          <button className="workspace-badge">Sort by Reach</button>
        </div>
        <div className="grid gap-3 lg:grid-cols-3">
          {influencerPagination.pageItems.map((influencer) => (
            <article className="workspace-card-soft p-3" key={influencer.name}>
              <p className="text-sm font-semibold">{influencer.name}</p>
              <p className="text-pro-muted mt-1 text-xs">Engagement: {influencer.engagement}</p>
              <p className="text-pro-muted text-xs">AI score: {influencer.score}</p>
              <div className="mt-3 flex gap-2">
                <button className="btn-pro-secondary h-8 px-3 py-0 text-xs">View Profile</button>
                <button className="btn-pro-primary h-8 px-3 py-0 text-xs">Message</button>
              </div>
            </article>
          ))}
        </div>
        <PaginationControls
          fromItem={influencerPagination.fromItem}
          onPageChange={influencerPagination.setPage}
          onPageSizeChange={influencerPagination.setPageSize}
          page={influencerPagination.page}
          pageSize={influencerPagination.pageSize}
          toItem={influencerPagination.toItem}
          totalItems={influencerPagination.totalItems}
          totalPages={influencerPagination.totalPages}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="workspace-card p-4">
          <h3 className="font-display text-xl font-semibold">Campaign Tasks</h3>
          <div className="mt-3 space-y-2">
            {taskPagination.pageItems.map((task) => (
              <div className="workspace-card-soft flex items-center justify-between p-3" key={task.title}>
                <p className="text-sm">{task.title}</p>
                <span className={`rounded-full px-2 py-0.5 text-xs ${stateClass(task.state)}`}>{task.state}</span>
              </div>
            ))}
          </div>
          <PaginationControls
            fromItem={taskPagination.fromItem}
            onPageChange={taskPagination.setPage}
            onPageSizeChange={taskPagination.setPageSize}
            page={taskPagination.page}
            pageSize={taskPagination.pageSize}
            toItem={taskPagination.toItem}
            totalItems={taskPagination.totalItems}
            totalPages={taskPagination.totalPages}
          />
        </article>

        <article className="workspace-card p-4">
          <h3 className="font-display text-xl font-semibold">Performance Overview</h3>
          <div className="bg-pro-panel mt-3 rounded-xl border border-pro-surface p-3">
            <ChartContainer className="h-[210px]" config={trendChartConfig}>
              <AreaChart data={performanceTrendData} margin={{ left: 2, right: 10, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="campaignReachFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-reach)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--color-reach)" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis axisLine={false} dataKey="day" tickLine={false} />
                <YAxis axisLine={false} dataKey="reach" tickFormatter={formatCompact} tickLine={false} width={40} />
                <YAxis axisLine={false} dataKey="engagement" orientation="right" tickFormatter={(value) => `${value}%`} tickLine={false} width={34} yAxisId="right" />
                <ChartTooltip
                  content={<ChartTooltipContent valueFormatter={(value, dataKey) => (dataKey === "engagement" ? `${value}%` : formatCompact(Number(value)))} />}
                />
                <Area dataKey="reach" fill="url(#campaignReachFill)" stroke="var(--color-reach)" strokeWidth={2.5} type="monotone" />
                <Area dataKey="engagement" fill="transparent" stroke="var(--color-engagement)" strokeWidth={2.1} type="monotone" yAxisId="right" />
              </AreaChart>
            </ChartContainer>
          </div>

          <div className="bg-pro-panel mt-3 rounded-xl border border-pro-surface p-3">
            <ChartContainer className="h-[190px]" config={deliveryChartConfig}>
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel valueFormatter={(value) => `${value} assets`} />} />
                <Pie
                  data={deliveryMixData}
                  dataKey="value"
                  innerRadius={46}
                  nameKey="name"
                  outerRadius={70}
                  paddingAngle={3}
                  stroke="transparent"
                >
                  {deliveryMixData.map((entry) => (
                    <Cell fill={`var(--color-${entry.key})`} key={entry.key} />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent className="justify-center" />} />
              </PieChart>
            </ChartContainer>
            <div className="mt-2 text-center text-xs text-pro-muted">Content delivery breakdown (13/20 completed)</div>
          </div>
        </article>
      </section>

      <section className="workspace-card p-4">
        <h3 className="font-display text-xl font-semibold">Recent Activity</h3>
        <div className="mt-3 divide-y workspace-divider">
          {activityPagination.pageItems.map((activity) => (
            <article className="flex items-center justify-between py-3" key={activity}>
              <p className="text-sm text-pro-main">{activity}</p>
              <button className="text-sm text-pro-accent">View</button>
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

      <section className="flex flex-wrap justify-end gap-2">
        <button className="btn-pro-secondary h-10 px-4 py-0 text-sm">Message Creators</button>
        <button className="btn-pro-secondary h-10 px-4 py-0 text-sm">View Full Analytics</button>
        <button className="btn-pro-secondary h-10 px-4 py-0 text-sm">Generate Report</button>
        <button className="btn-pro-primary h-10 px-4 py-0 text-sm">Extend Campaign</button>
      </section>
    </div>
  );
}
