import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { TerminalWindow } from "@/components/terminal-window";
import { getDictionary, resolveLocale } from "@/utils/i18n";
import { THEME_COOKIE, resolveTheme } from "@/utils/theme";
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

  const rawContent = await getRawPostContent(reviewData.name);
  if (!rawContent) {
    notFound();
  }

  const dictionary = await getDictionary(locale);
  const theme = resolveTheme((await cookies()).get(THEME_COOKIE)?.value);

  return (
    <TerminalWindow
      title={`irwin@notes: ~/review/${params.slug}`}
      skipToContentLabel={dictionary.nav.skipToContent}
      themeToggleLabels={dictionary.themeToggle}
      serverTheme={theme}
    >
      <TextReviewClient
        initialContent={rawContent}
        notes={reviewData.notes}
        suggestions={reviewData.suggestions}
        fileName={reviewData.name}
      />
    </TerminalWindow>
  );
}
