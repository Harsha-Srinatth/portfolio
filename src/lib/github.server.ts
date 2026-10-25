/**
 * Live GitHub activity for the About section: the public contribution
 * calendar (parsed from github.com, which needs no token) and the public
 * repository count and main languages (from the REST API). Cached in memory
 * for a few hours so visitors never hit GitHub's rate limits.
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

async function contributions(year: number) {
  const url = `https://github.com/users/${GITHUB.username}/contributions?from=${year}-01-01&to=${year}-12-31`;
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

async function profile() {
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB.username}/repos?per_page=100`, {
      headers: { ...UA, accept: "application/vnd.github+json" },
    });
    if (!res.ok) return { repos: null, languages: [] };
    const repos = (await res.json()) as { fork: boolean; language: string | null }[];
    const own = repos.filter((r) => !r.fork);
    const tally = new Map<string, number>();
    for (const r of own) if (r.language) tally.set(r.language, (tally.get(r.language) ?? 0) + 1);
    const languages = [...tally.entries()].sort((a, b) => b[1] - a[1]).slice(0, 2).map(([l]) => l);
    return { repos: own.length, languages };
  } catch {
    return { repos: null, languages: [] };
  }
}

export async function getGithubActivity(year: number): Promise<GithubActivity> {
  const [cal, prof] = await Promise.all([
    cached(`cal:${year}`, () => contributions(year)),
    cached("profile", profile),
  ]);
  return { year, ...cal, ...prof };
}
