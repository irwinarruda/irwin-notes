import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { TokenUsage, TokenUsageRecord } from "@/utils/token-usage";

const MinimumFavo = "0.15.0";
const Root = path.join(import.meta.dirname, "..");
const UsagePath = "src/content/usage/token-usage.json";
const isPublishing = !process.argv.includes("--no-push");

type FavoUsage = {
  until: string;
  machines: { name: string; problem?: string }[];
  days: {
    day: string;
    provider: string;
    input: number;
    cacheRead: number;
    cacheWrite: number;
    output: number;
    cost?: number;
  }[];
};

function run(command: string, args: string[]) {
  return execFileSync(command, args, {
    cwd: Root,
    encoding: "utf8",
    maxBuffer: 256 * 1024 * 1024,
    stdio: ["ignore", "pipe", "inherit"],
  }).trim();
}

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

function getTotal(records: TokenUsageRecord[]) {
  const tokens = records.reduce((sum, record) => sum + record.tokens, 0);
  return `${(tokens / 1e9).toFixed(2)}B`;
}

if (
  isPublishing &&
  run("git", ["rev-parse", "--abbrev-ref", "HEAD"]) !== "main"
) {
  fail(
    "Not on main. Switch to main, or pass --no-push to only write the file.",
  );
}
const version = run("favo", ["--version"]);
if (version.localeCompare(MinimumFavo, undefined, { numeric: true }) < 0) {
  fail(`favo ${version} is too old. Run "favo update" to get ${MinimumFavo}.`);
}

console.log("Reading every machine with favo…");
const report: FavoUsage = JSON.parse(
  run("favo", ["usage", "--tokens", "--all", "--json"]),
);
const problems = report.machines.filter((machine) => machine.problem);
if (problems.length > 0) {
  fail(
    `Nothing was written, because favo could not read every machine:\n${problems
      .map((machine) => `  ${machine.name}: ${machine.problem}`)
      .join("\n")}`,
  );
}
if (report.days.length === 0) {
  fail("Nothing was written, because favo returned no usage.");
}

const counted = new Map<string, TokenUsageRecord>();
for (const day of report.days) {
  const key = `${day.day}|${day.provider}`;
  const record = counted.get(key) ?? {
    date: day.day,
    agent: day.provider,
    tokens: 0,
    cost: 0,
  };
  record.tokens += day.input + day.cacheRead + day.cacheWrite + day.output;
  record.cost += day.cost ?? 0;
  counted.set(key, record);
}
const favoAgents = new Set(report.days.map((day) => day.provider));
const current: TokenUsage = JSON.parse(
  readFileSync(path.join(Root, UsagePath), "utf8"),
);
const kept = current.records.filter((record) => !favoAgents.has(record.agent));
const usage: TokenUsage = {
  updatedAt: report.until,
  records: [...kept, ...counted.values()]
    .map((record) => ({ ...record, cost: Math.round(record.cost * 100) / 100 }))
    .sort((a, b) =>
      `${a.date}|${a.agent}`.localeCompare(`${b.date}|${b.agent}`),
    ),
};
writeFileSync(
  path.join(Root, UsagePath),
  `${JSON.stringify(usage, null, 2)}\n`,
);
console.log(
  `Wrote ${usage.records.length} days: ${getTotal(current.records)} before, ${getTotal(usage.records)} now.`,
);

if (!isPublishing) {
  process.exit(0);
}
run("git", ["add", "--", UsagePath]);
if (run("git", ["status", "--porcelain", "--", UsagePath]) === "") {
  console.log("Nothing changed, so nothing was pushed.");
  process.exit(0);
}
run("git", [
  "commit",
  "--message",
  `chore: update token usage to ${usage.updatedAt}`,
  "--",
  UsagePath,
]);
run("git", ["push", "origin", "main"]);
console.log("Pushed to main.");
