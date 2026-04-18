"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";

type ThemeToggleProps = {
  compact?: boolean;
  className?: string;
};

export function ThemeToggle({ compact, className }: ThemeToggleProps) {
  const { canToggleTheme, theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  if (!canToggleTheme) return null;

  return (
    <button
      className={`btn-pro-secondary inline-flex items-center ${compact ? "size-10 justify-center p-0" : "h-10 gap-1.5 px-3 py-0 text-sm"} ${className ?? ""}`}
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      type="button"
    >
      {isDark ? <Sun size={15} /> : <Moon size={15} />}
      {!compact ? <span>{isDark ? "Light" : "Dark"}</span> : null}
    </button>
  );
}
