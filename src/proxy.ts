import { type NextRequest, NextResponse } from "next/server";
import {
  DEFAULT_LOCALE,
  detectLocaleFromAcceptLanguage,
  getLocaleFromPathname,
  LOCALE_COOKIE,
  localizePathname,
  isLocale,
} from "@/utils/i18n";

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;
const LEGACY_REDIRECT_PATTERN = /^\/(?:about|posts|post\/[^/]+)\/?$/;

function getLocaleFromCookie(request: NextRequest) {
  const cookieValue = request.cookies.get(LOCALE_COOKIE)?.value;
  if (!cookieValue || !isLocale(cookieValue)) {
    return null;
  }

  return cookieValue;
}

function setLocaleCookie(response: NextResponse, locale: string): void {
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    sameSite: "lax",
    maxAge: ONE_YEAR_IN_SECONDS,
  });
}

function isLegacyPathname(pathname: string): boolean {
  return LEGACY_REDIRECT_PATTERN.test(pathname);
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const pathnameLocale = getLocaleFromPathname(pathname);

  if (!pathnameLocale && isLegacyPathname(pathname)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = localizePathname(DEFAULT_LOCALE, pathname);

    const response = NextResponse.redirect(redirectUrl, 308);
    setLocaleCookie(response, DEFAULT_LOCALE);
    return response;
  }

  if (pathnameLocale) {
    const cookieLocale = getLocaleFromCookie(request);
    if (cookieLocale === pathnameLocale) {
      return NextResponse.next();
    }

    const response = NextResponse.next();
    setLocaleCookie(response, pathnameLocale);
    return response;
  }

  const cookieLocale = getLocaleFromCookie(request);
  const headerLocale = detectLocaleFromAcceptLanguage(
    request.headers.get("accept-language"),
  );

  const locale = cookieLocale ?? headerLocale;
  const localizedPathname = localizePathname(locale, request.nextUrl.pathname);

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = localizedPathname;

  const response = NextResponse.redirect(redirectUrl);
  setLocaleCookie(response, locale);
  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
  ],
};
