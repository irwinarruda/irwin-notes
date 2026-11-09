import Link from "next/link";
import { cookies } from "next/headers";
import { TerminalNav, TerminalWindow } from "@/components/terminal-window";
import { getDictionary, resolveLocale } from "@/utils/i18n";
import { getLocaleSwitcherConfig } from "@/utils/get-locale-switcher";
import { getTerminalNavLinks } from "@/utils/get-terminal-nav-links";
import { getAllPosts } from "@/utils/posts";
import { THEME_COOKIE, resolveTheme } from "@/utils/theme";

type PostsScreenProps = {
  params: Promise<{ locale: string }>;
};

export default async function PostsScreen(props: PostsScreenProps) {
  const params = await props.params;
  const locale = resolveLocale(params.locale);

  const [dictionary, posts] = await Promise.all([
    getDictionary(locale),
    getAllPosts(locale),
  ]);

  const navLinks = getTerminalNavLinks(locale, dictionary);
  const localeSwitcher = getLocaleSwitcherConfig(locale, "/posts", dictionary);
  const theme = resolveTheme((await cookies()).get(THEME_COOKIE)?.value);

  return (
    <TerminalWindow
      homeHref={`/${locale}/posts`}
      nav={
        <TerminalNav
          active={`/${locale}/posts`}
          ariaLabel={dictionary.nav.ariaLabel}
          links={navLinks}
        />
      }
      skipToContentLabel={dictionary.nav.skipToContent}
      themeToggleLabels={dictionary.themeToggle}
      serverTheme={theme}
      localeSwitcher={localeSwitcher}
    >
      <div className="fade-in">
        <h1 className="font-serif text-fg text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-1">
          {dictionary.postsPage.heading}
        </h1>
        <p className="text-fg-muted text-sm sm:text-base truncate">
          {dictionary.postsPage.subtitleItems.map((item, index) => (
            <span key={item}>
              {index > 0 ? (
                <span aria-hidden="true" className="mx-1">
                  &middot;
                </span>
              ) : null}
              {item}
            </span>
          ))}
        </p>
      </div>
      <div className="border-t border-line-subtle my-6" />
      <ul className="space-y-1 mb-8">
        {posts.map((post, i) => {
          const fadeDelays = [
            "fade-in-delay-2",
            "fade-in-delay-3",
            "fade-in-delay-4",
            "fade-in-delay-5",
            "fade-in-delay-6",
          ];
          const delay = fadeDelays[Math.min(i, fadeDelays.length - 1)];
          return (
          <li
            key={post.slug}
            className={`fade-in ${delay}`}
          >
            <Link
              href={`/${locale}/post/${post.slug}`}
              className="post-entry group block rounded-r-lg pl-5 py-3.5 transition-all duration-300 hover:bg-raised focus-visible:bg-raised"
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm sm:text-base">
                <span className="text-fg-muted">{post.date}</span>
                <span className="text-fg-muted" aria-hidden="true">
                  &middot;
                </span>
                <span className="text-fg-muted">
                  {post.readTime} {dictionary.postsPage.readLabel}
                </span>
              </div>
              <h2 className="font-serif text-fg text-xl sm:text-2xl mt-1 font-bold">
                {post.title}
                {post.draft && (
                  <span className="ml-2 inline-block align-middle rounded border border-dashed border-warning-line bg-warning-soft px-1.5 py-0.5 text-xs font-mono font-normal text-warning">
                    {dictionary.postsPage.draftLabel}
                  </span>
                )}
              </h2>
              <p className="text-fg-muted text-sm sm:text-base mt-1 leading-relaxed max-w-2xl">
                {post.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {post.tags.map((tag, index) => (
                  <span key={tag} className="text-fg-muted text-sm">
                    #{tag}
                    {index < post.tags.length - 1 ? " " : ""}
                  </span>
                ))}
              </div>
            </Link>
          </li>
          );
        })}
      </ul>
    </TerminalWindow>
  );
}
