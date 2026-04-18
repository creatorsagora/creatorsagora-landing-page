"use client";

import { Laptop, ShieldCheck } from "lucide-react";
import { PaginationControls } from "@/components/ui/PaginationControls";
import { usePagination } from "@/hooks/usePagination";
import { useSettingsContext } from "@/components/workspace/settings/SettingsContext";

function togglePill(checked: boolean) {
  return checked ? "border-pro-primary/45 bg-pro-primary/20" : "border-pro-surface bg-white/[0.04]";
}

export function SecuritySettingsTab() {
  const { state, setState } = useSettingsContext();
  const sessionsPagination = usePagination(state.security.sessions, 5);

  const updateSecurity = (patch: Partial<typeof state.security>) =>
    setState((previous) => ({ ...previous, security: { ...previous.security, ...patch } }));

  const removeSession = (sessionId: string) => {
    updateSecurity({
      sessions: state.security.sessions.filter((session) => session.id !== sessionId)
    });
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
      <article className="workspace-card-soft p-4">
        <h3 className="inline-flex items-center gap-2 font-display text-lg font-semibold">
          <ShieldCheck size={18} className="text-pro-success" />
          Security Controls
        </h3>
        <div className="mt-3 space-y-2">
          {[
            ["twoFactor", "Enable 2FA via authenticator app"],
            ["loginAlerts", "Send alerts for new sign-ins"],
            ["biometricApproval", "Require biometric approval for payouts"]
          ].map(([key, label]) => (
            <button
              className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${togglePill(state.security[key as keyof typeof state.security] as boolean)}`}
              key={key}
              onClick={() => updateSecurity({ [key]: !state.security[key as keyof typeof state.security] } as Partial<typeof state.security>)}
              type="button"
            >
              {label}
            </button>
          ))}
          <label className="text-pro-muted mt-2 block text-xs">Session Timeout</label>
          <select
            className="workspace-input"
            onChange={(event) => updateSecurity({ sessionTimeout: event.target.value as typeof state.security.sessionTimeout })}
            value={state.security.sessionTimeout}
          >
            <option value="15m">15 minutes</option>
            <option value="30m">30 minutes</option>
            <option value="1h">1 hour</option>
          </select>
        </div>
      </article>

      <article className="workspace-card-soft p-4">
        <h3 className="inline-flex items-center gap-2 font-display text-lg font-semibold">
          <Laptop size={18} className="text-pro-accent" />
          Active Sessions
        </h3>
        <div className="mt-3 space-y-2">
          {sessionsPagination.pageItems.map((session) => (
            <div className="workspace-card-soft flex items-center justify-between gap-2 p-3" key={session.id}>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{session.device}</p>
                <p className="text-pro-muted text-xs">
                  {session.location} | {session.lastActive}
                </p>
              </div>
              {session.current ? (
                <span className="workspace-badge border-pro-success/30 bg-pro-success/10 text-pro-success">Current</span>
              ) : (
                <button className="btn-pro-secondary h-8 px-3 py-0 text-xs" onClick={() => removeSession(session.id)} type="button">
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
        <PaginationControls
          fromItem={sessionsPagination.fromItem}
          onPageChange={sessionsPagination.setPage}
          onPageSizeChange={sessionsPagination.setPageSize}
          page={sessionsPagination.page}
          pageSize={sessionsPagination.pageSize}
          toItem={sessionsPagination.toItem}
          totalItems={sessionsPagination.totalItems}
          totalPages={sessionsPagination.totalPages}
        />
      </article>
    </div>
  );
}
