import { useEffect } from "react";

/**
 * One-time entrances for `.reveal` cards and the Path's `.vine`: each gets
 * `is-in` the first time it scrolls into view, and a short CSS transition
 * plays once. (Scroll-linked animations would restyle the page on every
 * scroll frame; this costs nothing once things have appeared.) Elements
 * added later — a new build-log tab, say — are picked up too. Nothing is
 * hidden until this runs, or at all with reduced motion.
 */
export function useReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    const watch = (scope: ParentNode) => scope.querySelectorAll(".reveal:not(.is-in), .vine:not(.is-in)").forEach((el) => io.observe(el));
    root.classList.add("reveal-ready");
    watch(document);
    const mo = new MutationObserver((records) => {
      for (const r of records)
        r.addedNodes.forEach((n) => {
          if (!(n instanceof Element)) return;
          if (n.matches(".reveal, .vine")) io.observe(n);
          watch(n);
        });
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
      root.classList.remove("reveal-ready");
    };
  }, []);
}
