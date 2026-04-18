"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type SocialPlatform = "Instagram" | "X" | "TikTok" | "YouTube";

export type SocialLink = {
  platform: SocialPlatform;
  handle: string;
  iconBgClass: string;
};

export type SessionItem = {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current?: boolean;
};

export type InvoiceItem = {
  id: string;
  period: string;
  amount: string;
  state: "Paid" | "Processing" | "Overdue";
  method: string;
};

export type SettingsState = {
  profile: {
    fullName: string;
    email: string;
    phone: string;
    bio: string;
    location: string;
    website: string;
    visibility: boolean;
    showContactInfo: boolean;
    showStatistics: boolean;
    socialLinks: SocialLink[];
    categories: string[];
  };
  account: {
    username: string;
    accountId: string;
    language: string;
    timezone: string;
    phoneCode: string;
    phoneNumber: string;
    recoveryEmail: string;
  };
  notifications: {
    emailCampaigns: boolean;
    emailMessages: boolean;
    emailSecurity: boolean;
    pushCampaigns: boolean;
    pushMessages: boolean;
    pushMilestones: boolean;
    weeklyDigest: boolean;
    marketingTips: boolean;
  };
  security: {
    twoFactor: boolean;
    loginAlerts: boolean;
    biometricApproval: boolean;
    sessionTimeout: "15m" | "30m" | "1h";
    sessions: SessionItem[];
  };
  billing: {
    defaultMethod: "card" | "bank" | "usdt";
    autoTopup: boolean;
    topupThreshold: string;
    monthlyCap: string;
    invoiceEmail: string;
    taxId: string;
    invoices: InvoiceItem[];
  };
  preferences: {
    density: "comfortable" | "compact";
    startPage: "/dashboard" | "/campaigns/details" | "/messages" | "/wallet" | "/settings/profile";
    reduceMotion: boolean;
    dataSaver: boolean;
  };
};

const SETTINGS_STORAGE_KEY = "creatoragora-settings-v3";

const DEFAULT_SETTINGS_STATE: SettingsState = {
  profile: {
    fullName: "Alex Johnson",
    email: "alex@creatoragora.com",
    phone: "+234 801 234 5678",
    bio: "Creator and campaign strategist focused on fashion and lifestyle launches.",
    location: "Lagos, Nigeria",
    website: "https://creatoragora.com/alex",
    visibility: true,
    showContactInfo: false,
    showStatistics: true,
    socialLinks: [
      {
        platform: "Instagram",
        handle: "@alexjohnson_creator",
        iconBgClass: "from-[#833AB4]/35 via-[#FD1D1D]/20 to-[#FCAF45]/35 text-[#ff9bc6] border-[#c13584]/45"
      },
      { platform: "X", handle: "@alexjohnson", iconBgClass: "from-[#0f1119]/85 to-[#1a1f2e]/75 text-white border-white/20" },
      { platform: "TikTok", handle: "@alexjohnson.creates", iconBgClass: "from-[#00f2ea]/20 via-[#111]/60 to-[#ff0050]/25 text-[#ffffff] border-[#00f2ea]/35" },
      { platform: "YouTube", handle: "youtube.com/@alexjohnson", iconBgClass: "from-[#ff2e2e]/35 to-[#ff4b7d]/20 text-[#ffb3bd] border-[#ff2e2e]/40" }
    ],
    categories: ["Fashion", "Lifestyle"]
  },
  account: {
    username: "@alexjohnson_creator",
    accountId: "PR8-2456789",
    language: "English",
    timezone: "Africa/Lagos (GMT+1)",
    phoneCode: "+234",
    phoneNumber: "801 234 5678",
    recoveryEmail: "security@creatoragora.com"
  },
  notifications: {
    emailCampaigns: true,
    emailMessages: true,
    emailSecurity: true,
    pushCampaigns: true,
    pushMessages: true,
    pushMilestones: true,
    weeklyDigest: true,
    marketingTips: false
  },
  security: {
    twoFactor: false,
    loginAlerts: true,
    biometricApproval: false,
    sessionTimeout: "30m",
    sessions: [
      { id: "sess-1", device: "MacBook Pro - Chrome", location: "Lagos, NG", lastActive: "Now", current: true },
      { id: "sess-2", device: "iPhone 15 - Safari", location: "Lagos, NG", lastActive: "3 mins ago" },
      { id: "sess-3", device: "Windows Desktop - Edge", location: "Abuja, NG", lastActive: "1 day ago" },
      { id: "sess-4", device: "Android Tablet - Chrome", location: "Ibadan, NG", lastActive: "3 days ago" },
      { id: "sess-5", device: "Mac Mini - Chrome", location: "London, UK", lastActive: "1 week ago" },
      { id: "sess-6", device: "iPad Pro - Safari", location: "Accra, GH", lastActive: "2 weeks ago" }
    ]
  },
  billing: {
    defaultMethod: "card",
    autoTopup: true,
    topupThreshold: "50,000",
    monthlyCap: "2,000,000",
    invoiceEmail: "billing@creatoragora.com",
    taxId: "TIN-4490217",
    invoices: [
      { id: "INV-9011", period: "Jan 2026", amount: "₦125,000", state: "Paid", method: "Visa ****3142" },
      { id: "INV-9012", period: "Feb 2026", amount: "₦185,000", state: "Paid", method: "GTBank ****4521" },
      { id: "INV-9013", period: "Mar 2026", amount: "₦240,000", state: "Paid", method: "USDT Wallet" },
      { id: "INV-9014", period: "Apr 2026", amount: "₦90,000", state: "Processing", method: "Visa ****3142" },
      { id: "INV-9015", period: "May 2026", amount: "₦110,000", state: "Paid", method: "GTBank ****4521" },
      { id: "INV-9016", period: "Jun 2026", amount: "₦158,000", state: "Overdue", method: "Visa ****3142" }
    ]
  },
  preferences: {
    density: "comfortable",
    startPage: "/dashboard",
    reduceMotion: false,
    dataSaver: false
  }
};

