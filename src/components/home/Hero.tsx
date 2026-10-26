import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { ArrowRight } from "lucide-react";

import { PERSON } from "@/components/portfolio/data";
import { BotanicalScene } from "./hero/BotanicalScene";
import { CompactCards, SceneCards } from "./hero/HangingCards";

/*
 * The tree is decorative and generated in the browser, so it is built once
 * the page is idle — after the copy has painted and hydration has finished.
 */
let idle = false;
const idleListeners = new Set<() => void>();
function subscribeIdle(cb: () => void) {
  idleListeners.add(cb);
  if (!idle && idleListeners.size === 1) {
    const done = () => {
      idle = true;
      idleListeners.forEach((l) => l());
    };
    if ("requestIdleCallback" in window) window.requestIdleCallback(done, { timeout: 900 });
    else setTimeout(done, 200);
  }
  return () => idleListeners.delete(cb);
}
const useIdle = () =>
  useSyncExternalStore(
    subscribeIdle,
    () => idle,
    () => false,
  );

// keep in step with the `wide` variant in styles.css
const WIDE = "(min-width: 1024px) and (min-aspect-ratio: 5/4)";
function useWide() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(WIDE);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(WIDE).matches,
    () => true,
  );
}

/*
 * The scene is revealed once per page load. It is mounted and drawn first, at
 * a hair's breadth above fully transparent (browsers skip drawing what is
 * fully hidden, which made the first reveal frame stall for a second), given
 * a moment to settle, and then faded in while a warm glow blooms from the
 * centre to every corner. Both moves are opacity and transform only, so they
 * run on the compositor. Later mounts (a resize across the breakpoint) show
 * the scene straight away.
 */
let revealed = false;

/** Wait until the browser has drawn the freshly mounted scene, then let it settle. */
function afterPaint(cb: () => void) {
  let raf = 0;
  let idleId = 0;
  let timer = 0;
  raf = requestAnimationFrame(() => {
    raf = requestAnimationFrame(() => {
      const settle = () => {
        timer = window.setTimeout(cb, 450);
      };
      if ("requestIdleCallback" in window) idleId = window.requestIdleCallback(settle, { timeout: 600 });
      else settle();
    });
  });
  return () => {
    cancelAnimationFrame(raf);
    if (idleId) window.cancelIdleCallback(idleId);
    window.clearTimeout(timer);
  };
}

/** The sunlit wall. The light comes from the upper right. */
function Backdrop() {
  return (
    <div aria-hidden className="absolute inset-0">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--hero-wall-1)_0%,var(--hero-wall-2)_86%)]" />
      {/* shade gathering in the upper-left corner, and a broad shaft of sun */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_65%_at_0%_0%,var(--hero-wall-shade),transparent_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(112deg,transparent_18%,color-mix(in_oklab,var(--hero-ledge)_45%,transparent)_34%,transparent_52%)] opacity-70" />
      {/* the pool of direct sun on the lower wall, clear of the tree's shade */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_34%_30%_at_30%_74%,var(--sun-pool),transparent_70%)]" />
    </div>
  );
}

/** A line of the name, sliding up from behind a mask (pure CSS: it runs from the first paint). */
function Line({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <span className="block overflow-hidden pb-[0.14em] -mb-[0.08em]">
      <span className="hero-line block" style={{ animationDelay: `${delay}s` }}>
        {children}
      </span>
    </span>
  );
}

