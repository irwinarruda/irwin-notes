import { LOCALES, type Locale } from "@/utils/i18n";
import type { Dictionary } from "@/utils/i18n";

export type LocaleSwitcherConfig = {
  ariaLabel: string;
  label: string;
  links: Array<{
    href: string;
    label: string;
    isActive: boolean;
  }>;
};

export function getLocaleSwitcherConfig(
  locale: Locale,
  pathname: string,
  dictionary: Dictionary,
): LocaleSwitcherConfig {
  const normalizedPathname = pathname.startsWith("/")
    ? pathname
    : `/${pathname}`;

  return {
    ariaLabel: dictionary.localeSwitcher.ariaLabel,
    label: dictionary.localeSwitcher.label,
    links: LOCALES.map((supportedLocale) => ({
      href: `/${supportedLocale}${normalizedPathname}`,
      label: dictionary.localeSwitcher.locales[supportedLocale],
      isActive: supportedLocale === locale,
    })),
  };
}
