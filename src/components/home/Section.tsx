import type { ReactNode } from "react";

import { useInView } from "./useInView";

/**
 * A section: its title and a short note on top, the content (mostly cards)
 * full width below. Margins match the hero.
 */
export function Section({
  id,
  title,
  note,
  children,
  backdrop,
  className = "",
}: {
  id: string;
  title: string;
  note?: ReactNode;
  children: ReactNode;
  /** a decorative layer behind the content (see Ambient.tsx) */
  backdrop?: ReactNode;
  className?: string;
}) {
  // ambient motion inside runs only while the section is on screen
  const [ref, live] = useInView<HTMLElement>();
  return (
    <section ref={ref} id={id} data-live={live} aria-labelledby={`${id}-title`} className={`relative isolate scroll-mt-6 ${backdrop ? "overflow-hidden" : ""} ${className}`}>
      {backdrop}
      <div className="relative mx-auto max-w-[1920px] px-6 py-20 md:px-12 md:py-28 wide:px-[clamp(3rem,3.8vw,5.5rem)]">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-12">
          <h2 id={`${id}-title`} className="font-display text-[clamp(2.4rem,4.4vw,4.4rem)] font-[360] leading-[1] tracking-[-0.025em]">
            {title}
          </h2>
          {note && <p className="max-w-[26rem] text-pretty text-[1rem] leading-relaxed text-muted-foreground md:pb-2 md:text-right">{note}</p>}
        </header>
        <div className="mt-10 md:mt-14">{children}</div>
      </div>
    </section>
  );
}

/** Thin rule used between sections. */
export function Course() {
  return (
    <div className="mx-auto max-w-[1920px] px-6 md:px-12 wide:px-[clamp(3rem,3.8vw,5.5rem)]" aria-hidden>
      <div className="h-px bg-border" />
    </div>
  );
}
