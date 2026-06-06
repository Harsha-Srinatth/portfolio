import { STRATA } from "./data";
import { SectionLabel } from "./Constellation";
import { RevealOnScroll } from "./RevealOnScroll";

export function Stratum() {
  return (
    <section id="strata" className="relative w-full overflow-hidden border-t border-border bg-background">
      <SectionLabel index="03" title="Evolution" subtitle="Knowledge accumulated through curiosity and building." />
      <RevealOnScroll delay={0.06} className="mx-auto max-w-[1600px] px-6 pb-32 md:px-12 lg:px-20">
        <div className="overflow-hidden rounded-3xl border border-border">
          {STRATA.map((s, i) => (
            <Layer key={s.era} s={s} i={i} total={STRATA.length} />
          ))}
        </div>
      </RevealOnScroll>
    </section>
  );
}

function Layer({
  s,
  i,
  total,
}: {
  s: (typeof STRATA)[number];
  i: number;
  total: number;
}) {
  // Slightly lighten each stratum so it reads as geology
  const depth = i / Math.max(1, total - 1);
  const tone = `color-mix(in oklab, var(--color-card) ${88 - depth * 30}%, var(--color-primary) ${depth * 30}%)`;
  return (
    <div
      data-cursor="link"
      className="group relative grid grid-cols-12 items-center gap-6 border-b border-border/60 px-6 py-10 md:px-10 md:py-14 last:border-b-0 transition-[padding] duration-500 hover:py-20"
      style={{ background: tone }}
    >
      {/* Era index */}
      <div className="col-span-12 md:col-span-2 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
        {s.era}
      </div>
      <div className="col-span-12 md:col-span-5">
        <h3 className="font-display text-3xl md:text-4xl leading-tight tracking-tight">{s.role}</h3>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.3em] text-primary">{s.org}</p>
      </div>
      <div className="col-span-12 md:col-span-5">
        <p className="text-base leading-relaxed text-foreground/90">{s.arc}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {s.artifacts.map((a) => (
            <span
              key={a}
              className="rounded-full border border-border bg-background/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground"
            >
              {a}
            </span>
          ))}
        </div>
      </div>
      {/* Depth marker */}
      <div className="pointer-events-none absolute right-4 top-4 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/70">
        depth · {s.depthLabel}
      </div>
    </div>
  );
}