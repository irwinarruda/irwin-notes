import type { Metadata } from "next";
import TextReviewScreen from "@/screens/text-review-screen";
import { LOCALES, resolveLocale, getDictionary } from "@/utils/i18n";
import { getAllReviewSlugs } from "@/utils/reviews";

type ReviewPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const entries = await Promise.all(
    LOCALES.map(async (locale) => {
      const slugs = await getAllReviewSlugs(locale);
      return slugs.map((slug) => ({ locale, slug }));
    }),
  );
  return entries.flat();
}

export async function generateMetadata(
  props: ReviewPageProps,
): Promise<Metadata> {
  const params = await props.params;
  const locale = resolveLocale(params.locale);
  const dictionary = await getDictionary(locale);

  return {
    title: `Review: ${params.slug} | ${dictionary.meta.siteTitle}`,
    robots: { index: false, follow: false },
  };
}

export default function ReviewPage(props: Readonly<ReviewPageProps>) {
  return <TextReviewScreen params={props.params} />;
}
