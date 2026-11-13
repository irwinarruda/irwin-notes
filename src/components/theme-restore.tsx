"use client";

import { useLayoutEffect } from "react";
import { applyThemeCookie } from "@/utils/theme";

export function ThemeRestore() {
  useLayoutEffect(() => {
    applyThemeCookie();
  }, []);

  return null;
}
