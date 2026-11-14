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
    <section ref={ref} id={id} data-live={live} aria-labelledby={`${id}-title`} className={`section-lazy relative isolate scroll-mt-6 ${backdrop ? "overflow-hidden" : ""} ${className}`}>
      {backdrop}
      <div className="relative mx-auto max-w-[1920px] px-6 py-20 md:px-12 md:py-28 wide:px-[clamp(3rem,3.8vw,5.5rem)]">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-12">
          <h2 id={`${id}-title`} className="font-display text-[clamp(2.4rem,4.4vw,4.4rem)] font-[360] leading-[1] tracking-[-0.025em]">
            {/* slides up from behind a mask, like the name in the hero */}
            <span className="mask -mb-[0.16em] block overflow-hidden pb-[0.16em]">
              <span className="mask-in block">{title}</span>
            </span>
          </h2>
          {note && (
            <p className="reveal max-w-[26rem] text-pretty text-[1rem] leading-relaxed text-muted-foreground md:pb-2 md:text-right" style={{ ["--i" as string]: 3 }}>
              {note}
            </p>
          )}
        </header>
        <div className="mt-10 md:mt-14">{children}</div>
      </div>
    </section>
  );
}

/** Between sections: a twig that grows across as it is reached, with a sprig of leaves. */
export function Course() {
  return (
    <div className="mx-auto max-w-[1920px] px-6 md:px-12 wide:px-[clamp(3rem,3.8vw,5.5rem)]" aria-hidden>
      <div className="twig relative h-px">
        <div className="twig-line absolute inset-0 bg-[color-mix(in_oklab,var(--twig)_38%,var(--border))]" />
        <svg viewBox="0 0 40 30" className="twig-sprig absolute bottom-0 left-[12%] h-[22px] w-[30px] overflow-visible md:left-[8%]">
          <path d="M20 30 C12 26 5 18 7 7 C15 8 21 17 20 30 Z" fill="var(--leaf-4)" />
          <path d="M20 30 C28 25 35 16 32 5 C24 7 19 17 20 30 Z" fill="var(--leaf-3)" />
          <path d="M20 30 L10 11 M20 30 L30 9" stroke="var(--leaf-vein)" strokeWidth="1" fill="none" />
        </svg>
      </div>
    </div>
  );
}
