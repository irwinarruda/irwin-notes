import type { Metadata } from "next";
import PostsScreen from "@/screens/posts-screen";
import {
  buildLanguageAlternates,
  getDictionary,
  resolveLocale,
} from "@/utils/i18n";

type PostsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(
  props: PostsPageProps,
): Promise<Metadata> {
  const params = await props.params;
  const locale = resolveLocale(params.locale);
  const dictionary = await getDictionary(locale);
  const siteUrl = "https://www.irwinarruda.com";

  return {
    openGraph: {
      title: dictionary.meta.siteTitle,
      description: dictionary.meta.siteDescription,
      url: `${siteUrl}/${locale}/posts`,
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
      languages: buildLanguageAlternates("/posts"),
    },
  };
}

export default function PostsPage(props: Readonly<PostsPageProps>) {
  return <PostsScreen params={props.params} />;
}
