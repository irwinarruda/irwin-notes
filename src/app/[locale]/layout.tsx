import type { Metadata } from "next";
import LocaleLayoutScreen from "@/layout/locale-layout";
import {
  buildLanguageAlternates,
  isLocale,
  LOCALES,
  getDictionary,
} from "@/utils/i18n";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata(
  props: LocaleLayoutProps,
): Promise<Metadata> {
  const params = await props.params;
  if (!isLocale(params.locale)) {
    return {};
  }

  const dictionary = await getDictionary(params.locale);

  return {
    title: dictionary.meta.siteTitle,
    description: dictionary.meta.siteDescription,
    alternates: {
      languages: buildLanguageAlternates(""),
    },
  };
}

export default function LocaleLayout(props: Readonly<LocaleLayoutProps>) {
  return (
    <LocaleLayoutScreen params={props.params}>
      {props.children}
    </LocaleLayoutScreen>
  );
}
