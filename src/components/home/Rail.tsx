import { useEffect, useRef, useState } from "react";

const STOPS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "constellation", label: "Work" },
  { id: "strata", label: "Path" },
  { id: "frequencies", label: "Skills" },
  { id: "achievements", label: "Achievements" },
  { id: "build-log", label: "Build log" },
  { id: "transmissions", label: "Contact" },
];
const LAST = STOPS.length - 1;

/**
 * How far down the page the reader is, in stops: 0 at the top of the first
 * section, 1 at the top of the second, 2.5 halfway through the third, and
 * so on; negative while still in the hero. Measured from a line across the
 * middle of the screen. The sections are looked up afresh each time, since
 * they can arrive (or be replaced) after this has mounted.
 */
function progress() {
  // Over the last screenful of scrolling the line slides from the middle of
  // the screen to its foot, so the final (often short) section is reached
  // by the time the page ends, on any window height.
  const vh = window.innerHeight;
  const left = document.documentElement.scrollHeight - vh - window.scrollY;
  const line = vh * (0.5 + 0.5 * Math.min(1, Math.max(0, 1 - left / vh)));
  const tops: number[] = [];
  for (const s of STOPS) {
    const el = document.getElementById(s.id);
    if (!el) return null;
    tops.push(el.getBoundingClientRect().top);
  }
  if (line < tops[0]) return -1;
  const end = document.getElementById(STOPS[LAST].id)!.getBoundingClientRect().bottom;
  for (let i = LAST; i >= 0; i--) {
    if (line < tops[i]) continue;
    const next = i === LAST ? end : tops[i + 1];
    // the last stop has nothing after it to travel toward
    return i === LAST ? LAST : i + Math.min(1, (line - tops[i]) / Math.max(1, next - tops[i]));
  }
  return -1;
}

/**
 * A stem down the left edge with a leaf for each section. It appears once
 * the hero has gone by; the green line grows down it with the scroll, a
 * little at a time, and every leaf it has passed stays green, so it shows
 * both where the reader is and how much they have seen. Each leaf is a link
 * (the header scrolls away with the hero). Labels show on hover and focus.
 */
export function Rail() {
  // which leaf the reader is in; -1 while in the hero
  const [active, setActive] = useState(-1);
  const fill = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const p = progress();
      if (p === null) return;
      // the line follows the scroll directly, without waiting for React
      if (fill.current) fill.current.style.transform = `scaleY(${Math.max(0, p) / LAST})`;
      setActive(p < 0 ? -1 : Math.min(LAST, Math.floor(p)));
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    // the page grows as sections arrive and as their real heights become known
    const ro = new ResizeObserver(queue);
    ro.observe(document.documentElement);
    ro.observe(document.body);
    queue();
    return () => {
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const shown = active >= 0;
  return (
    <nav
      aria-label="Sections"
      className={`group/rail fixed left-[clamp(0.85rem,1.2vw,1.5rem)] top-1/2 z-40 hidden -translate-y-1/2 transition-opacity duration-500 md:block ${shown ? "opacity-100" : "pointer-events-none opacity-0"}`}
    >
      <ol className="relative flex flex-col gap-[1.35rem]">
        <span aria-hidden className="absolute bottom-[6px] left-[5.5px] top-[6px] w-px bg-[color-mix(in_oklab,var(--twig)_30%,var(--border))]" />
        {/* grows with the scroll (set in the effect above) */}
        <span ref={fill} aria-hidden className="absolute bottom-[6px] left-[5px] top-[6px] w-[2px] origin-top rounded-full bg-accent" style={{ transform: "scaleY(0)" }} />
        {STOPS.map((s, i) => {
          const on = i === active;
          const passed = i <= active;
          return (
            <li key={s.id} className="relative">
              <a href={`#${s.id}`} aria-current={on ? "true" : undefined} tabIndex={shown ? 0 : -1} className="group/stop flex items-center gap-3 rounded-full">
                <span
                  aria-hidden
                  className={`block h-3 w-3 rounded-[0_100%_0_100%] transition-[transform,background-color] duration-500 ease-[var(--ease-stone)] ${
                    passed ? "bg-accent" : "bg-[color-mix(in_oklab,var(--foreground)_22%,var(--background))]"
                  } ${on ? "rotate-[20deg] scale-[1.45]" : "group-hover/stop:scale-125"}`}
                />
                <span
                  className={`pointer-events-none whitespace-nowrap rounded-full border border-border bg-card px-3 py-1 text-[0.78rem] shadow-[0_8px_20px_-14px_rgb(0_0_0/0.5)] transition-[opacity,transform] duration-300 group-hover/rail:translate-x-0 group-hover/rail:opacity-100 group-focus-visible/stop:translate-x-0 group-focus-visible/stop:opacity-100 ${
                    on ? "text-foreground" : "text-muted-foreground"
                  } -translate-x-1 opacity-0`}
                >
                  {s.label}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
