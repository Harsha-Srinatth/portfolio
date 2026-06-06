import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("kael-theme");
    const initial = saved ? saved === "dark" : true;
    setDark(initial);
    document.documentElement.classList.toggle("dark", initial);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("kael-theme", next ? "dark" : "light");
  };

  return (
    <button
      data-cursor="link"
      onClick={toggle}
      className="group relative h-9 overflow-hidden rounded-full border border-border bg-background/40 px-4 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground backdrop-blur-md transition-colors hover:text-foreground"
      aria-label="Toggle theme"
    >
      <span className="relative z-10 flex items-center gap-2">
        <span
          className="inline-block h-2 w-2 rounded-full transition-colors"
          style={{ background: dark ? "var(--color-primary)" : "var(--color-accent)" }}
        />
        {dark ? "nocturne" : "diurne"}
      </span>
    </button>
  );
}