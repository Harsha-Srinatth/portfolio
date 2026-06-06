import { SIGNALS } from "./data";

export function Ticker() {
  const items = [...SIGNALS, ...SIGNALS];
  return (
    <div className="relative overflow-hidden border-y border-border bg-background/40 py-2 backdrop-blur-sm">
      <div className="flex anim-ticker whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
        {items.map((s, i) => (
          <span key={i} className="mx-8 flex items-center gap-3">
            <span className="inline-block h-1 w-1 rounded-full bg-primary anim-glow" />
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}