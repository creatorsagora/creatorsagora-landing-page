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
    fullName: "",
    email: "",
    phone: "",
    bio: "",
    location: "",
    website: "",
    visibility: true,
    showContactInfo: false,
    showStatistics: true,
    socialLinks: [],
    categories: []
  },
  account: {
    username: "",
    accountId: "",
    language: "English",
    timezone: "",
    phoneCode: "",
    phoneNumber: "",
    recoveryEmail: ""
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
    sessions: []
  },
  billing: {
    defaultMethod: "card",
    autoTopup: true,
    topupThreshold: "",
    monthlyCap: "",
    invoiceEmail: "",
    taxId: "",
    invoices: []
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
