import type { Metadata } from "next";
import type { ReactNode } from "react";
import { JetBrains_Mono, Manrope, Sora } from "next/font/google";
import Script from "next/script";
import { CurrencyProvider } from "@/components/preferences/CurrencyProvider";
import { LanguageProvider } from "@/components/preferences/LanguageProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "CREATORSAGORA | AI-Powered Creator Marketplace",
  description:
    "Launch, manage, and optimize creator campaigns with AI recommendations, escrow-protected payments, and real-time analytics."
};

type RootLayoutProps = {
  children: ReactNode;
};

const sansFont = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap"
});

const displayFont = Sora({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap"
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-mono",
  display: "swap"
});

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${sansFont.variable} ${displayFont.variable} ${monoFont.variable}`}
    >
      <body>
        <Script id="creatoragora-theme-init" strategy="beforeInteractive">
          {`
            try {
              const key = "creatoragora-theme";
              const stored = localStorage.getItem(key);
              const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
              const workspacePattern = /^(\\/dashboard|\\/campaigns|\\/wallet|\\/messages|\\/analytics|\\/settings|\\/admin)(\\/|$)/;
              const isWorkspace = workspacePattern.test(window.location.pathname);
              const theme = isWorkspace
                ? (stored === "light" || stored === "dark" ? stored : (prefersLight ? "light" : "dark"))
                : "light";
              document.documentElement.setAttribute("data-theme", theme);
              document.documentElement.setAttribute("data-page", window.location.pathname === "/" ? "landing" : (isWorkspace ? "workspace" : "public"));
            } catch {}
          `}
        </Script>
        <ThemeProvider>
          <LanguageProvider>
            <CurrencyProvider>{children}</CurrencyProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
