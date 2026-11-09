export type Theme = "dark" | "light";
export type Palette = "barro" | "favo";

export type ThemeChoice = {
  theme?: Theme;
  palette: Palette;
};

export const DEFAULT_THEME: Theme = "dark";
export const DEFAULT_PALETTE: Palette = "barro";
export const THEME_COOKIE = "theme";
export const THEME_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;
export const SYSTEM_DARK_QUERY = "(prefers-color-scheme: dark)";

function isTheme(value: string): value is Theme {
  return value === "dark" || value === "light";
}

function isPalette(value: string): value is Palette {
  return value === "barro" || value === "favo";
}

export function resolveThemeCookie(value: string | undefined): ThemeChoice {
  const words = value?.split("-") ?? [];

  return {
    theme: words.find(isTheme),
    palette: words.find(isPalette) ?? DEFAULT_PALETTE,
  };
}

function getThemeChoiceFromCookieString(cookieString: string): ThemeChoice {
  const cookiePrefix = `${THEME_COOKIE}=`;
  const themeCookie = cookieString
    .split(";")
    .map((cookiePart) => cookiePart.trim())
    .find((cookiePart) => cookiePart.startsWith(cookiePrefix));

  return resolveThemeCookie(themeCookie?.slice(cookiePrefix.length));
}

export function getDocumentTheme(): Theme {
  if (typeof document === "undefined") {
    return DEFAULT_THEME;
  }

  const systemTheme = window.matchMedia(SYSTEM_DARK_QUERY).matches
    ? "dark"
    : "light";

  return getThemeChoiceFromCookieString(document.cookie).theme ?? systemTheme;
}

export function getDocumentPalette(): Palette {
  if (typeof document === "undefined") {
    return DEFAULT_PALETTE;
  }

  return getThemeChoiceFromCookieString(document.cookie).palette;
}

export function setThemeCookie(change: Partial<ThemeChoice>): void {
  if (typeof document === "undefined") {
    return;
  }

  const choice = {
    ...getThemeChoiceFromCookieString(document.cookie),
    ...change,
  };
  const value = choice.theme
    ? `${choice.palette}-${choice.theme}`
    : choice.palette;
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "; Secure"
      : "";

  document.cookie = `${THEME_COOKIE}=${value}; Path=/; Max-Age=${THEME_COOKIE_MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
}
