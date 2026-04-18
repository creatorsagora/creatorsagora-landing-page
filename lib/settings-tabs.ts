export const SETTINGS_TABS = [
  { id: "profile", label: "Profile" },
  { id: "account", label: "Account" },
  { id: "notifications", label: "Notifications" },
  { id: "security", label: "Security" },
  { id: "billing", label: "Billing" },
  { id: "preferences", label: "Preferences" }
] as const;

export type SettingsTabId = (typeof SETTINGS_TABS)[number]["id"];

export const DEFAULT_SETTINGS_TAB: SettingsTabId = "profile";

export const SETTINGS_TAB_LABELS: Record<SettingsTabId, string> = SETTINGS_TABS.reduce(
  (accumulator, tab) => {
    accumulator[tab.id] = tab.label;
    return accumulator;
  },
  {} as Record<SettingsTabId, string>
);

export function isSettingsTabId(value: string): value is SettingsTabId {
  return SETTINGS_TABS.some((tab) => tab.id === value);
}

export function normalizeSettingsTab(value: string | null | undefined): SettingsTabId {
  if (value && isSettingsTabId(value)) return value;
  return DEFAULT_SETTINGS_TAB;
}
