"use client";

import { Bell, Smartphone } from "lucide-react";
import { useSettingsContext } from "@/components/workspace/settings/SettingsContext";

function togglePill(checked: boolean) {
  return checked ? "border-pro-primary/45 bg-pro-primary/20" : "border-pro-surface bg-white/[0.04]";
}

export function NotificationsSettingsTab() {
  const { state, setState } = useSettingsContext();

  const updateNotifications = (patch: Partial<typeof state.notifications>) =>
    setState((previous) => ({ ...previous, notifications: { ...previous.notifications, ...patch } }));

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <article className="workspace-card-soft p-4">
        <h3 className="inline-flex items-center gap-2 font-display text-lg font-semibold">
          <Bell size={18} className="text-pro-accent" />
          Email Notifications
        </h3>
        <div className="mt-3 space-y-2">
          {[
            ["emailCampaigns", "Campaign updates and status changes"],
            ["emailMessages", "New campaign message alerts"],
            ["emailSecurity", "Security and account alerts"]
          ].map(([key, label]) => (
            <button
              className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${togglePill(state.notifications[key as keyof typeof state.notifications] as boolean)}`}
              key={key}
              onClick={() => updateNotifications({ [key]: !state.notifications[key as keyof typeof state.notifications] } as Partial<typeof state.notifications>)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
      </article>

      <article className="workspace-card-soft p-4">
        <h3 className="inline-flex items-center gap-2 font-display text-lg font-semibold">
          <Smartphone size={18} className="text-pro-accent" />
          Push and Digest
        </h3>
        <div className="mt-3 space-y-2">
          {[
            ["pushCampaigns", "Campaign progress push notifications"],
            ["pushMessages", "New chat and reply notifications"],
            ["pushMilestones", "Milestone approvals and payment releases"],
            ["weeklyDigest", "Weekly performance digest"],
            ["marketingTips", "Product news and growth tips"]
          ].map(([key, label]) => (
            <button
              className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${togglePill(state.notifications[key as keyof typeof state.notifications] as boolean)}`}
              key={key}
              onClick={() => updateNotifications({ [key]: !state.notifications[key as keyof typeof state.notifications] } as Partial<typeof state.notifications>)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
      </article>
    </div>
  );
}
