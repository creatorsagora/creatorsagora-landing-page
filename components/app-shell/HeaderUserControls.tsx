"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Bell, Camera, ChevronDown, LogOut, Settings } from "lucide-react";
import { clearAuthSession, updateStoredUser } from "@/lib/auth-client";
import { useAuthUser } from "@/hooks/useAuthUser";

export function HeaderNotificationsButton() {
  return (
    <button className="workspace-badge relative inline-flex size-9 items-center justify-center p-0" aria-label="Notifications">
      <Bell size={14} />
    </button>
  );
}

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

export function HeaderUserDropdown() {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { user, initials } = useAuthUser();
  const avatarUrl = user?.avatarUrl?.trim() ?? "";

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  const onLogout = () => {
    clearAuthSession();
    router.push("/auth/login");
    setOpen(false);
  };

  const onAvatarFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !user) return;

    try {
      setUploading(true);
      const avatarDataUrl = await fileToSquareDataUrl(file);
      updateStoredUser({ ...user, avatarUrl: avatarDataUrl });
      setOpen(false);
    } catch {
      // ignore upload errors in UI-only flow
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <input
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={onAvatarFileChange}
        ref={fileInputRef}
        type="file"
      />

      <button
        className="workspace-card-soft inline-flex h-10 items-center gap-2 rounded-full px-2.5"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <span className="grid size-7 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-[#30416d] to-[#4C3AFF] text-[11px] font-semibold text-white">
          {avatarUrl ? (
            <img alt="User avatar" className="h-full w-full object-cover" src={avatarUrl} />
          ) : (
            initials
          )}
        </span>
        <ChevronDown className={`text-pro-muted transition ${open ? "rotate-180" : ""}`} size={14} />
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-[220px] rounded-2xl border border-pro-primary/20 bg-pro-panel p-2 shadow-[0_18px_34px_rgba(12,16,24,0.14),0_0_20px_rgba(76,58,255,0.16)]">
          <button
            className="workspace-card-soft inline-flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-pro-primary/10"
            disabled={!user || uploading}
            onClick={() => fileInputRef.current?.click()}
            type="button"
          >
            <Camera size={14} className="text-pro-accent" />
            {uploading ? "Uploading..." : "Upload Photo"}
          </button>

          <Link className="workspace-card-soft mt-1 inline-flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-pro-primary/10" href="/settings/profile" onClick={() => setOpen(false)}>
            <Settings size={14} className="text-pro-accent" />
            Settings
          </Link>

          <button className="workspace-card-soft mt-1 inline-flex w-full items-center gap-2 px-3 py-2 text-sm text-[#ff8b9e] hover:bg-[#ff4d6d1f]" onClick={onLogout} type="button">
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      ) : null}
    </div>
  );
}
