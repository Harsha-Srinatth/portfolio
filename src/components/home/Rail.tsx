import { useEffect, useState } from "react";

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

/**
 * A stem down the left edge with a leaf for each section (desktop only). It
 * appears once the hero has gone by, fills as far as the section being read,
 * and each leaf is a link, so the page can be moved around after the header
 * has scrolled away. Labels show on hover and keyboard focus.
 */
export function Rail() {
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const els = STOPS.map((s) => document.getElementById(s.id));
    const inside = new Set<number>();
    // a line across the middle of the screen: the section crossing it is the one being read
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const i = els.indexOf(e.target as HTMLElement);
          if (e.isIntersecting) inside.add(i);
          else inside.delete(i);
        }
        if (inside.size) setActive(Math.max(...inside));
        else if (els[0] && els[0].getBoundingClientRect().top > window.innerHeight / 2) setActive(-1);
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    els.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const shown = active >= 0;
  return (
    <nav
      aria-label="Sections"
      className={`group/rail fixed left-[clamp(0.85rem,1.2vw,1.5rem)] top-1/2 z-40 hidden -translate-y-1/2 transition-opacity duration-700 wide:block ${shown ? "opacity-100" : "pointer-events-none opacity-0"}`}
    >
      <ol className="relative flex flex-col gap-[1.35rem]">
        <span aria-hidden className="absolute bottom-[6px] left-[5.5px] top-[6px] w-px bg-[color-mix(in_oklab,var(--twig)_30%,var(--border))]" />
        <span
          aria-hidden
          className="absolute bottom-[6px] left-[5.5px] top-[6px] w-px origin-top bg-accent transition-transform duration-700 ease-[var(--ease-stone)]"
          style={{ transform: `scaleY(${Math.max(0, active) / (STOPS.length - 1)})` }}
        />
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
