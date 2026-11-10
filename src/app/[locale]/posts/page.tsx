import type { Metadata } from "next";
import PostsScreen from "@/screens/posts-screen";
import { buildAlternates, resolveLocale } from "@/utils/i18n";

type PostsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(
  props: PostsPageProps,
): Promise<Metadata> {
  const params = await props.params;
  const locale = resolveLocale(params.locale);

  return { alternates: buildAlternates(locale, "/posts") };
}

export default function PostsPage(props: Readonly<PostsPageProps>) {
  return <PostsScreen params={props.params} />;
}
