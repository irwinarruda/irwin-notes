import type { Metadata } from "next";
import UsageScreen from "@/screens/usage-screen";
import { buildAlternates, getDictionary, resolveLocale } from "@/utils/i18n";

type UsagePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(
  props: UsagePageProps,
): Promise<Metadata> {
  const params = await props.params;
  const locale = resolveLocale(params.locale);
  const dictionary = await getDictionary(locale);

  return {
    title: `${dictionary.usagePage.title} · ${dictionary.meta.siteTitle}`,
    alternates: buildAlternates(locale, "/usage"),
  };
}

export default function UsagePage(props: Readonly<UsagePageProps>) {
  return <UsageScreen params={props.params} />;
}
