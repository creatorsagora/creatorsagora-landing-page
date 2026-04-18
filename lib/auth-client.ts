import {
  persistCreatorInfluencerBadgeStatus,
  persistUserRole,
  type CreatorInfluencerBadgeStatus,
  type UserRole
} from "@/lib/user-role";
import { setStoredLanguageCode } from "@/lib/languages";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api";

export const AUTH_STORAGE_KEY = "creatoragora-auth-session";
export const ADMIN_AUTH_STORAGE_KEY = "creatoragora-admin-session";
export const AUTH_USER_CHANGED_EVENT = "creatoragora:auth-user-changed";

export type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  currency: string;
  language: string;
  roles: UserRole[];
  currentMode: UserRole;
  influencerBadgeStatus: "none" | "pending" | "verified";
  avatarUrl: string;
  waitlist?: {
    isWaitlisted: boolean;
    accessGranted: boolean;
    joinedAt: string | null;
    notifiedAt: string | null;
  };
  onboarding?: {
    promoter: {
      goals: string[];
      creatorTypes: string[];
    };
    creator: {
      niches: string[];
      formats: string[];
    };
  };
};

export type AuthSession = {
  token: string;
  user: AuthUser;
};

type AuthPayload = {
  token: string;
  user: AuthUser;
};

export type SignupInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  country: string;
  currency: string;
  language: string;
  role: UserRole;
  source?: "direct" | "waitlist";
  onboarding: {
    promoter: {
      goals: string[];
      creatorTypes: string[];
    };
    creator: {
      niches: string[];
      formats: string[];
    };
  };
};

export type LoginInput = {
  email: string;
  password: string;
};

function asJsonHeaders(token?: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, init);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message ?? "Request failed");
  }
  return data as T;
}

export async function signupRequest(input: SignupInput) {
  return request<AuthPayload>("/auth/signup", {
    method: "POST",
    headers: asJsonHeaders(),
    body: JSON.stringify(input)
  });
}

export async function loginRequest(input: LoginInput) {
  return request<AuthPayload>("/auth/login", {
    method: "POST",
    headers: asJsonHeaders(),
    body: JSON.stringify(input)
  });
}

export async function fetchMeRequest(token: string) {
  return request<{ user: AuthUser }>("/auth/me", {
    method: "GET",
    headers: asJsonHeaders(token)
  });
}

export async function updateModeRequest(token: string, mode: UserRole) {
  return request<{ token: string; user: AuthUser }>("/auth/mode", {
    method: "PATCH",
    headers: asJsonHeaders(token),
    body: JSON.stringify({ mode })
  });
}

export async function adminLoginRequest(input: LoginInput) {
  return request<{ token: string; admin: { email: string } }>("/admin/login", {
    method: "POST",
    headers: asJsonHeaders(),
    body: JSON.stringify(input)
  });
}

export async function fetchAdminOverviewRequest(token: string) {
  return request<{
    stats: {
      users: number;
      campaigns: number;
      activeCampaigns: number;
      conversations: number;
      transactions: number;
      waitlistPending: number;
    };
    latestUsers: Array<{
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      currentMode: UserRole;
      influencerBadgeStatus: string;
      waitlist?: {
        isWaitlisted: boolean;
        accessGranted: boolean;
        joinedAt: string | null;
        notifiedAt: string | null;
      };
      createdAt: string;
    }>;
    latestCampaigns: Array<{
      _id: string;
      title: string;
      status: string;
      budgetUsd: number;
      spentUsd: number;
      createdAt: string;
    }>;
    waitlistUsers: Array<{
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      country: string;
      currency: string;
      waitlist: {
        isWaitlisted: boolean;
        accessGranted: boolean;
        joinedAt: string | null;
        notifiedAt: string | null;
      };
      createdAt: string;
    }>;
  }>("/admin/overview", {
    method: "GET",
    headers: asJsonHeaders(token)
  });
}

export async function activateWaitlistGoLiveRequest(token: string) {
  return request<{ message: string; activatedCount: number; notifiedAt: string }>("/admin/waitlist/go-live", {
    method: "POST",
    headers: asJsonHeaders(token)
  });
}

export function persistAuthSession(payload: AuthPayload) {
  if (typeof window === "undefined") return;
  const session: AuthSession = { token: payload.token, user: payload.user };
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event(AUTH_USER_CHANGED_EVENT));
  persistUserRole(payload.user.currentMode);
  setStoredLanguageCode(payload.user.language || "en");
  const badgeStatus: CreatorInfluencerBadgeStatus =
    payload.user.influencerBadgeStatus === "verified" ? "verified" : "pending";
  persistCreatorInfluencerBadgeStatus(badgeStatus);
}

export function readAuthSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.dispatchEvent(new Event(AUTH_USER_CHANGED_EVENT));
}

export function updateStoredUser(user: AuthUser, token?: string) {
  if (typeof window === "undefined") return;
  const existing = readAuthSession();
  const nextToken = token ?? existing?.token ?? "";
  if (!nextToken) return;
  window.localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({
      token: nextToken,
      user
    } satisfies AuthSession)
  );
  window.dispatchEvent(new Event(AUTH_USER_CHANGED_EVENT));
  persistUserRole(user.currentMode);
  setStoredLanguageCode(user.language || "en");
}

export function persistAdminSession(token: string, email: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    ADMIN_AUTH_STORAGE_KEY,
    JSON.stringify({
      token,
      email
    })
  );
}

export function readAdminSession(): { token: string; email: string } | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(ADMIN_AUTH_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as { token: string; email: string };
  } catch {
    return null;
  }
}

export function clearAdminSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
}
