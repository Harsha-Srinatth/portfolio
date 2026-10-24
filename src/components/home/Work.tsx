import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Plus } from "lucide-react";

import { PROJECTS } from "@/components/portfolio/data";
import { Section } from "./Section";

export function Work() {
  const [open, setOpen] = useState<string | null>(PROJECTS[0].id);

  return (
    <Section id="constellation" title="Work" note="Selected projects. Open one to read how it was built.">
      <ul className="border-t border-border">
        {PROJECTS.map((p) => {
          const isOpen = open === p.id;
          return (
            <li key={p.id} className="border-b border-border">
              <h3>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`${p.id}-detail`}
                  onClick={() => setOpen(isOpen ? null : p.id)}
                  className="group grid w-full grid-cols-[1fr_auto] items-start gap-6 py-8 text-left md:grid-cols-[9rem_1fr_auto] md:py-10"
                >
                  <span className="hidden pt-2 text-[0.85rem] text-muted-foreground md:block">{p.year}</span>
                  <span>
                    <span className="font-display block text-[clamp(1.7rem,2.9vw,2.6rem)] font-[370] leading-[1.08] tracking-[-0.015em] transition-colors duration-500 group-hover:text-accent">
                      {p.title}
                    </span>
                    <span className="mt-2 block text-[0.92rem] text-muted-foreground">{p.kind}</span>
                  </span>
                  <span
                    className={`mt-2 grid h-10 w-10 place-items-center rounded-full border border-foreground/25 transition-[transform,background-color,color] duration-500 ease-[var(--ease-stone)] group-hover:border-foreground/60 ${
                      isOpen ? "rotate-45 bg-foreground text-background" : ""
                    }`}
                    aria-hidden
                  >
                    <Plus className="h-4 w-4" strokeWidth={1.6} />
                  </span>
                </button>
              </h3>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`${p.id}-detail`}
                    key="detail"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="grid gap-8 pb-12 md:grid-cols-[9rem_1fr]">
                      <span aria-hidden className="hidden md:block" />
                      <div className="max-w-[44rem]">
                        <p className="text-pretty text-[1.12rem] leading-[1.65]">{p.blurb}</p>
                        <p className="mt-5 text-pretty text-[0.98rem] leading-[1.75] text-foreground/70">{p.detail}</p>
                        <dl className="mt-9 grid grid-cols-1 gap-5 border-t border-border pt-7 sm:grid-cols-3">
                          {p.metrics.map((m) => (
                            <div key={m.label}>
                              <dt className="text-[0.8rem] text-muted-foreground">{m.label}</dt>
                              <dd className="mt-1 text-[0.98rem]">{m.value}</dd>
                            </div>
                          ))}
                        </dl>
                        {p.url && (
                          <a href={p.url} target="_blank" rel="noreferrer" className="btn btn-line mt-9">
                            Visit {p.title}
                            <ArrowUpRight className="h-4 w-4" strokeWidth={1.6} />
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
