"use client";

import { ArrowDownLeft, ArrowUpRight, Plus, RefreshCw, type LucideIcon } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { useCurrency } from "@/components/preferences/CurrencyProvider";
import { PaginationControls } from "@/components/ui/PaginationControls";
import { usePagination } from "@/hooks/usePagination";

const escrowFunds = [
  { name: "Summer Fashion Launch", amountUsd: 580000 / 1550, status: "Active", release: "Expected release: Dec 15, 2026" },
  { name: "Tech Product Review", amountUsd: 370000 / 1550, status: "Pending", release: "Expected release: Dec 20, 2026" }
];

const transactions = [
  { type: "Deposit from GTBank", amountUsd: 500000 / 1550, state: "Completed", date: "Dec 12, 2026 - 2:34 PM" },
  { type: "Campaign Payment - Summer Fashion Launch", amountUsd: -(450000 / 1550), state: "Completed", date: "Dec 11, 2026 - 10:15 AM" },
  { type: "Withdrawal to GTBank", amountUsd: -(200000 / 1550), state: "Processing", date: "Dec 10, 2026 - 3:22 PM" },
  { type: "Platform Fee", amountUsd: -(12500 / 1550), state: "Completed", date: "Dec 9, 2026 - 11:30 AM" }
];

const monthlyFlowData = [
  { month: "Oct", deposited: 520000 / 1550, withdrawn: 330000 / 1550, spend: 420000 / 1550 },
  { month: "Nov", deposited: 780000 / 1550, withdrawn: 460000 / 1550, spend: 610000 / 1550 },
  { month: "Dec", deposited: 980000 / 1550, withdrawn: 680500 / 1550, spend: 860000 / 1550 }
];

const spendMixData = [
  { key: "campaignSpend", name: "Campaign Spend", value: 1890000 / 1550 },
  { key: "withdrawals", name: "Withdrawals", value: 680500 / 1550 },
  { key: "fees", name: "Fees", value: 12500 / 1550 }
];

const flowChartConfig = {
  deposited: { label: "Deposited", theme: { light: "#00A778", dark: "#00C896" } },
  withdrawn: { label: "Withdrawn", theme: { light: "#5A4BE0", dark: "#4C3AFF" } },
  spend: { label: "Campaign Spend", theme: { light: "#00A6D4", dark: "#00D1FF" } }
} satisfies ChartConfig;

const spendMixChartConfig = {
  campaignSpend: { label: "Campaign Spend", theme: { light: "#5A4BE0", dark: "#4C3AFF" } },
  withdrawals: { label: "Withdrawals", theme: { light: "#00B8DD", dark: "#00D1FF" } },
  fees: { label: "Fees", theme: { light: "#E89B27", dark: "#FFB020" } }
} satisfies ChartConfig;

function formatCompactNumber(value: number) {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return Math.round(value).toString();
}

const walletActions: { title: string; subtitle: string; icon: LucideIcon; iconClass: string }[] = [
  {
    title: "Add Funds",
    subtitle: "Deposit money to wallet",
    icon: ArrowDownLeft,
    iconClass: "from-pro-success/30 to-pro-accent/15 text-pro-success"
  },
  {
    title: "Withdraw",
    subtitle: "Transfer to bank account",
    icon: ArrowUpRight,
    iconClass: "from-pro-primary/30 to-pro-primary/10 text-pro-primary"
  },
  {
    title: "Auto-Topup",
    subtitle: "Configure automatic deposits",
    icon: RefreshCw,
    iconClass: "from-pro-accent/25 to-pro-primary/10 text-pro-accent"
  }
];

function stateClass(state: string): string {
  if (state === "Completed") return "bg-pro-success/15 text-pro-success";
  if (state === "Processing") return "bg-pro-warning/15 text-pro-warning";
  return "bg-white/10 text-pro-main";
}

