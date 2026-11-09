import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { TerminalNav, TerminalWindow } from "@/components/terminal-window";
import { getDictionary, resolveLocale } from "@/utils/i18n";
import { getLocaleSwitcherConfig } from "@/utils/get-locale-switcher";
import { getTerminalNavLinks } from "@/utils/get-terminal-nav-links";
import { getPostBySlug, getPostComponent } from "@/utils/posts";
import { THEME_COOKIE, resolveTheme } from "@/utils/theme";

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
      <header className="mb-6 fade-in fade-in-delay-1">
        <div className="ml-2">
          <h1 className="mb-3 font-serif text-3xl font-bold leading-tight text-fg sm:text-4xl">
            {post.title}
          </h1>

          <div className="mb-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-fg-muted sm:text-base">
            <span>{post.date}</span>
            <span aria-hidden="true">&middot;</span>
            <span>
              {post.readTime} {dictionary.postPage.readLabel}
            </span>
            {post.draft && (
              <>
                <span aria-hidden="true">&middot;</span>
                <span className="rounded border border-dashed border-warning-line bg-warning-soft px-1.5 py-0.5 text-xs font-mono text-warning">
                  {dictionary.postPage.draftLabel}
                </span>
              </>
            )}
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span key={tag} className="text-fg-muted text-sm">
                #{tag}
                {index < post.tags.length - 1 ? " " : ""}
              </span>
            ))}
          </div>
        </div>
      </header>

      {post.draft && (
        <div className="mx-2 mb-6 rounded-lg border border-dashed border-warning-line bg-warning-soft px-4 py-3 fade-in fade-in-delay-2">
          <p className="font-mono text-sm text-warning">
            {dictionary.postPage.draftNotice}
          </p>
        </div>
      )}

      <div className="mb-6 border-t border-line-subtle" />

      <article className="terminal-prose mb-8 ml-2 fade-in fade-in-delay-3">
        <PostContent />
      </article>

      {post.references.length > 0 && (
        <footer className="ml-2 mb-8 fade-in fade-in-delay-4">
          <div className="border-t border-line-subtle mb-6" />
          <h2 className="text-xl font-bold text-fg mb-4 font-serif">
            {dictionary.postPage.referencesHeading}
          </h2>
          <ol className="space-y-3 list-decimal list-inside">
            {post.references.map((ref) => (
              <li key={ref.url} className="text-fg-muted text-base">
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg transition-colors duration-200"
                >
                  {ref.label}
                </a>
              </li>
            ))}
          </ol>
        </footer>
      )}
    </TerminalWindow>
  );
}
