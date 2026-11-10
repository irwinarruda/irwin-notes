import type { Metadata } from "next";
import BlogPostScreen from "@/screens/blog-post-screen";
import {
  buildAlternates,
  getDictionary,
  LOCALES,
  resolveLocale,
} from "@/utils/i18n";
import { getAllPosts, getPostBySlug, getPostLocales } from "@/utils/posts";

type BlogPostPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const entries = await Promise.all(
    LOCALES.map(async (locale) => {
      const posts = await getAllPosts(locale);
      return posts.map((post) => ({ locale, slug: post.slug }));
    }),
  );

  return entries.flat();
}

export async function generateMetadata(
  props: BlogPostPageProps,
): Promise<Metadata> {
  const params = await props.params;
  const locale = resolveLocale(params.locale);
  const post = await getPostBySlug(locale, params.slug);

  if (!post) {
    return {};
  }

  const dictionary = await getDictionary(locale);

  const titleSuffix = post.draft ? ` (${dictionary.postPage.draftLabel})` : "";

  const title = `${post.title}${titleSuffix}`;
  const description = `${post.description}${post.tags.length > 0 ? ` ${post.tags.map((tag) => `#${tag}`).join(" ")}` : ""}`;
  const alternates = buildAlternates(
    locale,
    `/post/${post.slug}`,
    await getPostLocales(post.slug),
  );

  return {
    title: `${title} · ${dictionary.meta.siteTitle}`,
    description,
    keywords: post.tags,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      siteName: dictionary.meta.siteTitle,
      type: "article",
    },
    alternates,
  };
}

export default function BlogPostPage(props: Readonly<BlogPostPageProps>) {
  return <BlogPostScreen params={props.params} />;
}
