import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RootLayoutScreen from "@/layout/root-layout";
import { isLocale, LOCALES, getDictionary } from "@/utils/i18n";
import { SITE_URL } from "@/utils/site";
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
    metadataBase: new URL(SITE_URL),
    title: dictionary.meta.siteTitle,
    description: dictionary.meta.siteDescription,
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "32x32" },
        { url: "/brand/icon-ia.svg", type: "image/svg+xml" },
      ],
      shortcut: "/favicon.ico",
      apple: "/brand/icon-ia-180.png",
    },
    openGraph: {
      title: dictionary.meta.siteTitle,
      description: dictionary.meta.siteDescription,
      url: "./",
      siteName: dictionary.meta.siteTitle,
      type: "website",
    },
  };
}

export default async function LocaleLayout(props: Readonly<LocaleLayoutProps>) {
  const params = await props.params;
  if (!isLocale(params.locale)) {
    notFound();
  }

  return (
    <RootLayoutScreen locale={params.locale}>{props.children}</RootLayoutScreen>
  );
}
