import { useState } from "react";
import { ChevronDown, CircleAlert, TrendingUp, Wrench, type LucideIcon } from "lucide-react";

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
  // newest month first, and open on it
  const months = [...BUILD_LOG].reverse();
  const [active, setActive] = useState(months[0].month);
  const current = months.find((m) => m.month === active) ?? months[0];

  return (
    <Section id="build-log" title="Build log" note="An engineering journal: the problem, what I changed, and what it did.">
      {/* a native select: it opens the phone's own picker, and scales to any number of months */}
      <div className="relative inline-block">
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

      <ul key={current.month} aria-live="polite" className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {current.entries.map((e, i) => (
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
          </Card>
        ))}
      </ul>
    </Section>
  );
}
