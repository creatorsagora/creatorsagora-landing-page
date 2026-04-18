"use client";

import Link from "next/link";
import {
  BarChart3,
  CheckCircle2,
  Circle,
  Clock3,
  DollarSign,
  Ellipsis,
  LayoutDashboard,
  Megaphone,
  MessageSquareText,
  Mic,
  Paperclip,
  Phone,
  Search,
  SendHorizontal,
  Settings,
  ShieldAlert,
  Sparkles,
  UserCircle2,
  Video,
  Wallet,
  type LucideIcon
} from "lucide-react";
import { useCurrency } from "@/components/preferences/CurrencyProvider";
import { PaginationControls } from "@/components/ui/PaginationControls";
import { usePagination } from "@/hooks/usePagination";

type Tone = "purple" | "cyan" | "orange" | "green";

type AppNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  active?: boolean;
};

type Thread = {
  name: string;
  campaign: string;
  snippet: string;
  time: string;
  unread?: number;
  typing?: boolean;
  active?: boolean;
  tone: Tone;
  status: "Running" | "Pending" | "Review";
};

type ChatMessage = {
  author: string;
  text: string;
  time: string;
  mine?: boolean;
  system?: boolean;
  tone: Tone;
};

type Approval = {
  title: string;
  assignee: string;
  state: "Approved" | "In Review" | "Pending";
};

const appNav: AppNavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Campaigns", href: "/campaigns/details", icon: Megaphone },
  { label: "Wallet", href: "/wallet", icon: Wallet },
  { label: "Messages", href: "/messages", icon: MessageSquareText, active: true },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings }
];

const campaignThreads: Thread[] = [
  {
    name: "@sarah_lifestyle",
    campaign: "Summer Fashion Launch",
    snippet: "Final carousel draft uploaded for approval.",
    time: "2m",
    unread: 2,
    typing: true,
    active: true,
    tone: "cyan",
    status: "Running"
  },
  {
    name: "@tech_marcus",
    campaign: "Tech Product Review",
    snippet: "Can we lock content timeline for tomorrow?",
    time: "1h",
    tone: "purple",
    status: "Pending"
  },
  {
    name: "@emma_beauty",
    campaign: "Fitness Challenge",
    snippet: "Thumbnail options are ready.",
    time: "3h",
    tone: "orange",
    status: "Review"
  },
  {
    name: "CREATORAGORA Support",
    campaign: "Escrow and Payouts",
    snippet: "Milestone payout processed successfully.",
    time: "1d",
    tone: "green",
    status: "Running"
  }
];

const chatMessages: ChatMessage[] = [
  {
    author: "Sarah",
    text: "Hi. I finished the main visuals for Summer Fashion Launch. Sharing the first version for your review.",
    time: "01:20 AM",
    tone: "cyan"
  },
  {
    author: "Alex",
    text: "Great quality. Please adjust frame three so the product logo has more room.",
    time: "01:27 AM",
    mine: true,
    tone: "purple"
  },
  {
    author: "Sarah",
    text: "Understood. I will update and resend in 30 minutes with final copy options.",
    time: "01:29 AM",
    tone: "cyan"
  },
  {
    author: "System",
    text: "External contact detected in draft message. Message blocked by AI moderation.",
    time: "01:33 AM",
    system: true,
    tone: "orange"
  },
  {
    author: "Alex",
    text: "Looks good now. Approved. Proceed with posting and share analytics after launch window.",
    time: "01:36 AM",
    mine: true,
    tone: "purple"
  }
];

const milestones = [
  { label: "Created", complete: true },
  { label: "Assigned", complete: true },
  { label: "Live", complete: true },
  { label: "Review", complete: false }
];

const approvals: Approval[] = [
  { title: "Instagram carousel copy", assignee: "@sarah_lifestyle", state: "Approved" },
  { title: "Reel voiceover draft", assignee: "@emma_beauty", state: "In Review" },
  { title: "TikTok hook variant", assignee: "@tech_marcus", state: "Pending" }
];

