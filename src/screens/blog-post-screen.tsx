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
          <h1 className="mb-3 text-2xl font-bold leading-tight text-term-green sm:text-3xl md:text-4xl">
            {post.title}
          </h1>

          <div className="mb-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-term-muted sm:text-base">
            <span className="text-term-amber">{post.date}</span>
            <span aria-hidden="true">&middot;</span>
            <span>
              {post.readTime} {dictionary.postPage.readLabel}
            </span>
            {post.draft && (
              <>
                <span aria-hidden="true">&middot;</span>
                <span className="rounded border border-dashed border-term-amber/50 bg-term-amber/8 px-1.5 py-0.5 text-xs font-mono text-term-amber">
                  {dictionary.postPage.draftLabel}
                </span>
              </>
            )}
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="text-term-cyan-strong text-sm">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </header>

      {post.draft && (
        <div className="mx-2 mb-6 rounded-lg border border-dashed border-term-amber/30 bg-term-amber/5 px-4 py-3 fade-in fade-in-delay-2">
          <p className="font-mono text-sm text-term-amber">
            {dictionary.postPage.draftNotice}
          </p>
        </div>
      )}

      <div className="mb-6 border-t border-term-border" />

      <article className="terminal-prose mb-8 ml-2 fade-in fade-in-delay-3">
        <PostContent />
      </article>

      {post.references.length > 0 && (
        <footer className="ml-2 mb-8 fade-in fade-in-delay-4">
          <div className="border-t border-term-border mb-6" />
          <h2 className="text-xl font-semibold text-term-muted mb-4 font-mono">
            {dictionary.postPage.referencesHeading}
          </h2>
          <ol className="space-y-3 list-decimal list-inside">
            {post.references.map((ref) => (
              <li key={ref.url} className="text-term-muted text-base">
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-term-blue underline underline-offset-2 hover:text-term-cyan transition-colors duration-200"
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
