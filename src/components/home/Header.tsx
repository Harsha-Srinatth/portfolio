import { useEffect, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";

import { setTheme, useTheme } from "@/lib/theme";

const NAV = [
  { href: "#about", label: "About" },
  { href: "#constellation", label: "Work" },
  { href: "#strata", label: "Path" },
  { href: "#transmissions", label: "Contact" },
];

function Monogram() {
  return (
    <span className="font-display text-[1.7rem] leading-none tracking-[-0.08em] wide:text-[clamp(1.8rem,2.1vw,2.4rem)]" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 0, "WONK" 0', fontWeight: 420 }}>
      H<span className="-ml-[0.08em]">S</span>
    </span>
  );
}

/** Light / Dark switch: both icons visible, the active mode highlighted. */
function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useTheme();
  const dark = theme === "dark";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label="Dark theme"
      title={dark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => setTheme(dark ? "light" : "dark")}
      className={`relative grid h-11 w-[4.75rem] shrink-0 grid-cols-2 items-center rounded-full border border-[var(--card-paper-border)] bg-[color-mix(in_oklab,var(--card-chip)_62%,transparent)] p-1 shadow-[0_6px_18px_-10px_rgb(80_50_20/0.4)] backdrop-blur-md transition-colors duration-300 hover:border-foreground/40 ${className}`}
    >
      <span
        aria-hidden
        className={`absolute top-1 h-9 w-9 rounded-full bg-foreground transition-transform duration-300 ease-[var(--ease-stone)] ${dark ? "translate-x-[2.15rem]" : "translate-x-0"}`}
      />
      <Sun aria-hidden className={`relative z-10 mx-auto h-4 w-4 transition-colors duration-300 ${dark ? "text-foreground/60" : "text-background"}`} strokeWidth={1.7} />
      <Moon aria-hidden className={`relative z-10 mx-auto h-4 w-4 transition-colors duration-300 ${dark ? "text-background" : "text-foreground/60"}`} strokeWidth={1.7} />
    </button>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      {/* sits over the top of the hero and scrolls away with it */}
      <header className="absolute inset-x-0 top-0 z-50">
        <div className="mx-auto flex h-[4.5rem] max-w-[1920px] items-center gap-2.5 px-5 sm:gap-4 md:h-[5.5rem] md:gap-6 md:px-12 lg:gap-10 wide:h-[clamp(5.5rem,12vh,6.75rem)] wide:px-[clamp(3rem,3.8vw,5.5rem)]">
          <a href="#index" aria-label="Harsha Srinatth Ryali, back to top" className="shrink-0 rounded-md">
            <Monogram />
          </a>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-9 text-[0.92rem] wide:gap-[clamp(2rem,2.6vw,3rem)] wide:text-[clamp(0.95rem,0.98vw,1.08rem)]">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="link-underline pb-0.5 text-foreground/85 transition-colors hover:text-foreground">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <span className="flex-1" aria-hidden />

          {/* on phones the switch lives in the menu, to keep the bar uncrowded */}
          <ThemeToggle className="max-sm:hidden" />
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            className="-mr-2 grid h-11 w-11 place-items-center rounded-full md:hidden"
          >
            <Menu className="h-7 w-7" strokeWidth={1.3} />
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-background/96 backdrop-blur-xl md:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="flex h-[4.5rem] items-center justify-between px-6">
            <Monogram />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="grid h-11 w-11 place-items-center rounded-full border border-foreground/30"
            >
              <X className="h-4 w-4" strokeWidth={1.6} />
            </button>
          </div>
          <nav aria-label="Mobile" className="flex flex-1 flex-col justify-center px-6 pb-24">
            <ul className="space-y-2">
              {[...NAV, { href: "#frequencies", label: "Skills" }, { href: "#achievements", label: "Achievements" }].map((n) => (
                <li key={n.href}>
                  <a href={n.href} onClick={() => setMenuOpen(false)} className="font-display block py-1.5 text-[2.6rem] leading-tight tracking-tight">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex items-center gap-4 text-[0.95rem] text-muted-foreground sm:hidden">
              Theme
              <ThemeToggle />
            </div>
          </nav>
        </div>
      )}

    </>
  );
}
