"use client";

import { ArrowDownLeft, ArrowUpRight, RefreshCw, type LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { useCurrency } from "@/components/preferences/CurrencyProvider";
import { PaginationControls } from "@/components/ui/PaginationControls";
import { usePagination } from "@/hooks/usePagination";
import { fetchWalletRequest, readAuthSession, type WalletOverviewResponse } from "@/lib/auth-client";

type WalletAction = {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  iconClass: string;
};

type EscrowFund = {
  name: string;
  release: string;
  amountUsd: number;
  status: "Completed" | "Processing" | "Pending";
};

type WalletTransaction = {
  id: string;
  title: string;
  date: string;
  amountUsd: number;
  state: "Completed" | "Processing" | "Pending";
};

type MonthlyFlowPoint = {
  month: string;
  deposited: number;
  withdrawn: number;
  spend: number;
};

type SpendMixPoint = {
  key: "campaignSpend" | "withdrawals" | "fees";
  name: string;
  value: number;
};

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

const walletActions: WalletAction[] = [
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

function formatCompactNumber(value: number) {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return Math.round(value).toString();
}

function stateClass(state: "Completed" | "Processing" | "Pending"): string {
  if (state === "Completed") return "bg-pro-success/15 text-pro-success";
  if (state === "Processing") return "bg-pro-warning/15 text-pro-warning";
  return "bg-white/10 text-pro-main";
}

function statusToState(status: string): "Completed" | "Processing" | "Pending" {
  if (status === "completed") return "Completed";
  if (status === "failed") return "Pending";
  return "Processing";
}

function transactionTitle(type: string, description?: string) {
  if (description?.trim()) return description.trim();
  if (type === "deposit") return "Wallet Deposit";
  if (type === "withdrawal") return "Wallet Withdrawal";
  if (type === "campaign_spend") return "Campaign Spend";
  if (type === "earning") return "Campaign Earning";
  if (type === "fee") return "Platform Fee";
  return "Wallet Activity";
}

function buildMonthlyFlow(transactions: WalletOverviewResponse["transactions"]): MonthlyFlowPoint[] {
  const now = new Date();
  const months: Array<{ key: string; month: string }> = [];

  for (let i = 5; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const month = date.toLocaleString(undefined, { month: "short" });
    months.push({ key, month });
  }

  const grouped = new Map<string, { deposited: number; withdrawn: number; spend: number }>();
  for (const item of transactions) {
    const date = new Date(item.createdAt);
    if (Number.isNaN(date.getTime())) continue;
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    if (!grouped.has(key)) grouped.set(key, { deposited: 0, withdrawn: 0, spend: 0 });
    const bucket = grouped.get(key);
    if (!bucket) continue;

    if (item.type === "deposit" || item.type === "earning") {
      bucket.deposited += Math.abs(item.amountUsd);
    } else if (item.type === "withdrawal") {
      bucket.withdrawn += Math.abs(item.amountUsd);
    } else if (item.type === "campaign_spend" || item.type === "fee") {
      bucket.spend += Math.abs(item.amountUsd);
    }
  }

  return months.map((entry) => {
    const bucket = grouped.get(entry.key);
    return {
      month: entry.month,
      deposited: bucket?.deposited ?? 0,
      withdrawn: bucket?.withdrawn ?? 0,
      spend: bucket?.spend ?? 0
    };
  });
}

export function WalletPageView() {
  const { formatDualFromUsd, formatSignedDualFromUsd } = useCurrency();
  const [data, setData] = useState<WalletOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadWallet = async () => {
      const session = readAuthSession();
      if (!session?.token) {
        if (active) {
          setError("Please sign in to view wallet.");
          setLoading(false);
        }
        return;
      }

      try {
        const response = await fetchWalletRequest(session.token);
        if (!active) return;
        setData(response);
        setError("");
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Unable to load wallet data");
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadWallet();
    return () => {
      active = false;
    };
  }, []);

  const availableBalance = useMemo(() => formatDualFromUsd(data?.wallet.availableUsd ?? 0), [data, formatDualFromUsd]);
  const totalEscrow = useMemo(() => formatDualFromUsd(data?.wallet.escrowUsd ?? 0), [data, formatDualFromUsd]);

  const transactions = useMemo<WalletTransaction[]>(() => {
    const source = data?.transactions ?? [];
    return source.map((entry) => {
      const date = new Date(entry.createdAt);
      const timestamp = Number.isNaN(date.getTime())
        ? "Unknown time"
        : `${date.toLocaleDateString()} · ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
      return {
        id: entry._id,
        title: transactionTitle(entry.type, entry.description),
        date: timestamp,
        amountUsd: Number(entry.amountUsd ?? 0),
        state: statusToState(entry.status)
      };
    });
  }, [data]);

  const escrowFunds = useMemo<EscrowFund[]>(() => {
    const escrowUsd = Number(data?.wallet.escrowUsd ?? 0);
    if (escrowUsd <= 0) return [];
    return [
      {
        name: "Funds locked in active campaigns",
        release: "Released as campaign milestones are completed",
        amountUsd: escrowUsd,
        status: "Processing"
      }
    ];
  }, [data]);

  const totals = useMemo(() => {
    let deposited = 0;
    let withdrawn = 0;
    let campaignSpend = 0;
    let fees = 0;

    for (const item of data?.transactions ?? []) {
      const amount = Math.abs(Number(item.amountUsd ?? 0));
      if (item.type === "deposit" || item.type === "earning") deposited += amount;
      if (item.type === "withdrawal") withdrawn += amount;
      if (item.type === "campaign_spend") campaignSpend += amount;
      if (item.type === "fee") fees += amount;
    }

    return {
      deposited,
      withdrawn,
      campaignSpend,
      fees
    };
  }, [data]);

  const monthlyFlowData = useMemo<MonthlyFlowPoint[]>(() => buildMonthlyFlow(data?.transactions ?? []), [data]);

  const spendMixData = useMemo<SpendMixPoint[]>(
    () => [
      { key: "campaignSpend", name: "Campaign Spend", value: totals.campaignSpend },
      { key: "withdrawals", name: "Withdrawals", value: totals.withdrawn },
      { key: "fees", name: "Fees", value: totals.fees }
    ],
    [totals]
  );

  const totalDeposited = formatDualFromUsd(totals.deposited);
  const totalWithdrawn = formatDualFromUsd(totals.withdrawn);
  const totalCampaignSpend = formatDualFromUsd(totals.campaignSpend);
  const totalOutflow = formatDualFromUsd(totals.withdrawn + totals.campaignSpend + totals.fees).local;

  const escrowPagination = usePagination(escrowFunds, 5);
  const transactionPagination = usePagination(transactions, 5);

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
              {loading ? "Syncing wallet..." : "Realtime wallet balance"}
              {availableBalance.usd ? ` | ${availableBalance.usd}` : ""}
            </p>
          </div>
          <p className="text-sm text-white/85">Escrow locked: {totalEscrow.local}</p>
        </div>
      </section>

      {error ? <section className="rounded-xl border border-[#ff4d6d66] bg-[#ff4d6d1a] px-4 py-3 text-sm text-[#ff8b9e]">{error}</section> : null}

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
          {escrowPagination.pageItems.length === 0 ? (
            <p className="text-sm text-pro-muted">No escrow funds yet.</p>
          ) : (
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
          )}
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
          </div>
          <div className="workspace-card-soft p-4">
            <p className="text-sm text-pro-muted">
              No payment methods connected yet. Add a bank or wallet in the live flow to enable withdrawals.
            </p>
          </div>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.15fr_1fr]">
        <article className="workspace-card p-4">
          <h2 className="font-display text-xl font-semibold">Transaction History</h2>
          {transactionPagination.pageItems.length === 0 ? (
            <p className="mt-3 text-sm text-pro-muted">No transactions yet. Deposits and campaign spending will appear here.</p>
          ) : (
            <div className="mt-3 divide-y workspace-divider">
              {transactionPagination.pageItems.map((transaction) => {
                const amount = formatSignedDualFromUsd(transaction.amountUsd);
                return (
                  <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between" key={transaction.id}>
                    <div>
                      <p className="text-sm text-pro-main">{transaction.title}</p>
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
          )}
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
