"use client";

import { useSyncExternalStore } from "react";
import {
  DEFAULT_PALETTE,
  getDocumentPalette,
  setThemeCookie,
  type Palette,
} from "@/utils/theme";

export type PalettePickerLabels = Record<Palette, string> & { label: string };

const DEFAULT_PALETTE_PICKER_LABELS: PalettePickerLabels = {
  label: "Theme",
  barro: "Barro theme",
  favo: "Favo theme",
  lila: "Lila theme",
};

const SWATCHES: Record<Palette, string> = {
  barro: "bg-swatch-barro",
  favo: "bg-swatch-favo",
  lila: "bg-swatch-lila",
};

const PALETTES = Object.keys(SWATCHES) as Palette[];

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

export function PalettePicker({
  labels = DEFAULT_PALETTE_PICKER_LABELS,
}: {
  labels?: PalettePickerLabels;
}) {
  const current = useSyncExternalStore(
    subscribeToPalette,
    getDocumentPalette,
    getServerPaletteSnapshot,
  );

  function onPaletteChoose(palette: Palette) {
    setThemeCookie({ palette });
    document.documentElement.setAttribute("data-palette", palette);

    window.dispatchEvent(new Event(PALETTE_CHANGE_EVENT));
  }

  return (
    <fieldset aria-label={labels.label} className="flex items-center">
      {PALETTES.map((palette) => (
        <button
          key={palette}
          type="button"
          onClick={() => onPaletteChoose(palette)}
          className="group inline-flex min-h-6 min-w-6 items-center justify-center rounded transition-colors duration-200 hover:bg-hover cursor-pointer focus-visible:outline-offset-1"
          aria-label={labels[palette]}
          aria-pressed={current === palette}
          title={labels[palette]}
        >
          <span
            aria-hidden="true"
            className={`size-2.5 rounded-full outline-offset-2 group-aria-pressed:outline-2 group-aria-pressed:outline-fg-muted ${SWATCHES[palette]}`}
          />
        </button>
      ))}
    </fieldset>
  );
}
