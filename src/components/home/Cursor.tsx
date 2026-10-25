import { useEffect, useRef, useState } from "react";

/**
 * A soft ring that trails the pointer and opens up over anything clickable.
 * The normal cursor stays visible; the ring only adds a sense of motion.
 * Mouse and trackpad only, never with reduced motion, and the animation
 * loop runs only while the ring is catching up.
 */

const INTERACTIVE = "a, button, [role='tab'], [role='switch'], summary, label, select";

export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const el = ring.current;
    if (!enabled || !el) return;
    const target = { x: -100, y: -100, s: 1, o: 0 };
    const now = { x: -100, y: -100, s: 1, o: 0 };
    let raf = 0;

    const tick = () => {
      now.x += (target.x - now.x) * 0.2;
      now.y += (target.y - now.y) * 0.2;
      now.s += (target.s - now.s) * 0.18;
      now.o += (target.o - now.o) * 0.2;
      el.style.transform = `translate3d(${now.x}px, ${now.y}px, 0) translate(-50%, -50%) scale(${now.s})`;
      el.style.opacity = String(now.o);
      const settled = Math.abs(target.x - now.x) < 0.1 && Math.abs(target.y - now.y) < 0.1 && Math.abs(target.s - now.s) < 0.002 && Math.abs(target.o - now.o) < 0.01;
      raf = settled ? 0 : requestAnimationFrame(tick);
    };
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (now.o === 0) {
        now.x = e.clientX;
        now.y = e.clientY;
      }
      target.x = e.clientX;
      target.y = e.clientY;
      target.o = 1;
      const hot = (e.target as Element | null)?.closest?.(INTERACTIVE);
      target.s = hot ? 1.75 : 1;
      el.dataset.hot = hot ? "1" : "";
      wake();
    };
    const down = () => {
      target.s *= 0.8;
      wake();
    };
    const up = (e: PointerEvent) => move(e);
    const leave = () => {
      target.o = 0;
      wake();
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [enabled]);

  if (!enabled) return null;
  return <div ref={ring} aria-hidden className="cursor-ring" />;
}
