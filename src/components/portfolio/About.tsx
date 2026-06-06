import { useMemo, useState } from "react";
import { FileText } from "lucide-react";

import { PERSON, GITHUB, BEYOND_CODE } from "./data";
import { ResumeViewer } from "./ResumeViewer";
import { SectionLabel } from "./Constellation";
import { RevealOnScroll } from "./RevealOnScroll";

// Deterministic pseudo-random heatmap that sums to 290 across 53 weeks × 7 days.
function useContributionGrid(total: number) {
  return useMemo(() => {
    const weeks = 53;
    const days = 7;
    const cells: number[] = new Array(weeks * days).fill(0);
    // seeded LCG
    let s = 1337;
    const rnd = () => {
      s = (s * 1664525 + 1013904223) % 0xffffffff;
      return s / 0xffffffff;
    };
    let remaining = total;
    // weighted active days, mostly weekdays
    while (remaining > 0) {
      const i = Math.floor(rnd() * cells.length);
      const day = i % days;
      // bias against Sundays
      if (day === 0 && rnd() < 0.7) continue;
      const add = 1 + Math.floor(rnd() * Math.min(4, remaining));
      cells[i] = Math.min(cells[i] + add, 9);
      remaining -= add;
    }
    return { cells, weeks, days };
  }, [total]);
}

function level(v: number) {
  if (v === 0) return "bg-muted/40";
  if (v <= 1) return "bg-primary/25";
  if (v <= 3) return "bg-primary/50";
  if (v <= 6) return "bg-primary/75";
  return "bg-primary";
}

export function About() {
  const [resumeOpen, setResumeOpen] = useState(false);
  const { cells, weeks, days } = useContributionGrid(GITHUB.totalContributions);

  return (
    <section id="about" className="relative w-full overflow-hidden border-t border-border bg-background">
      <SectionLabel index="01" title="About" subtitle="The basics, on the record." />
      <RevealOnScroll delay={0.06} className="mx-auto max-w-[1600px] px-6 pb-32 md:px-12 lg:px-20">
        <div className="max-w-3xl space-y-4 text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
          {PERSON.about.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </div>

        {/* Meta grid */}
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3">
          <MetaCol label="Location" value={PERSON.location} />
          <MetaCol label="Education" value={PERSON.education} />
          <MetaCol label="Also" value={PERSON.also} />
        </div>

        {/* Resume button */}
        <div className="mt-10">
          <button
            type="button"
            onClick={() => setResumeOpen(true)}
            data-cursor="link"
            className="inline-flex items-center gap-3 rounded-2xl border border-border bg-card px-6 py-4 font-mono text-sm tracking-wide transition-colors hover:border-primary hover:text-primary"
          >
            <FileText className="h-4 w-4" />
            View Resume
          </button>
        </div>

        {/* GitHub contributions */}
        <div className="mt-14 overflow-hidden rounded-3xl border border-border bg-card/40 p-6 md:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div className="font-mono text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
              {GITHUB.totalContributions} contributions in {GITHUB.year}
            </div>
            <a
              href="https://github.com/Harsha-Srinatth"
              target="_blank"
              rel="noreferrer"
              data-cursor="link"
              className="font-mono text-[11px] uppercase tracking-[0.35em] text-muted-foreground hover:text-primary"
            >
              @Harsha-Srinatth ↗
            </a>
          </div>

          <div className="mt-6 overflow-x-auto">
            <div
              className="grid gap-[3px]"
              style={{
                gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))`,
                gridAutoFlow: "column",
                gridTemplateRows: `repeat(${days}, 12px)`,
                minWidth: weeks * 15,
              }}
            >
              {cells.map((v, i) => (
                <div
                  key={i}
                  className={`h-3 w-3 rounded-[3px] ${level(v)}`}
                  title={`${v} contribution${v === 1 ? "" : "s"}`}
                />
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            <span>JavaScript · Python · {GITHUB.repoCount} repos</span>
            <span className="flex items-center gap-2">
              less
              {[0, 1, 3, 6, 9].map((n) => (
                <span key={n} className={`h-2.5 w-2.5 rounded-[2px] ${level(n)}`} />
              ))}
              more
            </span>
          </div>
        </div>

        {/* Beyond code */}
        <div className="mt-14">
          <div className="font-mono text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
            Beyond code
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            {BEYOND_CODE.map((b) => (
              <div
                key={b.label}
                className="rounded-2xl border border-border bg-card/40 px-5 py-6 text-center transition-colors hover:border-primary"
              >
                <div className="text-2xl">{b.icon}</div>
                <div className="mt-2 font-display text-lg tracking-tight">{b.label}</div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  {b.note}
                </div>
              </div>
            ))}
          </div>
        </div>
      </RevealOnScroll>

      <ResumeViewer open={resumeOpen} onClose={() => setResumeOpen(false)} />
    </section>
  );
}

function MetaCol({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary">{label}</div>
      <div className="mt-2 text-base text-foreground md:text-lg">{value}</div>
    </div>
  );
}