/**
 * Live GitHub activity for the About section: the contribution calendar
 * (parsed from github.com, which needs no token) and the public repository
 * count and main languages (from the REST API), for every account in
 * GITHUB.accounts, added together into one calendar. Cached in memory for a
 * few hours so visitors never hit GitHub's rate limits.
 *
 * GitHub shows a signed-out visitor private-repository contributions only
 * where the account has "Include private contributions on my profile"
 * turned on, so that setting decides how much of the work shows here.
 */

import { GITHUB } from "@/components/portfolio/data";

export type ContributionDay = { date: string; level: 0 | 1 | 2 | 3 | 4; count: number };
export type GithubActivity = {
  year: number;
  total: number;
  days: ContributionDay[];
  repos: number | null;
  languages: string[];
};

const TTL = 6 * 60 * 60 * 1000;
const cache = new Map<string, { at: number; value: unknown }>();

async function cached<T>(key: string, load: () => Promise<T>): Promise<T> {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL) return hit.value as T;
  const value = await load();
  cache.set(key, { at: Date.now(), value });
  return value;
}

const UA = { "user-agent": "byharsha-portfolio" };

async function contributions(user: string, year: number) {
  const url = `https://github.com/users/${user}/contributions?from=${year}-01-01&to=${year}-12-31`;
  const res = await fetch(url, { headers: UA });
  if (!res.ok) throw new Error(`GitHub contributions: ${res.status}`);
  const html = (await res.text()).replace(/\s+/g, " ");

  // the day cells: id, date and shade
  const cells = new Map<string, { date: string; level: number }>();
  for (const m of html.matchAll(/<td[^>]*?class="ContributionCalendar-day"[^>]*>/g)) {
    const tag = m[0];
    const id = /id="([^"]+)"/.exec(tag)?.[1];
    const date = /data-date="([^"]+)"/.exec(tag)?.[1];
    const level = Number(/data-level="(\d)"/.exec(tag)?.[1] ?? 0);
    if (id && date) cells.set(id, { date, level });
  }
  // each cell's tooltip carries its exact count
  const counts = new Map<string, number>();
  for (const m of html.matchAll(/<tool-tip[^>]*for="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
    const n = /^(\d[\d,]*) contribution/.exec(m[2].trim());
    counts.set(m[1], n ? Number(n[1].replace(/,/g, "")) : 0);
  }

  const days: ContributionDay[] = [...cells.entries()]
    .map(([id, c]) => ({ date: c.date, level: Math.min(4, c.level) as ContributionDay["level"], count: counts.get(id) ?? 0 }))
    .filter((d) => d.date.startsWith(String(year)))
    .sort((a, b) => a.date.localeCompare(b.date));
  if (!days.length) throw new Error("GitHub contributions: no calendar found");

  const heading = /([\d,]+)\s+contributions?\s+in\s+\d{4}/.exec(html)?.[1];
  const total = heading ? Number(heading.replace(/,/g, "")) : days.reduce((a, d) => a + d.count, 0);
  return { days, total };
}

type Repo = { fork: boolean; language: string | null };

async function repos(user: string): Promise<Repo[] | null> {
  try {
    const res = await fetch(`https://api.github.com/users/${user}/repos?per_page=100`, {
      headers: { ...UA, accept: "application/vnd.github+json" },
    });
    if (!res.ok) return null;
    return ((await res.json()) as Repo[]).filter((r) => !r.fork);
  } catch {
    return null;
  }
}

/** Public repositories and the two main languages, across all the accounts. */
async function profile() {
  const lists = await Promise.all(GITHUB.accounts.map((u) => cached(`repos:${u}`, () => repos(u))));
  const own = lists.flatMap((l) => l ?? []);
  if (lists.every((l) => l === null)) return { repos: null, languages: [] };
  const tally = new Map<string, number>();
  for (const r of own) if (r.language) tally.set(r.language, (tally.get(r.language) ?? 0) + 1);
  const languages = [...tally.entries()].sort((a, b) => b[1] - a[1]).slice(0, 2).map(([l]) => l);
  return { repos: own.length, languages };
}

/**
 * Shades for the combined days, the way GitHub picks them: a day with no
 * contributions is blank, and the busy days are split into four bands at the
 * quartiles of that year's non-zero counts.
 */
function shade(days: { date: string; count: number }[]): ContributionDay[] {
  const busy = days.map((d) => d.count).filter((n) => n > 0).sort((a, b) => a - b);
  const at = (q: number) => busy[Math.min(busy.length - 1, Math.floor(q * busy.length))] ?? 0;
  const cuts = [at(0.25), at(0.5), at(0.75)];
  return days.map((d) => ({
    date: d.date,
    count: d.count,
    level: (d.count === 0 ? 0 : 1 + cuts.filter((c) => d.count > c).length) as ContributionDay["level"],
  }));
}

/** Every account's calendar for the year, added day by day. */
async function combined(year: number) {
  const results = await Promise.allSettled(GITHUB.accounts.map((u) => cached(`cal:${u}:${year}`, () => contributions(u, year))));
  const calendars = results.flatMap((r) => (r.status === "fulfilled" ? [r.value] : []));
  // one account being unreachable should not take the whole graph down
  if (!calendars.length) throw (results[0] as PromiseRejectedResult).reason;
  const byDate = new Map<string, number>();
  for (const c of calendars) for (const d of c.days) byDate.set(d.date, (byDate.get(d.date) ?? 0) + d.count);
  const days = shade([...byDate.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([date, count]) => ({ date, count })));
  return { days, total: calendars.reduce((a, c) => a + c.total, 0) };
}

export async function getGithubActivity(year: number): Promise<GithubActivity> {
  const [cal, prof] = await Promise.all([combined(year), profile()]);
  return { year, ...cal, ...prof };
}
