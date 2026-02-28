import "server-only";

import { notFound } from "next/navigation";
import enDictionary from "@/content/texts/en.json";
import ptBrDictionary from "@/content/texts/pt-BR.json";

export const LOCALES = ["en", "pt-BR"] as const;
export type Locale = (typeof LOCALES)[number];
export type Dictionary = typeof enDictionary;

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "locale";

const LOCALE_SET = new Set<string>(LOCALES);

const DICTIONARIES = {
  en: enDictionary,
  "pt-BR": ptBrDictionary,
} satisfies Record<Locale, Dictionary>;

export function isLocale(value: string): value is Locale {
  return LOCALE_SET.has(value);
}

export function resolveLocale(localeParam: string): Locale {
  if (!isLocale(localeParam)) {
    notFound();
  }

  return localeParam;
}

export function getLocaleFromPathname(pathname: string): Locale | null {
  const [, segment] = pathname.split("/");

  if (!segment) {
    return null;
  }

  return isLocale(segment) ? segment : null;
}

export function localizePathname(locale: Locale, pathname: string): string {
  const normalizedPathname = pathname.startsWith("/")
    ? pathname
    : `/${pathname}`;

  if (normalizedPathname === "/") {
    return `/${locale}`;
  }

  return `/${locale}${normalizedPathname}`;
}

export function detectLocaleFromAcceptLanguage(
  headerValue: string | null,
): Locale {
  if (!headerValue) {
    return DEFAULT_LOCALE;
  }

  const loweredLocales = LOCALES.map((locale) => locale.toLowerCase());

  const candidates = headerValue
    .split(",")
    .map((entry) => entry.trim().split(";")[0]?.toLowerCase())
    .filter((entry): entry is string => Boolean(entry));

  for (const candidate of candidates) {
    const exactIndex = loweredLocales.indexOf(candidate);
    if (exactIndex !== -1) {
      return LOCALES[exactIndex];
    }

    const baseLanguage = candidate.split("-")[0];
    const baseIndex = loweredLocales.findIndex(
      (supportedLocale) =>
        supportedLocale === baseLanguage ||
        supportedLocale.startsWith(`${baseLanguage}-`),
    );

    if (baseIndex !== -1) {
      return LOCALES[baseIndex];
    }
  }

  return DEFAULT_LOCALE;
}

export function buildLanguageAlternates(pathname: string): Record<string, string> {
  const normalizedPathname = pathname.startsWith("/")
    ? pathname
    : `/${pathname}`;

  return Object.fromEntries(
    LOCALES.map((locale) => [
      locale,
      normalizedPathname === "/"
        ? `/${locale}`
        : `/${locale}${normalizedPathname}`,
    ]),
  );
}

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return DICTIONARIES[locale];
}
