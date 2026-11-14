import { ArrowRight, Brain, CalendarDays, GraduationCap, Layers, type LucideIcon } from "lucide-react";

import { STRATA } from "@/components/portfolio/data";
import { Vine } from "./Ambient";
import { Section } from "./Section";
import { Card, Chip, IconChip } from "./ui";

const ICONS: LucideIcon[] = [GraduationCap, Layers, Brain];
const since = (era: string) => era.replace(/(\d{4})\s*[—–-]\s*Present/i, "Since $1");

/** How the work has grown: three stages, one after another. */
export function Path() {
  return (
    <Section id="strata" title="Path" note="Knowledge built up layer by layer, through study, curiosity and shipping things.">
      <Vine />
      <ol className="grid gap-4 md:grid-cols-3 md:gap-5">
        {STRATA.map((s, i) => {
          const Icon = ICONS[i] ?? Layers;
          return (
            <Card as="li" key={s.role} className="reveal with-vine relative flex flex-col p-6 md:p-7" style={{ ["--i" as string]: i }}>
              <div className="flex items-center justify-between gap-3">
                <IconChip>
                  <Icon className="h-5 w-5" strokeWidth={1.6} />
                </IconChip>
                <Chip>
                  <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.6} aria-hidden />
                  {since(s.era)}
                </Chip>
              </div>
              <h3 className="font-display mt-6 text-[1.5rem] font-[390] leading-[1.15] tracking-[-0.01em]">{s.role}</h3>
              <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.88rem] text-muted-foreground">
                {s.org}
                {/* still going: each stage is ongoing */}
                <span className="inline-flex items-center gap-2 text-accent">
                  <span className="pulse-dot" aria-hidden />
                  {s.depthLabel}
                </span>
              </p>
              <p className="mt-4 text-pretty text-[0.97rem] leading-[1.6] text-foreground/75">{s.arc}</p>
              <ul className="mt-auto flex flex-wrap gap-1.5 pt-6">
                {s.artifacts.map((a, j) => (
                  <li key={a} className="chip-pop" style={{ ["--j" as string]: j + i * 6 }}>
                    <Chip className="!text-[0.78rem]">{a}</Chip>
                  </li>
                ))}
              </ul>
              {i < STRATA.length - 1 && (
                <span aria-hidden className="absolute -right-[1.15rem] top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 place-items-center rounded-full border border-border bg-background text-muted-foreground md:grid">
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.6} />
                </span>
              )}
            </Card>
          );
        })}
      </ol>
    </Section>
  );
}
