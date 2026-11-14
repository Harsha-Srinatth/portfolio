import { useState } from "react";
import { ChevronDown, CircleAlert, TrendingUp, Wrench, type LucideIcon } from "lucide-react";

import { BUILD_LOG } from "@/components/portfolio/data";
import { CountUp } from "./motion";
import { Section } from "./Section";
import { Card } from "./ui";

function Row({ icon: Icon, label, children, strong = false }: { icon: LucideIcon; label: string; children: string; strong?: boolean }) {
  return (
    <div className="flex gap-3">
      <span aria-hidden className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg ${strong ? "bg-accent text-accent-foreground" : "bg-secondary text-foreground/70"}`}>
        <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
      </span>
      <div>
        <p className="text-[0.78rem] text-muted-foreground">{label}</p>
        <p className={`mt-0.5 text-[0.97rem] leading-snug ${strong ? "text-accent" : ""}`}>{children}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The measured results, drawn                                         */
/* ------------------------------------------------------------------ */

type Measured = { kind: "range"; before: number; after: number; unit: (n: number) => string } | { kind: "percent"; value: number };

const inMs = (n: string, unit: string) => Number(n) * (unit.toLowerCase() === "s" ? 1000 : 1);
const showMs = (ms: number) => (ms >= 1000 ? `${(ms / 1000).toLocaleString("en-IN")} s` : `${ms} ms`);

/** Read "from 550 ms to about 100 ms" or "+18%" out of a result, where it has one. */
function measure(outcome: string): Measured | null {
  const r = /from (?:about )?([\d.]+)\s?(ms|s)\b to (?:about )?([\d.]+)\s?(ms|s)\b/i.exec(outcome);
  if (r) return { kind: "range", before: inMs(r[1], r[2]), after: inMs(r[3], r[4]), unit: showMs };
  const p = /([+−-])\s?(\d+)\s?%/.exec(outcome);
  if (p) return { kind: "percent", value: Number(p[2]) * (p[1] === "+" ? 1 : -1) };
  return null;
}

function Bar({ label, value, share, strong, b }: { label: string; value: string; share: number; strong?: boolean; b: number }) {
  return (
    <div className="grid grid-cols-[3.4rem_1fr_auto] items-center gap-3 text-[0.78rem]">
      <span className="text-muted-foreground">{label}</span>
      <span className="h-2 overflow-hidden rounded-full bg-secondary">
        <span
          className={`bar-fill block h-full rounded-full ${strong ? "bg-accent" : "bg-[color-mix(in_oklab,var(--foreground)_32%,transparent)]"}`}
          style={{ width: `${Math.max(4, share * 100)}%`, ["--b" as string]: b }}
        />
      </span>
      <span className={`tabular-nums ${strong ? "text-accent" : "text-foreground/75"}`}>{value}</span>
    </div>
  );
}

/** Before and after as two bars to the same scale, or a single change as a share of the whole. */
function Measure({ m }: { m: Measured }) {
  if (m.kind === "range") {
    const top = Math.max(m.before, m.after);
    const change = Math.round((m.after / m.before - 1) * 100);
    return (
      <div className="space-y-2 border-t border-border pt-4" role="img" aria-label={`Before ${m.unit(m.before)}, after ${m.unit(m.after)}`}>
        <Bar label="Before" value={m.unit(m.before)} share={m.before / top} b={0} />
        <Bar label="After" value={m.unit(m.after)} share={m.after / top} strong b={1} />
        <p className="pt-1 text-[0.8rem] text-muted-foreground">
          <span className="font-display text-[1.25rem] text-accent">
            {change > 0 ? "+" : ""}
            <CountUp value={Math.abs(change)} />%
          </span>{" "}
          {change < 0 ? "less time" : "more"}
        </p>
      </div>
    );
  }
  const up = m.value > 0;
  return (
    <div className="space-y-2 border-t border-border pt-4" role="img" aria-label={`${up ? "Up" : "Down"} ${Math.abs(m.value)} percent`}>
      <div className="flex items-center gap-3">
        <span className="font-display text-[1.25rem] text-accent">
          {up ? "+" : "−"}
          <CountUp value={Math.abs(m.value)} />%
        </span>
        <span className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
          <span className="bar-fill block h-full rounded-full bg-accent" style={{ width: `${Math.min(100, Math.abs(m.value))}%` }} />
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

const short = (month: string) => {
  const [name, year] = month.split(" ");
  return { name: name.slice(0, 3), year };
};

export function BuildLog() {
  // newest month first, and open on it
  const months = [...BUILD_LOG].reverse();
  const [active, setActive] = useState(months[0].month);
  const current = months.find((m) => m.month === active) ?? months[0];

  return (
    <Section id="build-log" title="Build log" note="An engineering journal: the problem, what I changed, and what it did.">
      {/* phones: a native select, which opens the phone's own picker */}
      <div className="relative inline-block sm:hidden">
        <label htmlFor="log-month" className="sr-only">
          Month
        </label>
        <select
          id="log-month"
          value={active}
          onChange={(e) => setActive(e.target.value)}
          className="h-12 min-w-[13rem] cursor-pointer appearance-none rounded-full border border-foreground/25 bg-card pl-5 pr-12 text-[0.98rem] text-foreground transition-colors duration-300 hover:border-foreground/50"
        >
          {months.map((m) => (
            <option key={m.month} value={m.month}>
              {m.month}
            </option>
          ))}
        </select>
        <ChevronDown aria-hidden className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/70" strokeWidth={1.8} />
      </div>

      {/* wider screens: the months along a line, oldest to newest, a dot for each entry */}
      <div role="group" aria-label="Month" className="reveal relative hidden max-w-full overflow-x-auto pb-1 sm:block">
        <div className="relative inline-flex min-w-full items-end gap-2">
          <span aria-hidden className="absolute inset-x-0 bottom-[1.05rem] h-px bg-border" />
          {BUILD_LOG.map((m) => {
            const on = m.month === active;
            const s = short(m.month);
            return (
              <button
                key={m.month}
                type="button"
                aria-pressed={on}
                aria-label={`${m.month}, ${m.entries.length} ${m.entries.length === 1 ? "entry" : "entries"}`}
                onClick={() => setActive(m.month)}
                className="group relative flex min-w-[4.6rem] flex-1 flex-col items-center gap-2 rounded-xl pb-0 pt-1"
              >
                <span className="flex h-3 items-end gap-[3px]" aria-hidden>
                  {m.entries.map((_, k) => (
                    <span key={k} className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${on ? "bg-accent" : "bg-[color-mix(in_oklab,var(--foreground)_25%,transparent)] group-hover:bg-foreground/50"}`} />
                  ))}
                </span>
                <span
                  className={`relative rounded-full border px-3.5 py-1.5 text-[0.88rem] transition-[background-color,color,border-color,transform] duration-300 ease-[var(--ease-stone)] ${
                    on ? "scale-105 border-foreground bg-foreground text-background" : "border-border bg-background text-foreground/70 group-hover:border-foreground/40 group-hover:text-foreground"
                  }`}
                >
                  {s.name} <span className="text-[0.74rem] opacity-70">{s.year}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <ul key={current.month} aria-live="polite" className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {current.entries.map((e, i) => {
          const m = measure(e.outcome);
          return (
            <Card as="li" key={e.challenge} className="reveal space-y-5 p-6" style={{ ["--i" as string]: i % 3 }}>
              <Row icon={CircleAlert} label="Problem">
                {e.challenge}
              </Row>
              <Row icon={Wrench} label="What I changed">
                {e.solution}
              </Row>
              <Row icon={TrendingUp} label="Result" strong>
                {e.outcome}
              </Row>
              {m && <Measure m={m} />}
            </Card>
          );
        })}
      </ul>
    </Section>
  );
}
