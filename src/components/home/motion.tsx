import { useEffect, useState, useSyncExternalStore } from "react";

import { useInView } from "./useInView";

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * A number that counts up to its value the first time it is seen. The server
 * (and anyone with reduced motion) gets the final value straight away.
 */
export function CountUp({
  value,
  decimals = 0,
  duration = 1400,
  locale = "en-IN",
  className,
}: {
  value: number;
  decimals?: number;
  duration?: number;
  locale?: string;
  className?: string;
}) {
  const [ref, seen] = useInView<HTMLSpanElement>({ once: true, margin: "0px 0px -8% 0px" });
  // false on the server and during hydration, so the markup always holds the real value
  const animate = useSyncExternalStore(
    () => () => {},
    () => !reduced(),
    () => false,
  );
  const [t, setT] = useState(0);

  useEffect(() => {
    if (!animate || !seen) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / duration);
      setT(k);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [animate, seen, value, duration]);

  // ease-out: quick at first, settling on the value
  const shown = animate ? value * (1 - Math.pow(1 - t, 4)) : value;

  return (
    <span ref={ref} className={`tabular-nums ${className ?? ""}`}>
      {shown.toLocaleString(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
    </span>
  );
}

/**
 * A sentence whose words light up one after another as it travels up the
 * screen (scroll-linked, see `.lit` in styles.css). Where the browser has no
 * scroll timelines the sentence is simply there.
 */
export function LitText({ text, from = 8, span = 26 }: { text: string; from?: number; span?: number }) {
  const words = text.split(" ");
  return (
    <span className="lit">
      {words.map((w, i) => {
        const at = from + (i / words.length) * span;
        return (
          <span key={i} style={{ ["animationRange" as string]: `cover ${at.toFixed(1)}% cover ${(at + 9).toFixed(1)}%` }}>
            {w}
            {i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </span>
  );
}
