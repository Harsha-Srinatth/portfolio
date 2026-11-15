import { useEffect, useRef, useState } from "react";

/**
 * Whether an element is on screen (with a margin). Ambient motion uses it to
 * run only while it can be seen; `once` latches true for one-off entrances.
 */
export function useInView<T extends Element>({ margin = "120px 0px", once = false } = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        // A busy page can deliver several updates at once ("out", then "in"):
        // the last one is the current state. Reading only the first left
        // things that were plainly on screen believing they were not.
        const e = entries[entries.length - 1];
        setInView(e.isIntersecting);
        if (once && e.isIntersecting) io.disconnect();
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin, once]);

  return [ref, inView] as const;
}