type SettingsContextValue = {
  ready: boolean;
  state: SettingsState;
  setState: React.Dispatch<React.SetStateAction<SettingsState>>;
  saveNow: () => void;
  lastSavedAt: string | null;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

function loadSettingsState(): SettingsState {
  if (typeof window === "undefined") return DEFAULT_SETTINGS_STATE;
  const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
  if (!raw) return DEFAULT_SETTINGS_STATE;

  try {
    const parsed = JSON.parse(raw) as Partial<SettingsState>;
    return {
      profile: { ...DEFAULT_SETTINGS_STATE.profile, ...parsed.profile, socialLinks: parsed.profile?.socialLinks ?? DEFAULT_SETTINGS_STATE.profile.socialLinks, categories: parsed.profile?.categories ?? DEFAULT_SETTINGS_STATE.profile.categories },
      account: { ...DEFAULT_SETTINGS_STATE.account, ...parsed.account },
      notifications: { ...DEFAULT_SETTINGS_STATE.notifications, ...parsed.notifications },
      security: { ...DEFAULT_SETTINGS_STATE.security, ...parsed.security, sessions: parsed.security?.sessions ?? DEFAULT_SETTINGS_STATE.security.sessions },
      billing: { ...DEFAULT_SETTINGS_STATE.billing, ...parsed.billing, invoices: parsed.billing?.invoices ?? DEFAULT_SETTINGS_STATE.billing.invoices },
      preferences: { ...DEFAULT_SETTINGS_STATE.preferences, ...parsed.preferences }
    };
  } catch {
    return DEFAULT_SETTINGS_STATE;
  }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SettingsState>(DEFAULT_SETTINGS_STATE);
  const [ready, setReady] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  useEffect(() => {
    setState(loadSettingsState());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(state));
  }, [ready, state]);

  const saveNow = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(state));
    }
    setLastSavedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  }, [state]);

  const value = useMemo<SettingsContextValue>(() => ({ ready, state, setState, saveNow, lastSavedAt }), [lastSavedAt, ready, saveNow, state]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettingsContext() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettingsContext must be used inside SettingsProvider");
  return context;
}
