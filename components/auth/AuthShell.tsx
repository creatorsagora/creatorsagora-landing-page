import type { ReactNode } from "react";
import Image from "next/image";
import { AuthImageCarousel } from "@/components/auth/AuthImageCarousel";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  const authSlides = [
    "/authimg1.jpg",
    "/authimg2.jpg",
    "/authimg3.jpg",
    "/authimg4.jpg"
  ];

  return (
    <div className="workspace-shell p-4 md:p-6">
      <div className="workspace-card mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-3xl lg:grid-cols-[1.05fr_1fr]">
        <section className="bg-pro-panel relative hidden min-h-[620px] overflow-hidden border-r workspace-divider lg:block">
          <AuthImageCarousel className="absolute inset-0" images={authSlides} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/26 via-black/30 to-black/46" />

          <div className="absolute left-6 top-6 z-10 inline-flex">
            <Image alt="CreatorAgora logo" className="h-9 w-auto object-contain" height={133} src="/brand/logo-light-full.png" width={325} />
          </div>
        </section>

        <section className="flex items-center p-4 sm:p-8">
          <div className="mx-auto w-full max-w-md">
            <p className="section-eyebrow">Welcome to CREATORAGORA</p>
            <h2 className="mt-4 font-display text-3xl font-bold">{title}</h2>
            <p className="text-pro-muted mt-2 text-sm">{subtitle}</p>
            <div className="mt-6">{children}</div>
          </div>
        </section>
      </div>
    </div>
  );
}
