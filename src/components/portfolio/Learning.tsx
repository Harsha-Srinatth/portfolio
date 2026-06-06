import { LEARNING_PATH } from "./data";
import { SectionLabel } from "./Constellation";
import { RevealOnScroll } from "./RevealOnScroll";

export function Learning() {
  return (
    <section id="learning" className="relative w-full overflow-hidden border-t border-border bg-background">
      <SectionLabel index="06" title="Learning Vector" subtitle="A progression from code to emergence." />
      <RevealOnScroll delay={0.06} className="mx-auto max-w-[1600px] px-6 pb-32 md:px-12 lg:px-20">
        <div className="rounded-3xl border border-dashed border-border bg-card/30 p-6 md:p-8">
          <div className="mb-6 font-mono text-[10px] uppercase tracking-[0.4em] text-primary">
            Learning vector →
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {LEARNING_PATH.map((step, i) => (
              <div key={step} className="flex items-center gap-3">
                <span className="rounded-xl border border-border bg-background px-4 py-2 font-mono text-xs tracking-wide">
                  {step}
                </span>
                {i < LEARNING_PATH.length - 1 && (
                  <span className="font-mono text-muted-foreground">→</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}