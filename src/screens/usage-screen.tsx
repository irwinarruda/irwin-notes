import Link from "next/link";
import { notFound } from "next/navigation";
import { TerminalNav, TerminalWindow } from "@/components/terminal-window";
import { getDictionary, resolveLocale, type Locale } from "@/utils/i18n";
import { getLocaleSwitcherConfig } from "@/utils/get-locale-switcher";
import { getTerminalNavLinks } from "@/utils/get-terminal-nav-links";
import {
  getAgentLabel,
  getTokenUsage,
  type UsageDay,
  type UsageYear,
} from "@/utils/token-usage";

type UsageScreenProps = {
  params: Promise<{ locale: string; year?: string }>;
};

const LevelClasses = [
  "bg-line-subtle",
  "bg-primary/35",
  "bg-primary/60",
  "bg-primary/80",
  "bg-primary",
];

const AgentClasses = [
  "bg-primary",
  "bg-function",
  "bg-type",
  "bg-constant",
  "bg-parameter",
];

const LabeledWeekdays = [1, 3, 5];

function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    String(values[key] ?? match),
  );
}

function getFormatters(locale: Locale) {
  return {
    compact: new Intl.NumberFormat(locale, {
      notation: "compact",
      maximumFractionDigits: 1,
    }),
    integer: new Intl.NumberFormat(locale),
    percent: new Intl.NumberFormat(locale, {
      style: "percent",
      maximumFractionDigits: 1,
    }),
    currency: new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }),
    date: new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeZone: "UTC",
    }),
    month: new Intl.DateTimeFormat(locale, { month: "short", timeZone: "UTC" }),
    weekday: new Intl.DateTimeFormat(locale, {
      weekday: "short",
      timeZone: "UTC",
    }),
  };
}

type Formatters = ReturnType<typeof getFormatters>;

function getDayTitle(
  day: UsageDay,
  formatters: Formatters,
  texts: { dayTokens: string; noTokens: string },
) {
  const date = formatters.date.format(new Date(`${day.date}T00:00:00Z`));
  if (day.tokens === 0) {
    return `${date}: ${texts.noTokens}`;
  }
  const tokens = fill(texts.dayTokens, {
    tokens: formatters.compact.format(day.tokens),
  });
  const agents = day.agents
    .map(
      ([agent, agentTokens]) =>
        `${getAgentLabel(agent)} ${formatters.compact.format(agentTokens)}`,
    )
    .join(", ");
  return `${date}: ${tokens} (${agents})`;
}

