import { useEffect, useMemo, useState } from "react";

import { CONTRIBUTION_SNAPSHOT } from "@/components/portfolio/contributionSnapshot";
import { GITHUB } from "@/components/portfolio/data";
import type { GithubActivity } from "@/lib/github.server";
import { CountUp } from "./motion";
import { Card, GithubMark } from "./ui";
import { useInView } from "./useInView";

/**
 * The GitHub contribution calendar, shaded in the site's jade. One column per
 * week, Sunday at top. It opens on the last year as recorded from both
 * profiles (personal and internship, private work included; see
 * contributionSnapshot.ts), combined into one calendar. Earlier years are
 * read live from /api/github.
 */

const FIRST_YEAR = 2025;
const SHADES = ["var(--contrib-0)", ...[32, 52, 76, 100].map((p) => `color-mix(in oklab, var(--accent) ${p}%, transparent)`)];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const store = new Map<number, Promise<GithubActivity>>();
function load(year: number) {
  let p = store.get(year);
  if (!p) {
    p = fetch(`/api/github?year=${year}`).then((r) => (r.ok ? (r.json() as Promise<GithubActivity>) : Promise.reject(new Error(String(r.status)))));
    p.catch(() => store.delete(year));
    store.set(year, p);
  }
  return p;
}

type Day = { date: string; level: number; count: number };
type Cell = Day | null;

const iso = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 86_400_000);

/* ------------------------------------------------------------------ */
/* The recorded last year, both accounts combined                       */
/* ------------------------------------------------------------------ */

/** A rough number of contributions for each of GitHub's shades, used only to weigh the two accounts' days against each other. */
const WEIGHT = [0, 1, 2.5, 4.5, 8];

/**
 * Both accounts' recorded calendars as one. Only shades and totals were
 * recorded, so each account's total is spread over its days in proportion
 * to their shade, the two are added day by day, and the combined days are
 * shaded again the way GitHub does it (quartiles of the busy days). The
 * total is exactly the two totals added.
 */
function snapshotCalendar() {
  const end = new Date(`${CONTRIBUTION_SNAPSHOT.asOf}T00:00:00Z`);
  const start = addDays(end, -(end.getUTCDay() + 52 * 7)); // the first column's Sunday
  const byDate = new Map<string, number>();
  for (const a of CONTRIBUTION_SNAPSHOT.accounts) {
    const cells: { date: string; w: number }[] = [];
    a.rows.forEach((row, r) =>
      [...row].forEach((ch, c) => {
        const date = addDays(start, c * 7 + r);
        if (date <= end) cells.push({ date: iso(date), w: WEIGHT[Number(ch)] });
      }),
    );
    const sum = cells.reduce((x, c) => x + c.w, 0) || 1;
    for (const c of cells) byDate.set(c.date, (byDate.get(c.date) ?? 0) + (c.w / sum) * a.total);
  }
  const busy = [...byDate.values()].filter((n) => n > 0).sort((a, b) => a - b);
  const at = (q: number) => busy[Math.min(busy.length - 1, Math.floor(q * busy.length))] ?? 0;
  const cuts = [at(0.25), at(0.5), at(0.75)];
  const days: Day[] = [...byDate.entries()].map(([date, n]) => ({ date, count: n, level: n > 0 ? 1 + cuts.filter((c) => n > c).length : 0 }));
  const total = CONTRIBUTION_SNAPSHOT.accounts.reduce((x, a) => x + a.total, 0);
  return { start: iso(start), end: CONTRIBUTION_SNAPSHOT.asOf, days, total };
}
const SNAPSHOT = snapshotCalendar();
/** The profiles the graph adds together, with what each is for. */
const ACCOUNTS = CONTRIBUTION_SNAPSHOT.accounts.map((a) => ({ user: a.user, label: a.label }));

/** Lay the days from `from` to `to` out in week columns, padding the first and last weeks. */
function weeks(from: string, to: string, days: Day[] | null) {
  const byDate = new Map((days ?? []).map((d) => [d.date, d]));
  const start = new Date(`${from}T00:00:00Z`);
  const end = new Date(`${to}T00:00:00Z`);
  const cols: Cell[][] = [];
  let col: Cell[] = Array.from({ length: start.getUTCDay() }, () => null);
  const monthAt: { col: number; label: string }[] = [];
  for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    const iso = d.toISOString().slice(0, 10);
    if (d.getUTCDate() === 1) monthAt.push({ col: cols.length, label: MONTHS[d.getUTCMonth()] });
    const day = byDate.get(iso);
    col.push(day ? { date: iso, level: day.level, count: day.count } : { date: iso, level: 0, count: 0 });
    if (col.length === 7) {
      cols.push(col);
      col = [];
    }
  }
  if (col.length) cols.push([...col, ...Array.from({ length: 7 - col.length }, () => null)]);
  // a range starting mid-month (the last year does) is labelled at its first week too
  if (start.getUTCDate() !== 1 && (monthAt[0]?.col ?? 99) >= 3) monthAt.unshift({ col: 0, label: MONTHS[start.getUTCMonth()] });
  return { cols, monthAt };
}

