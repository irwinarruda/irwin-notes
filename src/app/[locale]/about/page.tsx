import type { Metadata } from "next";
import AboutScreen from "@/screens/about-screen";
import {
  buildLanguageAlternates,
  getDictionary,
  resolveLocale,
} from "@/utils/i18n";

type AboutPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(
  props: AboutPageProps,
): Promise<Metadata> {
  const params = await props.params;
  const locale = resolveLocale(params.locale);
  const dictionary = await getDictionary(locale);
  const siteUrl = "https://www.irwinarruda.com";

  return {
    openGraph: {
      title: dictionary.meta.siteTitle,
      description: dictionary.meta.siteDescription,
      url: `${siteUrl}/${locale}/about`,
      siteName: dictionary.meta.siteTitle,
      images: [
        {
          url: `${siteUrl}/irwin-notes.png`,
          alt: dictionary.meta.siteTitle,
        },
      ],
      type: "website",
    },
    alternates: {
      languages: buildLanguageAlternates("/about"),
    },
  };
}

export default function AboutPage(props: Readonly<AboutPageProps>) {
  return <AboutScreen params={props.params} />;
}
