"use client";

import Link from "next/link";
import { WorkspaceShell } from "@/components/app-shell/WorkspaceShell";
import { DashboardPageView } from "@/components/workspace/DashboardPageView";
import { CreatorDashboardView } from "@/components/workspace/RoleDashboardViews";
import { useUserRole } from "@/hooks/useUserRole";
import { USER_ROLE_LABELS } from "@/lib/user-role";
import { Compass, Plus, Repeat2 } from "lucide-react";

export default function DashboardPage() {
  const { ready, role, hasInfluencerBadge, setRole } = useUserRole();
  const canCreateCampaign = ready && role === "promoter";

  const title = `${USER_ROLE_LABELS[role]} Dashboard`;
  const subtitle =
    role === "promoter"
      ? "Manage campaign budgets, creators, and approvals."
      : hasInfluencerBadge
        ? "Creator workspace with verified influencer badge."
        : "Discover briefs, submit pitches, and monitor creator growth.";

  const topActions =
    !ready ? null : canCreateCampaign ? (
      <>
        <Link className="btn-pro-primary inline-flex h-10 items-center gap-1.5 px-4 py-0 text-sm" href="/campaigns/create">
          <Plus size={14} />
          Create Campaign
        </Link>
      </>
    ) : (
      <>
        <Link className="btn-pro-secondary inline-flex h-10 items-center gap-1.5 px-4 py-0 text-sm" href="/campaigns/details">
          <Compass size={14} />
          Discover Briefs
        </Link>
        <button className="btn-pro-primary inline-flex h-10 items-center gap-1.5 px-4 py-0 text-sm" onClick={() => setRole("promoter")} type="button">
          <Repeat2 size={14} />
          Switch To Promoter
        </button>
      </>
    );

  return (
    <WorkspaceShell title={title} subtitle={subtitle} topActions={topActions}>
      {!ready ? (
        <section className="workspace-card p-6">
          <p className="text-pro-muted text-sm">Loading your role dashboard...</p>
        </section>
      ) : canCreateCampaign ? (
        <DashboardPageView />
      ) : (
        <CreatorDashboardView hasInfluencerBadge={hasInfluencerBadge} />
      )}
    </WorkspaceShell>
  );
}
