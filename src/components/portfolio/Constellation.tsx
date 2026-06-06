import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PROJECTS, type Project } from "./data";
import { RevealOnScroll } from "./RevealOnScroll";

export function Constellation() {
  const [active, setActive] = useState<Project>(PROJECTS[0]);
  const positions = useMemo(() => {
    return PROJECTS.map((_, i) => {
      const angle = (i / PROJECTS.length) * Math.PI * 2 - Math.PI / 2;
      return { x: 50 + Math.cos(angle) * 36, y: 50 + Math.sin(angle) * 36 };
    });
  }, []);

  return (
    <section
      id="constellation"
      className="relative w-full overflow-hidden border-t border-border bg-background"
    >
      <SectionLabel index="02" title="Projects" subtitle="Selected builds. Hover to explore." />

      <RevealOnScroll delay={0.06} className="mx-auto grid max-w-[1600px] grid-cols-1 gap-12 px-6 pb-32 md:px-12 lg:grid-cols-12 lg:gap-8 lg:px-20">
        {/* Map */}
        <div className="relative lg:col-span-7">
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-border bg-card/30 grid-paper">
            {/* Lines between projects and active */}
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {positions.map((p, i) => {
                if (PROJECTS[i].id === active.id) return null;
                const ap = positions[PROJECTS.findIndex((x) => x.id === active.id)];
                return (
                  <line
                    key={i}
                    x1={p.x}
                    y1={p.y}
                    x2={ap.x}
                    y2={ap.y}
                    stroke="currentColor"
                    strokeWidth={0.15}
                    className="text-foreground/30"
                    strokeDasharray="0.6 0.6"
                  />
                );
              })}
            </svg>

            {/* Concentric rings */}
            {[20, 30, 40].map((r) => (
              <div
                key={r}
                className="absolute rounded-full border border-border/60"
                style={{
                  width: `${r * 2}%`,
                  height: `${r * 2}%`,
                  left: `${50 - r}%`,
                  top: `${50 - r}%`,
                }}
              />
            ))}

            {/* Nodes */}
            {PROJECTS.map((p, i) => {
              const pos = positions[i];
              const isActive = p.id === active.id;
              return (
                <button
                  key={p.id}
                  data-cursor="link"
                  onMouseEnter={() => setActive(p)}
                  onFocus={() => setActive(p)}
                  onClick={() => setActive(p)}
                  className="group absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                >
                  <div className="relative grid place-items-center">
                    <span
                      className="absolute rounded-full transition-all duration-500"
                      style={{
                        width: isActive ? 84 : 36,
                        height: isActive ? 84 : 36,
                        background: `conic-gradient(from ${p.hue}deg, var(--color-primary), var(--color-accent), transparent 70%)`,
                        opacity: isActive ? 0.45 : 0.15,
                        filter: "blur(8px)",
                      }}
                    />
                    <span
                      className="relative grid place-items-center rounded-full border bg-background transition-all duration-300"
                      style={{
                        width: isActive ? 22 : 14,
                        height: isActive ? 22 : 14,
                        borderColor: isActive ? "var(--color-primary)" : "var(--color-border)",
                      }}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: isActive ? "var(--color-primary)" : "var(--color-muted-foreground)" }}
                      />
                    </span>
                    <span
                      className={`absolute top-full mt-3 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.3em] transition-colors ${
                        isActive ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {p.codename}
                    </span>
                  </div>
                </button>
              );
            })}

            {/* Center reading */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
                signal strength
              </div>
              <div className="mt-2 font-display text-5xl text-foreground tabular-nums">
                {(active.signal * 100).toFixed(0)}
                <span className="text-base text-muted-foreground">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detail */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.article
              key={active.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em] text-primary">
                <span>{active.codename}</span>
                <span className="h-px flex-1 bg-border" />
                <span className="text-muted-foreground">{active.year}</span>
              </div>
              <h3 className="font-display mt-6 text-5xl md:text-6xl leading-[0.95] tracking-tight">
                {active.url ? (
                  <a
                    href={active.url}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="link"
                    className="transition-colors hover:text-primary"
                  >
                    {active.title}
                  </a>
                ) : (
                  active.title
                )}
              </h3>
              <p className="mt-3 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
                {active.kind}
              </p>
              <p className="mt-8 text-lg leading-relaxed text-foreground/90">{active.blurb}</p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">{active.detail}</p>

              <dl className="mt-10 grid grid-cols-3 gap-4">
                {active.metrics.map((m) => (
                  <div key={m.label} className="rounded-xl border border-border bg-card/40 p-4">
                    <dt className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
                      {m.label}
                    </dt>
                    <dd className="mt-2 font-display text-xl text-foreground">{m.value}</dd>
                  </div>
                ))}
              </dl>
            </motion.article>
          </AnimatePresence>
        </div>
      </RevealOnScroll>
    </section>
  );
}

export function SectionLabel({
  index,
  title,
  subtitle,
}: {
  index: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <RevealOnScroll>
      <div className="mx-auto flex max-w-[1600px] items-end justify-between gap-6 px-6 pt-28 pb-12 md:px-12 lg:px-20">
        <div className="flex items-end gap-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary">
            §{index}
          </span>
          <h2 className="font-display text-4xl md:text-6xl tracking-tight">{title}</h2>
        </div>
        {subtitle && (
          <p className="hidden md:block max-w-xs text-right font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
    </RevealOnScroll>
  );
}