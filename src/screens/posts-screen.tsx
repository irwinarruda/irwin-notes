import Link from "next/link";
import { TerminalNav, TerminalWindow } from "@/components/terminal-window";
import { getDictionary, resolveLocale } from "@/utils/i18n";
import { getLocaleSwitcherConfig } from "@/utils/get-locale-switcher";
import { getTerminalNavLinks } from "@/utils/get-terminal-nav-links";
import { getAllPosts } from "@/utils/posts";

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

  return (
    <TerminalWindow
      title={dictionary.postsPage.windowTitle}
      skipToContentLabel={dictionary.nav.skipToContent}
      themeToggleLabels={dictionary.themeToggle}
      localeSwitcher={localeSwitcher}
    >
      <div className="mb-6 fade-in">
        <h1 className="text-term-green text-lg sm:text-xl md:text-2xl font-bold tracking-tight mb-1">
          {dictionary.postsPage.heading}
        </h1>
        <p className="text-term-muted text-xs sm:text-sm">
          {dictionary.postsPage.subtitleItems.map((item, index) => (
            <span key={item}>
              {index > 0 ? <span aria-hidden="true"> &middot;</span> : null} {item}
            </span>
          ))}
        </p>
      </div>
      <div className="mb-6 fade-in fade-in-delay-1">
        <TerminalNav
          active={`/${locale}/posts`}
          ariaLabel={dictionary.nav.ariaLabel}
          links={navLinks}
        />
      </div>
      <div className="border-t border-term-border mb-6" />
      <ul className="space-y-1 mb-8">
        {posts.map((post, i) => (
          <li key={post.slug} className={`fade-in fade-in-delay-${Math.min(i + 2, 6)}`}>
            <Link
              href={`/${locale}/post/${post.slug}`}
              className="post-entry group block rounded-r-lg pl-5 py-3.5 transition-all duration-300 hover:bg-term-chrome/50 focus-visible:bg-term-chrome/50"
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm">
                <span className="text-term-amber font-medium">{post.date}</span>
                <span className="text-term-muted" aria-hidden="true">&middot;</span>
                <span className="text-term-muted">
                  {post.readTime} {dictionary.postsPage.readLabel}
                </span>
              </div>
              <h2 className="text-term-bright text-base sm:text-lg mt-1 font-medium group-hover:text-term-green transition-colors duration-300">
                {post.title}
              </h2>
              <p className="text-term-text text-xs sm:text-sm mt-1 leading-relaxed max-w-2xl">
                {post.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="text-term-cyan-strong text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </TerminalWindow>
  );
}
