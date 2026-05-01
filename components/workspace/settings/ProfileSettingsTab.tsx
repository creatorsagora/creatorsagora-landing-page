"use client";

import { Camera, Plus } from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";
import { usePagination } from "@/hooks/usePagination";
import { useUserRole } from "@/hooks/useUserRole";
import { useAuthUser } from "@/hooks/useAuthUser";
import { PaginationControls } from "@/components/ui/PaginationControls";
import { useSettingsContext } from "@/components/workspace/settings/SettingsContext";
import { renderSocialIcon } from "@/components/workspace/settings/social-icons";
import { updateStoredUser } from "@/lib/auth-client";

function fileToSquareDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Unable to read image"));
    reader.onload = () => {
      const source = reader.result;
      if (typeof source !== "string") {
        reject(new Error("Invalid image data"));
        return;
      }

      const image = new Image();
      image.onerror = () => reject(new Error("Invalid image"));
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const size = 256;
        canvas.width = size;
        canvas.height = size;

        const context = canvas.getContext("2d");
        if (!context) {
          reject(new Error("Canvas not available"));
          return;
        }

        const sourceSize = Math.min(image.width, image.height);
        const sourceX = (image.width - sourceSize) / 2;
        const sourceY = (image.height - sourceSize) / 2;
        context.drawImage(image, sourceX, sourceY, sourceSize, sourceSize, 0, 0, size, size);
        resolve(canvas.toDataURL("image/jpeg", 0.9));
      };
      image.src = source;
    };
    reader.readAsDataURL(file);
  });
}

