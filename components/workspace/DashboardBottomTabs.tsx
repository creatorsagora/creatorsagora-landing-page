 "use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Megaphone, MessageSquareText, UserCircle2, Wallet } from "lucide-react";

const tabs = [
  { label: "Home", href: "/dashboard", icon: LayoutDashboard },
  { label: "Campaigns", href: "/campaigns/details", icon: Megaphone },
  { label: "Wallet", href: "/wallet", icon: Wallet },
  { label: "Messages", href: "/messages", icon: MessageSquareText },
  { label: "Profile", href: "/settings", icon: UserCircle2 }
];

function isTabActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  if (href === "/campaigns/details") return pathname.startsWith("/campaigns");
  return pathname.startsWith(href);
}

export function DashboardBottomTabs() {
  const pathname = usePathname() ?? "/dashboard";

  return (
    <footer className="bg-pro-header fixed inset-x-0 bottom-0 z-30 border-t workspace-divider px-2 pb-[max(10px,env(safe-area-inset-bottom))] pt-2 backdrop-blur lg:hidden">
      <nav className="grid grid-cols-5 gap-1" aria-label="Workspace Bottom Tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isTabActive(pathname, tab.href);
          return (
            <Link
              className={`inline-flex flex-col items-center justify-center gap-1 rounded-lg px-1 py-1.5 text-[11px] ${
                active ? "bg-pro-primary/20 text-pro-main" : "text-pro-muted"
              }`}
              href={tab.href}
              key={tab.label}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </footer>
  );
}
