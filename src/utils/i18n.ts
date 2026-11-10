import "server-only";

import { notFound } from "next/navigation";
import enDictionary from "@/content/texts/en.json";
import ptBrDictionary from "@/content/texts/pt-BR.json";
import { SITE_URL } from "@/utils/site";

export const LOCALES = ["en", "pt-BR"] as const;
export type Locale = (typeof LOCALES)[number];
export type Dictionary = typeof enDictionary;

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "locale";

const LOCALE_SET = new Set<string>(LOCALES);

type LocaleCandidate = {
  value: string;
  quality: number;
  order: number;
};

function parseAcceptLanguage(headerValue: string): string[] {
  return headerValue
    .split(",")
    .map((entry, order) => {
      const [rawValue, ...rawParams] = entry.trim().split(";");
      const value = rawValue?.toLowerCase();
      if (!value) {
        return null;
      }

      let quality = 1;
      for (const rawParam of rawParams) {
        const [key, rawQuality] = rawParam.trim().split("=");
        if (key !== "q" || !rawQuality) {
          continue;
        }

        const parsedQuality = Number.parseFloat(rawQuality);
        if (!Number.isNaN(parsedQuality)) {
          quality = Math.max(0, Math.min(parsedQuality, 1));
        }
      }

      return {
        value,
        quality,
        order,
      } satisfies LocaleCandidate;
    })
    .filter(
      (candidate): candidate is LocaleCandidate =>
        candidate !== null && candidate.quality > 0,
    )
    .sort((a, b) => {
      if (a.quality !== b.quality) {
        return b.quality - a.quality;
      }

      return a.order - b.order;
    })
    .map((candidate) => candidate.value);
}

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
  const candidates = parseAcceptLanguage(headerValue);

  for (const candidate of candidates) {
    if (candidate === "*") {
      return DEFAULT_LOCALE;
    }

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

export function buildAlternates(
  locale: Locale,
  pathname: string,
  contentLocales: readonly Locale[] = LOCALES,
) {
  const fallbackLocale = contentLocales.includes(DEFAULT_LOCALE)
    ? DEFAULT_LOCALE
    : contentLocales[0];
  const canonicalLocale = contentLocales.includes(locale)
    ? locale
    : fallbackLocale;

  return {
    canonical: `${SITE_URL}${localizePathname(canonicalLocale, pathname)}`,
    languages: {
      ...Object.fromEntries(
        contentLocales.map((contentLocale) => [
          contentLocale,
          `${SITE_URL}${localizePathname(contentLocale, pathname)}`,
        ]),
      ),
      "x-default": `${SITE_URL}${localizePathname(fallbackLocale, pathname)}`,
    },
  };
}

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return DICTIONARIES[locale];
}
