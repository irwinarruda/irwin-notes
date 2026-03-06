export type Theme = "dark" | "light";

export const DEFAULT_THEME: Theme = "dark";
export const THEME_COOKIE = "theme";
export const THEME_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export function resolveTheme(value: string | undefined): Theme {
  return value === "dark" || value === "light" ? value : DEFAULT_THEME;
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

export function getThemeFromDocumentCookie(): Theme {
  if (typeof document === "undefined") {
    return DEFAULT_THEME;
  }

  return getThemeFromCookieString(document.cookie) ?? DEFAULT_THEME;
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
