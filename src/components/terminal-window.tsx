import Link from "next/link";
import type { Theme } from "@/utils/theme";
import { ThemeToggle, type ThemeToggleLabels } from "./theme-toggle";

export type TerminalNavLink = {
  href: string;
  label: string;
};

export type TerminalLocaleSwitcherLink = {
  href: string;
  label: string;
  isActive: boolean;
};

export type TerminalLocaleSwitcher = {
  ariaLabel: string;
  label: string;
  links: TerminalLocaleSwitcherLink[];
};

const DEFAULT_SKIP_TO_CONTENT_LABEL = "Skip to content";

const DEFAULT_THEME_TOGGLE_LABELS: ThemeToggleLabels = {
  light: "light",
  dark: "dark",
  switchToLight: "Switch to light mode",
  switchToDark: "Switch to dark mode",
};

const DEFAULT_TERMINAL_NAV_LINKS: TerminalNavLink[] = [
  { href: "/posts", label: "posts/" },
  { href: "/about", label: "about.md" },
];

export function TerminalWindow({
  children,
  title = "irwin@notes: ~/posts",
  skipToContentLabel = DEFAULT_SKIP_TO_CONTENT_LABEL,
  themeToggleLabels = DEFAULT_THEME_TOGGLE_LABELS,
  serverTheme,
  localeSwitcher,
}: {
  children: React.ReactNode;
  title?: string;
  skipToContentLabel?: string;
  themeToggleLabels?: ThemeToggleLabels;
  serverTheme?: Theme;
  localeSwitcher?: TerminalLocaleSwitcher;
}) {
  return (
    <div className="flex min-h-dvh justify-center bg-term-bg p-0 sm:p-6 md:p-10">
      <div className="flex w-full max-w-4xl flex-col">
        <a href="#main-content" className="skip-link">
          {skipToContentLabel}
        </a>
        <div className="flex items-center sm:rounded-t-xl sm:border sm:border-b-0 border-term-border bg-term-chrome px-3 py-2 sm:px-4">
          <div className="flex gap-2 shrink-0" aria-hidden="true">
            <div className="w-3 h-3 rounded-full bg-term-red" />
            <div className="w-3 h-3 rounded-full bg-term-yellow" />
            <div className="w-3 h-3 rounded-full bg-term-green-dot" />
          </div>
          <span className="text-term-muted text-xs tracking-wide mx-auto select-none min-w-0 truncate px-2">
            {title}
          </span>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {localeSwitcher ? (
              <nav
                aria-label={localeSwitcher.ariaLabel}
                className="flex items-center gap-2 text-xs"
              >
                <span className="text-term-muted select-none">
                  {localeSwitcher.label}
                </span>
                <div className="flex items-center gap-1">
                  {localeSwitcher.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={link.isActive ? "page" : undefined}
                      className={`inline-flex min-h-6 items-center rounded px-1.5 transition-colors duration-200 focus-visible:outline-offset-1 ${
                        link.isActive
                          ? "text-term-bright font-medium"
                          : "text-term-text hover:text-term-bright"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </nav>
            ) : null}
            <ThemeToggle labels={themeToggleLabels} serverTheme={serverTheme} />
          </div>
        </div>
        <main
          id="main-content"
          className="terminal-body flex-1 sm:rounded-b-xl sm:border border-term-border border-t-0 bg-term-window p-4 shadow-2xl shadow-black/10 sm:p-7 md:p-9"
        >
          {children}
        </main>
        <div
          className="mx-4 h-2 rounded-b-xl bg-black/20 blur-sm hidden sm:block"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

export function TerminalNav({
  active,
  ariaLabel = "Site navigation",
  links = DEFAULT_TERMINAL_NAV_LINKS,
}: {
  active?: string;
  ariaLabel?: string;
  links?: TerminalNavLink[];
}) {
  return (
    <nav
      aria-label={ariaLabel}
      className="flex flex-wrap gap-x-6 gap-y-1 text-base"
    >
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          aria-current={active === link.href ? "page" : undefined}
          className={`hover:text-term-cyan transition-colors duration-200 ${
            active === link.href
              ? "text-term-green font-medium"
              : "text-term-blue"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
