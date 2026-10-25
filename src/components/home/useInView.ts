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
      ([e]) => {
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
