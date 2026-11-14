import { useEffect } from "react";

/**
 * Sunlight on cards: tells whichever `.glow` card is under the pointer where
 * the pointer is, so its pool of light can follow (see `.glow` in styles.css).
 * One listener for the whole page; mice and trackpads only.
 */
export function usePointerGlow() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let raf = 0;
    let last: PointerEvent | null = null;
    const apply = () => {
      raf = 0;
      const e = last;
      if (!e || !(e.target instanceof Element)) return;
      const card = e.target.closest<HTMLElement>(".glow");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${(e.clientX - r.left).toFixed(0)}px`);
      card.style.setProperty("--my", `${(e.clientY - r.top).toFixed(0)}px`);
    };
    const onMove = (e: PointerEvent) => {
      last = e;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);
}

/** Ask the Work section to show a project (see Work.tsx). */
export const PROJECT_EVENT = "rhs:project";
export function showProject(id: string) {
  window.dispatchEvent(new CustomEvent(PROJECT_EVENT, { detail: id }));
}
