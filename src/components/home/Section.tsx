import type { ReactNode } from "react";

/**
 * Gallery-style section: a placard (title + short note) that stays in view on
 * large screens, beside the content it describes.
 */
export function Section({
  id,
  title,
  note,
  children,
  className = "",
}: {
  id: string;
  title: string;
  note?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`relative scroll-mt-20 ${className}`}>
      <div className="mx-auto grid max-w-[1680px] grid-cols-1 gap-x-12 px-6 py-24 md:px-12 md:py-32 lg:grid-cols-12 lg:px-16">
        <header className="lg:sticky lg:top-32 lg:col-span-4 lg:self-start xl:col-span-4">
          <h2 id={`${id}-title`} className="font-display text-[clamp(2.5rem,4.4vw,4.25rem)] font-[360] leading-[1] tracking-[-0.025em]">
            {title}
          </h2>
          {note && <p className="mt-5 max-w-[22rem] text-pretty text-[1rem] leading-relaxed text-muted-foreground">{note}</p>}
        </header>
        <div className="mt-12 lg:col-span-8 lg:mt-1">{children}</div>
      </div>
    </section>
  );
}

/** Thin rule used between sections — a joint between stone courses. */
export function Course() {
  return (
    <div className="mx-auto max-w-[1680px] px-6 md:px-12 lg:px-16" aria-hidden>
      <div className="h-px bg-border" />
    </div>
  );
}
