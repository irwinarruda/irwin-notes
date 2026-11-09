export type Theme = "dark" | "light";

export const DEFAULT_THEME: Theme = "dark";
export const THEME_COOKIE = "theme";
export const THEME_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;
export const SYSTEM_DARK_QUERY = "(prefers-color-scheme: dark)";

export function resolveTheme(value: string | undefined): Theme | undefined {
  return value === "dark" || value === "light" ? value : undefined;
}

export function getThemeFromCookieString(cookieString: string): Theme | null {
  const cookiePrefix = `${THEME_COOKIE}=`;
  const themeCookie = cookieString
    .split(";")
    .map((cookiePart) => cookiePart.trim())
    .find((cookiePart) => cookiePart.startsWith(cookiePrefix));

  if (!themeCookie) {
    return null;
  }

  const theme = themeCookie.slice(cookiePrefix.length);
  if (theme !== "dark" && theme !== "light") {
    return null;
  }

  return theme;
}

export function getDocumentTheme(): Theme {
  if (typeof document === "undefined") {
    return DEFAULT_THEME;
  }

  const systemTheme = window.matchMedia(SYSTEM_DARK_QUERY).matches
    ? "dark"
    : "light";

  return getThemeFromCookieString(document.cookie) ?? systemTheme;
}

export function setThemeCookie(theme: Theme): void {
  if (typeof document === "undefined") {
    return;
  }

  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "; Secure"
      : "";

  document.cookie = `${THEME_COOKIE}=${theme}; Path=/; Max-Age=${THEME_COOKIE_MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
}
