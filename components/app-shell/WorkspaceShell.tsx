"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import {
  BarChart3,
  ChevronsLeft,
  ChevronsRight,
  LayoutDashboard,
  LifeBuoy,
  Menu,
  Megaphone,
  MessageSquareText,
  PlusCircle,
  Repeat2,
  Settings,
  Sparkles,
  Wallet,
  X,
  type LucideIcon
} from "lucide-react";
import { HeaderLanguagePill, HeaderNotificationsButton, HeaderUserDropdown } from "@/components/app-shell/HeaderUserControls";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { DashboardBottomTabs } from "@/components/workspace/DashboardBottomTabs";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useUserRole } from "@/hooks/useUserRole";
import { canCreateCampaign, type UserRole } from "@/lib/user-role";

type WorkspaceShellProps = {
  title: string;
  subtitle?: string;
  topActions?: ReactNode;
  children: ReactNode;
};

type NavItem = {
  icon: LucideIcon;
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Megaphone, label: "Campaigns", href: "/campaigns/details" },
  { icon: Wallet, label: "Wallet", href: "/wallet" },
  { icon: MessageSquareText, label: "Messages", href: "/messages" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: Settings, label: "Settings", href: "/settings" }
];

function isItemActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  if (href === "/campaigns/details" || href === "/campaigns/create") return pathname.startsWith("/campaigns");
  return pathname.startsWith(href);
}

