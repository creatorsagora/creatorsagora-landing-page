"use client";

import { KeyRound, Monitor, Moon, SlidersHorizontal, Smartphone, Sun } from "lucide-react";
import { useLanguage } from "@/components/preferences/LanguageProvider";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useSettingsContext } from "@/components/workspace/settings/SettingsContext";

function togglePill(checked: boolean) {
  return checked ? "border-pro-primary/45 bg-pro-primary/20" : "border-pro-surface bg-white/[0.04]";
}

export function PreferencesSettingsTab() {
  const { theme, setTheme } = useTheme();
  const { languageCode, languageOptions, setLanguageCode } = useLanguage();
  const { state, setState } = useSettingsContext();

  const updatePreferences = (patch: Partial<typeof state.preferences>) =>
    setState((previous) => ({ ...previous, preferences: { ...previous.preferences, ...patch } }));

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <article className="workspace-card-soft p-4">
        <h3 className="inline-flex items-center gap-2 font-display text-lg font-semibold">
          <SlidersHorizontal size={18} className="text-pro-accent" />
          Interface Preferences
        </h3>
        <div className="mt-3 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button className={`rounded-lg border px-3 py-2 text-sm ${togglePill(theme === "dark")}`} onClick={() => setTheme("dark")} type="button">
              <span className="inline-flex items-center gap-1.5">
                <Moon size={14} />
                Dark
              </span>
            </button>
            <button className={`rounded-lg border px-3 py-2 text-sm ${togglePill(theme === "light")}`} onClick={() => setTheme("light")} type="button">
              <span className="inline-flex items-center gap-1.5">
                <Sun size={14} />
                Light
              </span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button className={`rounded-lg border px-3 py-2 text-sm ${togglePill(state.preferences.density === "comfortable")}`} onClick={() => updatePreferences({ density: "comfortable" })} type="button">
              <span className="inline-flex items-center gap-1.5">
                <Monitor size={14} />
                Comfortable
              </span>
            </button>
            <button className={`rounded-lg border px-3 py-2 text-sm ${togglePill(state.preferences.density === "compact")}`} onClick={() => updatePreferences({ density: "compact" })} type="button">
              <span className="inline-flex items-center gap-1.5">
                <Smartphone size={14} />
                Compact
              </span>
            </button>
          </div>

          <select
            className="workspace-input"
            onChange={(event) => updatePreferences({ startPage: event.target.value as typeof state.preferences.startPage })}
            value={state.preferences.startPage}
          >
            <option value="/dashboard">Dashboard</option>
            <option value="/campaigns/details">Campaigns</option>
            <option value="/messages">Messages</option>
            <option value="/wallet">Wallet</option>
            <option value="/settings/profile">Settings</option>
          </select>

          <select className="workspace-input" onChange={(event) => setLanguageCode(event.target.value)} value={languageCode}>
            {languageOptions.map((option) => (
              <option key={option.code} value={option.code}>
                {option.label} ({option.code})
              </option>
            ))}
          </select>
        </div>
      </article>

      <article className="workspace-card-soft p-4">
        <h3 className="inline-flex items-center gap-2 font-display text-lg font-semibold">
          <KeyRound size={18} className="text-pro-accent" />
          Experience Controls
        </h3>
        <div className="mt-3 space-y-2">
          <button className={`w-full rounded-lg border px-3 py-2 text-left text-sm ${togglePill(state.preferences.reduceMotion)}`} onClick={() => updatePreferences({ reduceMotion: !state.preferences.reduceMotion })} type="button">
            Reduce animations and transitions
          </button>
          <button className={`w-full rounded-lg border px-3 py-2 text-left text-sm ${togglePill(state.preferences.dataSaver)}`} onClick={() => updatePreferences({ dataSaver: !state.preferences.dataSaver })} type="button">
            Enable low-data workspace mode
          </button>
        </div>
        <p className="text-pro-muted mt-3 text-xs">
          Start page: <span className="text-pro-main">{state.preferences.startPage}</span>
        </p>
      </article>
    </div>
  );
}
