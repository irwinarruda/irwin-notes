import Image from "next/image";
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
  { href: "/posts", label: "notes" },
  { href: "/about", label: "about" },
];

export function TerminalWindow({
  children,
  homeHref = "/",
  nav,
  skipToContentLabel = DEFAULT_SKIP_TO_CONTENT_LABEL,
  themeToggleLabels = DEFAULT_THEME_TOGGLE_LABELS,
  serverTheme,
  localeSwitcher,
}: {
  children: React.ReactNode;
  homeHref?: string;
  nav?: React.ReactNode;
  skipToContentLabel?: string;
  themeToggleLabels?: ThemeToggleLabels;
  serverTheme?: Theme;
  localeSwitcher?: TerminalLocaleSwitcher;
}) {
  return (
    <div className="flex min-h-dvh justify-center bg-page p-0 sm:p-6 md:p-10">
      <div className="flex w-full max-w-4xl flex-col">
        <a href="#main-content" className="skip-link">
          {skipToContentLabel}
        </a>
        <header className="flex items-center gap-4 border-b border-line-subtle bg-surface px-4 py-3 sm:rounded-t-xl sm:border sm:border-line sm:border-b-line-subtle sm:px-7 md:px-9">
          <Link
            href={homeHref}
            className="inline-flex shrink-0 items-center rounded-sm focus-visible:outline-offset-4"
          >
            <Image
              src="/brand/irwin-light.svg"
              alt="Irwin Arruda"
              width={55}
              height={22}
              className="h-[22px] w-auto dark:hidden"
              priority
            />
            <Image
              src="/brand/irwin-dark.svg"
              alt="Irwin Arruda"
              width={55}
              height={22}
              className="hidden h-[22px] w-auto dark:block"
              priority
            />
          </Link>
          <div className="ml-auto flex items-center gap-3 sm:gap-5">
            {nav}
            {localeSwitcher ? (
              <nav
                aria-label={localeSwitcher.ariaLabel}
                className="flex items-center gap-2 text-xs"
              >
                <span className="hidden text-fg-muted select-none sm:inline">
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
                          ? "text-fg font-medium"
                          : "text-fg-muted hover:text-fg"
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
        </header>
        <main
          id="main-content"
          className="flex-1 bg-surface p-4 shadow-2xl shadow-black/10 sm:rounded-b-xl sm:border sm:border-t-0 sm:border-line sm:p-7 md:p-9"
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
      className="flex items-center gap-x-3 text-sm sm:gap-x-5"
    >
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          aria-current={active === link.href ? "page" : undefined}
          className={`inline-flex min-h-6 items-center transition-colors duration-200 ${
            active === link.href
              ? "text-primary-fg font-medium"
              : "text-fg-muted hover:text-fg"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
