import type { Metadata } from "next";
import AboutScreen from "@/screens/about-screen";
import { buildLanguageAlternates, resolveLocale } from "@/utils/i18n";

type AboutPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(
  props: AboutPageProps,
): Promise<Metadata> {
  const params = await props.params;
  resolveLocale(params.locale);

  return {
    alternates: {
      languages: buildLanguageAlternates("/about"),
    },
  };
}

export default function AboutPage(props: Readonly<AboutPageProps>) {
  return <AboutScreen params={props.params} />;
}
