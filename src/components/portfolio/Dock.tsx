import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

const SECTIONS = [
  { id: "index", label: "Index" },
  { id: "about", label: "About" },
  { id: "constellation", label: "Projects" },
  { id: "strata", label: "Evolution" },
  { id: "frequencies", label: "Frequencies" },
  { id: "achievements", label: "Achievements & Certifications" },
  { id: "learning", label: "Learning Vector" },
  { id: "build-log", label: "Build Log" },
  { id: "transmissions", label: "Contact" },
];

export function Dock() {
  const [active, setActive] = useState("index");

  useEffect(() => {
    const observed = new Set<Element>();
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );

    const observeSections = () => {
      SECTIONS.forEach((s) => {
        const el = document.getElementById(s.id);
        if (el && !observed.has(el)) {
          obs.observe(el);
          observed.add(el);
        }
      });
    };

    observeSections();
    const retry = window.setTimeout(observeSections, 300);
    const retryAgain = window.setTimeout(observeSections, 1000);

    return () => {
      window.clearTimeout(retry);
      window.clearTimeout(retryAgain);
      obs.disconnect();
    };
  }, []);

  return (
    <>
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-6 py-5 md:px-12 lg:px-20">
          <a href="#index" data-cursor="link" className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-foreground">
            <span className="grid h-7 w-7 place-items-center rounded-full border border-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary anim-glow" />
            </span>
            Harsha · RHS
          </a>
          <div className="hidden md:flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
              an observatory, not a résumé
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Right dock */}
      <nav className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 md:flex">
        <ul className="flex flex-col gap-3 rounded-full border border-border bg-background/40 px-2 py-3 backdrop-blur-md">
          {SECTIONS.map((s, i) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                data-cursor="link"
                className="group relative flex items-center gap-3 rounded-full px-2 py-1"
                aria-label={s.label}
              >
                <span
                  className={`grid h-7 w-7 place-items-center font-mono text-[10px] uppercase tracking-[0.2em] transition-colors ${
                    active === s.id ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-full border border-border bg-background/80 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.3em] opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 ${
                    active === s.id ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {s.label}
                </span>
                <span
                  className="block h-px transition-all duration-300"
                  style={{
                    width: active === s.id ? 28 : 12,
                    background: active === s.id ? "var(--color-primary)" : "var(--color-border)",
                  }}
                />
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
