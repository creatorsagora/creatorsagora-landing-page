"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Bell, CheckCircle2, ChevronDown, Globe2, LogOut, MessageSquareText, Settings, Wallet } from "lucide-react";
import { useCurrency } from "@/components/preferences/CurrencyProvider";
import { useLanguage } from "@/components/preferences/LanguageProvider";
import { useAuthUser } from "@/hooks/useAuthUser";
import { clearAuthSession } from "@/lib/auth-client";
import { useUserRole } from "@/hooks/useUserRole";
import type { UserRole } from "@/lib/user-role";

export function HeaderNotificationsButton() {
  return (
    <button className="workspace-badge relative inline-flex size-9 items-center justify-center p-0" aria-label="Notifications">
      <Bell size={14} />
      <span className="absolute -right-1 -top-1 inline-flex size-4 items-center justify-center rounded-full bg-[#ff4d6d] text-[10px] font-semibold text-white">
        3
      </span>
    </button>
  );
}

export function HeaderLanguagePill() {
  const { languageCode, languageOptions, setLanguageCode } = useLanguage();

  return (
    <label className="workspace-card-soft hidden h-10 items-center gap-1.5 rounded-full px-2 md:inline-flex">
      <Globe2 size={14} className="shrink-0 text-pro-accent" />
      <select
        aria-label="Select global language"
        className="max-w-[120px] bg-transparent text-xs font-medium uppercase text-pro-main outline-none"
        onChange={(event) => setLanguageCode(event.target.value)}
        value={languageCode}
      >
        {languageOptions.map((option) => (
          <option key={option.code} value={option.code}>
            {option.code}
          </option>
        ))}
      </select>
    </label>
  );
}

export function HeaderUserDropdown() {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const { role, roleLabel, hasInfluencerBadge, setRole } = useUserRole();
  const { user, initials } = useAuthUser();
  const { countryName, currencyCode } = useCurrency();
  const { languageCode, languageOptions, setLanguageCode } = useLanguage();

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  const onRoleSwitch = (nextRole: UserRole) => {
    setRole(nextRole);
    setOpen(false);
  };

  const onLogout = () => {
    clearAuthSession();
    router.push("/auth/login");
    setOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="workspace-card-soft inline-flex h-10 items-center gap-2 rounded-full px-2.5"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <span className="grid size-7 place-items-center rounded-full bg-gradient-to-br from-[#30416d] to-[#4C3AFF] text-[11px] font-semibold text-white">{initials}</span>
        <span className="hidden text-xs text-pro-main sm:inline">{user?.firstName ?? "Alex"}</span>
        <ChevronDown className={`text-pro-muted transition ${open ? "rotate-180" : ""}`} size={14} />
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-[280px] rounded-2xl border border-pro-primary/20 bg-pro-panel p-3 shadow-[0_18px_34px_rgba(12,16,24,0.14),0_0_20px_rgba(76,58,255,0.16)]">
          <div className="workspace-card-soft border-pro-primary/20 p-3">
            <p className="text-sm font-semibold">{user ? `${user.firstName} ${user.lastName}` : "Alex Johnson"}</p>
            <p className="text-pro-muted text-xs">{user?.email ?? "alex@creatoragora.com"}</p>
            <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
              <span className="workspace-badge border-pro-primary/30 bg-pro-primary/18 text-pro-main">{roleLabel}</span>
              {hasInfluencerBadge ? (
                <span className="workspace-badge border-pro-success/30 bg-pro-success/12 text-pro-success">Influencer Verified</span>
              ) : null}
            </div>
            <p className="text-pro-muted mt-2 text-[11px]">
              {countryName} | {currencyCode}
            </p>
            <div className="mt-2">
              <label className="text-pro-muted block text-[11px]">Global Language</label>
              <select
                className="workspace-input mt-1 h-9 py-0 text-xs"
                onChange={(event) => setLanguageCode(event.target.value)}
                value={languageCode}
              >
                {languageOptions.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-2 grid gap-1.5">
            <Link className="workspace-card-soft inline-flex items-center gap-2 px-3 py-2 text-sm hover:bg-pro-primary/10" href="/settings" onClick={() => setOpen(false)}>
              <Settings size={14} className="text-pro-accent" />
              Profile and Settings
            </Link>
            <Link className="workspace-card-soft inline-flex items-center gap-2 px-3 py-2 text-sm hover:bg-pro-primary/10" href="/wallet" onClick={() => setOpen(false)}>
              <Wallet size={14} className="text-pro-accent" />
              Wallet
            </Link>
            <Link className="workspace-card-soft inline-flex items-center gap-2 px-3 py-2 text-sm hover:bg-pro-primary/10" href="/messages" onClick={() => setOpen(false)}>
              <MessageSquareText size={14} className="text-pro-accent" />
              Messages
            </Link>
          </div>

          <div className="my-2 border-t workspace-divider" />

          <div className="grid gap-1.5">
            <button
              className={`workspace-card-soft inline-flex items-center justify-between px-3 py-2 text-sm ${
                role === "promoter" ? "border-pro-primary/35 bg-pro-primary/12" : "hover:bg-pro-primary/10"
              }`}
              onClick={() => onRoleSwitch("promoter")}
              type="button"
            >
              <span>Switch to Promoter</span>
              {role === "promoter" ? <CheckCircle2 size={14} className="text-pro-success" /> : null}
            </button>
            <button
              className={`workspace-card-soft inline-flex items-center justify-between px-3 py-2 text-sm ${
                role === "creator" ? "border-pro-primary/35 bg-pro-primary/12" : "hover:bg-pro-primary/10"
              }`}
              onClick={() => onRoleSwitch("creator")}
              type="button"
            >
              <span>Switch to Creator</span>
              {role === "creator" ? <CheckCircle2 size={14} className="text-pro-success" /> : null}
            </button>
          </div>

          <div className="mt-2 border-t workspace-divider pt-2">
            <button className="workspace-card-soft inline-flex w-full items-center gap-2 px-3 py-2 text-sm text-[#ff8b9e] hover:bg-[#ff4d6d1f]" onClick={onLogout} type="button">
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