export function Hero() {
  const ready = useIdle();
  const wide = useWide();
  const section = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(revealed);
  const [glow, setGlow] = useState(!revealed);

  // pause the breeze while the hero is out of view (see .hero-still)
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    // wakes a little before it scrolls back into view, so it is ready on arrival
    const io = new IntersectionObserver(([e]) => el.classList.toggle("hero-still", !e.isIntersecting), { rootMargin: "300px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // once the scene is mounted and drawn, start the reveal
  useEffect(() => {
    if (!ready || open) return;
    return afterPaint(() => {
      revealed = true;
      setOpen(true);
    });
  }, [ready, open]);

  // a stable element, so the memoised scene layers are not redone when only the reveal state changes
  const cards = useMemo(() => (wide ? <SceneCards /> : <CompactCards />), [wide]);

  const scene = ready && (
    <div className={`scene-frame absolute inset-0 ${open ? "scene-in" : "scene-pre"} ${wide ? "" : "scene-frame--stacked"}`}>
      <BotanicalScene density={wide ? 1 : 0.8} snapshot={wide} settled={open && !glow}>
        {cards}
      </BotanicalScene>
    </div>
  );

  return (
    <section ref={section} id="index" aria-label="Introduction" className="relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden wide:block wide:h-[100svh] wide:min-h-[640px]">
      <Backdrop />
      {/* layout for both sizes is decided by CSS, so nothing shifts on hydration */}
      <div className="absolute inset-0 hidden wide:block">{wide && scene}</div>

      <div className="pointer-events-none relative z-10 mx-auto w-full max-w-[1920px] px-6 pt-[5.5rem] md:px-12 md:pt-[8rem] wide:px-[clamp(3rem,3.8vw,5.5rem)] wide:pt-[clamp(7rem,21vh,13rem)]">
        <div className="max-w-[44rem] wide:max-w-[min(46rem,41vw)]">
          <h1 className="text-name text-[clamp(2.3rem,11.2vw,4.4rem)] md:text-[clamp(3.4rem,7.8vw,5.3rem)] wide:text-[clamp(3rem,5.4vw,7rem)]">
            <Line delay={0.15}>Harsha</Line>
            <Line delay={0.27}>Srinatth Ryali</Line>
          </h1>

          <p
            className="hero-rise mt-3 text-[0.84rem] tracking-[0.03em] text-muted-foreground sm:tracking-[0.09em] md:mt-7 md:text-[1.1rem] wide:mt-[clamp(1.25rem,4.4vh,2.5rem)] wide:whitespace-nowrap wide:text-[clamp(0.9rem,1.06vw,1.35rem)]"
            style={{ animationDelay: "0.55s" }}
          >
            Computer Science
            <span className="mx-2.5 opacity-60 sm:mx-3.5" aria-hidden>
              ·
            </span>
            SRKR Engineering College
          </p>

          <p
            className="hero-rise mt-3 max-w-[38rem] text-pretty text-[0.94rem] leading-[1.55] text-foreground/72 md:mt-7 md:text-[1.15rem] md:leading-[1.6] wide:mt-[clamp(1.25rem,4.4vh,2.25rem)] wide:max-w-[min(37.5rem,36vw)] wide:text-[clamp(1rem,1.08vw,1.35rem)] wide:leading-[1.5]"
            style={{ animationDelay: "0.7s" }}
          >
            {PERSON.tagline}
            {" "}
            {PERSON.taglineContext}
          </p>

          <div
            className="hero-fade pointer-events-auto mt-5 flex flex-wrap gap-3 max-sm:[&_.btn]:h-11 max-sm:[&_.btn]:gap-2 max-sm:[&_.btn]:px-5 max-sm:[&_.btn]:text-[0.9rem] md:mt-9 md:gap-4 wide:mt-[clamp(1.5rem,3.6vh,2.25rem)] wide:gap-5 wide:[&_.btn]:h-[clamp(3.25rem,6.2vh,3.6rem)] wide:[&_.btn]:px-8 wide:[&_.btn]:text-[clamp(0.95rem,0.98vw,1.1rem)]"
            style={{ animationDelay: "0.85s" }}
          >
            <a href="#about" className="btn btn-solid">
              About me
              <ArrowRight className="h-4 w-4" strokeWidth={1.6} />
            </a>
            <a href="#transmissions" className="btn btn-line">
              Get in touch
              <ArrowRight className="h-4 w-4" strokeWidth={1.6} />
            </a>
          </div>
        </div>
      </div>

      {/* phones and tablets: the tree full-bleed under the copy, its crown
          rising beside the buttons, the cards across the width */}
      {/* the tree takes all the height left on the first screen, so the next
          section never peeks in half-cut at the bottom */}
      <div className="scene-stack relative z-0 -mt-[2vw] w-full wide:hidden">{!wide && scene}</div>

      {/* the reveal's glow, blooming from the centre to every corner */}
      {glow && open && <div aria-hidden className="scene-glow pointer-events-none absolute inset-0 z-[5]" onAnimationEnd={() => setGlow(false)} />}
    </section>
  );
}
