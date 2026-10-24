import { useState } from "react";

import { BUILD_LOG } from "@/components/portfolio/data";
import { Section } from "./Section";

export function BuildLog() {
  const [active, setActive] = useState(BUILD_LOG[0].month);
  const current = BUILD_LOG.find((m) => m.month === active) ?? BUILD_LOG[0];

  return (
    <Section id="build-log" title="Build log" note="An engineering journal: the problem, what I changed, and what it did.">
      <div role="tablist" aria-label="Month" className="flex flex-wrap gap-2">
        {BUILD_LOG.map((m) => {
          const selected = m.month === active;
          return (
            <button
              key={m.month}
              type="button"
              role="tab"
              id={`log-${m.month}`}
              aria-selected={selected}
              aria-controls="log-panel"
              onClick={() => setActive(m.month)}
              className={`h-10 rounded-full px-4 text-[0.9rem] transition-colors duration-500 ${
                selected ? "bg-foreground text-background" : "border border-foreground/20 text-foreground/75 hover:border-foreground/50 hover:text-foreground"
              }`}
            >
              {m.month}
            </button>
          );
        })}
      </div>

      <div id="log-panel" role="tabpanel" aria-labelledby={`log-${active}`} className="mt-10">
        <div className="hidden grid-cols-3 gap-8 border-b border-border pb-3 text-[0.82rem] text-muted-foreground md:grid">
          <span>Problem</span>
          <span>What I changed</span>
          <span>Result</span>
        </div>
        <ul>
          {current.entries.map((e) => (
            <li key={e.challenge} className="grid gap-2 border-b border-border py-6 md:grid-cols-3 md:gap-8">
              <p className="text-[1.02rem] leading-relaxed">{e.challenge}</p>
              <p className="text-[1rem] leading-relaxed text-foreground/75">
                <span className="text-muted-foreground md:hidden">Changed: </span>
                {e.solution}
              </p>
              <p className="text-[1rem] leading-relaxed text-accent">
                <span className="text-muted-foreground md:hidden">Result: </span>
                {e.outcome}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
