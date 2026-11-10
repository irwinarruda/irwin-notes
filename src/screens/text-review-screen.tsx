import { notFound } from "next/navigation";
import { TerminalWindow } from "@/components/terminal-window";
import { getDictionary, resolveLocale } from "@/utils/i18n";
import { getReviewData, getRawPostContent } from "@/utils/reviews";
import { TextReviewClient } from "@/components/text-review-client";

type TextReviewScreenProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function TextReviewScreen(
  props: TextReviewScreenProps,
) {
  const params = await props.params;
  const locale = resolveLocale(params.locale);

  const reviewData = await getReviewData(locale, params.slug);
  if (!reviewData) {
    notFound();
  }

  const rawContent = await getRawPostContent(locale, reviewData.name);
  if (!rawContent) {
    notFound();
  }

  const dictionary = await getDictionary(locale);

  return (
    <TerminalWindow
      homeHref={`/${locale}/posts`}
      skipToContentLabel={dictionary.nav.skipToContent}
      themeToggleLabels={dictionary.themeToggle}
      paletteToggleLabels={dictionary.paletteToggle}
    >
      <TextReviewClient
        initialContent={rawContent}
        notes={reviewData.notes}
        suggestions={reviewData.suggestions}
        fileName={reviewData.name}
        texts={dictionary.reviewPage}
      />
    </TerminalWindow>
  );
}
