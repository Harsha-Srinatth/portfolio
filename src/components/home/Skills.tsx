import { FREQUENCIES, LEARNING_PATH } from "@/components/portfolio/data";
import { Section } from "./Section";

export function Skills() {
  return (
    <Section id="frequencies" title="Skills" note="The tools I reach for, grouped by the kind of problem they solve.">
      <div className="grid grid-cols-1 gap-x-12 gap-y-10 border-t border-border pt-10 sm:grid-cols-2 xl:grid-cols-3">
        {FREQUENCIES.map((f) => (
          <div key={f.band}>
            <h3 className="font-display text-[1.45rem] font-[380] tracking-[-0.01em]">{f.band}</h3>
            <ul className="mt-3 space-y-1.5 text-[0.98rem] text-foreground/75">
              {f.notes.split("•").map((n) => (
                <li key={n.trim()}>{n.trim()}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div id="learning" className="mt-16 scroll-mt-28 border-t border-border pt-10">
        <h3 className="text-[0.95rem] text-muted-foreground">Where my learning is heading</h3>
        <ol className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-3 text-[1.02rem]">
          {LEARNING_PATH.map((step, i) => (
            <li key={step} className="flex items-center gap-3">
              <span
                className={`rounded-full border px-4 py-1.5 ${
                  i < 4 ? "border-foreground/25" : "border-dashed border-foreground/20 text-foreground/65"
                }`}
              >
                {step}
              </span>
              {i < LEARNING_PATH.length - 1 && (
                <span aria-hidden className="h-px w-5 bg-foreground/30" />
              )}
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
