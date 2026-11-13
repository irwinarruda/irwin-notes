import type { Metadata } from "next";
import UsageScreen from "@/screens/usage-screen";
import {
  buildAlternates,
  getDictionary,
  LOCALES,
  resolveLocale,
} from "@/utils/i18n";
import { getPastUsageYears } from "@/utils/token-usage";

type UsageYearPageProps = {
  params: Promise<{ locale: string; year: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    getPastUsageYears().map((year) => ({ locale, year: String(year) })),
  );
}

export async function generateMetadata(
  props: UsageYearPageProps,
): Promise<Metadata> {
  const params = await props.params;
  const locale = resolveLocale(params.locale);
  const dictionary = await getDictionary(locale);

  return {
    title: `${dictionary.usagePage.title} ${params.year} · ${dictionary.meta.siteTitle}`,
    alternates: buildAlternates(locale, `/usage/${params.year}`),
  };
}

export default function UsageYearPage(props: Readonly<UsageYearPageProps>) {
  return <UsageScreen params={props.params} />;
}
