"use client";

import Link from "next/link";
import { WorkspaceShell } from "@/components/app-shell/WorkspaceShell";
import { CampaignDetailsPageView } from "@/components/workspace/CampaignDetailsPageView";
import { useUserRole } from "@/hooks/useUserRole";
import { Plus, Repeat2, Share2, SlidersHorizontal } from "lucide-react";

export default function CampaignDetailsPage() {
  const { ready, role, setRole } = useUserRole();
  const canCreateCampaign = ready && role === "promoter";

  return (
    <WorkspaceShell
      title="Summer Fashion Launch"
      subtitle="Campaign ID: CF-284-001"
      topActions={
        <>
          <button className="btn-pro-secondary inline-flex h-10 items-center gap-1.5 px-4 py-0 text-sm">
            <SlidersHorizontal size={14} />
            Actions
          </button>
          <button className="btn-pro-secondary inline-flex h-10 items-center gap-1.5 px-4 py-0 text-sm">
            <Share2 size={14} />
            Share
          </button>
          {!ready ? null : canCreateCampaign ? (
            <Link className="btn-pro-primary inline-flex h-10 items-center gap-1.5 px-4 py-0 text-sm" href="/campaigns/create">
              <Plus size={14} />
              Create New
            </Link>
          ) : (
            <button className="btn-pro-primary inline-flex h-10 items-center gap-1.5 px-4 py-0 text-sm" onClick={() => setRole("promoter")} type="button">
              <Repeat2 size={14} />
              Switch To Promoter
            </button>
          )}
        </>
      }
    >
      <CampaignDetailsPageView />
    </WorkspaceShell>
  );
}
