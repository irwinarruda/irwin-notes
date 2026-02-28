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
}: {
  labels?: ThemeToggleLabels;
}) {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    () => DEFAULT_THEME,
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
      className="text-term-muted hover:text-term-bright text-[11px] tracking-wide transition-colors duration-200 cursor-pointer select-none"
      aria-label={theme === "dark" ? labels.switchToLight : labels.switchToDark}
      title={theme === "dark" ? labels.switchToLight : labels.switchToDark}
    >
      <span aria-hidden="true">{theme === "dark" ? "☀" : "☾"}</span>{" "}
      {theme === "dark" ? labels.light : labels.dark}
    </button>
  );
}
