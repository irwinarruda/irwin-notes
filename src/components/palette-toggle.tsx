"use client";

import { useSyncExternalStore } from "react";
import {
  DEFAULT_PALETTE,
  getDocumentPalette,
  setThemeCookie,
  type Palette,
} from "@/utils/theme";

export type PaletteToggleLabels = {
  switchToBarro: string;
  switchToFavo: string;
};

const DEFAULT_PALETTE_TOGGLE_LABELS: PaletteToggleLabels = {
  switchToBarro: "Switch to the Barro palette",
  switchToFavo: "Switch to the Favo palette",
};

const PALETTE_CHANGE_EVENT = "palettechange";

function getServerPaletteSnapshot(): Palette {
  return DEFAULT_PALETTE;
}

function subscribeToPalette(onStoreChange: () => void): () => void {
  window.addEventListener(PALETTE_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener(PALETTE_CHANGE_EVENT, onStoreChange);
  };
}

export function PaletteToggle({
  labels = DEFAULT_PALETTE_TOGGLE_LABELS,
}: {
  labels?: PaletteToggleLabels;
}) {
  const palette = useSyncExternalStore(
    subscribeToPalette,
    getDocumentPalette,
    getServerPaletteSnapshot,
  );
  const next = palette === "favo" ? "barro" : "favo";
  const label = next === "favo" ? labels.switchToFavo : labels.switchToBarro;

  function onPaletteToggle() {
    setThemeCookie({ palette: next });
    document.documentElement.setAttribute("data-palette", next);

    window.dispatchEvent(new Event(PALETTE_CHANGE_EVENT));
  }

  return (
    <button
      type="button"
      onClick={onPaletteToggle}
      className="inline-flex min-h-6 min-w-6 items-center rounded px-1.5 text-xs text-fg-muted tracking-wide transition-colors duration-200 hover:text-fg cursor-pointer select-none focus-visible:outline-offset-1"
      aria-label={label}
      title={label}
    >
      <span className="inline-flex items-center gap-1.5 favo:hidden">
        <span
          aria-hidden="true"
          className="size-1.5 rounded-full bg-swatch-favo"
        />
        favo
      </span>
      <span className="hidden items-center gap-1.5 favo:inline-flex">
        <span
          aria-hidden="true"
          className="size-1.5 rounded-full bg-swatch-barro"
        />
        barro
      </span>
    </button>
  );
}
