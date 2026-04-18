"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { persistUserRole, readUserRole, type UserRole } from "@/lib/user-role";

export type CampaignStatus = "Running" | "Pending" | "Completed" | "Live";
export type ThreadStatus = "Running" | "Pending" | "Review";
export type Tone = "purple" | "cyan" | "orange" | "green";

export type Campaign = {
  id: string;
  name: string;
  description: string;
  category: "Music" | "Brand" | "Event" | "Fashion";
  goal: "Brand Awareness" | "Viral Growth" | "Direct Sales" | "Event Attendance";
  budget: number;
  spent: number;
  reach: number;
  engagementRate: number;
  status: CampaignStatus;
  startDate: string;
  endDate: string;
  createdAt: string;
};

export type WalletTransaction = {
  id: string;
  type: string;
  amount: number;
  state: "Completed" | "Processing";
  date: string;
};

export type WalletState = {
  balance: number;
  escrow: number;
  transactions: WalletTransaction[];
};

export type Message = {
  id: string;
  author: string;
  text: string;
  time: string;
  mine?: boolean;
  system?: boolean;
  tone: Tone;
};

export type MessageThread = {
  id: string;
  name: string;
  campaignId: string;
  campaign: string;
  snippet: string;
  time: string;
  unread: number;
  typing?: boolean;
  tone: Tone;
  status: ThreadStatus;
  messages: Message[];
};

export type MockUser = {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  role: UserRole;
};

type CreateCampaignInput = {
  name: string;
  description: string;
  category: Campaign["category"];
  goal: Campaign["goal"];
  budget: number;
  startDate: string;
  endDate: string;
};

type SignupInput = {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
};

type LoginInput = {
  email: string;
  role: UserRole;
};

type MockAppState = {
  user: MockUser;
  campaigns: Campaign[];
  activeCampaignId: string;
  wallet: WalletState;
  threads: MessageThread[];
  activeThreadId: string;
};

type MockAppContextValue = {
  ready: boolean;
  user: MockUser;
  campaigns: Campaign[];
  activeCampaign: Campaign | null;
  wallet: WalletState;
  threads: MessageThread[];
  activeThread: MessageThread | null;
  signup: (input: SignupInput) => void;
  login: (input: LoginInput) => void;
  setRole: (role: UserRole) => void;
  createCampaign: (input: CreateCampaignInput) => string;
  selectCampaign: (campaignId: string) => void;
  addFunds: (amount: number) => void;
  withdrawFunds: (amount: number) => boolean;
  selectThread: (threadId: string) => void;
  sendMessage: (threadId: string, message: string) => void;
};

const APP_STORAGE_KEY = "creatoragora-mock-app-v1";

const MockAppContext = createContext<MockAppContextValue | null>(null);

function toIsoDate(value: Date): string {
  return value.toISOString().slice(0, 10);
}

