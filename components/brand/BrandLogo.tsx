"use client";

import Image from "next/image";
import { useTheme } from "@/components/theme/ThemeProvider";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  compact?: boolean;
  className?: string;
  priority?: boolean;
};

const THEME_LOGO_MAP = {
  dark: {
    full: "/brand/logo-dark-full.png",
    compact: "/brand/logo-dark-compact.png"
  },
  light: {
    full: "/brand/logo-light-full.png",
    compact: "/brand/logo-light-compact.png"
  }
} as const;

export function BrandLogo({ compact = false, className, priority = false }: BrandLogoProps) {
  const { theme } = useTheme();
  const src = compact ? THEME_LOGO_MAP[theme].compact : THEME_LOGO_MAP[theme].full;
  const dimensions = compact
    ? { width: 115, height: 121 }
    : { width: 325, height: 133 };

  return (
    <Image
      alt={compact ? "CreatorAgora mark" : "CreatorAgora logo"}
      className={cn(
        "object-contain",
        compact ? "h-8 w-8" : "h-10 w-auto max-w-[180px]",
        className
      )}
      height={dimensions.height}
      priority={priority}
      src={src}
      width={dimensions.width}
    />
  );
}