function UsageCalendar({
  year,
  formatters,
  texts,
}: {
  year: UsageYear;
  formatters: Formatters;
  texts: { dayTokens: string; noTokens: string };
}) {
  const columns = {
    gridTemplateColumns: `repeat(${year.weeks.length}, minmax(0, 1fr))`,
  };

  return (
    <div aria-hidden="true" className="text-2xs text-fg-muted">
      <div className="flex gap-[2px] sm:gap-[3px]">
        <div className="w-6 shrink-0 sm:w-7" />
        <div
          className="grid min-w-0 flex-1 gap-[2px] sm:gap-[3px]"
          style={columns}
        >
          {year.months.map(({ month, week }) => (
            <span
              key={month}
              className="whitespace-nowrap"
              style={{ gridColumn: `${week + 1} / span 3`, gridRow: 1 }}
            >
              {formatters.month.format(new Date(Date.UTC(year.year, month, 1)))}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-1 flex gap-[2px] sm:gap-[3px]">
        <div className="grid w-6 shrink-0 grid-rows-7 gap-[2px] sm:w-7 sm:gap-[3px]">
          {Array.from({ length: 7 }, (_, weekday) => (
            <span key={weekday} className="flex items-center leading-none">
              {LabeledWeekdays.includes(weekday) &&
                formatters.weekday.format(
                  new Date(Date.UTC(2026, 10, 1 + weekday)),
                )}
            </span>
          ))}
        </div>
        <div
          className="grid min-w-0 flex-1 grid-flow-col grid-rows-7 gap-[2px] sm:gap-[3px]"
          style={columns}
        >
          {year.weeks.flat().map((day) => (
            <span
              key={day.date}
              title={
                day.isOutside ? undefined : getDayTitle(day, formatters, texts)
              }
              className={`aspect-square rounded-[2px] ${
                day.isOutside ? "invisible" : LevelClasses[day.level]
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function UsageScreen(props: UsageScreenProps) {
  const params = await props.params;
  const locale = resolveLocale(params.locale);
  const dictionary = await getDictionary(locale);
  const texts = dictionary.usagePage;
  const navLinks = getTerminalNavLinks(locale, dictionary);
  const usage = getTokenUsage();
  const selectedYear = params.year
    ? usage.years.find((year) => String(year.year) === params.year)
    : usage.years[0];
  if (!selectedYear) {
    notFound();
  }
  const localeSwitcher = getLocaleSwitcherConfig(
    locale,
    params.year ? `/usage/${params.year}` : "/usage",
    dictionary,
  );
  const formatters = getFormatters(locale);
  const formatDate = (date: string) =>
    formatters.date.format(new Date(`${date}T00:00:00Z`));
  const stats = [
    {
      value: formatters.compact.format(usage.totalTokens),
      label: texts.stats.tokens,
    },
    {
      value: formatters.integer.format(usage.activeDays),
      label: texts.stats.activeDays,
    },
    {
      value: formatters.compact.format(usage.topDay.tokens),
      label: `${texts.stats.topDay} · ${formatDate(usage.topDay.date)}`,
    },
    {
      value: fill(texts.streakDays, { count: usage.longestStreak }),
      label: texts.stats.longestStreak,
    },
    {
      value: formatters.currency.format(usage.totalCost),
      label: texts.stats.cost,
    },
  ];

  return (
    <TerminalWindow
      homeHref={`/${locale}/posts`}
      nav={
        <TerminalNav
          active={`/${locale}/usage`}
          ariaLabel={dictionary.nav.ariaLabel}
          links={navLinks}
        />
      }
      skipToContentLabel={dictionary.nav.skipToContent}
      themeToggleLabels={dictionary.themeToggle}
      paletteToggleLabels={dictionary.paletteToggle}
      localeSwitcher={localeSwitcher}
    >
      <div className="fade-in">
        <h1 className="font-display text-fg text-[2rem] sm:text-[2.375rem] font-semibold leading-tight">
          {texts.title}
        </h1>
        <p className="text-fg-muted text-sm sm:text-base mt-1 max-w-2xl">
          {fill(texts.description, { since: formatDate(usage.firstDate) })}
        </p>
      </div>

      <div className="border-t border-line-subtle my-6" />

      <dl className="fade-in fade-in-delay-1 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-5">
        {stats.map((stat) => (
          <div key={stat.label} className="flex min-w-0 flex-col">
            <dt className="text-fg-muted text-sm">{stat.label}</dt>
            <dd className="font-display text-fg text-2xl sm:text-[1.75rem] font-semibold leading-tight order-first">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="border-t border-line-subtle my-6" />

      <div className="fade-in fade-in-delay-2 space-y-8">
        <section>
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <h2 className="flex items-baseline gap-3">
              <span className="font-display text-fg text-xl font-semibold">
                {selectedYear.year}
              </span>
              <span className="text-fg-muted text-sm">
                {formatters.compact.format(selectedYear.tokens)}{" "}
                {texts.stats.tokens}
              </span>
            </h2>
            {usage.years.length > 1 && (
              <nav
                aria-label={texts.yearFilterLabel}
                className="flex items-center gap-2 text-xs"
              >
                <span className="hidden text-fg-muted select-none sm:inline">
                  {texts.yearFilter}
                </span>
                <div className="flex items-center gap-1">
                  {usage.years.map((year, index) => (
                    <Link
                      key={year.year}
                      href={`/${locale}/usage${index === 0 ? "" : `/${year.year}`}`}
                      scroll={false}
                      aria-current={year === selectedYear ? "page" : undefined}
                      className={`inline-flex min-h-6 items-center rounded px-1.5 transition-colors duration-200 focus-visible:outline-offset-1 ${
                        year === selectedYear
                          ? "text-fg font-medium"
                          : "text-fg-muted hover:text-fg"
                      }`}
                    >
                      {year.year}
                    </Link>
                  ))}
                </div>
              </nav>
            )}
          </div>
          <p className="sr-only">
            {fill(texts.yearSummary, {
              year: selectedYear.year,
              tokens: formatters.compact.format(selectedYear.tokens),
              days: selectedYear.activeDays,
            })}
          </p>
          <UsageCalendar
            year={selectedYear}
            formatters={formatters}
            texts={texts}
          />
        </section>
        <div
          aria-hidden="true"
          className="flex items-center justify-end gap-1 text-2xs text-fg-muted"
        >
          <span className="mr-1">{texts.less}</span>
          {LevelClasses.map((levelClass) => (
            <span
              key={levelClass}
              className={`size-2.5 rounded-[2px] ${levelClass}`}
            />
          ))}
          <span className="ml-1">{texts.more}</span>
        </div>
      </div>

      <div className="border-t border-line-subtle my-6" />

      <section className="fade-in fade-in-delay-3">
        <h2 className="font-display text-fg text-xl font-semibold mb-3">
          {texts.byTool}
        </h2>
        <div
          aria-hidden="true"
          className="flex h-2.5 overflow-hidden rounded-full bg-line-subtle"
        >
          {usage.agents.map(({ agent, share }, index) => (
            <span
              key={agent}
              className={AgentClasses[index % AgentClasses.length]}
              style={{ width: `${share * 100}%` }}
            />
          ))}
        </div>
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
          {usage.agents.map(({ agent, tokens, share }, index) => (
            <li key={agent} className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className={`size-2.5 rounded-full ${AgentClasses[index % AgentClasses.length]}`}
              />
              <span className="text-fg">{getAgentLabel(agent)}</span>
              <span className="text-fg-muted">
                {formatters.compact.format(tokens)} ·{" "}
                {formatters.percent.format(share)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <div className="border-t border-line-subtle my-6" />

      <footer className="fade-in fade-in-delay-4 text-fg-muted text-sm leading-relaxed space-y-1 max-w-2xl">
        {texts.notes.map((note) => (
          <p key={note}>{note}</p>
        ))}
        <p>{fill(texts.updatedAt, { date: formatDate(usage.updatedAt) })}</p>
      </footer>
    </TerminalWindow>
  );
}
