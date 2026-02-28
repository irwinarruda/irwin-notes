"use client";

import { useSyncExternalStore } from "react";

type Theme = "dark" | "light";

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
  if (typeof document === "undefined") {
    return "dark";
  }

  return document.documentElement.getAttribute("data-theme") === "light"
    ? "light"
    : "dark";
}

function subscribeToTheme(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleThemeChange = () => {
    onStoreChange();
  };

  const handleStorage = (event: StorageEvent) => {
    if (event.key === "theme") {
      onStoreChange();
    }
  };

  window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    window.removeEventListener("storage", handleStorage);
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
    () => "dark",
  );

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);

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