export function ProfileSettingsTab() {
  const { state, setState } = useSettingsContext();
  const { role, setRole, creatorBadgeStatus, hasInfluencerBadge, setInfluencerBadgeStatus } = useUserRole();
  const { user, initials } = useAuthUser();
  const avatarUrl = user?.avatarUrl?.trim() ?? "";
  const socialLinksPagination = usePagination(state.profile.socialLinks, 5);
  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const updateProfile = (patch: Partial<typeof state.profile>) =>
    setState((previous) => ({ ...previous, profile: { ...previous.profile, ...patch } }));

  const addCategory = () => {
    const options = ["Tech", "Beauty", "Gaming", "Travel", "Food"];
    const next = options.find((item) => !state.profile.categories.includes(item));
    if (!next) return;
    updateProfile({ categories: [...state.profile.categories, next] });
  };

  const onAvatarFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !user) return;

    try {
      setUploadingAvatar(true);
      const avatarDataUrl = await fileToSquareDataUrl(file);
      updateStoredUser({ ...user, avatarUrl: avatarDataUrl });
    } catch {
      // Ignore avatar upload errors in UI-only flow
    } finally {
      setUploadingAvatar(false);
    }
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[1.15fr_1fr]">
      <div className="space-y-4">
        <article className="workspace-card-soft p-4">
          <h3 className="font-display text-lg font-semibold">Profile Photo</h3>
          <p className="text-pro-muted mt-1 text-sm">This photo appears in your dashboard header and dropdown.</p>
          <div className="mt-3 flex items-center gap-3">
            <span className="grid size-14 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-[#30416d] to-[#4C3AFF] text-sm font-semibold text-white">
              {avatarUrl ? <img alt="User avatar" className="h-full w-full object-cover" src={avatarUrl} /> : initials}
            </span>
            <input
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={onAvatarFileChange}
              ref={avatarFileInputRef}
              type="file"
            />
            <button
              className="btn-pro-secondary h-10 px-4 py-0 text-sm"
              onClick={() => avatarFileInputRef.current?.click()}
              type="button"
              disabled={uploadingAvatar}
            >
              <Camera size={14} />
              {uploadingAvatar ? "Uploading..." : "Upload Photo"}
            </button>
          </div>
        </article>

        <article className="workspace-card-soft p-4">
          <h3 className="font-display text-lg font-semibold">Personal Information</h3>
          <div className="mt-3 grid gap-3">
            <input className="workspace-input" onChange={(event) => updateProfile({ fullName: event.target.value })} value={state.profile.fullName} />
            <input className="workspace-input" onChange={(event) => updateProfile({ email: event.target.value })} value={state.profile.email} />
            <input className="workspace-input" onChange={(event) => updateProfile({ phone: event.target.value })} value={state.profile.phone} />
            <textarea className="workspace-input h-20 resize-none py-3" onChange={(event) => updateProfile({ bio: event.target.value })} value={state.profile.bio} />
            <input className="workspace-input" onChange={(event) => updateProfile({ location: event.target.value })} value={state.profile.location} />
            <input className="workspace-input" onChange={(event) => updateProfile({ website: event.target.value })} value={state.profile.website} />
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
                  <span className={`grid size-8 shrink-0 place-items-center rounded-lg border bg-gradient-to-br transition duration-300 group-hover:shadow-pro-cyan ${social.iconBgClass}`}>
                    {renderSocialIcon(social.platform)}
                  </span>
                  <span className="text-pro-main truncate text-sm font-medium">{social.platform}</span>
                </span>
                <input
                  className="w-[50%] min-w-[180px] bg-transparent text-right text-sm text-[var(--input-text)] outline-none"
                  onChange={(event) =>
                    updateProfile({
                      socialLinks: state.profile.socialLinks.map((item) =>
                        item.platform === social.platform ? { ...item, handle: event.target.value } : item
                      )
                    })
                  }
                  value={social.handle}
                />
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
            {[
              { key: "visibility", label: "Profile Visibility", value: state.profile.visibility },
              { key: "showContactInfo", label: "Show Contact Info", value: state.profile.showContactInfo },
              { key: "showStatistics", label: "Show Statistics", value: state.profile.showStatistics }
            ].map((item) => (
              <button
                className="flex w-full items-center justify-between text-left"
                key={item.key}
                onClick={() =>
                  updateProfile({
                    [item.key]: !item.value
                  } as Partial<typeof state.profile>)
                }
                type="button"
              >
                <span className="text-pro-muted">{item.label}</span>
                <span className={`inline-flex h-5 w-9 rounded-full p-0.5 transition ${item.value ? "bg-pro-primary" : "bg-white/10"}`}>
                  <span className={`size-4 rounded-full bg-white transition ${item.value ? "translate-x-4" : ""}`} />
                </span>
              </button>
            ))}
          </div>
        </article>

        <article className="workspace-card-soft p-4">
          <h3 className="font-display text-lg font-semibold">Role Management</h3>
          <div className="mt-3 grid gap-2">
            <button
              className={`rounded-lg border p-3 text-left transition ${
                role === "promoter" ? "border-pro-primary/45 bg-pro-primary/20" : "border-pro-surface bg-white/[0.04]"
              }`}
              onClick={() => setRole("promoter")}
              type="button"
            >
              <p className="text-sm font-semibold">Promoter Mode</p>
              <p className="text-pro-muted text-xs">Create and manage campaigns, budgets, and approvals.</p>
            </button>
            <button
              className={`rounded-lg border p-3 text-left transition ${
                role === "creator" ? "border-pro-primary/45 bg-pro-primary/20" : "border-pro-surface bg-white/[0.04]"
              }`}
              onClick={() => setRole("creator")}
              type="button"
            >
              <p className="text-sm font-semibold">Creator Mode</p>
              <p className="text-pro-muted text-xs">Discover briefs, submit pitches, and grow your profile.</p>
            </button>
          </div>
        </article>

        <article className="workspace-card-soft p-4">
          <h3 className="font-display text-lg font-semibold">Influencer Badge</h3>
          <p className="text-pro-muted mt-2 text-sm">Influencers are creator accounts manually verified by admins.</p>
          <div className="mt-3 rounded-lg border border-pro-surface bg-white/[0.03] p-3">
            <p className="text-sm font-semibold">{hasInfluencerBadge ? "Verified Influencer" : "Verification Pending"}</p>
            <p className="text-pro-muted mt-1 text-xs">Current status: {creatorBadgeStatus}</p>
          </div>
          <div className="mt-3 grid gap-2">
            <button className="btn-pro-secondary h-10 px-4 py-0 text-sm" onClick={() => setInfluencerBadgeStatus("pending")} type="button">
              Mark Pending Review
            </button>
            <button className="btn-pro-primary h-10 px-4 py-0 text-sm" onClick={() => setInfluencerBadgeStatus("verified")} type="button">
              Mark Verified
            </button>
          </div>
        </article>

        <article className="workspace-card-soft p-4">
          <h3 className="font-display text-lg font-semibold">Creator Categories</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {state.profile.categories.map((category) => (
              <span className="workspace-badge border-pro-primary/35 bg-pro-primary/20" key={category}>
                {category}
              </span>
            ))}
            <button className="workspace-badge inline-flex items-center gap-1.5" onClick={addCategory} type="button">
              <Plus size={12} />
              Add Category
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}
