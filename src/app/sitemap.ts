import type { MetadataRoute } from "next";
import { buildAlternates, LOCALES } from "@/utils/i18n";
import { getAllPosts, getPostLocales } from "@/utils/posts";
import { getPastUsageYears } from "@/utils/token-usage";

const PAGE_PATHNAMES = [
  "/posts",
  "/about",
  "/usage",
  ...getPastUsageYears().map((year) => `/usage/${year}`),
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = LOCALES.flatMap((locale) =>
    PAGE_PATHNAMES.map((pathname) => {
      const alternates = buildAlternates(locale, pathname);

      return {
        url: alternates.canonical,
        alternates: { languages: alternates.languages },
      };
    }),
  );

  const localePosts = await Promise.all(
    LOCALES.map((locale) => getAllPosts(locale)),
  );
  const publishedPosts = localePosts
    .flat()
    .filter((post) => !post.draft && post.contentLocale === post.locale);
  const posts = await Promise.all(
    publishedPosts.map(async (post) => {
      const alternates = buildAlternates(
        post.locale,
        `/post/${post.slug}`,
        await getPostLocales(post.slug),
      );

      return {
        url: alternates.canonical,
        lastModified: post.date,
        alternates: { languages: alternates.languages },
      };
    }),
  );

  return [...pages, ...posts];
}