function formatTime(value: Date): string {
  return value.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function seedState(role: UserRole): MockAppState {
  const now = new Date();
  const user: MockUser = {
    id: "user_1",
    firstName: "Alex",
    lastName: "Johnson",
    name: "Alex Johnson",
    email: "alex@creatoragora.com",
    role
  };

  const campaigns: Campaign[] = [
    {
      id: "CF-284-001",
      name: "Summer Fashion Launch",
      description: "Seasonal style launch with creator-led short videos and carousel content.",
      category: "Fashion",
      goal: "Brand Awareness",
      budget: 580000,
      spent: 450000,
      reach: 125840,
      engagementRate: 7.8,
      status: "Live",
      startDate: "2026-03-15",
      endDate: "2026-03-30",
      createdAt: "2026-03-12"
    },
    {
      id: "CF-284-002",
      name: "Tech Product Review",
      description: "Creator reviews for new product launch across TikTok and Instagram Reels.",
      category: "Brand",
      goal: "Direct Sales",
      budget: 780000,
      spent: 180000,
      reach: 98560,
      engagementRate: 6.2,
      status: "Pending",
      startDate: "2026-03-20",
      endDate: "2026-04-08",
      createdAt: "2026-03-14"
    },
    {
      id: "CF-284-003",
      name: "Fitness Challenge",
      description: "Community challenge with weekly creator updates and CTA conversion posts.",
      category: "Event",
      goal: "Viral Growth",
      budget: 320000,
      spent: 320000,
      reach: 156230,
      engagementRate: 9.1,
      status: "Completed",
      startDate: "2026-02-01",
      endDate: "2026-02-20",
      createdAt: "2026-01-28"
    }
  ];

  const wallet: WalletState = {
    balance: 2847650,
    escrow: 950000,
    transactions: [
      {
        id: "txn_1",
        type: "Deposit from GTBank",
        amount: 500000,
        state: "Completed",
        date: "Dec 12, 2026 - 2:34 PM"
      },
      {
        id: "txn_2",
        type: "Campaign Payment - Summer Fashion Launch",
        amount: -450000,
        state: "Completed",
        date: "Dec 11, 2026 - 10:15 AM"
      },
      {
        id: "txn_3",
        type: "Withdrawal to GTBank",
        amount: -200000,
        state: "Processing",
        date: "Dec 10, 2026 - 3:22 PM"
      }
    ]
  };

  const sharedMessages: Message[] = [
    {
      id: "msg_1",
      author: "Sarah",
      text: "Hi. I finished the main visuals for Summer Fashion Launch. Sharing the first version for your review.",
      time: "01:20 AM",
      tone: "cyan"
    },
    {
      id: "msg_2",
      author: "Alex",
      text: "Great quality. Please adjust frame three so the product logo has more room.",
      time: "01:27 AM",
      mine: true,
      tone: "purple"
    },
    {
      id: "msg_3",
      author: "Sarah",
      text: "Understood. I will update and resend in 30 minutes with final copy options.",
      time: "01:29 AM",
      tone: "cyan"
    },
    {
      id: "msg_4",
      author: "System",
      text: "External contact detected in draft message. Message blocked by AI moderation.",
      time: "01:33 AM",
      system: true,
      tone: "orange"
    }
  ];

  const threads: MessageThread[] = [
    {
      id: "thread_1",
      name: "@sarah_lifestyle",
      campaignId: "CF-284-001",
      campaign: "Summer Fashion Launch",
      snippet: "Final carousel draft uploaded for approval.",
      time: "2m",
      unread: 2,
      typing: true,
      tone: "cyan",
      status: "Running",
      messages: sharedMessages
    },
    {
      id: "thread_2",
      name: "@tech_marcus",
      campaignId: "CF-284-002",
      campaign: "Tech Product Review",
      snippet: "Can we lock content timeline for tomorrow?",
      time: "1h",
      unread: 0,
      tone: "purple",
      status: "Pending",
      messages: [
        {
          id: "msg_21",
          author: "Tech Marcus",
          text: "Can we lock content timeline for tomorrow morning?",
          time: "10:14 AM",
          tone: "purple"
        }
      ]
    },
    {
      id: "thread_3",
      name: "@emma_beauty",
      campaignId: "CF-284-003",
      campaign: "Fitness Challenge",
      snippet: "Thumbnail options are ready.",
      time: "3h",
      unread: 0,
      tone: "orange",
      status: "Review",
      messages: [
        {
          id: "msg_31",
          author: "Emma Beauty",
          text: "Thumbnail options are ready. Which one should we push first?",
          time: "08:42 AM",
          tone: "orange"
        }
      ]
    }
  ];

  return {
    user,
    campaigns,
    activeCampaignId: campaigns[0].id,
    wallet,
    threads,
    activeThreadId: threads[0].id
  };
}

function safeParseState(raw: string | null): MockAppState | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as MockAppState;
    if (!parsed?.user || !parsed?.campaigns || !parsed?.wallet || !parsed?.threads) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function MockAppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MockAppState>(() => seedState("promoter"));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const persisted = safeParseState(window.localStorage.getItem(APP_STORAGE_KEY));
    if (persisted) {
      setState(persisted);
      persistUserRole(persisted.user.role);
      setReady(true);
      return;
    }

    const role = readUserRole();
    setState(seedState(role));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(state));
    persistUserRole(state.user.role);
  }, [ready, state]);

  const value = useMemo<MockAppContextValue>(() => {
    const activeCampaign = state.campaigns.find((campaign) => campaign.id === state.activeCampaignId) ?? state.campaigns[0] ?? null;
    const activeThread = state.threads.find((thread) => thread.id === state.activeThreadId) ?? state.threads[0] ?? null;

    return {
      ready,
      user: state.user,
      campaigns: state.campaigns,
      activeCampaign,
      wallet: state.wallet,
      threads: state.threads,
      activeThread,
      signup: (input) => {
        setState((prev) => ({
          ...prev,
          user: {
            ...prev.user,
            firstName: input.firstName,
            lastName: input.lastName,
            name: `${input.firstName} ${input.lastName}`.trim(),
            email: input.email,
            role: input.role
          }
        }));
      },
      login: (input) => {
        setState((prev) => ({
          ...prev,
          user: {
            ...prev.user,
            email: input.email,
            role: input.role
          }
        }));
      },
      setRole: (role) => {
        setState((prev) => ({
          ...prev,
          user: { ...prev.user, role }
        }));
      },
      createCampaign: (input) => {
        const id = `CF-${String(Date.now()).slice(-6)}`;
        const createdAt = toIsoDate(new Date());
        const nextCampaign: Campaign = {
          id,
          name: input.name,
          description: input.description,
          category: input.category,
          goal: input.goal,
          budget: input.budget,
          spent: 0,
          reach: 0,
          engagementRate: 0,
          status: "Pending",
          startDate: input.startDate,
          endDate: input.endDate,
          createdAt
        };

        setState((prev) => ({
          ...prev,
          campaigns: [nextCampaign, ...prev.campaigns],
          activeCampaignId: id,
          wallet: {
            ...prev.wallet,
            escrow: prev.wallet.escrow + input.budget,
            transactions: [
              {
                id: `txn_${Date.now()}`,
                type: `Campaign Escrow - ${input.name}`,
                amount: -input.budget,
                state: "Processing",
                date: new Date().toLocaleString()
              },
              ...prev.wallet.transactions
            ]
          }
        }));

        return id;
      },
      selectCampaign: (campaignId) => {
        setState((prev) => ({ ...prev, activeCampaignId: campaignId }));
      },
      addFunds: (amount) => {
        if (amount <= 0) return;
        setState((prev) => ({
          ...prev,
          wallet: {
            ...prev.wallet,
            balance: prev.wallet.balance + amount,
            transactions: [
              {
                id: `txn_${Date.now()}`,
                type: "Deposit to Wallet",
                amount,
                state: "Completed",
                date: new Date().toLocaleString()
              },
              ...prev.wallet.transactions
            ]
          }
        }));
      },
      withdrawFunds: (amount) => {
        if (amount <= 0) return false;
        if (state.wallet.balance < amount) return false;

        setState((prev) => ({
          ...prev,
          wallet: {
            ...prev.wallet,
            balance: prev.wallet.balance - amount,
            transactions: [
              {
                id: `txn_${Date.now()}`,
                type: "Withdrawal to Bank",
                amount: -amount,
                state: "Processing",
                date: new Date().toLocaleString()
              },
              ...prev.wallet.transactions
            ]
          }
        }));
        return true;
      },
      selectThread: (threadId) => {
        setState((prev) => ({
          ...prev,
          activeThreadId: threadId,
          threads: prev.threads.map((thread) => (thread.id === threadId ? { ...thread, unread: 0, typing: false } : thread))
        }));
      },
      sendMessage: (threadId, message) => {
        const trimmed = message.trim();
        if (!trimmed) return;

        const now = new Date();
        const timestamp = formatTime(now);

        setState((prev) => ({
          ...prev,
          threads: prev.threads.map((thread) => {
            if (thread.id !== threadId) return thread;
            const nextMessage: Message = {
              id: `msg_${Date.now()}`,
              author: prev.user.firstName,
              text: trimmed,
              time: timestamp,
              mine: true,
              tone: "purple"
            };

            return {
              ...thread,
              snippet: trimmed,
              time: "now",
              messages: [...thread.messages, nextMessage]
            };
          })
        }));
      }
    };
  }, [ready, state]);

  return <MockAppContext.Provider value={value}>{children}</MockAppContext.Provider>;
}

export function useMockApp() {
  const context = useContext(MockAppContext);
  if (!context) throw new Error("useMockApp must be used within MockAppProvider");
  return context;
}
