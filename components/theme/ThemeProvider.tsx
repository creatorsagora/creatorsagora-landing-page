"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

type Theme = "dark" | "light";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  canToggleTheme: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const THEME_STORAGE_KEY = "creatoragora-theme";
const WORKSPACE_ROUTE_PATTERN = /^(\/dashboard|\/campaigns|\/wallet|\/messages|\/analytics|\/settings|\/admin)(\/|$)/;

function resolveStoredTheme(): Theme {
  if (typeof window === "undefined") return "dark";

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "dark" || stored === "light") return stored;

  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  return prefersLight ? "light" : "dark";
}

function isWorkspacePath(pathname: string | null) {
  return pathname ? WORKSPACE_ROUTE_PATTERN.test(pathname) : false;
}

function getPageScope(pathname: string | null) {
  if (pathname === "/") return "landing";
  if (isWorkspacePath(pathname)) return "workspace";
  return "public";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [userTheme, setUserThemeState] = useState<Theme>("dark");
  const canToggleTheme = isWorkspacePath(pathname);
  const theme = canToggleTheme ? userTheme : "light";

  useEffect(() => {
    const nextTheme = resolveStoredTheme();
    setUserThemeState(nextTheme);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-page", getPageScope(pathname));
    if (canToggleTheme) {
      window.localStorage.setItem(THEME_STORAGE_KEY, userTheme);
    }
  }, [canToggleTheme, pathname, theme, userTheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      toggleTheme: () => setUserThemeState((prev) => (prev === "dark" ? "light" : "dark")),
      setTheme: (nextTheme: Theme) => setUserThemeState(nextTheme),
      canToggleTheme
    }),
    [canToggleTheme, theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
