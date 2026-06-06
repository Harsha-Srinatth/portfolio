import { useEffect, useRef, useState } from "react";

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"idle" | "link" | "drag">("idle");
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: pos.x, y: pos.y };

    const move = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      setHidden(false);
      const t = e.target as HTMLElement;
      if (t.closest("[data-cursor='link']")) setMode("link");
      else if (t.closest("[data-cursor='drag']")) setMode("drag");
      else setMode("idle");
    };
    const leave = () => setHidden(true);

    let raf = 0;
    const tick = () => {
      ring.x += (pos.x - ring.x) * 0.18;
      ring.y += (pos.y - ring.y) * 0.18;
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] hidden md:block" aria-hidden>
      <div
        ref={ringRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-[width,height,border-color,opacity] duration-300 ease-out"
        style={{
          width: mode === "link" ? 64 : mode === "drag" ? 80 : 28,
          height: mode === "link" ? 64 : mode === "drag" ? 80 : 28,
          borderColor: "var(--color-primary)",
          opacity: hidden ? 0 : 0.85,
          mixBlendMode: "difference",
          marginLeft: mode === "link" ? -32 : mode === "drag" ? -40 : -14,
          marginTop: mode === "link" ? -32 : mode === "drag" ? -40 : -14,
        }}
      >
        {mode === "drag" && (
          <div className="absolute inset-0 grid place-items-center text-[10px] font-mono uppercase tracking-[0.25em] text-primary">
            drag
          </div>
        )}
      </div>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 rounded-full"
        style={{
          width: 4,
          height: 4,
          marginLeft: -2,
          marginTop: -2,
          background: "var(--color-primary)",
          opacity: hidden ? 0 : 1,
        }}
      />
    </div>
  );
}