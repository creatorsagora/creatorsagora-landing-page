"use client";

import { WorkspaceShell } from "@/components/app-shell/WorkspaceShell";
import { DashboardPageView } from "@/components/workspace/DashboardPageView";
import { CreatorDashboardView } from "@/components/workspace/RoleDashboardViews";
import { useUserRole } from "@/hooks/useUserRole";
import { USER_ROLE_LABELS } from "@/lib/user-role";

export default function DashboardPage() {
  const { ready, role } = useUserRole();
  const canCreateCampaign = ready && role === "promoter";

  const title = `${USER_ROLE_LABELS[role]} Dashboard`;

  return (
    <WorkspaceShell title={title}>
      {!ready ? (
        <section className="workspace-card p-6">
          <p className="text-pro-muted text-sm">Loading your role dashboard...</p>
        </section>
      ) : canCreateCampaign ? (
        <DashboardPageView />
      ) : (
        <CreatorDashboardView />
      )}
    </WorkspaceShell>
  );
}
