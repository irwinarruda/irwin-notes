import { notFound } from "next/navigation";
import { getDictionary, LOCALES, resolveLocale } from "@/utils/i18n";
import {
  createOpenGraphImage,
  OPEN_GRAPH_IMAGE_SIZE,
} from "@/utils/open-graph-image";
import { getAllPosts, getPostBySlug } from "@/utils/posts";

type PostOpenGraphImageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export const size = OPEN_GRAPH_IMAGE_SIZE;
export const contentType = "image/png";

export async function generateStaticParams() {
  const entries = await Promise.all(
    LOCALES.map(async (locale) => {
      const posts = await getAllPosts(locale);
      return posts.map((post) => ({ locale, slug: post.slug }));
    }),
  );

  return entries.flat();
}

export default async function PostOpenGraphImage(
  props: PostOpenGraphImageProps,
) {
  const params = await props.params;
  const locale = resolveLocale(params.locale);
  const post = await getPostBySlug(locale, params.slug);

  if (!post) {
    notFound();
  }

  const dictionary = await getDictionary(locale);

  return createOpenGraphImage({
    title: post.title,
    details: `${post.date} · ${post.readTime} ${dictionary.postPage.readLabel}`,
  });
}
