"use client";

import type { SettingsTabId } from "@/lib/settings-tabs";
import { AccountSettingsTab } from "@/components/workspace/settings/AccountSettingsTab";
import { BillingSettingsTab } from "@/components/workspace/settings/BillingSettingsTab";
import { NotificationsSettingsTab } from "@/components/workspace/settings/NotificationsSettingsTab";
import { PreferencesSettingsTab } from "@/components/workspace/settings/PreferencesSettingsTab";
import { ProfileSettingsTab } from "@/components/workspace/settings/ProfileSettingsTab";
import { SecuritySettingsTab } from "@/components/workspace/settings/SecuritySettingsTab";

export function SettingsTabContent({ activeTab }: { activeTab: SettingsTabId }) {
  if (activeTab === "account") return <AccountSettingsTab />;
  if (activeTab === "notifications") return <NotificationsSettingsTab />;
  if (activeTab === "security") return <SecuritySettingsTab />;
  if (activeTab === "billing") return <BillingSettingsTab />;
  if (activeTab === "preferences") return <PreferencesSettingsTab />;
  return <ProfileSettingsTab />;
}
