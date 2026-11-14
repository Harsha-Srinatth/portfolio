import { Brain, Cpu, Database, Layers, Radio, Server, type LucideIcon } from "lucide-react";

import { FREQUENCIES, PROJECTS } from "@/components/portfolio/data";
import { showProject } from "./motionEvents";
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

/**
 * Which entries in a project's stack show a skill in use. Skills not listed
 * here are matched by their own name.
 */
const SHOWN_BY: Record<string, string[]> = {
  Node: ["Node.js"],
  "Express.js": ["Express"],
  "JWT Authentication": ["JWT"],
  "Realtime Systems": ["Socket.IO"],
  "REST APIs": ["Express", "FastAPI", "Flask"],
  Python: ["Python ML", "FastAPI", "Flask", "scikit-learn"],
  ML: ["Python ML", "scikit-learn"],
  Deployment: ["Render"],
};

/** The projects on this page that use a skill. */
function usedIn(skill: string) {
  const names = SHOWN_BY[skill] ?? [skill];
  return PROJECTS.filter((p) => p.stack.some((t) => names.includes(t)));
}

export function Skills() {
  return (
    <Section id="frequencies" title="Skills" note="The tools I reach for, grouped by the kind of problem they solve. A dot marks the ones you can see at work in a project above.">
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
                {f.notes.split("•").map((raw, j) => {
                  const n = raw.trim();
                  const projects = usedIn(n);
                  return (
                    <li key={n} className="chip-pop" style={{ ["--j" as string]: j }}>
                      {projects.length ? (
                        // opens the first project that uses it
                        <button
                          type="button"
                          data-tip={`Used in ${projects.map((p) => p.title).join(", ")}`}
                          aria-label={`${n}: used in ${projects.map((p) => p.title).join(", ")}. Show ${projects[0].title}`}
                          onClick={() => {
                            showProject(projects[0].id);
                            document.getElementById("constellation")?.scrollIntoView({ behavior: "smooth", block: "start" });
                          }}
                          className="tip rounded-full"
                        >
                          <Chip className="transition-colors duration-300 hover:border-accent hover:text-foreground">
                            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
                            {n}
                          </Chip>
                        </button>
                      ) : (
                        <Chip>{n}</Chip>
                      )}
                    </li>
                  );
                })}
              </ul>
            </Card>
          );
        })}
      </ul>
    </Section>
  );
}
