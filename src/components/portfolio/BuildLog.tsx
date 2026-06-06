import { useState } from "react";
import { BUILD_LOG } from "./data";
import { SectionLabel } from "./Constellation";

export function BuildLog() {
  const [active, setActive] = useState(BUILD_LOG[0].month);
  const current = BUILD_LOG.find((m) => m.month === active) ?? BUILD_LOG[0];

  return (
    <section id="build-log" className="relative w-full overflow-hidden border-t border-border bg-background">
      <SectionLabel index="07" title="Build Log" subtitle="Engineering journal — challenge → solution → outcome." />
      <div className="mx-auto max-w-[1600px] px-6 pb-32 md:px-12 lg:px-20">
        <div className="overflow-hidden rounded-3xl border border-border bg-card/40">
          {/* terminal chrome */}
          <div className="flex items-center gap-2 border-b border-border bg-background/50 px-5 py-3">
            <span className="h-3 w-3 rounded-full bg-destructive/80" />
            <span className="h-3 w-3 rounded-full bg-primary/80" />
            <span className="h-3 w-3 rounded-full bg-accent/80" />
            <span className="ml-4 font-mono text-[11px] text-muted-foreground">~/notes/build.log</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr]">
            <aside className="border-b border-border p-4 md:border-b-0 md:border-r">
              <ul className="space-y-1">
                {BUILD_LOG.map((m) => (
                  <li key={m.month}>
                    <button
                      data-cursor="link"
                      onClick={() => setActive(m.month)}
                      className={`w-full rounded-lg px-3 py-2 text-left font-mono text-xs transition-colors ${
                        active === m.month
                          ? "bg-foreground text-background"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {m.month}
                    </button>
                  </li>
                ))}
              </ul>
            </aside>
            <div className="p-6 font-mono text-sm leading-relaxed">
              <div className="text-muted-foreground">
                $ <span className="text-foreground">tail -f build.log</span> — {current.month}
              </div>
              <div className="mt-6 space-y-6">
                {current.entries.map((e, i) => (
                  <div key={i}>
                    <div className="text-muted-foreground">#{String(i + 1).padStart(2, "0")}</div>
                    <div>
                      <span className="text-muted-foreground">challenge:</span> {e.challenge}
                    </div>
                    <div>
                      <span className="text-muted-foreground">solution:</span> {e.solution}
                    </div>
                    <div className="text-primary">→ {e.outcome}</div>
                  </div>
                ))}
                <div className="inline-block h-4 w-2 animate-pulse bg-foreground" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}