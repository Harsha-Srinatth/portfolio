import { Brain, Cpu, Database, Layers, Radio, Server, type LucideIcon } from "lucide-react";

import { FREQUENCIES } from "@/components/portfolio/data";
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
    </Section>
  );
}