/** Week columns from `from` to `to`, with their month labels. */
function Calendar({ cols, monthAt, from, to, shown, exact }: { cols: Cell[][]; monthAt: { col: number; label: string }[]; from: number; to: number; shown: boolean; exact: boolean }) {
  const slice = cols.slice(from, to);
  return (
    <div>
      <div className="relative mb-2 h-4 text-[0.72rem] text-muted-foreground" aria-hidden>
        {monthAt
          .filter((m) => m.col >= from && m.col < to)
          .map((m) => (
            <span key={`${m.label}${m.col}`} className="absolute" style={{ left: `${((m.col - from) / slice.length) * 100}%` }}>
              {m.label}
            </span>
          ))}
      </div>
      <div className={`grid gap-[3px] transition-opacity duration-500 ${shown ? "opacity-100" : "opacity-60"}`} style={{ gridTemplateColumns: `repeat(${slice.length}, minmax(0, 1fr))` }}>
        {slice.map((col, c) => (
          <div key={c} className="contrib-col grid gap-[3px]" style={{ ["--c" as string]: c }}>
            {col.map((cell, r) =>
              cell ? (
                <span
                  key={r}
                  className="contrib-cell aspect-square rounded-[3px]"
                  style={{ background: SHADES[cell.level] }}
                  title={
                    !shown
                      ? undefined
                      : exact
                        ? `${cell.count ? cell.count : "No"} contribution${cell.count === 1 ? "" : "s"} on ${fmt(cell.date)}`
                        : // the recorded year has shades, not exact counts
                          `${cell.level ? "Contributed" : "No contributions"} on ${fmt(cell.date)}`
                  }
                />
              ) : (
                <span key={r} className="aspect-square" />
              ),
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * What the days add up to: days with activity, the longest run of days in a
 * row, the busiest day and the month with the most active days.
 */
function summarise(days: Day[]) {
  let active = 0;
  let best = { count: 0, date: "" };
  let run = 0;
  let streak = 0;
  const months = new Map<string, number>();
  for (const d of [...days].sort((a, b) => a.date.localeCompare(b.date))) {
    if (d.count > 0) {
      active++;
      run++;
      streak = Math.max(streak, run);
      if (d.count > best.count) best = { count: d.count, date: d.date };
      months.set(d.date.slice(0, 7), (months.get(d.date.slice(0, 7)) ?? 0) + 1);
    } else run = 0;
  }
  const [month, monthDays] = [...months.entries()].sort((a, b) => b[1] - a[1])[0] ?? ["", 0];
  return { active, best, streak, month, monthDays };
}

/** Where phones split the year: the start of July, in weeks. */
const HALF = 26;

const fmt = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "UTC" });

/** The views: the recorded last year, then each earlier calendar year. */
type View = "last" | number;
const viewLabel = (v: View) => (v === "last" ? "Last year" : String(v));

export function Contributions() {
  const lastYearStart = Number(SNAPSHOT.start.slice(0, 4));
  const views: View[] = ["last", ...Array.from({ length: Math.max(0, lastYearStart - FIRST_YEAR + 1) }, (_, i) => lastYearStart - i)];
  const [view, setView] = useState<View>("last");
  const live = typeof view === "number";
  // the live calendar also gives the repository count and languages for the line below
  const year = live ? view : new Date().getFullYear();
  const [data, setData] = useState<GithubActivity | null>(null);
  const [failedYear, setFailedYear] = useState<number | null>(null);
  const failed = live && failedYear === year;

  // asks GitHub only as the card comes near, so it never competes with the first load
  const [nearRef, near] = useInView<HTMLDivElement>({ once: true, margin: "800px 0px" });

  useEffect(() => {
    if (!near) return;
    let on = true;
    load(year)
      .then((d) => on && setData(d))
      .catch(() => on && setFailedYear(year));
    return () => {
      on = false;
    };
  }, [year, near]);

  const fetched = data?.year === year ? data : null;
  // the recorded year is part of the page, so it is there at once
  const shown = useMemo(() => (live ? (fetched ? { total: fetched.total, days: fetched.days as Day[] } : null) : SNAPSHOT), [live, fetched]);
  // fills in week by week the first time it is seen (with data)
  const [ref, seen] = useInView<HTMLDivElement>({ once: true, margin: "0px 0px -15% 0px" });
  const grown = seen && !!shown;
  const grid = useMemo(
    () => (typeof view === "number" ? weeks(`${view}-01-01`, `${view}-12-31`, shown?.days ?? null) : weeks(SNAPSHOT.start, SNAPSHOT.end, SNAPSHOT.days)),
    [view, shown],
  );
  const sum = useMemo(() => (shown ? summarise(shown.days) : null), [shown]);
  const profile = `https://github.com/${GITHUB.username}`;
  const when = live ? `in ${view}` : "in the last year";
  const monthName = (ym: string) => new Date(`${ym}-01T00:00:00Z`).toLocaleDateString("en-IN", { month: "long", timeZone: "UTC" });
  const stats = sum
    ? [
        { label: "Active days", value: sum.active, note: "" },
        // exact counts only exist for the live years
        live
          ? { label: "Busiest day", value: sum.best.count, note: fmt(sum.best.date) }
          : { label: "Busiest month", value: sum.monthDays, note: `active days in ${monthName(sum.month)}` },
        { label: "Longest streak", value: sum.streak, note: sum.streak === 1 ? "day" : "days" },
      ]
    : [];

  return (
    <div ref={nearRef}>
    <Card flat className="reveal p-5 sm:p-7 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-secondary">
            <GithubMark className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <p aria-live="polite">
              <span className="font-display text-[1.75rem] font-[400] tabular-nums tracking-[-0.02em]">{shown ? <CountUp key={viewLabel(view)} value={shown.total} /> : "…"}</span>
              <span className="ml-2 text-[0.95rem] text-muted-foreground">contributions {when}</span>
            </p>
            {/* one graph for both accounts: say so, right under the number */}
            <p className="mt-1 text-[0.85rem] text-foreground/75">{ACCOUNTS.map((a) => a.label).join(" + ")} accounts, combined</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {views.length > 1 && (
            <div role="group" aria-label="Period" className="flex rounded-full border border-border p-1">
              {views.map((v) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={v === view}
                  onClick={() => setView(v)}
                  className={`h-8 rounded-full px-3.5 text-[0.85rem] tabular-nums transition-colors duration-300 ${
                    v === view ? "bg-foreground text-background" : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {viewLabel(v)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div ref={ref} className={`mt-7 ${grown ? "contrib-grow" : ""}`} role="img" aria-label={shown ? `${shown.total} GitHub contributions ${when}` : `GitHub contributions ${when}, loading`}>
        {/* the whole year in one row on wider screens; two half-years on phones */}
        <div className="hidden sm:block">
          <Calendar cols={grid.cols} monthAt={grid.monthAt} from={0} to={grid.cols.length} shown={!!shown} exact={live} />
        </div>
        <div className="space-y-5 sm:hidden">
          <Calendar cols={grid.cols} monthAt={grid.monthAt} from={0} to={HALF} shown={!!shown} exact={live} />
          <Calendar cols={grid.cols} monthAt={grid.monthAt} from={HALF} to={grid.cols.length} shown={!!shown} exact={live} />
        </div>
      </div>

      {/* the same days, added up */}
      {sum && sum.active > 0 && (
        <dl key={viewLabel(view)} className="mt-6 grid grid-cols-3 gap-3 border-t border-border pt-5 sm:max-w-[34rem]">
          {stats.map((s, j) => (
            <div key={s.label} className="pop" style={{ ["--j" as string]: j * 3 }}>
              <dt className="text-[0.78rem] text-muted-foreground">{s.label}</dt>
              <dd className="mt-0.5 flex items-baseline gap-1.5">
                <CountUp value={s.value} className="font-display text-[1.45rem] tracking-[-0.02em]" />
                {s.note && <span className="text-[0.8rem] text-muted-foreground">{s.note}</span>}
              </dd>
            </div>
          ))}
        </dl>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-[0.85rem] text-muted-foreground">
        <span>
          {failed ? (
            <>
              Couldn’t load the graph just now.{" "}
              <a href={profile} target="_blank" rel="noreferrer" className="link-underline text-foreground">
                See it on GitHub
              </a>
            </>
          ) : (
            [
              fetched?.languages.length ? `Mostly ${fetched.languages.join(" and ")}${fetched.repos ? `, ${fetched.repos} public repositories` : ""}.` : "",
            ]
              .filter(Boolean)
              .join(" ") || "\u00a0"
          )}
        </span>
        <span className="flex items-center gap-1.5" aria-hidden>
          Less
          {SHADES.map((s) => (
            <span key={s} className="h-3 w-3 rounded-[3px]" style={{ background: s }} />
          ))}
          More
        </span>
      </div>
    </Card>
    </div>
  );
}
