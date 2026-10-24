import { STRATA } from "@/components/portfolio/data";
import { Section } from "./Section";

/** How the work has grown, laid down like courses of stone. */
export function Path() {
  return (
    <Section id="strata" title="Path" note="Knowledge built up layer by layer — through study, curiosity and shipping things.">
      <ol className="border-t border-border">
        {STRATA.map((s) => (
          <li key={s.role} className="grid gap-4 border-b border-border py-9 md:grid-cols-[9rem_1fr] md:py-11">
            <span className="pt-1.5 text-[0.85rem] text-muted-foreground">{s.era}</span>
            <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr] xl:gap-12">
              <div>
                <h3 className="font-display text-[clamp(1.55rem,2.3vw,2.1rem)] font-[370] leading-[1.12] tracking-[-0.01em]">{s.role}</h3>
                <p className="mt-2 text-[0.92rem] text-muted-foreground">{s.org}</p>
              </div>
              <div>
                <p className="text-pretty text-[1.02rem] leading-[1.7] text-foreground/80">{s.arc}</p>
                <p className="mt-4 text-[0.9rem] leading-relaxed text-muted-foreground">{s.artifacts.join(", ")}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
