"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Bell, BellDot, CreditCard, LogOut, Settings, Shield, SlidersHorizontal, UserCircle2 } from "lucide-react";
import { clearAuthSession } from "@/lib/auth-client";
import { useAuthUser } from "@/hooks/useAuthUser";

export function HeaderNotificationsButton() {
  return (
    <button className="workspace-badge relative inline-flex size-9 items-center justify-center p-0" aria-label="Notifications">
      <Bell size={14} />
    </button>
  );
}

export function HeaderUserDropdown() {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const { user, initials } = useAuthUser();
  const avatarUrl = user?.avatarUrl?.trim() ?? "";
  const fullName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "Creator";
  const modeLabel = user?.currentMode === "creator" ? "Creator Mode" : "Promoter Mode";
  const quickLinks = [
    { href: "/settings/profile", icon: UserCircle2, label: "Edit Profile", hint: "Update your bio and socials" },
    { href: "/settings/account", icon: Settings, label: "Account", hint: "Identity and region settings" },
    { href: "/settings/security", icon: Shield, label: "Security", hint: "Password and access protection" },
    { href: "/settings/billing", icon: CreditCard, label: "Billing", hint: "Wallet and payment methods" },
    { href: "/settings/notifications", icon: BellDot, label: "Notifications", hint: "Alerts and campaign updates" },
    { href: "/settings/preferences", icon: SlidersHorizontal, label: "Preferences", hint: "Theme and experience options" }
  ] as const;

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

  const onLogout = () => {
    clearAuthSession();
    router.push("/auth/login");
    setOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="workspace-card-soft inline-flex h-10 items-center rounded-full px-2.5"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <span className="grid size-7 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-[#30416d] to-[#4C3AFF] text-[11px] font-semibold text-white">
          {avatarUrl ? (
            <img alt="User avatar" className="h-full w-full object-cover" src={avatarUrl} />
          ) : (
            initials
          )}
        </span>
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-[296px] overflow-hidden rounded-2xl border border-pro-primary/30 bg-[linear-gradient(160deg,rgba(13,17,31,0.95),rgba(8,11,20,0.96))] p-2.5 shadow-[0_22px_44px_rgba(12,16,24,0.36),0_0_0_1px_rgba(76,58,255,0.18),0_0_28px_rgba(34,211,238,0.12)] backdrop-blur-xl">
          <div className="workspace-card-soft mb-2 rounded-xl border-pro-primary/25 bg-gradient-to-r from-pro-primary/16 via-pro-primary/8 to-pro-accent/10 p-3">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center overflow-hidden rounded-full border border-pro-primary/30 bg-gradient-to-br from-[#30416d] to-[#4C3AFF] text-xs font-semibold text-white shadow-[0_0_18px_rgba(76,58,255,0.35)]">
                {avatarUrl ? <img alt="User avatar" className="h-full w-full object-cover" src={avatarUrl} /> : initials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-pro-main">{fullName}</p>
                <p className="truncate text-xs text-pro-muted">{user?.email || "creator@agora.app"}</p>
              </div>
            </div>
            <span className="mt-2 inline-flex rounded-full border border-pro-accent/40 bg-pro-accent/12 px-2.5 py-1 text-[11px] font-semibold text-pro-accent">
              {modeLabel}
            </span>
          </div>

          <div className="space-y-1.5">
            {quickLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  className="group relative flex items-center gap-3 overflow-hidden rounded-xl border border-pro-surface bg-white/[0.02] px-3 py-2.5 transition hover:border-pro-primary/35 hover:bg-pro-primary/10"
                  href={item.href}
                  key={item.href}
                  onClick={() => setOpen(false)}
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-pro-primary/25 bg-pro-primary/14 text-pro-accent transition group-hover:border-pro-accent/45 group-hover:bg-pro-accent/12">
                    <Icon size={14} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-pro-main">{item.label}</span>
                    <span className="block truncate text-[11px] text-pro-muted">{item.hint}</span>
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="my-2 border-t border-pro-surface" />

          <button
            className="group flex w-full items-center gap-3 rounded-xl border border-[#ff4d6d55] bg-[#ff4d6d12] px-3 py-2.5 text-sm text-[#ff98aa] transition hover:bg-[#ff4d6d1f]"
            onClick={onLogout}
            type="button"
          >
            <span className="grid size-8 place-items-center rounded-lg border border-[#ff4d6d66] bg-[#ff4d6d1f]">
              <LogOut size={14} />
            </span>
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
