import { notFound } from "next/navigation";
import { TerminalNav, TerminalWindow } from "@/components/terminal-window";
import { getDictionary, resolveLocale } from "@/utils/i18n";
import { getLocaleSwitcherConfig } from "@/utils/get-locale-switcher";
import { getTerminalNavLinks } from "@/utils/get-terminal-nav-links";
import { getPostBySlug, getPostComponent } from "@/utils/posts";

type BlogPostScreenProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function BlogPostScreen(props: BlogPostScreenProps) {
  const params = await props.params;
  const locale = resolveLocale(params.locale);
  const post = await getPostBySlug(locale, params.slug);

  if (!post) {
    notFound();
  }

  const [dictionary, PostContent] = await Promise.all([
    getDictionary(locale),
    getPostComponent(post),
  ]);

  const navLinks = getTerminalNavLinks(locale, dictionary);
  const localeSwitcher = getLocaleSwitcherConfig(
    locale,
    `/post/${post.slug}`,
    dictionary,
  );

  return (
    <TerminalWindow
      title={`${dictionary.postPage.windowTitlePrefix}${post.slug}`}
      skipToContentLabel={dictionary.nav.skipToContent}
      themeToggleLabels={dictionary.themeToggle}
      localeSwitcher={localeSwitcher}
    >
      <div className="mb-6 fade-in fade-in-delay-1">
        <TerminalNav
          active={`/${locale}/posts`}
          ariaLabel={dictionary.nav.ariaLabel}
          links={navLinks}
        />
      </div>

      <div className="mb-6 border-t border-term-border" />

      <header className="mb-6 fade-in fade-in-delay-2">
        <div className="ml-2 mt-4">
          <h1 className="mb-3 text-xl font-bold leading-tight text-term-green sm:text-2xl md:text-3xl">
            {post.title}
          </h1>

          <div className="mb-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-term-muted sm:text-sm">
            <span className="text-term-amber">{post.date}</span>
            <span aria-hidden="true">&middot;</span>
            <span>
              {post.readTime} {dictionary.postPage.readLabel}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="text-[11px] text-term-cyan sm:text-xs">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className="mb-6 border-t border-term-border" />

      <article className="terminal-prose mb-8 ml-2 fade-in fade-in-delay-3">
        <PostContent />
      </article>
    </TerminalWindow>
  );
}
