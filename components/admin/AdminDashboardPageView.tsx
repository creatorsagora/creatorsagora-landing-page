"use client";

import { LogOut, Shield, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  activateWaitlistGoLiveRequest,
  clearAdminSession,
  fetchAdminOverviewRequest,
  readAdminSession
} from "@/lib/auth-client";

type AdminOverview = Awaited<ReturnType<typeof fetchAdminOverviewRequest>>;

export function AdminDashboardPageView() {
  const router = useRouter();
  const [data, setData] = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [error, setError] = useState("");
  const adminSession = readAdminSession();

  useEffect(() => {
    const load = async () => {
      const session = readAdminSession();
      if (!session?.token) {
        router.replace("/adminlogin");
        return;
      }

      try {
        const response = await fetchAdminOverviewRequest(session.token);
        setData(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load admin dashboard");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [router]);

  const handleLogout = () => {
    clearAdminSession();
    router.push("/adminlogin");
  };

  const handleGoLive = async () => {
    const session = readAdminSession();
    if (!session?.token) return;

    setActionLoading(true);
    setActionMessage("");
    setError("");
    try {
      const response = await activateWaitlistGoLiveRequest(session.token);
      setActionMessage(`${response.activatedCount} waitlist accounts activated. Launch emails can now be sent.`);
      const refreshed = await fetchAdminOverviewRequest(session.token);
      setData(refreshed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to activate waitlist users");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="workspace-shell min-h-screen p-4 md:p-6">
        <section className="workspace-card mx-auto max-w-7xl p-6">
          <p className="text-pro-muted text-sm">Loading admin overview...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="workspace-shell min-h-screen p-4 md:p-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-5">
        <section className="workspace-card balance-gradient-card relative overflow-hidden p-5">
          <span className="pointer-events-none absolute -right-16 -top-8 size-40 rounded-full bg-pro-accent/20 blur-3xl" />
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="inline-flex items-center gap-2 text-sm text-white/80">
                <Shield size={15} className="text-white/90" />
                CREATORAGORA Admin Control
              </p>
              <h1 className="mt-2 font-display text-3xl font-bold">Admin Dashboard</h1>
              <p className="mt-1 text-sm text-white/80">Logged in as {adminSession?.email ?? "admin"}</p>
            </div>
            <button className="btn-pro-secondary inline-flex h-10 items-center gap-1.5 px-4 py-0 text-sm text-white" onClick={handleLogout} type="button">
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </section>

        {error ? <section className="rounded-xl border border-[#ff4d6d66] bg-[#ff4d6d1a] px-4 py-3 text-sm text-[#ff8b9e]">{error}</section> : null}

        {data ? (
          <>
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
              {[
                { label: "Total Users", value: data.stats.users },
                { label: "Total Campaigns", value: data.stats.campaigns },
                { label: "Active Campaigns", value: data.stats.activeCampaigns },
                { label: "Conversations", value: data.stats.conversations },
                { label: "Transactions", value: data.stats.transactions },
                { label: "Waitlist Pending", value: data.stats.waitlistPending }
              ].map((card) => (
                <article className="workspace-card p-4" key={card.label}>
                  <p className="text-xs text-pro-muted">{card.label}</p>
                  <p className="mono-stat mt-2 text-3xl font-bold">{card.value.toLocaleString()}</p>
                </article>
              ))}
            </section>

            <section className="workspace-card p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl font-semibold">Waitlist Control</h2>
                  <p className="text-pro-muted mt-1 text-sm">
                    Activate waitlist accounts when you are ready to go live and send launch emails.
                  </p>
                </div>
                <button
                  className="btn-pro-primary h-10 px-4 py-0 text-sm"
                  disabled={actionLoading || data.stats.waitlistPending === 0}
                  onClick={handleGoLive}
                  type="button"
                >
                  {actionLoading ? "Activating..." : "Go Live For Waitlist"}
                </button>
              </div>
              {actionMessage ? <p className="mt-3 text-sm text-pro-success">{actionMessage}</p> : null}
            </section>

            <section className="grid gap-4 xl:grid-cols-2">
              <article className="workspace-card p-4">
                <h2 className="font-display text-xl font-semibold">Latest Users</h2>
                <div className="mt-3 divide-y workspace-divider">
                  {data.latestUsers.map((user) => (
                    <div className="flex items-center justify-between py-2.5" key={user._id}>
                      <div>
                        <p className="text-sm font-semibold">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-pro-muted">{user.email}</p>
                      </div>
                      <div className="text-right text-xs">
                        <p className="text-pro-main capitalize">{user.currentMode}</p>
                        <p className="text-pro-muted capitalize">
                          {user.waitlist?.isWaitlisted && !user.waitlist?.accessGranted ? "waitlist pending" : user.influencerBadgeStatus}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              <article className="workspace-card p-4">
                <h2 className="font-display text-xl font-semibold">Latest Campaigns</h2>
                <div className="mt-3 divide-y workspace-divider">
                  {data.latestCampaigns.map((campaign) => (
                    <div className="flex items-center justify-between py-2.5" key={campaign._id}>
                      <div>
                        <p className="text-sm font-semibold">{campaign.title}</p>
                        <p className="text-xs text-pro-muted">Budget ${campaign.budgetUsd.toLocaleString()}</p>
                      </div>
                      <div className="text-right text-xs">
                        <p className="text-pro-main capitalize">{campaign.status}</p>
                        <p className="text-pro-muted">Spent ${campaign.spentUsd.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </section>

            <section className="workspace-card p-4">
              <h2 className="font-display text-xl font-semibold">Waitlist Registrations</h2>
              <div className="mt-3 divide-y workspace-divider">
                {data.waitlistUsers.length === 0 ? (
                  <p className="text-pro-muted py-2 text-sm">No waitlist registrations yet.</p>
                ) : (
                  data.waitlistUsers.map((user) => (
                    <article className="flex flex-wrap items-center justify-between gap-2 py-2.5" key={user._id}>
                      <div>
                        <p className="text-sm font-semibold">{user.firstName} {user.lastName}</p>
                        <p className="text-pro-muted text-xs">
                          {user.email} • {user.country} ({user.currency})
                        </p>
                      </div>
                      <div className="text-right text-xs">
                        <p className={`font-semibold ${user.waitlist.accessGranted ? "text-pro-success" : "text-pro-warning"}`}>
                          {user.waitlist.accessGranted ? "Access Live" : "Pending Go-live"}
                        </p>
                        <p className="text-pro-muted">
                          Joined {user.waitlist.joinedAt ? new Date(user.waitlist.joinedAt).toLocaleDateString() : new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>
          </>
        ) : null}

        <section className="workspace-card p-4">
          <p className="inline-flex items-center gap-2 text-sm text-pro-muted">
            <Sparkles size={14} className="text-pro-accent" />
            Admin login route is intentionally separate at <span className="font-semibold text-pro-main">/adminlogin</span>.
          </p>
        </section>
      </div>
    </main>
  );
}
