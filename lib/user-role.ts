export type UserRole = "promoter" | "creator";
export type CreatorInfluencerBadgeStatus = "pending" | "verified";

export const USER_ROLE_STORAGE_KEY = "creatoragora-user-role";
export const CREATOR_INFLUENCER_BADGE_STORAGE_KEY = "creatoragora-creator-influencer-badge";
export const USER_ROLE_CHANGED_EVENT = "creatoragora:user-role-changed";
export const CREATOR_BADGE_CHANGED_EVENT = "creatoragora:creator-badge-changed";
export const DEFAULT_USER_ROLE: UserRole = "promoter";
export const DEFAULT_CREATOR_BADGE_STATUS: CreatorInfluencerBadgeStatus = "pending";

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  promoter: "Promoter",
  creator: "Creator"
};

export const USER_ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  promoter: "Launch and manage campaigns, budget, and approvals.",
  creator: "Discover briefs, submit creative pitches, and monetize content."
};

export function normalizeUserRole(value: string | null | undefined): UserRole {
  if (value === "promoter" || value === "creator") return value;
  return DEFAULT_USER_ROLE;
}

export function normalizeCreatorBadgeStatus(value: string | null | undefined): CreatorInfluencerBadgeStatus {
  if (value === "verified" || value === "pending") return value;
  return DEFAULT_CREATOR_BADGE_STATUS;
}

export function readUserRole(): UserRole {
  if (typeof window === "undefined") return DEFAULT_USER_ROLE;
  const stored = window.localStorage.getItem(USER_ROLE_STORAGE_KEY);
  return normalizeUserRole(stored);
}

export function persistUserRole(role: UserRole) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(USER_ROLE_STORAGE_KEY, role);
  window.dispatchEvent(new CustomEvent<UserRole>(USER_ROLE_CHANGED_EVENT, { detail: role }));
}

export function readCreatorInfluencerBadgeStatus(): CreatorInfluencerBadgeStatus {
  if (typeof window === "undefined") return DEFAULT_CREATOR_BADGE_STATUS;
  const stored = window.localStorage.getItem(CREATOR_INFLUENCER_BADGE_STORAGE_KEY);
  return normalizeCreatorBadgeStatus(stored);
}

export function persistCreatorInfluencerBadgeStatus(status: CreatorInfluencerBadgeStatus) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CREATOR_INFLUENCER_BADGE_STORAGE_KEY, status);
  window.dispatchEvent(new CustomEvent<CreatorInfluencerBadgeStatus>(CREATOR_BADGE_CHANGED_EVENT, { detail: status }));
}

export function canCreateCampaign(role: UserRole): boolean {
  return role === "promoter";
}
