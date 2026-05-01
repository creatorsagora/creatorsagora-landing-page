"use client";

import Link from "next/link";
import { WorkspaceShell } from "@/components/app-shell/WorkspaceShell";
import { CreateCampaignPageView } from "@/components/workspace/CreateCampaignPageView";
import { useUserRole } from "@/hooks/useUserRole";
import { Lock, Repeat2, Save } from "lucide-react";

export default function CreateCampaignPage() {
  const { ready, role, setRole } = useUserRole();
  const canCreateCampaign = ready && role === "promoter";

  return (
    <WorkspaceShell
      title="Create Campaign"
      subtitle="Plan budget, get AI-matched creators, then launch"
      topActions={
        !ready ? null : canCreateCampaign ? (
          <button className="btn-pro-secondary inline-flex h-10 items-center gap-1.5 px-4 py-0 text-sm">
            <Save size={14} />
            Save Draft
          </button>
        ) : (
          <button className="btn-pro-primary inline-flex h-10 items-center gap-1.5 px-4 py-0 text-sm" onClick={() => setRole("promoter")} type="button">
            <Repeat2 size={14} />
            Switch To Promoter
          </button>
        )
      }
    >
      {!ready ? (
        <section className="workspace-card mx-auto max-w-[980px] p-6">
          <p className="text-pro-muted text-sm">Loading workspace mode...</p>
        </section>
      ) : canCreateCampaign ? (
        <CreateCampaignPageView />
      ) : (
        <section className="workspace-card mx-auto max-w-[980px] p-6 md:p-8">
          <div className="workspace-card-soft border-pro-warning/35 bg-pro-warning/10 p-4 md:p-5">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-pro-warning">
              <Lock size={15} />
              Creator mode is read-only for campaign launch
            </p>
            <p className="text-pro-muted mt-2 text-sm">
              To create a new campaign, switch this account to <span className="text-pro-main font-semibold">Promoter Mode</span>.
              Your wallet, chats, and analytics stay synced across both modes.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="btn-pro-primary h-10 px-4 py-0 text-sm" onClick={() => setRole("promoter")} type="button">
                <Repeat2 size={14} />
                Switch To Promoter
              </button>
              <Link className="btn-pro-secondary h-10 px-4 py-0 text-sm" href="/campaigns/details">
                Back To Campaigns
              </Link>
            </div>
          </div>
        </section>
      )}
    </WorkspaceShell>
  );
}
