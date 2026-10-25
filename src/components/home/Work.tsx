import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight, CircleCheck, Layers, LayoutDashboard, Sparkles } from "lucide-react";

import { PROJECTS, type Project } from "@/components/portfolio/data";
import { ProjectArt } from "./ProjectArt";
import { Section } from "./Section";
import { Card, Chip, GithubMark, IconChip, NamedIcon } from "./ui";

const firstSentence = (s: string) => {
  const i = s.indexOf(". ");
  return i === -1 ? s : s.slice(0, i + 1);
};

function Featured({ p }: { p: Project }) {
  return (
    <>
      <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.05fr] lg:gap-12">
        <div>
          <p className="text-[0.88rem] text-muted-foreground">
            {p.kind}, {p.year}
          </p>
          <h3 className="font-display mt-2 text-[clamp(2.1rem,4vw,3.6rem)] font-[370] leading-[1.02] tracking-[-0.025em]">{p.title}</h3>
          <p className="mt-5 max-w-[36rem] text-pretty text-[1.05rem] leading-[1.65] text-foreground/75">{p.blurb}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            {p.url && (
              <a href={p.url} target="_blank" rel="noreferrer" className="btn btn-solid">
                Live demo
                <ArrowRight className="h-4 w-4" strokeWidth={1.6} />
              </a>
            )}
            {p.repo && (
              <a href={p.repo} target="_blank" rel="noreferrer" className="btn btn-line">
                <GithubMark className="h-4 w-4" />
                Source code
              </a>
            )}
            {!p.url && !p.repo && <p className="text-[0.9rem] text-muted-foreground">Demo and source available on request.</p>}
          </div>
          <ul className="mt-9 grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4">
            {p.highlights.map((h) => (
              <li key={h.label} className="flex flex-col gap-2 text-[0.88rem] leading-snug">
                <span className="text-accent">
                  <NamedIcon name={h.icon} className="h-5 w-5" />
                </span>
                {h.label}
              </li>
            ))}
          </ul>
        </div>
        <div className="mx-auto w-full max-w-[34rem]">
          <ProjectArt id={p.id} />
        </div>
      </div>

      <div className="mt-9 grid gap-8 border-t border-border pt-8 md:grid-cols-3 md:gap-10">
        <div>
          <div className="flex items-center gap-3">
            <IconChip className="!h-9 !w-9">
              <LayoutDashboard className="h-4 w-4" strokeWidth={1.6} />
            </IconChip>
            <h4 className="text-[0.95rem] font-medium">Overview</h4>
          </div>
          <p className="mt-4 text-pretty text-[0.95rem] leading-[1.65] text-foreground/75">{firstSentence(p.detail)}</p>
        </div>
        <div>
          <div className="flex items-center gap-3">
            <IconChip className="!h-9 !w-9">
              <Sparkles className="h-4 w-4" strokeWidth={1.6} />
            </IconChip>
            <h4 className="text-[0.95rem] font-medium">Key features</h4>
          </div>
          <ul className="mt-4 space-y-2.5">
            {p.features.map((f) => (
              <li key={f} className="flex gap-2.5 text-[0.95rem] leading-snug text-foreground/80">
                <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.7} aria-hidden />
                {f}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="flex items-center gap-3">
            <IconChip className="!h-9 !w-9">
              <Layers className="h-4 w-4" strokeWidth={1.6} />
            </IconChip>
            <h4 className="text-[0.95rem] font-medium">Tech stack</h4>
          </div>
          <ul className="mt-4 flex flex-wrap gap-2">
            {p.stack.map((t) => (
              <li key={t}>
                <Chip>{t}</Chip>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export function Work() {
  const [active, setActive] = useState(PROJECTS[0].id);
  const reduce = useReducedMotion();
  const view = useRef<HTMLDivElement>(null);
  const current = PROJECTS.find((p) => p.id === active) ?? PROJECTS[0];

  // picking a project brings its full view into sight, if it is not already
  const pick = (id: string) => {
    setActive(id);
    const el = view.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.top < 0 || r.top > window.innerHeight * 0.35) {
      el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
  };

  return (
    <Section id="constellation" title="Work" note="Selected projects. Pick one to see how it was built.">
      <div ref={view} className="scroll-mt-6">
        <Card className="p-6 sm:p-8 lg:p-10">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.id}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              aria-live="polite"
            >
              <Featured p={current} />
            </motion.div>
          </AnimatePresence>
        </Card>
      </div>

      <h3 className="mt-10 text-[0.95rem] text-muted-foreground">All projects ({PROJECTS.length})</h3>
      <ul className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {PROJECTS.map((p, i) => {
          const on = p.id === active;
          return (
            <li key={p.id} className="reveal relative">
              <div
                className={`flex h-full flex-col rounded-[1.4rem] border p-5 transition-[border-color,background-color,box-shadow] duration-300 ${
                  on ? "border-accent bg-card shadow-[0_18px_40px_-28px_rgb(61_92_73/0.6)] ring-1 ring-accent/40" : "border-border bg-card/55 hover:border-foreground/30"
                }`}
              >
                <span className={`text-[0.85rem] tabular-nums ${on ? "text-accent" : "text-muted-foreground"}`}>{String(i + 1).padStart(2, "0")}</span>
                <div className="mx-auto mt-2 w-full max-w-[17rem]">
                  <ProjectArt id={p.id} />
                </div>
                <h4 className="font-display mt-3 text-[1.3rem] font-[400] leading-[1.15] tracking-[-0.01em]">{p.title}</h4>
                <p className="mt-1.5 text-[0.88rem] leading-snug text-muted-foreground">{p.short}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.stack.slice(0, 3).map((t) => (
                    <Chip key={t} className="!px-2.5 !py-0.5 !text-[0.75rem]">
                      {t}
                    </Chip>
                  ))}
                </div>
                <span className="mt-auto flex items-center gap-2 pt-5 text-[0.85rem] text-foreground/75">
                  <span
                    aria-hidden
                    className={`grid h-9 w-9 place-items-center rounded-full border transition-colors duration-300 ${
                      on ? "border-accent bg-accent text-accent-foreground" : "border-foreground/25"
                    }`}
                  >
                    <ArrowRight className="h-4 w-4" strokeWidth={1.6} />
                  </span>
                  {on ? "Showing above" : "View details"}
                </span>
              </div>
              {/* the whole card selects the project */}
              <button
                type="button"
                aria-pressed={on}
                aria-label={`Show ${p.title}`}
                onClick={() => pick(p.id)}
                className="absolute inset-0 rounded-[1.4rem]"
              />
              {p.url && (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open ${p.title} in a new tab`}
                  className="absolute right-4 top-4 z-10 grid h-8 w-8 place-items-center rounded-full text-foreground/60 transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.6} />
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
