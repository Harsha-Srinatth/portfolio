import { useState } from "react";
import { CircleAlert, TrendingUp, Wrench, type LucideIcon } from "lucide-react";

import { BUILD_LOG } from "@/components/portfolio/data";
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

      <ul id="log-panel" role="tabpanel" aria-labelledby={`log-${active}`} className="mt-7 grid gap-4 md:grid-cols-3">
        {current.entries.map((e, i) => (
          <Card as="li" key={e.challenge} className="reveal space-y-5 p-6" style={{ ["--i" as string]: i }}>
            <Row icon={CircleAlert} label="Problem">
              {e.challenge}
            </Row>
            <Row icon={Wrench} label="What I changed">
              {e.solution}
            </Row>
            <Row icon={TrendingUp} label="Result" strong>
              {e.outcome}
            </Row>
          </Card>
        ))}
      </ul>
    </Section>
  );
}
