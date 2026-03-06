import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import RootLayoutScreen from "@/layout/root-layout";
import {
  buildLanguageAlternates,
  isLocale,
  LOCALES,
  getDictionary,
} from "@/utils/i18n";
import { THEME_COOKIE, resolveTheme } from "@/utils/theme";
import "@/styles/globals.css";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const dynamicParams = false;

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
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
    },
    alternates: {
      languages: buildLanguageAlternates(""),
    },
  };
}

export default async function LocaleLayout(props: Readonly<LocaleLayoutProps>) {
  const params = await props.params;
  if (!isLocale(params.locale)) {
    notFound();
  }

  const cookieStore = await cookies();
  const theme = resolveTheme(cookieStore.get(THEME_COOKIE)?.value);

  return (
    <RootLayoutScreen locale={params.locale} theme={theme}>
      {props.children}
    </RootLayoutScreen>
  );
}