export function WalletPageView() {
  const { formatDualFromUsd, formatSignedDualFromUsd } = useCurrency();
  const escrowPagination = usePagination(escrowFunds, 5);
  const transactionPagination = usePagination(transactions, 5);
  const availableBalance = formatDualFromUsd(2847650 / 1550);
  const totalEscrow = formatDualFromUsd((580000 + 370000) / 1550);
  const totalDeposited = formatDualFromUsd(3250000 / 1550);
  const totalWithdrawn = formatDualFromUsd(680500 / 1550);
  const totalCampaignSpend = formatDualFromUsd(1890000 / 1550);
  const totalOutflow = formatDualFromUsd((1890000 + 680500 + 12500) / 1550).local;

  return (
    <div className="space-y-5">
      <section className="balance-gradient-card workspace-card relative overflow-hidden p-5">
        <span className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
        <span className="pointer-events-none absolute -right-16 top-6 size-44 rounded-full bg-pro-accent/25 blur-3xl" />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-white/80">Available Balance</p>
            <p className="mono-stat mt-2 text-[clamp(1.9rem,5vw,3rem)] font-extrabold">{availableBalance.local}</p>
            <p className="mt-1 text-xs text-white/70">
              Last updated 2 minutes ago{availableBalance.usd ? ` | ${availableBalance.usd}` : ""}
            </p>
          </div>
          <p className="text-sm text-white/85">+8.2% from last month</p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {walletActions.map((action) => {
          const Icon = action.icon;
          return (
            <article className="workspace-card group p-4" key={action.title}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{action.title}</p>
                  <p className="mt-1 text-sm text-pro-muted">{action.subtitle}</p>
                </div>
                <span
                  className={`grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${action.iconClass} transition duration-300 group-hover:shadow-pro-cyan`}
                >
                  <Icon size={16} />
                </span>
              </div>
            </article>
          );
        })}
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="workspace-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Funds in Escrow</h2>
            <div className="text-right">
              <p className="mono-stat text-lg font-semibold">{totalEscrow.local}</p>
              {totalEscrow.usd ? <p className="text-xs text-pro-muted">{totalEscrow.usd}</p> : null}
            </div>
          </div>
          <div className="space-y-2">
            {escrowPagination.pageItems.map((fund) => {
              const amount = formatDualFromUsd(fund.amountUsd);
              return (
                <div className="workspace-card-soft p-3" key={fund.name}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold">{fund.name}</p>
                      <p className="mt-1 text-xs text-pro-muted">{fund.release}</p>
                    </div>
                    <div className="text-right">
                      <p className="mono-stat text-sm">{amount.local}</p>
                      {amount.usd ? <p className="text-xs text-pro-muted">{amount.usd}</p> : null}
                      <span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs ${stateClass(fund.status)}`}>{fund.status}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <PaginationControls
            fromItem={escrowPagination.fromItem}
            onPageChange={escrowPagination.setPage}
            onPageSizeChange={escrowPagination.setPageSize}
            page={escrowPagination.page}
            pageSize={escrowPagination.pageSize}
            toItem={escrowPagination.toItem}
            totalItems={escrowPagination.totalItems}
            totalPages={escrowPagination.totalPages}
          />
        </article>

        <article className="workspace-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Payment Methods</h2>
            <button className="btn-pro-primary inline-flex h-9 items-center gap-1.5 px-3 py-0 text-sm">
              <Plus size={14} />
              Add Method
            </button>
          </div>
          <div className="space-y-2">
            <div className="workspace-card-soft p-3">
              <p className="font-semibold">GTBank ****4521</p>
              <p className="text-xs text-pro-muted">Savings Account - Default</p>
            </div>
            <div className="workspace-card-soft grid grid-cols-2 gap-2 p-3">
              <div>
                <p className="font-semibold">Visa ****3142</p>
                <p className="text-xs text-pro-muted">Expires 12/26</p>
              </div>
              <div>
                <p className="font-semibold">USDT Wallet</p>
                <p className="text-xs text-pro-muted">TRC20 0x...BAA2</p>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.15fr_1fr]">
        <article className="workspace-card p-4">
          <h2 className="font-display text-xl font-semibold">Transaction History</h2>
          <div className="mt-3 divide-y workspace-divider">
            {transactionPagination.pageItems.map((transaction) => {
              const amount = formatSignedDualFromUsd(transaction.amountUsd);
              return (
                <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between" key={transaction.type}>
                  <div>
                    <p className="text-sm text-pro-main">{transaction.type}</p>
                    <p className="text-xs text-pro-muted">{transaction.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="mono-stat text-sm">{amount.local}</p>
                    {amount.usd ? <p className="text-xs text-pro-muted">{amount.usd}</p> : null}
                    <span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs ${stateClass(transaction.state)}`}>{transaction.state}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <PaginationControls
            fromItem={transactionPagination.fromItem}
            onPageChange={transactionPagination.setPage}
            onPageSizeChange={transactionPagination.setPageSize}
            page={transactionPagination.page}
            pageSize={transactionPagination.pageSize}
            toItem={transactionPagination.toItem}
            totalItems={transactionPagination.totalItems}
            totalPages={transactionPagination.totalPages}
          />
        </article>

        <article className="workspace-card p-4">
          <h2 className="font-display text-xl font-semibold">Financial Overview</h2>
          <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-pro-muted">
            <div className="workspace-card-soft p-2">
              <p>Total Deposited</p>
              <p className="mono-stat mt-1 text-base text-pro-main">{totalDeposited.local}</p>
              {totalDeposited.usd ? <p className="text-[11px]">{totalDeposited.usd}</p> : null}
            </div>
            <div className="workspace-card-soft p-2">
              <p>Total Withdrawn</p>
              <p className="mono-stat mt-1 text-base text-pro-main">{totalWithdrawn.local}</p>
              {totalWithdrawn.usd ? <p className="text-[11px]">{totalWithdrawn.usd}</p> : null}
            </div>
            <div className="workspace-card-soft p-2">
              <p>Campaign Spend</p>
              <p className="mono-stat mt-1 text-base text-pro-main">{totalCampaignSpend.local}</p>
              {totalCampaignSpend.usd ? <p className="text-[11px]">{totalCampaignSpend.usd}</p> : null}
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-[1.2fr_0.95fr]">
            <div className="bg-pro-panel rounded-xl border border-pro-surface p-3">
              <p className="text-xs text-pro-muted">Monthly cash flow</p>
              <ChartContainer className="mt-2 h-[220px]" config={flowChartConfig}>
                <BarChart data={monthlyFlowData} margin={{ left: 2, right: 8, top: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="walletDepositedFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-deposited)" stopOpacity={0.95} />
                      <stop offset="100%" stopColor="var(--color-deposited)" stopOpacity={0.45} />
                    </linearGradient>
                    <linearGradient id="walletWithdrawnFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-withdrawn)" stopOpacity={0.95} />
                      <stop offset="100%" stopColor="var(--color-withdrawn)" stopOpacity={0.45} />
                    </linearGradient>
                    <linearGradient id="walletSpendFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-spend)" stopOpacity={0.95} />
                      <stop offset="100%" stopColor="var(--color-spend)" stopOpacity={0.45} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} />
                  <XAxis axisLine={false} dataKey="month" tickLine={false} />
                  <YAxis axisLine={false} tickFormatter={(value) => formatCompactNumber(Number(value))} tickLine={false} width={38} />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        valueFormatter={(value) => {
                          const numericValue = Number(value);
                          return formatDualFromUsd(numericValue).local;
                        }}
                      />
                    }
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="deposited" fill="url(#walletDepositedFill)" maxBarSize={22} radius={[7, 7, 0, 0]} />
                  <Bar dataKey="withdrawn" fill="url(#walletWithdrawnFill)" maxBarSize={22} radius={[7, 7, 0, 0]} />
                  <Bar dataKey="spend" fill="url(#walletSpendFill)" maxBarSize={22} radius={[7, 7, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </div>

            <div className="bg-pro-panel rounded-xl border border-pro-surface p-3">
              <p className="text-xs text-pro-muted">Outflow composition</p>
              <ChartContainer className="mt-2 h-[220px]" config={spendMixChartConfig}>
                <PieChart>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        valueFormatter={(value) => {
                          const numericValue = Number(value);
                          return formatDualFromUsd(numericValue).local;
                        }}
                      />
                    }
                  />
                  <Pie
                    data={spendMixData}
                    dataKey="value"
                    innerRadius={52}
                    nameKey="name"
                    outerRadius={86}
                    paddingAngle={3}
                    stroke="transparent"
                  >
                    {spendMixData.map((entry) => (
                      <Cell fill={`var(--color-${entry.key})`} key={entry.key} />
                    ))}
                  </Pie>
                  <ChartLegend content={<ChartLegendContent className="justify-center" />} />
                </PieChart>
              </ChartContainer>
              <p className="mt-2 text-center text-xs text-pro-muted">
                Total outflow tracked: <span className="mono-stat text-pro-main">{totalOutflow}</span>
              </p>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