function SidebarContent({
  pathname,
  onNavigate,
  collapsed,
  role,
  onRoleSwitch,
  userName,
  userEmail,
  userInitials
}: {
  pathname: string;
  onNavigate?: () => void;
  collapsed?: boolean;
  role: UserRole;
  onRoleSwitch: (nextRole: UserRole) => void;
  userName: string;
  userEmail: string;
  userInitials: string;
}) {
  const allowCampaignCreation = canCreateCampaign(role);

  return (
    <div className="flex h-full flex-col">
      <div className={`flex h-16 items-center border-b workspace-divider ${collapsed ? "justify-center px-2" : "justify-between px-4"}`}>
        <Link className={`inline-flex items-center ${collapsed ? "justify-center" : ""}`} href="/dashboard" onClick={onNavigate}>
          <BrandLogo compact={collapsed} priority />
        </Link>
      </div>

      <nav className={`mt-4 grid gap-1 ${collapsed ? "px-2" : "px-3"}`}>
        {navItems.map((item) => {
          const active = isItemActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              className={`rounded-lg py-2.5 text-sm transition ${
                collapsed ? "px-0 text-center" : "px-3"
              } ${
                active
                  ? "bg-pro-primary/30 text-pro-main shadow-[0_0_0_1px_rgba(76,58,255,0.45)]"
                  : "text-pro-muted hover:bg-pro-primary/10 hover:text-pro-main"
              }`}
              href={item.href}
              key={item.label}
              onClick={onNavigate}
              title={collapsed ? item.label : undefined}
            >
              <span className={`inline-flex items-center ${collapsed ? "justify-center" : "gap-2.5"}`}>
                <Icon size={16} />
                {!collapsed ? <span>{item.label}</span> : null}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className={`mt-auto border-t workspace-divider ${collapsed ? "p-2" : "p-4"}`}>
        {collapsed ? (
          <div className="mb-2 grid gap-1">
            {allowCampaignCreation ? (
              <Link
                className="workspace-card-soft inline-flex items-center justify-center p-2 text-pro-accent hover:bg-pro-primary/10"
                href="/campaigns/create"
                onClick={onNavigate}
                title="Create campaign"
              >
                <PlusCircle size={15} />
              </Link>
            ) : (
              <button
                className="workspace-card-soft inline-flex items-center justify-center p-2 text-pro-accent hover:bg-pro-primary/10"
                onClick={() => {
                  onRoleSwitch("promoter");
                  onNavigate?.();
                }}
                title="Switch to promoter mode"
                type="button"
              >
                <Repeat2 size={15} />
              </button>
            )}
            <Link
              className="workspace-card-soft inline-flex items-center justify-center p-2 text-pro-muted hover:bg-pro-primary/10"
              href="/messages"
              onClick={onNavigate}
              title="Support inbox"
            >
              <LifeBuoy size={15} />
            </Link>
          </div>
        ) : (
          <div className="mb-3 workspace-card-soft border-pro-primary/25 bg-gradient-to-br from-pro-primary/20 to-pro-accent/10 p-3">
            <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-pro-main">
              <Sparkles size={14} className="text-pro-accent" />
              Quick Actions
            </p>
            <p className="mt-1 text-xs text-pro-muted">Start faster or reach support quickly.</p>
            <div className="mt-3 grid gap-1.5">
              {allowCampaignCreation ? (
                <Link
                  className="inline-flex items-center gap-2 rounded-md border border-pro-surface bg-pro-primary/10 px-2.5 py-1.5 text-xs hover:bg-pro-primary/15"
                  href="/campaigns/create"
                  onClick={onNavigate}
                >
                  <PlusCircle size={13} />
                  New Campaign
                </Link>
              ) : (
                <button
                  className="inline-flex items-center gap-2 rounded-md border border-pro-surface bg-pro-primary/10 px-2.5 py-1.5 text-left text-xs hover:bg-pro-primary/15"
                  onClick={() => {
                    onRoleSwitch("promoter");
                    onNavigate?.();
                  }}
                  type="button"
                >
                  <Repeat2 size={13} />
                  Switch To Promoter
                </button>
              )}
              <Link
                className="inline-flex items-center gap-2 rounded-md border border-pro-surface bg-pro-primary/10 px-2.5 py-1.5 text-xs hover:bg-pro-primary/15"
                href="/messages"
                onClick={onNavigate}
              >
                <LifeBuoy size={13} />
                Support Inbox
              </Link>
            </div>
          </div>
        )}

        <div className={`workspace-card-soft flex ${collapsed ? "justify-center p-2" : "items-center gap-3 p-3"}`}>
          <span className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-[#30416d] to-[#4C3AFF] text-xs font-semibold">{userInitials}</span>
          {!collapsed ? (
            <div>
              <p className="text-sm font-semibold">{userName}</p>
              <p className="text-xs text-pro-muted">{userEmail}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function WorkspaceShell({ title, subtitle, topActions, children }: WorkspaceShellProps) {
  const pathname = usePathname();
  const { ready, role, setRole } = useUserRole();
  const { user, initials } = useAuthUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const currentPath = useMemo(() => pathname ?? "/dashboard", [pathname]);
  const effectiveRole: UserRole = ready ? role : "creator";
  const displayName = user ? `${user.firstName} ${user.lastName}` : "Alex Johnson";
  const displayEmail = user?.email ?? "alex@creatoragora.com";

  return (
    <div className="workspace-shell">
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden p-3 transition-all duration-300 lg:block ${
          desktopCollapsed ? "w-[118px]" : "w-[278px]"
        }`}
      >
        <span className="pointer-events-none absolute inset-3 rounded-2xl border border-pro-primary/20 shadow-[0_0_24px_rgba(76,58,255,0.2),0_0_42px_rgba(34,211,238,0.1)]" />
        <div className="relative h-full overflow-hidden rounded-2xl border border-pro-surface bg-pro-sidebar">
          <SidebarContent
            pathname={currentPath}
            collapsed={desktopCollapsed}
            onRoleSwitch={setRole}
            role={effectiveRole}
            userName={displayName}
            userEmail={displayEmail}
            userInitials={initials}
          />
        </div>
      </aside>

      <div
        className={`flex min-h-screen flex-col transition-all duration-300 ${
          desktopCollapsed ? "lg:ml-[118px]" : "lg:ml-[278px]"
        }`}
      >
        <header className="sticky top-0 z-30 border-b workspace-divider bg-pro-header px-4 py-3 backdrop-blur md:px-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <button
                className="btn-pro-secondary grid size-10 place-items-center p-0 lg:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Open sidebar menu"
              >
                <Menu size={18} />
              </button>

              <button
                className="btn-pro-secondary hidden size-10 place-items-center p-0 lg:grid"
                onClick={() => setDesktopCollapsed((prev) => !prev)}
                aria-label={desktopCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                title={desktopCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {desktopCollapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
              </button>

              <div className="min-w-0 flex-1">
                <h1 className="truncate font-display text-[clamp(1.15rem,2.6vw,2rem)] font-bold">{title}</h1>
                {subtitle ? <p className="hidden text-sm text-pro-muted sm:block">{subtitle}</p> : null}
              </div>

              <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
                <div className="hidden items-center gap-2 md:flex">{topActions}</div>
                <HeaderLanguagePill />
                <ThemeToggle compact />
                <HeaderNotificationsButton />
                <HeaderUserDropdown />
              </div>
            </div>

            {topActions ? <div className="flex flex-wrap items-center gap-2 md:hidden">{topActions}</div> : null}
            {subtitle ? <p className="truncate text-xs text-pro-muted sm:hidden">{subtitle}</p> : null}
          </div>
        </header>

        <main className="flex-1 px-4 pb-24 pt-4 md:px-6 md:pb-6 md:pt-6">{children}</main>
        <DashboardBottomTabs />
      </div>

      {mobileOpen ? (
        <div
          className="fixed inset-0 z-50 bg-pro-overlay lg:hidden"
          onClick={() => setMobileOpen(false)}
          role="presentation"
        >
          <aside
            className="h-full w-[84%] max-w-[320px] border-r workspace-divider bg-pro-sidebar"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex h-14 items-center justify-between border-b workspace-divider px-4">
              <span className="text-sm font-semibold uppercase tracking-[0.1em] text-pro-muted">Navigation</span>
              <button
                className="btn-pro-secondary grid size-8 place-items-center p-0 text-xs"
                onClick={() => setMobileOpen(false)}
                aria-label="Close sidebar menu"
              >
                <X size={14} />
              </button>
            </div>
            <SidebarContent
              pathname={currentPath}
              onNavigate={() => setMobileOpen(false)}
              onRoleSwitch={setRole}
              role={effectiveRole}
              userName={displayName}
              userEmail={displayEmail}
              userInitials={initials}
            />
          </aside>
        </div>
      ) : null}
    </div>
  );
}
