import type { SVGProps } from "react";

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

export function renderSocialIcon(platform: string) {
  if (platform === "Instagram") return <InstagramBrandIcon className="size-[15px]" />;
  if (platform === "X") return <XBrandIcon className="size-[14px]" />;
  if (platform === "TikTok") return <TikTokBrandIcon className="size-[14px]" />;
  return <YouTubeBrandIcon className="size-[15px]" />;
}
