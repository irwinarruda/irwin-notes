import type { Dictionary, Locale } from "@/utils/i18n";

export function getTerminalNavLinks(locale: Locale, dictionary: Dictionary) {
  return [
    {
      href: `/${locale}/posts`,
      label: dictionary.nav.posts,
    },
    {
      href: `/${locale}/about`,
      label: dictionary.nav.about,
    },
  ];
}
