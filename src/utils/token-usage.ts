import tokenUsage from "@/content/usage/token-usage.json";

export type TokenUsageRecord = {
  date: string;
  agent: string;
  tokens: number;
  cost: number;
};

export type TokenUsage = {
  updatedAt: string;
  records: TokenUsageRecord[];
};

export type UsageDay = {
  date: string;
  tokens: number;
  agents: [string, number][];
  level: number;
  isOutside: boolean;
};

export type UsageYear = {
  year: number;
  tokens: number;
  activeDays: number;
  weeks: UsageDay[][];
  months: { month: number; week: number }[];
};

const AgentLabels: Record<string, string> = {
  claude: "Claude Code",
  codex: "Codex",
  opencode: "OpenCode",
  pi: "Pi",
};

const DayMs = 24 * 60 * 60 * 1000;

export function getAgentLabel(agent: string) {
  return AgentLabels[agent] ?? agent;
}

function toDate(date: string) {
  return new Date(`${date}T00:00:00Z`);
}

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * DayMs);
}

function getLevel(tokens: number, thresholds: number[]) {
  if (tokens === 0) {
    return 0;
  }
  return 1 + thresholds.filter((threshold) => tokens > threshold).length;
}

export function getPastUsageYears() {
  return getTokenUsage()
    .years.slice(1)
    .map((year) => year.year);
}

export function getTokenUsage() {
  const { updatedAt, records } = tokenUsage as TokenUsage;
  const days = new Map<string, Map<string, number>>();
  const agentTotals = new Map<string, number>();
  let totalCost = 0;
  for (const record of records) {
    const agents = days.get(record.date) ?? new Map<string, number>();
    agents.set(record.agent, (agents.get(record.agent) ?? 0) + record.tokens);
    days.set(record.date, agents);
    agentTotals.set(
      record.agent,
      (agentTotals.get(record.agent) ?? 0) + record.tokens,
    );
    totalCost += record.cost;
  }
  const dayTotals = new Map(
    [...days].map(([date, agents]) => [
      date,
      [...agents.values()].reduce((sum, tokens) => sum + tokens, 0),
    ]),
  );
  const activeDates = [...dayTotals.keys()].sort();
  const sortedTotals = [...dayTotals.values()].sort((a, b) => a - b);
  const thresholds = [0.25, 0.5, 0.75].map(
    (quantile) => sortedTotals[Math.floor(quantile * sortedTotals.length)],
  );
  const totalTokens = sortedTotals.reduce((sum, tokens) => sum + tokens, 0);
  const firstDate = activeDates[0];
  const [topDate, topTokens] = [...dayTotals].reduce((top, day) =>
    day[1] > top[1] ? day : top,
  );
  let longestStreak = 0;
  let streak = 0;
  for (let index = 0; index < activeDates.length; index++) {
    const isNextDay =
      index > 0 &&
      toDate(activeDates[index]).getTime() -
        toDate(activeDates[index - 1]).getTime() ===
        DayMs;
    streak = isNextDay ? streak + 1 : 1;
    longestStreak = Math.max(longestStreak, streak);
  }

  const lastYear = toDate(updatedAt).getUTCFullYear();
  const years: UsageYear[] = [];
  for (
    let year = lastYear;
    year >= toDate(firstDate).getUTCFullYear();
    year--
  ) {
    const yearStart = toDate(`${year}-01-01`);
    const yearEnd = toDate(`${year}-12-31`);
    const gridStart = addDays(yearStart, -yearStart.getUTCDay());
    const weeks: UsageDay[][] = [];
    const months: UsageYear["months"] = [];
    let yearTokens = 0;
    let activeDays = 0;
    for (
      let weekStart = gridStart;
      weekStart <= yearEnd;
      weekStart = addDays(weekStart, 7)
    ) {
      const week: UsageDay[] = [];
      for (let weekday = 0; weekday < 7; weekday++) {
        const date = addDays(weekStart, weekday);
        const dateKey = toDateKey(date);
        const tokens = dayTotals.get(dateKey) ?? 0;
        const isOutside = date.getUTCFullYear() !== year || dateKey > updatedAt;
        if (!isOutside && date.getUTCDate() === 1) {
          months.push({ month: date.getUTCMonth(), week: weeks.length });
        }
        if (!isOutside && tokens > 0) {
          yearTokens += tokens;
          activeDays++;
        }
        week.push({
          date: dateKey,
          tokens,
          agents: [...(days.get(dateKey) ?? [])].sort((a, b) => b[1] - a[1]),
          level: getLevel(tokens, thresholds),
          isOutside,
        });
      }
      weeks.push(week);
    }
    years.push({ year, tokens: yearTokens, activeDays, weeks, months });
  }

  return {
    updatedAt,
    firstDate,
    totalTokens,
    totalCost,
    activeDays: activeDates.length,
    topDay: { date: topDate, tokens: topTokens },
    longestStreak,
    agents: [...agentTotals]
      .sort((a, b) => b[1] - a[1])
      .map(([agent, tokens]) => ({
        agent,
        tokens,
        share: tokens / totalTokens,
      })),
    years,
  };
}
