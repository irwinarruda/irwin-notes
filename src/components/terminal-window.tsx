import Image from "next/image";
import Link from "next/link";
import { PaletteToggle, type PaletteToggleLabels } from "./palette-toggle";
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
  { href: "/posts", label: "Notes" },
  { href: "/about", label: "About" },
  { href: "/usage", label: "Usage" },
];

export function TerminalWindow({
  children,
  homeHref = "/",
  nav,
  skipToContentLabel = DEFAULT_SKIP_TO_CONTENT_LABEL,
  themeToggleLabels = DEFAULT_THEME_TOGGLE_LABELS,
  paletteToggleLabels,
  localeSwitcher,
}: {
  children: React.ReactNode;
  homeHref?: string;
  nav?: React.ReactNode;
  skipToContentLabel?: string;
  themeToggleLabels?: ThemeToggleLabels;
  paletteToggleLabels?: PaletteToggleLabels;
  localeSwitcher?: TerminalLocaleSwitcher;
}) {
  return (
    <div className="flex min-h-dvh justify-center bg-page p-0 sm:p-6 md:p-10">
      <div className="flex w-full max-w-4xl flex-col">
        <a href="#main-content" className="skip-link">
          {skipToContentLabel}
        </a>
        <header className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-line-subtle bg-surface px-4 py-3 sm:rounded-t-xl sm:border sm:border-line sm:border-b-line-subtle sm:px-7 md:px-9">
          <Link
            href={homeHref}
            className="inline-flex shrink-0 items-center rounded-sm focus-visible:outline-offset-4"
          >
            <Image
              src="/brand/irwin-arruda-light.svg"
              alt="Irwin Arruda"
              width={135}
              height={22}
              className="h-5 w-auto sm:h-[22px] dark:hidden"
              priority
            />
            <Image
              src="/brand/irwin-arruda-dark.svg"
              alt="Irwin Arruda"
              width={135}
              height={22}
              className="hidden h-5 w-auto sm:h-[22px] dark:block"
              priority
            />
          </Link>
          {nav ? (
            <div className="order-last -ml-3 w-full sm:order-none sm:ml-0 sm:w-auto">
              {nav}
            </div>
          ) : null}
          <div className="ml-auto flex items-center gap-3 sm:gap-4">
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
            <PaletteToggle labels={paletteToggleLabels} />
            <ThemeToggle labels={themeToggleLabels} />
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
      className="flex items-center gap-1 font-display text-[15px]"
    >
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          aria-current={active === link.href ? "page" : undefined}
          className={`inline-flex h-8 items-center rounded-md px-3 font-medium transition-colors duration-200 ${
            active === link.href
              ? "bg-primary-soft text-primary-fg"
              : "text-fg-muted hover:bg-hover hover:text-fg"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
