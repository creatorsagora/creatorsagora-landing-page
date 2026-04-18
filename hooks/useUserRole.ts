"use client";

import { useEffect, useMemo, useState } from "react";
import { readAuthSession, updateModeRequest, updateStoredUser } from "@/lib/auth-client";
import {
  CREATOR_BADGE_CHANGED_EVENT,
  DEFAULT_CREATOR_BADGE_STATUS,
  DEFAULT_USER_ROLE,
  USER_ROLE_CHANGED_EVENT,
  USER_ROLE_DESCRIPTIONS,
  USER_ROLE_LABELS,
  persistCreatorInfluencerBadgeStatus,
  persistUserRole,
  readCreatorInfluencerBadgeStatus,
  readUserRole,
  type CreatorInfluencerBadgeStatus,
  type UserRole
} from "@/lib/user-role";

export function useUserRole() {
  const [role, setRoleState] = useState<UserRole>(DEFAULT_USER_ROLE);
  const [creatorBadgeStatus, setCreatorBadgeStatus] = useState<CreatorInfluencerBadgeStatus>(DEFAULT_CREATOR_BADGE_STATUS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const syncFromStorage = () => {
      setRoleState(readUserRole());
      setCreatorBadgeStatus(readCreatorInfluencerBadgeStatus());
    };

    syncFromStorage();
    setReady(true);

    const onStorage = () => syncFromStorage();
    const onRoleChanged = () => syncFromStorage();
    const onBadgeChanged = () => syncFromStorage();

    window.addEventListener("storage", onStorage);
    window.addEventListener(USER_ROLE_CHANGED_EVENT, onRoleChanged);
    window.addEventListener(CREATOR_BADGE_CHANGED_EVENT, onBadgeChanged);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(USER_ROLE_CHANGED_EVENT, onRoleChanged);
      window.removeEventListener(CREATOR_BADGE_CHANGED_EVENT, onBadgeChanged);
    };
  }, []);

  const setRole = (nextRole: UserRole) => {
    setRoleState(nextRole);
    persistUserRole(nextRole);
    const session = readAuthSession();
    if (!session?.token) return;

    void (async () => {
      try {
        const response = await updateModeRequest(session.token, nextRole);
        updateStoredUser(response.user, response.token);
      } catch {
        // Keep local role update for UX even if API is unavailable.
      }
    })();
  };

  const setInfluencerBadgeStatus = (nextStatus: CreatorInfluencerBadgeStatus) => {
    setCreatorBadgeStatus(nextStatus);
    persistCreatorInfluencerBadgeStatus(nextStatus);
  };

  const roleLabel = useMemo(() => USER_ROLE_LABELS[role], [role]);
  const roleDescription = useMemo(() => USER_ROLE_DESCRIPTIONS[role], [role]);
  const hasInfluencerBadge = creatorBadgeStatus === "verified";

  return {
    ready,
    role,
    roleLabel,
    roleDescription,
    creatorBadgeStatus,
    hasInfluencerBadge,
    setRole,
    setInfluencerBadgeStatus
  };
}
