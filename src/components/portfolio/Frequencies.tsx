import { FREQUENCIES } from "./data";
import { SectionLabel } from "./Constellation";

export function Frequencies() {
  return (
    <section id="frequencies" className="relative w-full overflow-hidden border-t border-border bg-background">
      <SectionLabel index="04" title="Frequencies" subtitle="Skills as radio signals — waves, overlap, and evolution." />
      <div className="mx-auto max-w-[1600px] px-6 pb-32 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Oscilloscope */}
          <div className="lg:col-span-7 relative aspect-[16/10] overflow-hidden rounded-3xl border border-border bg-card/30 grid-paper">
            <svg viewBox="0 0 800 500" className="absolute inset-0 h-full w-full">
              <defs>
                <linearGradient id="osc" x1="0" x2="1">
                  <stop offset="0" stopColor="var(--color-primary)" />
                  <stop offset="1" stopColor="var(--color-accent)" />
                </linearGradient>
              </defs>
              {FREQUENCIES.map((f, i) => {
                const amp = 30 + f.weight * 90;
                const freq = 0.012 + i * 0.004;
                const phase = i * 0.7;
                const y = 60 + i * 60;
                let d = `M 0 ${y}`;
                for (let x = 0; x <= 800; x += 4) {
                  d += ` L ${x} ${y + Math.sin(x * freq + phase) * amp * (1 - Math.abs(x - 400) / 1200)}`;
                }
                return (
                  <path
                    key={f.band}
                    d={d}
                    fill="none"
                    stroke="url(#osc)"
                    strokeWidth={1.2}
                    opacity={0.55 + f.weight * 0.45}
                  />
                );
              })}
            </svg>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-full bg-gradient-to-b from-background/60 via-transparent to-background/60" />
            <div className="absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              osc · 6-band · live
            </div>
          </div>

          {/* Band readout */}
          <ul className="lg:col-span-5 divide-y divide-border rounded-3xl border border-border">
            {FREQUENCIES.map((f) => (
              <li
                key={f.band}
                data-cursor="link"
                className="group grid grid-cols-12 items-center gap-3 px-5 py-4 transition-colors hover:bg-card/40"
              >
                <div className="col-span-3 font-display text-lg">{f.band}</div>
                <div className="col-span-6">
                  <div className="relative h-[2px] w-full bg-border">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent"
                      style={{ width: `${f.weight * 100}%` }}
                    />
                    {/* tick marks */}
                    <div className="absolute inset-0 flex justify-between">
                      {Array.from({ length: 11 }).map((_, i) => (
                        <span key={i} className="h-2 w-px -translate-y-1/2 bg-border/80" />
                      ))}
                    </div>
                  </div>
                  <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    {f.notes}
                  </div>
                </div>
                <div className="col-span-3 text-right font-mono text-sm tabular-nums text-foreground">
                  {(f.weight * 100).toFixed(1)}
                  <span className="text-muted-foreground"> dB</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}