import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";

import { GITHUB } from "@/components/portfolio/data";
import type { GithubActivity } from "@/lib/github.server";
import { Card, GithubMark } from "./ui";
import { useInView } from "./useInView";

/**
 * The real GitHub contribution calendar, read from /api/github (which reads
 * github.com), shaded in the site's jade. One column per week, Sunday at top.
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

type Cell = { date: string; level: number; count: number } | null;

/** Lay the days out in week columns, padding the first and last weeks. */
function weeks(year: number, days: GithubActivity["days"] | null) {
  const byDate = new Map((days ?? []).map((d) => [d.date, d]));
  const start = new Date(Date.UTC(year, 0, 1));
  const end = new Date(Date.UTC(year, 11, 31));
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
  return { cols, monthAt };
}

/** Week columns from `from` to `to`, with their month labels. */
function Calendar({ cols, monthAt, from, to, shown }: { cols: Cell[][]; monthAt: { col: number; label: string }[]; from: number; to: number; shown: boolean }) {
  const slice = cols.slice(from, to);
  return (
    <div>
      <div className="relative mb-2 h-4 text-[0.72rem] text-muted-foreground" aria-hidden>
        {monthAt
          .filter((m) => m.col >= from && m.col < to)
          .map((m) => (
            <span key={m.label} className="absolute" style={{ left: `${((m.col - from) / slice.length) * 100}%` }}>
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
                  className="aspect-square rounded-[3px]"
                  style={{ background: SHADES[cell.level] }}
                  title={shown ? `${cell.count ? cell.count : "No"} contribution${cell.count === 1 ? "" : "s"} on ${fmt(cell.date)}` : undefined}
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

/** Where phones split the year: the start of July, in weeks. */
const HALF = 26;

const fmt = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "UTC" });

export function Contributions() {
  const now = new Date().getFullYear();
  const years = Array.from({ length: now - FIRST_YEAR + 1 }, (_, i) => now - i);
  const [year, setYear] = useState(Math.min(2025, now));
  const [data, setData] = useState<GithubActivity | null>(null);
  const [failedYear, setFailedYear] = useState<number | null>(null);
  const failed = failedYear === year;

  useEffect(() => {
    let live = true;
    load(year)
      .then((d) => live && setData(d))
      .catch(() => live && setFailedYear(year));
    return () => {
      live = false;
    };
  }, [year]);

  const shown = data?.year === year ? data : null;
  // fills in week by week the first time it is seen (with data)
  const [ref, seen] = useInView<HTMLDivElement>({ once: true, margin: "0px 0px -15% 0px" });
  const grown = seen && !!shown;
  const grid = useMemo(() => weeks(year, shown?.days ?? null), [year, shown]);
  const profile = `https://github.com/${GITHUB.username}`;

  return (
    <Card className="p-5 sm:p-7 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-secondary">
            <GithubMark className="h-5 w-5" />
          </span>
          <p className="leading-tight" aria-live="polite">
            <span className="font-display text-[1.75rem] font-[400] tabular-nums tracking-[-0.02em]">{shown ? shown.total.toLocaleString("en-IN") : "…"}</span>
            <span className="ml-2 text-[0.95rem] text-muted-foreground">contributions in {year}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          {years.length > 1 && (
            <div role="group" aria-label="Year" className="flex rounded-full border border-border p-1">
              {years.map((y) => (
                <button
                  key={y}
                  type="button"
                  aria-pressed={y === year}
                  onClick={() => setYear(y)}
                  className={`h-8 rounded-full px-3.5 text-[0.85rem] tabular-nums transition-colors duration-300 ${
                    y === year ? "bg-foreground text-background" : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          )}
          <a href={profile} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1.5 text-[0.9rem] text-foreground/80 hover:text-foreground">
            <span className="link-underline">@{GITHUB.username}</span>
            <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.6} />
          </a>
        </div>
      </div>

      <div ref={ref} className={`mt-7 ${grown ? "contrib-grow" : ""}`} role="img" aria-label={shown ? `${shown.total} GitHub contributions in ${year}` : `GitHub contributions in ${year}, loading`}>
        {/* the whole year in one row on wider screens; two half-years on phones */}
        <div className="hidden sm:block">
          <Calendar cols={grid.cols} monthAt={grid.monthAt} from={0} to={grid.cols.length} shown={!!shown} />
        </div>
        <div className="space-y-5 sm:hidden">
          <Calendar cols={grid.cols} monthAt={grid.monthAt} from={0} to={HALF} shown={!!shown} />
          <Calendar cols={grid.cols} monthAt={grid.monthAt} from={HALF} to={grid.cols.length} shown={!!shown} />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-[0.85rem] text-muted-foreground">
        <span>
          {failed ? (
            <>
              Couldn’t load the graph just now.{" "}
              <a href={profile} target="_blank" rel="noreferrer" className="link-underline text-foreground">
                See it on GitHub
              </a>
            </>
          ) : shown?.languages.length ? (
            `Mostly ${shown.languages.join(" and ")}${shown.repos ? `, ${shown.repos} public repositories` : ""}`
          ) : (
            " "
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
  );
}
