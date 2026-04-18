"use client";

import type { ReactNode, SVGProps } from "react";
import { Plus } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { PaginationControls } from "@/components/ui/PaginationControls";
import { usePagination } from "@/hooks/usePagination";
import { USER_ROLE_LABELS, type UserRole } from "@/lib/user-role";

const profileTabs = ["Profile", "Account", "Notifications", "Security", "Billing", "Preferences"];

function XBrandIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.4l-5.78-7.55-6.61 7.55H.52l8.6-9.83L0 1.15h7.59l5.22 6.9 6.09-6.9Zm-1.3 19.58h2.04L6.49 3.33H4.3L17.6 20.73Z" />
    </svg>
  );
}

function InstagramBrandIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 5.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Zm5.25-.75a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Zm-5.25 2a3.25 3.25 0 1 1 0 6.5 3.25 3.25 0 0 1 0-6.5Z" />
    </svg>
  );
}

function TikTokBrandIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M19.59 6.69a4.79 4.79 0 0 1-3.77-4.24V2h-3.27v13.23a3.08 3.08 0 0 1-3.08 3.05 3.08 3.08 0 0 1-3.08-3.05 3.08 3.08 0 0 1 3.08-3.05c.34 0 .66.05.97.15V8.99a6.48 6.48 0 0 0-.97-.07A6.46 6.46 0 0 0 3 15.23a6.46 6.46 0 0 0 6.47 6.32 6.46 6.46 0 0 0 6.47-6.32V8.69a8.08 8.08 0 0 0 4.72 1.5V6.93c-.36 0-.72-.08-1.07-.24Z" />
    </svg>
  );
}

function YouTubeBrandIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M4.5 5.5h15a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3h-15a3 3 0 0 1-3-3v-7a3 3 0 0 1 3-3Zm5.7 2.6v7.8l6-3.9-6-3.9Z" />
    </svg>
  );
}

type SocialLink = {
  platform: string;
  handle: string;
  icon: ReactNode;
  iconBgClass: string;
};

const socialLinks: SocialLink[] = [
  {
    platform: "Instagram",
    handle: "@username",
    icon: <InstagramBrandIcon className="size-[15px]" />,
    iconBgClass: "from-[#833AB4]/35 via-[#FD1D1D]/20 to-[#FCAF45]/35 text-[#ff9bc6] border-[#c13584]/45"
  },
  {
    platform: "X",
    handle: "@username",
    icon: <XBrandIcon className="size-[14px]" />,
    iconBgClass: "from-[#0f1119]/85 to-[#1a1f2e]/75 text-white border-white/20"
  },
  {
    platform: "TikTok",
    handle: "@username",
    icon: <TikTokBrandIcon className="size-[14px]" />,
    iconBgClass: "from-[#00f2ea]/20 via-[#111]/60 to-[#ff0050]/25 text-[#ffffff] border-[#00f2ea]/35"
  },
  {
    platform: "YouTube",
    handle: "Channel URL or @handle",
    icon: <YouTubeBrandIcon className="size-[15px]" />,
    iconBgClass: "from-[#ff2e2e]/35 to-[#ff4b7d]/20 text-[#ffb3bd] border-[#ff2e2e]/40"
  }
];

const influencerStats = [
  { label: "Instagram", value: "25.4K" },
  { label: "X", value: "12.1K" },
  { label: "TikTok", value: "8.2K" },
  { label: "YouTube", value: "8.7K" }
];

