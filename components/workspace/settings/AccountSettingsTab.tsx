"use client";

import { useEffect } from "react";
import { BadgeCheck, Globe, UserCog } from "lucide-react";
import { useCurrency } from "@/components/preferences/CurrencyProvider";
import { useSettingsContext } from "@/components/workspace/settings/SettingsContext";
import { USER_ROLE_LABELS } from "@/lib/user-role";
import { useUserRole } from "@/hooks/useUserRole";

export function AccountSettingsTab() {
  const { state, setState } = useSettingsContext();
  const { countryCode, countryName, countryOptions, currencyCode, currencyName, phoneCode, setCountry } = useCurrency();
  const { role, hasInfluencerBadge } = useUserRole();

  const updateAccount = (patch: Partial<typeof state.account>) =>
    setState((previous) => ({ ...previous, account: { ...previous.account, ...patch } }));

  useEffect(() => {
    if (state.account.phoneCode === phoneCode) return;
    setState((previous) => ({
      ...previous,
      account: {
        ...previous.account,
        phoneCode
      }
    }));
  }, [phoneCode, setState, state.account.phoneCode]);

  return (
    <div className="grid gap-4 xl:grid-cols-[1.15fr_1fr]">
      <article className="workspace-card-soft p-4">
        <h3 className="inline-flex items-center gap-2 font-display text-lg font-semibold">
          <UserCog size={18} className="text-pro-accent" />
          Account Details
        </h3>
        <div className="mt-3 grid gap-3">
          <input className="workspace-input" onChange={(event) => updateAccount({ username: event.target.value })} value={state.account.username} />
          <input className="workspace-input" onChange={(event) => updateAccount({ recoveryEmail: event.target.value })} value={state.account.recoveryEmail} />
          <div className="grid gap-3 sm:grid-cols-2">
            <select className="workspace-input" onChange={(event) => updateAccount({ language: event.target.value })} value={state.account.language}>
              <option>English</option>
              <option>French</option>
              <option>Spanish</option>
            </select>
            <select className="workspace-input" onChange={(event) => updateAccount({ timezone: event.target.value })} value={state.account.timezone}>
              <option>Africa/Lagos (GMT+1)</option>
              <option>UTC (GMT+0)</option>
              <option>America/New_York (GMT-5)</option>
            </select>
          </div>
          <div className="grid gap-3 sm:grid-cols-[140px_1fr]">
            <select className="workspace-input" value={countryCode} onChange={(event) => setCountry(event.target.value)}>
              {countryOptions.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.name}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-11 items-center rounded-lg border border-pro-surface bg-white/[0.04] px-3 text-sm font-semibold text-pro-main">
                {state.account.phoneCode}
              </span>
              <input className="workspace-input" onChange={(event) => updateAccount({ phoneNumber: event.target.value })} value={state.account.phoneNumber} />
            </div>
          </div>
        </div>
      </article>

      <div className="space-y-4">
        <article className="workspace-card-soft p-4">
          <h3 className="inline-flex items-center gap-2 font-display text-lg font-semibold">
            <Globe size={18} className="text-pro-accent" />
            Regional Settings
          </h3>
          <div className="mt-3 space-y-2 text-sm">
            <p className="text-pro-muted">
              Country: <span className="text-pro-main">{countryName}</span>
            </p>
            <p className="text-pro-muted">
              Currency:{" "}
              <span className="text-pro-main">
                {currencyCode} ({currencyName})
              </span>
            </p>
            <p className="text-pro-muted">
              Preferred Start Page: <span className="text-pro-main">{state.preferences.startPage}</span>
            </p>
          </div>
        </article>

        <article className="workspace-card-soft p-4">
          <h3 className="inline-flex items-center gap-2 font-display text-lg font-semibold">
            <BadgeCheck size={18} className="text-pro-success" />
            Account Status
          </h3>
          <div className="mt-3 space-y-2 text-sm">
            <p className="text-pro-muted">
              Account ID: <span className="text-pro-main">{state.account.accountId}</span>
            </p>
            <p className="text-pro-muted">
              Active Mode: <span className="text-pro-main">{USER_ROLE_LABELS[role]}</span>
            </p>
            <p className="text-pro-muted">
              Influencer Badge: <span className="text-pro-main">{hasInfluencerBadge ? "Verified" : "Pending"}</span>
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}
