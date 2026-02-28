import Image from "next/image";
import { TerminalNav, TerminalWindow } from "@/components/terminal-window";
import { getDictionary, resolveLocale } from "@/utils/i18n";
import { getLocaleSwitcherConfig } from "@/utils/get-locale-switcher";
import { getTerminalNavLinks } from "@/utils/get-terminal-nav-links";

type AboutScreenProps = {
  params: Promise<{ locale: string }>;
};

export default async function AboutScreen(props: AboutScreenProps) {
  const params = await props.params;
  const locale = resolveLocale(params.locale);
  const dictionary = await getDictionary(locale);
  const about = dictionary.aboutPage;
  const navLinks = getTerminalNavLinks(locale, dictionary);
  const localeSwitcher = getLocaleSwitcherConfig(locale, "/about", dictionary);

  return (
    <TerminalWindow
      title={about.windowTitle}
      skipToContentLabel={dictionary.nav.skipToContent}
      themeToggleLabels={dictionary.themeToggle}
      localeSwitcher={localeSwitcher}
    >
      <div className="mb-6 fade-in">
        <TerminalNav
          active={`/${locale}/about`}
          ariaLabel={dictionary.nav.ariaLabel}
          links={navLinks}
        />
      </div>

      <div className="border-t border-term-border my-8" />

      <div className="flex items-start gap-5 ml-2 fade-in fade-in-delay-2">
        <div className="shrink-0">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 border-term-border ring-1 ring-term-green/20">
            <Image
              src="/irwin-photo.jpg"
              alt={about.photoAlt}
              width={80}
              height={80}
              className="object-cover w-full h-full"
              priority
            />
          </div>
        </div>
        <div className="min-w-0">
          <h1 className="text-term-green text-xl sm:text-2xl font-bold leading-tight">
            {about.name}
          </h1>
          <p className="text-term-muted text-xs sm:text-sm mt-1">
            {about.role} <span aria-hidden="true">&middot;</span> {about.location}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs">
            <a
              href="https://github.com/irwinarruda"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-6 items-center text-term-blue transition-colors duration-200 hover:text-term-cyan"
            >
              github/irwinarruda
              <span className="sr-only"> {about.openInNewTabLabel}</span>
            </a>
            <a
              href="https://linkedin.com/in/irwinarruda"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-6 items-center text-term-blue transition-colors duration-200 hover:text-term-cyan"
            >
              linkedin/irwinarruda
              <span className="sr-only"> {about.openInNewTabLabel}</span>
            </a>
            <a
              href="mailto:arruda.irwin@gmail.com"
              className="inline-flex min-h-6 items-center text-term-blue transition-colors duration-200 hover:text-term-cyan"
            >
              arruda.irwin@gmail.com
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-term-border my-8" />

      <article className="terminal-prose ml-2 fade-in fade-in-delay-3">
        <h2>{about.whoamiHeading}</h2>
        <p>{about.whoamiBody}</p>
      </article>

      <div className="border-t border-term-border my-8" />

      <article className="terminal-prose ml-2 fade-in fade-in-delay-4">
        <h2>{about.stackHeading}</h2>
        <div className="space-y-3">
          <div>
            <span className="text-term-muted text-xs uppercase tracking-wider">
              {about.stackLabels.primary}
            </span>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {about.techStack.primary.map((tech) => (
                <span
                  key={tech}
                  className="text-term-cyan-strong text-xs bg-term-cyan/8 px-2 py-0.5 rounded border border-term-cyan/15"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div>
            <span className="text-term-muted text-xs uppercase tracking-wider">
              {about.stackLabels.exploring}
            </span>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {about.techStack.exploring.map((tech) => (
                <span
                  key={tech}
                  className="text-term-magenta-strong text-xs bg-term-magenta/8 px-2 py-0.5 rounded border border-term-magenta/15"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div>
            <span className="text-term-muted text-xs uppercase tracking-wider">
              {about.stackLabels.tools}
            </span>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {about.techStack.tools.map((tech) => (
                <span
                  key={tech}
                  className="text-term-amber-strong text-xs bg-term-amber/8 px-2 py-0.5 rounded border border-term-amber/15"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </article>

      <div className="border-t border-term-border my-8" />

      <div className="ml-2 fade-in fade-in-delay-5">
        <article className="terminal-prose mb-3">
          <h2>{about.projectsHeading}</h2>
        </article>
        <div className="grid gap-3 sm:grid-cols-2">
          {about.projects.map((project) => (
            <a
              key={project.name}
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-lg border border-term-border/60 bg-term-chrome/30 p-3 transition-all duration-300 hover:border-term-green/30 hover:bg-term-chrome/50 focus-visible:border-term-green/30 focus-visible:bg-term-chrome/50"
            >
              <div className="flex items-baseline justify-between gap-2 mb-1">
                <span className="text-term-bright text-xs sm:text-sm font-medium group-hover:text-term-green transition-colors duration-300">
                  {project.name}
                </span>
                <span className="text-term-cyan-strong text-xs shrink-0">
                  {project.tech}
                </span>
              </div>
              <p className="text-term-muted text-xs leading-relaxed">
                {project.description}
              </p>
              <span className="sr-only"> {about.openInNewTabLabel}</span>
            </a>
          ))}
        </div>
      </div>
    </TerminalWindow>
  );
}