const creators = [
  { name: "@sarah_lifestyle", status: "Live" },
  { name: "@tech_marcus", status: "Drafting" },
  { name: "@emma_beauty", status: "Awaiting Approval" }
];

function avatarTone(tone: Tone): string {
  if (tone === "purple") return "from-[#5e52d7] to-[#8b7dff]";
  if (tone === "cyan") return "from-[#1f88b5] to-[#3cd7ff]";
  if (tone === "orange") return "from-[#a56b1e] to-[#efb453]";
  return "from-[#187f5b] to-[#34d399]";
}

function initials(label: string): string {
  return label
    .replace("@", "")
    .split("_")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function threadStatusClass(state: Thread["status"]): string {
  if (state === "Running") return "bg-pro-success/15 text-pro-success border-pro-success/25";
  if (state === "Pending") return "bg-pro-warning/15 text-pro-warning border-pro-warning/25";
  return "bg-pro-primary/15 text-pro-primary border-pro-primary/25";
}

function approvalStateClass(state: Approval["state"]): string {
  if (state === "Approved") return "bg-pro-success/15 text-pro-success";
  if (state === "In Review") return "bg-pro-warning/15 text-pro-warning";
  return "bg-white/10 text-pro-muted";
}

export function MessagesPageView() {
  const { formatDualFromUsd } = useCurrency();
  const budgetUsed = formatDualFromUsd(450000 / 1550);
  const escrowLocked = formatDualFromUsd(130000 / 1550);
  const threadPagination = usePagination(campaignThreads, 5);
  const messagePagination = usePagination(chatMessages, 5);
  const approvalPagination = usePagination(approvals, 5);
  const creatorPagination = usePagination(creators, 5);

  return (
    <div className="workspace-shell min-h-screen p-3 pb-24 md:p-4 md:pb-4">
      <section className="workspace-card overflow-hidden p-0">
        <div className="grid min-h-[760px] grid-cols-1 lg:grid-cols-[72px_320px_minmax(0,1fr)] xl:grid-cols-[72px_320px_minmax(0,1fr)_320px]">
          <aside className="hidden min-h-0 flex-col border-r workspace-divider bg-white/[0.02] lg:flex">
            <div className="grid flex-1 grid-rows-[auto_1fr_auto] justify-items-center gap-3 py-3">
              <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-pro-primary to-pro-accent text-xs font-black text-white shadow-pro-purple">
                CA
              </span>
              <nav className="grid gap-2" aria-label="Workspace Navigation">
                {appNav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      className={`grid size-10 place-items-center rounded-xl border transition ${
                        item.active
                          ? "border-pro-primary/40 bg-pro-primary/20 text-pro-main shadow-[0_0_0_1px_rgba(76,58,255,0.3)]"
                          : "border-pro-surface bg-white/[0.03] text-pro-muted hover:border-pro-accent/30 hover:text-pro-main"
                      }`}
                      href={item.href}
                      key={item.label}
                      title={item.label}
                    >
                      <Icon size={16} />
                    </Link>
                  );
                })}
              </nav>
              <span className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-[#30416d] to-[#4C3AFF] text-xs font-semibold text-white">
                AJ
              </span>
            </div>
          </aside>

          <aside className="hidden min-h-0 flex-col border-r workspace-divider lg:flex">
            <header className="border-b workspace-divider p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold">Campaign Threads</h2>
                <button className="btn-pro-secondary grid size-8 place-items-center p-0" type="button" aria-label="More thread options">
                  <Ellipsis size={14} />
                </button>
              </div>
              <label className="workspace-input inline-flex h-10 items-center gap-2">
                <Search size={14} className="text-pro-muted" />
                <input
                  className="w-full bg-transparent text-sm text-[var(--input-text)] outline-none placeholder:text-[var(--input-placeholder)]"
                  placeholder="Search threads"
                />
              </label>
            </header>

            <div className="flex-1 space-y-2 overflow-y-auto p-3">
              {threadPagination.pageItems.map((thread) => (
                <article
                  className={`rounded-xl border p-3 transition ${
                    thread.active
                      ? "border-pro-primary/45 bg-gradient-to-r from-pro-primary/14 to-pro-accent/8"
                      : "border-pro-surface bg-white/[0.02] hover:border-pro-primary/25"
                  }`}
                  key={thread.name}
                >
                  <div className="flex items-start gap-2.5">
                    <span className={`grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br text-[11px] font-semibold text-white ${avatarTone(thread.tone)}`}>
                      {initials(thread.name)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold">{thread.name}</p>
                        <span className="text-pro-muted text-[11px]">{thread.time}</span>
                      </div>
                      <p className="text-pro-accent mt-0.5 truncate text-[11px]">{thread.campaign}</p>
                      <p className={`mt-1 truncate text-xs ${thread.typing ? "text-pro-success" : "text-pro-muted"}`}>
                        {thread.typing ? "typing..." : thread.snippet}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] ${threadStatusClass(thread.status)}`}>
                          {thread.status}
                        </span>
                        {thread.unread ? (
                          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-pro-primary px-1.5 text-[11px] font-semibold text-white">
                            {thread.unread}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
              <PaginationControls
                fromItem={threadPagination.fromItem}
                onPageChange={threadPagination.setPage}
                onPageSizeChange={threadPagination.setPageSize}
                page={threadPagination.page}
                pageSize={threadPagination.pageSize}
                toItem={threadPagination.toItem}
                totalItems={threadPagination.totalItems}
                totalPages={threadPagination.totalPages}
              />
            </div>
          </aside>

          <main className="flex min-h-0 flex-col">
            <header className="border-b workspace-divider flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="flex items-center gap-2.5">
                <span className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-[#111] to-[#2a2a2a] text-lg font-black text-white">
                  K
                </span>
                <div>
                  <p className="font-semibold">Summer Fashion Launch Thread</p>
                  <p className="text-pro-success text-xs">AI moderation active · Creator currently online</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button className="btn-pro-secondary grid size-9 place-items-center p-0" type="button" aria-label="Voice call">
                  <Phone size={15} />
                </button>
                <button className="btn-pro-secondary grid size-9 place-items-center p-0" type="button" aria-label="Video call">
                  <Video size={15} />
                </button>
                <button className="btn-pro-secondary grid size-9 place-items-center p-0" type="button" aria-label="More chat actions">
                  <Ellipsis size={15} />
                </button>
              </div>
            </header>

            <div className="border-b border-pro-warning/25 bg-pro-warning/10 px-4 py-2.5 text-sm text-[#d8c9a2]">
              Platform-protected chat. External contacts and off-platform payment requests are automatically blocked.
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              <div className="flex justify-center">
                <span className="text-pro-muted rounded-full border border-pro-surface bg-white/[0.03] px-3 py-1 text-xs">Today, March 12</span>
              </div>
              {messagePagination.pageItems.map((message, index) => (
                <article className={`max-w-[88%] ${message.mine ? "ml-auto" : ""}`} key={`${message.author}-${index}`}>
                  {message.system ? (
                    <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs text-red-300">
                      <ShieldAlert size={12} />
                      {message.text}
                    </div>
                  ) : (
                    <div className={`flex items-end gap-2 ${message.mine ? "flex-row-reverse" : ""}`}>
                      <span className={`grid size-8 shrink-0 place-items-center rounded-full bg-gradient-to-br text-[10px] font-semibold text-white ${avatarTone(message.tone)}`}>
                        {initials(message.author)}
                      </span>
                      <div
                        className={`rounded-2xl border px-3 py-2.5 ${
                          message.mine
                            ? "border-pro-primary/40 bg-gradient-to-r from-pro-primary to-[#7C3AED] text-white"
                            : "border-pro-surface bg-white/[0.03]"
                        }`}
                      >
                        <p className={`mb-1 text-xs font-semibold ${message.mine ? "text-white/85" : "text-pro-accent"}`}>{message.author}</p>
                        <p className={`text-sm leading-6 ${message.mine ? "text-white" : "text-pro-main"}`}>{message.text}</p>
                      </div>
                    </div>
                  )}
                  <p className={`text-pro-muted mt-1 text-xs ${message.mine ? "text-right" : "pl-10"}`}>{message.time}</p>
                </article>
              ))}
              <PaginationControls
                fromItem={messagePagination.fromItem}
                onPageChange={messagePagination.setPage}
                onPageSizeChange={messagePagination.setPageSize}
                page={messagePagination.page}
                pageSize={messagePagination.pageSize}
                toItem={messagePagination.toItem}
                totalItems={messagePagination.totalItems}
                totalPages={messagePagination.totalPages}
              />
            </div>

            <footer className="border-t workspace-divider p-3.5">
              <div className="workspace-card-soft flex items-center gap-2 border-pro-surface p-2">
                <button className="btn-pro-secondary grid size-9 place-items-center p-0" type="button" aria-label="Attach file">
                  <Paperclip size={15} />
                </button>
                <input className="workspace-input h-9 flex-1 border-0 bg-transparent px-2" placeholder="Type your message..." />
                <button className="btn-pro-secondary grid size-9 place-items-center p-0" type="button" aria-label="Voice note">
                  <Mic size={15} />
                </button>
                <button className="btn-pro-primary inline-flex h-9 items-center gap-1.5 px-3.5 py-0 text-sm">
                  <SendHorizontal size={14} />
                  Send
                </button>
              </div>
              <p className="text-pro-muted mt-2 inline-flex items-center gap-1.5 text-xs">
                <Sparkles size={12} className="text-pro-accent" />
                AI moderation enabled. Messages are monitored for policy compliance.
              </p>
            </footer>
          </main>

          <aside className="hidden min-h-0 flex-col border-l workspace-divider bg-white/[0.02] xl:flex">
            <header className="border-b workspace-divider flex items-center justify-between p-4">
              <h3 className="font-display text-lg font-semibold">Campaign Control</h3>
              <button className="btn-pro-secondary grid size-8 place-items-center p-0" type="button" aria-label="More panel actions">
                <Ellipsis size={14} />
              </button>
            </header>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              <section className="workspace-card-soft border-pro-surface p-3">
                <p className="text-sm font-semibold">Summer Fashion Launch</p>
                <p className="text-pro-muted mt-0.5 text-xs">Campaign ID: CF-284-001</p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg border border-pro-surface bg-white/[0.03] p-2">
                    <p className="text-pro-muted">Budget Used</p>
                    <p className="mono-stat mt-1 text-sm">{budgetUsed.local}</p>
                    {budgetUsed.usd ? <p className="text-pro-muted text-[11px]">{budgetUsed.usd}</p> : null}
                  </div>
                  <div className="rounded-lg border border-pro-surface bg-white/[0.03] p-2">
                    <p className="text-pro-muted">Escrow Locked</p>
                    <p className="mono-stat mt-1 text-sm">{escrowLocked.local}</p>
                    {escrowLocked.usd ? <p className="text-pro-muted text-[11px]">{escrowLocked.usd}</p> : null}
                  </div>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-white/10">
                  <span className="block h-1.5 w-[78%] rounded-full bg-gradient-to-r from-pro-primary to-pro-accent" />
                </div>
              </section>

              <section className="workspace-card-soft border-pro-surface p-3">
                <p className="mb-2 text-sm font-semibold">Milestones</p>
                <div className="space-y-1.5">
                  {milestones.map((item) => (
                    <div className="flex items-center justify-between text-xs" key={item.label}>
                      <span className="inline-flex items-center gap-1.5">
                        {item.complete ? <CheckCircle2 size={12} className="text-pro-success" /> : <Clock3 size={12} className="text-pro-muted" />}
                        {item.label}
                      </span>
                      <span className={`workspace-badge ${item.complete ? "border-pro-success/25 bg-pro-success/10 text-pro-success" : ""}`}>
                        {item.complete ? "Done" : "Open"}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="workspace-card-soft border-pro-surface p-3">
                <p className="mb-2 text-sm font-semibold">Content Approvals</p>
                <div className="space-y-2">
                  {approvalPagination.pageItems.map((item) => (
                    <article className="rounded-lg border border-pro-surface bg-white/[0.03] p-2" key={item.title}>
                      <p className="text-sm">{item.title}</p>
                      <div className="mt-1 flex items-center justify-between text-xs">
                        <span className="text-pro-muted">{item.assignee}</span>
                        <span className={`rounded-full px-2 py-0.5 ${approvalStateClass(item.state)}`}>{item.state}</span>
                      </div>
                    </article>
                  ))}
                </div>
                <PaginationControls
                  fromItem={approvalPagination.fromItem}
                  onPageChange={approvalPagination.setPage}
                  onPageSizeChange={approvalPagination.setPageSize}
                  page={approvalPagination.page}
                  pageSize={approvalPagination.pageSize}
                  toItem={approvalPagination.toItem}
                  totalItems={approvalPagination.totalItems}
                  totalPages={approvalPagination.totalPages}
                />
              </section>

              <section className="workspace-card-soft border-pro-surface p-3">
                <p className="mb-2 text-sm font-semibold">Assigned Creators</p>
                <div className="space-y-2">
                  {creatorPagination.pageItems.map((creator, index) => (
                    <div className="flex items-center justify-between text-sm" key={creator.name}>
                      <span className="inline-flex items-center gap-2">
                        <span className={`grid size-7 place-items-center rounded-full bg-gradient-to-br text-[9px] font-semibold text-white ${avatarTone((["cyan", "purple", "orange"] as const)[index])}`}>
                          {initials(creator.name)}
                        </span>
                        {creator.name}
                      </span>
                      <span className="text-pro-muted text-xs">{creator.status}</span>
                    </div>
                  ))}
                </div>
                <PaginationControls
                  fromItem={creatorPagination.fromItem}
                  onPageChange={creatorPagination.setPage}
                  onPageSizeChange={creatorPagination.setPageSize}
                  page={creatorPagination.page}
                  pageSize={creatorPagination.pageSize}
                  toItem={creatorPagination.toItem}
                  totalItems={creatorPagination.totalItems}
                  totalPages={creatorPagination.totalPages}
                />
              </section>

              <section className="workspace-card-soft border-pro-surface p-3">
                <p className="mb-2 text-sm font-semibold">Performance Snapshot</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="rounded-lg border border-pro-surface bg-white/[0.03] p-2 text-center">
                    <p className="text-pro-muted">Reach</p>
                    <p className="mono-stat mt-1 text-sm">125.8K</p>
                  </div>
                  <div className="rounded-lg border border-pro-surface bg-white/[0.03] p-2 text-center">
                    <p className="text-pro-muted">Engage</p>
                    <p className="mono-stat mt-1 text-sm">7.8%</p>
                  </div>
                  <div className="rounded-lg border border-pro-surface bg-white/[0.03] p-2 text-center">
                    <p className="text-pro-muted">ROI</p>
                    <p className="mono-stat mt-1 text-sm">3.2x</p>
                  </div>
                </div>
              </section>

              <section className="workspace-card-soft border-pro-surface p-3">
                <p className="mb-2 text-sm font-semibold">Compliance</p>
                <div className="space-y-1.5 text-xs">
                  <p className="text-pro-muted inline-flex items-center gap-1.5">
                    <Circle size={10} className="text-pro-success fill-pro-success" />
                    External contact blocked
                  </p>
                  <p className="text-pro-muted inline-flex items-center gap-1.5">
                    <Circle size={10} className="text-pro-success fill-pro-success" />
                    Off-platform payment blocked
                  </p>
                  <p className="text-pro-muted inline-flex items-center gap-1.5">
                    <Circle size={10} className="text-pro-success fill-pro-success" />
                    Escrow protection enabled
                  </p>
                </div>
              </section>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
