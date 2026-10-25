import { ArrowRight, Brain, Compass, Cpu, Database, Layers, Radio, Server, type LucideIcon } from "lucide-react";

import { FREQUENCIES, LEARNING_PATH } from "@/components/portfolio/data";
import { Section } from "./Section";
import { Card, Chip, IconChip } from "./ui";

const ICONS: Record<string, LucideIcon> = {
  Architecture: Layers,
  Intelligence: Brain,
  Communication: Radio,
  Infrastructure: Server,
  Data: Database,
  Algorithms: Cpu,
};

/** Learning steps already covered; the rest are where it is heading. */
const DONE = 4;

export function Skills() {
  return (
    <Section id="frequencies" title="Skills" note="The tools I reach for, grouped by the kind of problem they solve.">
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {FREQUENCIES.map((f, i) => {
          const Icon = ICONS[f.band] ?? Layers;
          return (
            <Card as="li" key={f.band} className="reveal p-6" style={{ ["--i" as string]: i % 3 }}>
              <div className="flex items-center gap-3">
                <IconChip>
                  <Icon className="h-5 w-5" strokeWidth={1.6} />
                </IconChip>
                <h3 className="font-display text-[1.35rem] font-[400] tracking-[-0.01em]">{f.band}</h3>
              </div>
              <ul className="mt-5 flex flex-wrap gap-1.5">
                {f.notes.split("•").map((n) => (
                  <li key={n.trim()}>
                    <Chip>{n.trim()}</Chip>
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </ul>

      <Card className="reveal mt-4 p-6 md:p-7">
        <div id="learning" className="flex scroll-mt-28 items-center gap-3">
          <IconChip>
            <Compass className="h-5 w-5" strokeWidth={1.6} />
          </IconChip>
          <div>
            <h3 className="font-display text-[1.35rem] font-[400] tracking-[-0.01em]">Where my learning is heading</h3>
            <p className="text-[0.85rem] text-muted-foreground">Solid steps are covered; outlined ones are next.</p>
          </div>
        </div>
        <ol className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-3">
          {LEARNING_PATH.map((step, i) => (
            <li key={step} className="flex items-center gap-2">
              <span
                className={`rounded-full px-3.5 py-1.5 text-[0.9rem] ${
                  i < DONE ? "bg-accent text-accent-foreground" : "border border-dashed border-foreground/30 text-foreground/70"
                }`}
              >
                {step}
              </span>
              {i < LEARNING_PATH.length - 1 && <ArrowRight aria-hidden className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.6} />}
            </li>
          ))}
        </ol>
      </Card>
    </Section>
  );
}
