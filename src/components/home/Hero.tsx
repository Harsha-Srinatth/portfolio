import { startTransition, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { ArrowRight } from "lucide-react";

import { PERSON } from "@/components/portfolio/data";
import { BotanicalScene } from "./hero/BotanicalScene";
import { CompactCards, SceneCards } from "./hero/HangingCards";
import { loadArt } from "./hero/loadArt";
import type { TreeArt } from "./hero/treeArt";

// keep in step with the `wide` variant in styles.css
const WIDE = "(min-width: 1024px) and (min-aspect-ratio: 5/4)";
const densityFor = (wide: boolean) => (wide ? 1 : 0.8);

// The tree starts growing in its worker as soon as this script runs, side by
// side with hydration rather than after it.
if (typeof window !== "undefined") void loadArt(densityFor(window.matchMedia(WIDE).matches));

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
 * The scene is revealed once per page load. While it is being prepared a
 * sapling grows at the very point the reveal will open from (Sapling, plain
 * CSS from the first paint). The scene is mounted and drawn at a hair's
 * breadth above fully transparent (browsers skip drawing what is fully
 * hidden, which made the first reveal frame stall for a second), given a
 * moment to settle, and then opened up by a circle growing from the centre to
 * every corner, with a ring of warm light along its edge: the sapling lights
 * up and hands over to the full tree. The circle is a clip-path and the ring a
 * transform, so neither repaints the scene. Later mounts (a resize across the
 * breakpoint) show the scene straight away.
 */
let revealed = false;

/** The sapling's growth takes this long from the first paint; it isn't cut short. */
const SAPLING_GROWN = 1250;

/** Longest wait for the frames to calm down, on devices where they never quite do. */
const SETTLE_LIMIT = 900;

/** Run `cb` once a frame has been drawn: the first paint must never wait for the scene. */
function afterNextFrame(cb: () => void) {
  let raf = requestAnimationFrame(() => {
    raf = requestAnimationFrame(cb);
  });
  return () => cancelAnimationFrame(raf);
}

/**
 * Wait until the freshly mounted scene has been drawn. A few quick frames in a
 * row mean the browser has finished with it, which takes a moment on a laptop
 * and much longer on a phone, so this is measured rather than a fixed delay.
 */
function afterPaint(cb: () => void) {
  let raf = 0;
  let timer = 0;
  const start = performance.now();
  let last = start;
  let calm = 0;
  const frame = (now: number) => {
    calm = now - last < 34 ? calm + 1 : 0;
    last = now;
    if (calm < 4 && now - start < SETTLE_LIMIT) {
      raf = requestAnimationFrame(frame);
      return;
    }
    const painted = performance.getEntriesByName("first-contentful-paint")[0]?.startTime ?? 0;
    timer = window.setTimeout(cb, Math.max(0, painted + SAPLING_GROWN - performance.now()));
  };
  raf = requestAnimationFrame(frame);
  return () => {
    cancelAnimationFrame(raf);
    window.clearTimeout(timer);
  };
}

// each pair of leaves opens as the stem passes it; x/y in px from the stem's base
const LEAVES = [
  { x: 27, y: 31, r: -158, d: 0.34, s: 1 },
  { x: 29, y: 35, r: -20, d: 0.44, s: 0.95 },
  { x: 27, y: 53, r: -146, d: 0.62, s: 0.82 },
  { x: 29, y: 56, r: -32, d: 0.72, s: 0.78 },
  { x: 28, y: 73, r: -82, d: 0.92, s: 0.72 },
];

/**
 * The loading animation: a small plant on a pool of warm light. Transforms and
 * opacity only, so it keeps moving on the compositor while the page's scripts
 * are busy. It is in the server's HTML, so it runs before any script arrives.
 */
function Sapling({ leaving }: { leaving: boolean }) {
  return (
    <div aria-hidden className={`sapling ${leaving ? "sapling-leaving" : ""}`}>
      <span className="sapling-halo" />
      <span className="sapling-ground" />
      <span className="sapling-plant">
        <svg className="sapling-stem" viewBox="0 0 56 84" fill="none">
          <path d="M28 84C26.5 66 30.5 52 28 34C27 24 28.5 16 28 8" stroke="var(--sapling-stem)" strokeWidth="2.6" strokeLinecap="round" />
        </svg>
        {LEAVES.map((l) => (
          <span key={l.y} className="sapling-leaf" style={{ left: l.x, bottom: l.y, rotate: `${l.r}deg`, scale: l.s }}>
            <i style={{ animationDelay: `${l.d}s` }} />
          </span>
        ))}
      </span>
    </div>
  );
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
  const wide = useWide();
  const [art, setArt] = useState<TreeArt | null>(null);
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

  // the scene's layers render in the background, so the page stays responsive
  useEffect(() => {
    let live = true;
    let cancel = () => {};
    void loadArt(densityFor(wide)).then((a) => {
      if (live) cancel = afterNextFrame(() => startTransition(() => setArt(a)));
    });
    return () => {
      live = false;
      cancel();
    };
  }, [wide]);

  // once the scene is mounted and drawn, start the reveal
  useEffect(() => {
    if (!art || open) return;
    return afterPaint(() => {
      revealed = true;
      setOpen(true);
    });
  }, [art, open]);

  // a stable element, so the memoised scene layers are not redone when only the reveal state changes
  const cards = useMemo(() => (wide ? <SceneCards /> : <CompactCards />), [wide]);

  const scene = art && (
    <>
      <div className={`scene-frame absolute inset-0 ${open ? "scene-in" : "scene-pre"} ${wide ? "" : "scene-frame--stacked"}`}>
        <BotanicalScene art={art} snapshot={wide} settled={open && !glow}>
          {cards}
        </BotanicalScene>
      </div>
      {/* the ring of light along the growing circle's edge */}
      {glow && open && (
        <div aria-hidden className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
          <div className="scene-ring" onAnimationEnd={() => setGlow(false)} />
        </div>
      )}
    </>
  );

  return (
    <section ref={section} id="index" aria-label="Introduction" className="relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden wide:block wide:h-[100svh] wide:min-h-[640px]">
      <Backdrop />
      {/* layout for both sizes is decided by CSS, so nothing shifts on hydration */}
      <div className="absolute inset-0 hidden wide:block">
        {glow && <Sapling leaving={open} />}
        {wide && scene}
      </div>

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
      <div className="scene-stack relative z-0 -mt-[2vw] w-full wide:hidden">
        {glow && <Sapling leaving={open} />}
        {!wide && scene}
      </div>

    </section>
  );
}
