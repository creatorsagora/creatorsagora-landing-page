"use client";

import { useEffect, useMemo, useState } from "react";
import { AUTH_USER_CHANGED_EVENT, readAuthSession, type AuthUser } from "@/lib/auth-client";

export function useAuthUser() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => {
      const session = readAuthSession();
      setUser(session?.user ?? null);
      setReady(true);
    };

    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(AUTH_USER_CHANGED_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(AUTH_USER_CHANGED_EVENT, sync);
    };
  }, []);

  const initials = useMemo(() => {
    if (!user) return "AJ";
    const first = user.firstName?.[0] ?? "";
    const last = user.lastName?.[0] ?? "";
    return `${first}${last}`.toUpperCase() || "AJ";
  }, [user]);

  return { user, ready, initials };
}
