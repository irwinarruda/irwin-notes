"use client";

import { useSyncExternalStore } from "react";
import {
  DEFAULT_THEME,
  getThemeFromDocumentCookie,
  setThemeCookie,
  type Theme,
} from "@/utils/theme";

export type ThemeToggleLabels = {
  light: string;
  dark: string;
  switchToLight: string;
  switchToDark: string;
};

const DEFAULT_THEME_TOGGLE_LABELS: ThemeToggleLabels = {
  light: "light",
  dark: "dark",
  switchToLight: "Switch to light mode",
  switchToDark: "Switch to dark mode",
};

const THEME_CHANGE_EVENT = "themechange";

function getThemeSnapshot(): Theme {
  return getThemeFromDocumentCookie();
}

function subscribeToTheme(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleThemeChange = () => {
    onStoreChange();
  };

  window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);

  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
  };
}

export function ThemeToggle({
  labels = DEFAULT_THEME_TOGGLE_LABELS,
  serverTheme = DEFAULT_THEME,
}: {
  labels?: ThemeToggleLabels;
  serverTheme?: Theme;
}) {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    () => serverTheme,
  );

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";

    setThemeCookie(next);
    document.documentElement.setAttribute("data-theme", next);

    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex min-h-6 min-w-6 items-center gap-1 rounded px-1.5 text-xs text-term-muted tracking-wide transition-colors duration-200 hover:text-term-bright cursor-pointer select-none focus-visible:outline-offset-1"
      aria-label={theme === "dark" ? labels.switchToLight : labels.switchToDark}
      aria-pressed={theme === "light"}
      title={theme === "dark" ? labels.switchToLight : labels.switchToDark}
    >
      <span aria-hidden="true">{theme === "dark" ? "☀" : "☾"}</span>
      {theme === "dark" ? labels.light : labels.dark}
    </button>
  );
}