export function ProfileSettingsPageView() {
  const { role, setRole, creatorBadgeStatus, hasInfluencerBadge, setInfluencerBadgeStatus } = useUserRole();
  const socialLinksPagination = usePagination(socialLinks, 5);
  const influencerStatsPagination = usePagination(influencerStats, 5);

  const roleCards: { role: UserRole; title: string; description: string }[] = [
    { role: "promoter", title: "Promoter Mode", description: "Create and manage campaigns, budgets, and approvals." },
    { role: "creator", title: "Creator Mode", description: "Discover open briefs, submit pitches, and grow your profile." }
  ];

  return (
    <div className="space-y-5">
      <section className="workspace-card p-4 md:p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid size-16 place-items-center rounded-xl bg-gradient-to-br from-[#2f3f6e] to-[#4C3AFF] text-lg font-bold">
              AJ
            </span>
            <div>
              <p className="text-2xl font-semibold">@alexjohnson_creator</p>
              <p className="text-pro-muted text-sm">Account ID: PR8-2456789</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="workspace-badge border-pro-success/30 bg-pro-success/10 text-pro-success">Email Verified</span>
                <span className="workspace-badge border-pro-success/30 bg-pro-success/10 text-pro-success">Phone Verified</span>
                <span className="workspace-badge border-pro-warning/35 bg-pro-warning/10 text-pro-warning">Identity Pending</span>
              </div>
            </div>
          </div>
          <button className="btn-pro-primary h-10 px-4 py-0 text-sm">Save Changes</button>
        </div>
      </section>

      <section className="workspace-card p-4">
        <div className="mb-4 flex flex-wrap gap-2">
          {profileTabs.map((tab, index) => (
            <button className={`rounded-lg px-3 py-1.5 text-sm ${index === 0 ? "bg-pro-primary/25 text-pro-main" : "bg-white/[0.04] text-pro-muted"}`} key={tab}>
              {tab}
            </button>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.15fr_1fr]">
          <div className="space-y-4">
            <article className="workspace-card-soft p-4">
              <h3 className="font-display text-lg font-semibold">Personal Information</h3>
              <div className="mt-3 grid gap-3">
                <input className="workspace-input" defaultValue="Alex Johnson" />
                <input className="workspace-input" defaultValue="alex@creatoragora.com" />
                <input className="workspace-input" defaultValue="+234 801 234 5678" />
                <textarea className="workspace-input h-20 resize-none py-3" defaultValue="Tell us about yourself..." />
                <input className="workspace-input" defaultValue="Lagos, Nigeria" />
                <input className="workspace-input" defaultValue="https://yourwebsite.com" />
              </div>
            </article>

            <article className="workspace-card-soft p-4">
              <h3 className="font-display text-lg font-semibold">Social Media Links</h3>
              <div className="mt-3 space-y-2">
                {socialLinksPagination.pageItems.map((social) => (
                  <div
                    className="workspace-input group flex items-center justify-between gap-3 border-pro-surface bg-[linear-gradient(120deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))]"
                    key={social.platform}
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      <span
                        className={`grid size-8 shrink-0 place-items-center rounded-lg border bg-gradient-to-br transition duration-300 group-hover:shadow-pro-cyan ${social.iconBgClass}`}
                      >
                        {social.icon}
                      </span>
                      <span className="text-pro-main truncate text-sm font-medium">{social.platform}</span>
                    </span>
                    <span className="text-pro-main truncate text-right text-sm">{social.handle}</span>
                  </div>
                ))}
              </div>
              <PaginationControls
                fromItem={socialLinksPagination.fromItem}
                onPageChange={socialLinksPagination.setPage}
                onPageSizeChange={socialLinksPagination.setPageSize}
                page={socialLinksPagination.page}
                pageSize={socialLinksPagination.pageSize}
                toItem={socialLinksPagination.toItem}
                totalItems={socialLinksPagination.totalItems}
                totalPages={socialLinksPagination.totalPages}
              />
            </article>
          </div>

          <div className="space-y-4">
            <article className="workspace-card-soft p-4">
              <h3 className="font-display text-lg font-semibold">Profile Visibility</h3>
              <div className="mt-3 space-y-3 text-sm">
                {["Profile Visibility", "Show Contact Info", "Show Statistics"].map((item) => (
                  <div className="flex items-center justify-between" key={item}>
                    <span className="text-pro-muted">{item}</span>
                    <span className="inline-flex h-5 w-9 rounded-full bg-white/10 p-0.5">
                      <span className="size-4 rounded-full bg-white/60" />
                    </span>
                  </div>
                ))}
              </div>
            </article>

            <article className="workspace-card-soft p-4">
              <h3 className="font-display text-lg font-semibold">Role Management</h3>
              <div className="mt-3 space-y-2">
                {roleCards.map((item) => {
                  const active = role === item.role;
                  return (
                    <button
                      className={`w-full rounded-lg border p-3 text-left transition ${
                        active
                          ? "border-pro-primary/45 bg-pro-primary/15"
                          : "border-pro-surface bg-white/[0.03] hover:border-pro-primary/28"
                      }`}
                      key={item.role}
                      onClick={() => setRole(item.role)}
                      type="button"
                    >
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="text-pro-muted text-xs">{item.description}</p>
                    </button>
                  );
                })}
                <p className="text-pro-muted text-xs">
                  Active mode: <span className="text-pro-main font-semibold">{USER_ROLE_LABELS[role]}</span>. Dashboard updates instantly and all workspace data stays synced.
                </p>
              </div>
            </article>

            <article className="workspace-card-soft p-4">
              <h3 className="font-display text-lg font-semibold">Influencer Badge</h3>
              <p className="text-pro-muted mt-2 text-sm">
                Influencers are managed as creator accounts. Badge is assigned after manual account review.
              </p>
              <div className="mt-3 rounded-lg border border-pro-surface bg-white/[0.03] p-3">
                <p className="text-sm font-semibold">{hasInfluencerBadge ? "Verified Influencer" : "Verification Pending"}</p>
                <p className="text-pro-muted mt-1 text-xs">Current status: {creatorBadgeStatus}</p>
              </div>
              <div className="mt-3 grid gap-2">
                <button
                  className="btn-pro-secondary h-10 px-4 py-0 text-sm"
                  onClick={() => setInfluencerBadgeStatus("pending")}
                  type="button"
                >
                  Mark Pending Review (Demo)
                </button>
                <button
                  className="btn-pro-primary h-10 px-4 py-0 text-sm"
                  onClick={() => setInfluencerBadgeStatus("verified")}
                  type="button"
                >
                  Manually Verify Badge (Demo)
                </button>
              </div>
            </article>

            <article className="workspace-card-soft p-4">
              <h3 className="font-display text-lg font-semibold">Creator Profile</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="workspace-badge border-pro-primary/35 bg-pro-primary/20">Fashion</span>
                <span className="workspace-badge">Lifestyle</span>
                <button className="workspace-badge inline-flex items-center gap-1.5">
                  <Plus size={12} />
                  Add Category
                </button>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {influencerStatsPagination.pageItems.map((stat) => (
                  <div className="workspace-card-soft p-2 text-sm" key={stat.label}>
                    <p className="text-pro-muted">{stat.label}</p>
                    <p className="mono-stat text-base">{stat.value}</p>
                  </div>
                ))}
              </div>
              <PaginationControls
                fromItem={influencerStatsPagination.fromItem}
                onPageChange={influencerStatsPagination.setPage}
                onPageSizeChange={influencerStatsPagination.setPageSize}
                page={influencerStatsPagination.page}
                pageSize={influencerStatsPagination.pageSize}
                toItem={influencerStatsPagination.toItem}
                totalItems={influencerStatsPagination.totalItems}
                totalPages={influencerStatsPagination.totalPages}
              />
              <div className="mt-3 grid gap-2">
                <button className="btn-pro-secondary h-10 px-4 py-0 text-sm">Upload Content Samples</button>
                <button className="btn-pro-secondary h-10 px-4 py-0 text-sm">Upload Media Kit</button>
              </div>
            </article>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button className="btn-pro-primary h-10 px-4 py-0 text-sm">Save All Changes</button>
          <button className="btn-pro-secondary h-10 px-4 py-0 text-sm">Cancel</button>
          <button className="text-sm text-pro-accent">Reset to Defaults</button>
        </div>
      </section>
    </div>
  );
}
