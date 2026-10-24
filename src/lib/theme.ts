import { useSyncExternalStore } from "react";

/**
 * Two appearance modes, chosen explicitly by the visitor. Light is the
 * default; the choice is remembered in localStorage and applied before first
 * paint by the boot script in __root.tsx (keep THEME_KEY in sync with it).
 */
export type Theme = "light" | "dark";

export const THEME_KEY = "rhs.theme";

const listeners = new Set<() => void>();

function current(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function setTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* storage unavailable: the choice lasts for this page view */
  }
  listeners.forEach((l) => l());
}

export function useTheme(): Theme {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    current,
    () => "light",
  );
}
