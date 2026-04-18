"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { SETTINGS_TABS, SETTINGS_TAB_LABELS, type SettingsTabId } from "@/lib/settings-tabs";
import { USER_ROLE_LABELS } from "@/lib/user-role";
import { useUserRole } from "@/hooks/useUserRole";
import { useSettingsContext } from "@/components/workspace/settings/SettingsContext";

type SettingsScaffoldProps = {
  activeTab: SettingsTabId;
  children: ReactNode;
};

export function SettingsScaffold({ activeTab, children }: SettingsScaffoldProps) {
  const { role, hasInfluencerBadge } = useUserRole();
  const { lastSavedAt, saveNow } = useSettingsContext();

  return (
    <div className="space-y-5">
      <section className="workspace-card p-4 md:p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid size-16 place-items-center rounded-xl bg-gradient-to-br from-[#2f3f6e] to-[#4C3AFF] text-lg font-bold">AJ</span>
            <div>
              <p className="text-2xl font-semibold">@alexjohnson_creator</p>
              <p className="text-pro-muted text-sm">Account ID: PR8-2456789</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="workspace-badge border-pro-success/30 bg-pro-success/10 text-pro-success">Email Verified</span>
                <span className="workspace-badge border-pro-success/30 bg-pro-success/10 text-pro-success">Phone Verified</span>
                <span className={`workspace-badge ${hasInfluencerBadge ? "border-pro-success/30 bg-pro-success/10 text-pro-success" : "border-pro-warning/35 bg-pro-warning/10 text-pro-warning"}`}>
                  {hasInfluencerBadge ? "Identity Verified" : "Identity Pending"}
                </span>
              </div>
              <p className="text-pro-muted mt-2 text-xs">
                Active: {SETTINGS_TAB_LABELS[activeTab]} | Mode: {USER_ROLE_LABELS[role]}
                {lastSavedAt ? ` | Saved ${lastSavedAt}` : ""}
              </p>
            </div>
          </div>
          <button className="btn-pro-primary h-10 px-4 py-0 text-sm" onClick={saveNow} type="button">
            Save Changes
          </button>
        </div>
      </section>

      <section className="workspace-card p-4">
        <div className="mb-4 flex flex-wrap gap-2">
          {SETTINGS_TABS.map((tab) => (
            <Link
              className={`rounded-lg px-3 py-1.5 text-sm transition ${
                tab.id === activeTab ? "bg-pro-primary/25 text-pro-main" : "bg-white/[0.04] text-pro-muted hover:text-pro-main"
              }`}
              href={`/settings/${tab.id}`}
              key={tab.id}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {children}
      </section>
    </div>
  );
}
