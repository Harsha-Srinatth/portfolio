import { Briefcase, CalendarDays, CircleCheck } from "lucide-react";

import { EXPERIENCE } from "@/components/portfolio/data";
import { Section } from "./Section";
import { Card, Chip, IconChip } from "./ui";

const day = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

/** Where I work: the company, the roles held there (newest first) and what the work has been. */
export function Experience() {
  return (
    <Section id="experience" title="Experience" note="Where I work now, and what I have built there.">
      <ul className="space-y-4">
        {EXPERIENCE.map((job) => {
          const current = job.roles.find((r) => !r.end);
          return (
            <Card as="li" key={job.company} flat className="reveal p-6 sm:p-8 lg:p-10">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <IconChip className="!h-12 !w-12">
                    <Briefcase className="h-5 w-5" strokeWidth={1.6} />
                  </IconChip>
                  <div>
                    <h3 className="font-display text-[clamp(1.7rem,2.6vw,2.3rem)] font-[380] leading-[1.05] tracking-[-0.02em]">{job.company}</h3>
                    <p className="mt-1 text-[0.9rem] text-muted-foreground">{job.about}</p>
                  </div>
                </div>
                {current && (
                  <span className="inline-flex items-center gap-2.5 rounded-full border border-accent/40 bg-[color-mix(in_oklab,var(--accent)_9%,transparent)] px-4 py-2 text-[0.9rem] text-accent">
                    <span className="pulse-dot" aria-hidden />
                    Current role: {current.title}
                  </span>
                )}
              </div>

              <div className="mt-8 grid gap-10 border-t border-border pt-8 lg:grid-cols-[minmax(0,19rem)_1fr] lg:gap-14">
                {/* the roles, newest first, down a line */}
                <ol className="relative space-y-7">
                  <span aria-hidden className="absolute bottom-3 left-[7px] top-3 w-px bg-[color-mix(in_oklab,var(--twig)_30%,var(--border))]" />
                  {job.roles.map((r, j) => (
                    <li key={r.start} className="pop relative pl-8" style={{ ["--j" as string]: j * 4 }}>
                      <span
                        aria-hidden
                        className={`absolute left-0 top-[0.4rem] h-[15px] w-[15px] rounded-full border-2 ${r.end ? "border-[color-mix(in_oklab,var(--foreground)_30%,var(--background))] bg-card" : "border-accent bg-accent"}`}
                      />
                      <p className="font-display text-[1.25rem] font-[400] leading-tight tracking-[-0.01em]">{r.title}</p>
                      <p className="mt-1 text-[0.88rem] text-muted-foreground">{r.kind}</p>
                      <Chip className="mt-3 !text-[0.8rem]">
                        <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.6} aria-hidden />
                        {day(r.start)} to {r.end ? day(r.end) : "present"}
                      </Chip>
                    </li>
                  ))}
                </ol>

                <div>
                  <ul className="space-y-4">
                    {job.points.map((p, j) => (
                      <li key={p} className="pop flex gap-3 text-pretty text-[1rem] leading-[1.6] text-foreground/85" style={{ ["--j" as string]: j * 3 + 2 }}>
                        <CircleCheck className="mt-[0.3rem] h-4 w-4 shrink-0 text-accent" strokeWidth={1.7} aria-hidden />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <ul className="mt-7 flex flex-wrap gap-2">
                    {job.areas.map((a, j) => (
                      <li key={a} className="chip-pop" style={{ ["--j" as string]: j + 6 }}>
                        <Chip>{a}</Chip>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          );
        })}
      </ul>
    </Section>
  );
}
