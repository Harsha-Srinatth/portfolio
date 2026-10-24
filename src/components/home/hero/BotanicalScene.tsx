import { useEffect, useMemo, useRef, type CSSProperties } from "react";

import { useTheme } from "@/lib/theme";
import { freezeScene } from "./freeze";

import { SHADE_TRANSFORM, VIEW, buildTreeArt, sceneUnit as u, type Shade, type Spray, type Tuft } from "./treeArt";

/**
 * The 2D botanical scene. Layout is pure CSS: the scene is a container whose
 * unit `--u` (px per scene unit) is min(width / --scene-w, height / 900), and
 * every piece is anchored to the bottom-right corner, so the tree keeps its
 * place beside the copy at any aspect ratio. Narrower layouts set a larger or
 * smaller --scene-w (see styles.css) to make room for the copy or crop in.
 *
 * Motion: the wood, ground, stones and light are static SVG. Each leafy spray
 * and tuft of ground cover is its own small element animated with CSS
 * keyframes (transform only), so the breeze runs on the compositor.
 */

// the art is deterministic, so build each density once per page
const artCache = new Map<number, ReturnType<typeof buildTreeArt>>();
function cachedArt(density: number) {
  let art = artCache.get(density);
  if (!art) {
    art = buildTreeArt(density);
    artCache.set(density, art);
  }
  return art;
}

function place(x: number, y: number, w: number, h: number): CSSProperties {
  return {
    right: u(VIEW.w - (x + w)),
    bottom: u(VIEW.h - (y + h)),
    width: u(w),
    height: u(h),
  };
}

const sway = (dur: number, delay: number, amp: number) => ({
  ["--dur" as string]: `${dur.toFixed(2)}s`,
  ["--delay" as string]: `${delay.toFixed(2)}s`,
  ["--amp" as string]: `${amp.toFixed(2)}deg`,
});

function SprayLayer({ s, alt }: { s: Spray; alt?: boolean }) {
  return (
    <div
      aria-hidden
      className={`leaf-sway absolute ${alt ? "sway-alt" : ""} ${s.group === "fringe" ? "scene-fringe" : ""}`}
      style={{
        ...place(s.x, s.y, s.w, s.h),
        transformOrigin: `${(s.ox * 100).toFixed(1)}% ${(s.oy * 100).toFixed(1)}%`,
        ...sway(s.dur, s.delay, s.amp),
      }}
    >
      <svg viewBox={`${f(s.x)} ${f(s.y)} ${f(s.w)} ${f(s.h)}`} data-freeze="" className="block h-full w-full overflow-visible">
        <path d={s.stem} fill="var(--twig)" />
        {s.tones.map((d, i) => (d ? <path key={i} d={d} fill={`var(--leaf-${i + 1})`} stroke="var(--leaf-edge)" strokeWidth={0.6} /> : null))}
        {s.veins && <path d={s.veins} fill="none" stroke="var(--leaf-vein)" strokeWidth={0.8} strokeLinecap="round" />}
      </svg>
    </div>
  );
}

function TuftLayer({ t, alt }: { t: Tuft; alt?: boolean }) {
  return (
    <div aria-hidden className={`grass-sway absolute ${alt ? "sway-alt" : ""}`} style={{ ...place(t.x, t.y, t.w, t.h), transformOrigin: "50% 100%", ...sway(t.dur, t.delay, t.amp) }}>
      <svg viewBox={`${f(t.x)} ${f(t.y)} ${f(t.w)} ${f(t.h)}`} data-freeze="" className="block h-full w-full overflow-visible">
        {t.tones.map((d, i) => (d ? <path key={i} d={d} fill={`var(--leaf-${i + 1})`} /> : null))}
        {t.blades && <path d={t.blades} fill="var(--grass)" />}
      </svg>
    </div>
  );
}

/** A piece of the wall shadow, drifting slowly as the sprays above it sway. */
/**
 * Masks and blurs for shadows on the wall. Each SVG that casts onto the wall
 * carries its own copy (ids suffixed), since references across separate SVG
 * elements are not applied reliably.
 */
function WallDefs({ id }: { id: string }) {
  return (
    <>
      <filter id={`fleck-blur${id}`} filterUnits="userSpaceOnUse" x="-800" y="-600" width="3200" height="1800">
        <feGaussianBlur stdDeviation="3" />
      </filter>
      <filter id={`dapple-blur${id}`} filterUnits="userSpaceOnUse" x="-800" y="-400" width="2900" height="1600">
        <feGaussianBlur stdDeviation="3.4" />
      </filter>
      {/* the shadow falls on the wall only, not the ground */}
      <linearGradient id={`wall-only${id}`} x1="0" y1="0" x2="0" y2="900" gradientUnits="userSpaceOnUse">
        <stop offset="0.78" stopColor="#fff" />
        <stop offset="0.85" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      {/* ...and only faintly behind the copy, which has to stay easy to read */}
      <linearGradient id={`copy-fade${id}`} x1="480" y1="0" x2="780" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#000" stopOpacity="0.62" />
        <stop offset="1" stopColor="#000" stopOpacity="0" />
      </linearGradient>
      <mask id={`wall-mask${id}`} maskUnits="userSpaceOnUse" x="-800" y="-400" width="2900" height="1300">
        <rect x="-800" y="-400" width="2900" height="1300" fill={`url(#wall-only${id})`} />
        <rect x="-800" y="-400" width="2900" height="1300" fill={`url(#copy-fade${id})`} />
      </mask>
    </>
  );
}

function ShadeLayer({ s, i }: { s: Shade; i: number }) {
  const id = `-s${i}`;
  return (
    <div
      aria-hidden
      className={`leaf-sway scene-dapple absolute ${s.fringe ? "scene-fringe" : ""}`}
      style={{ ...place(s.x, s.y, s.w, s.h), transformOrigin: "50% 0%", ...sway(s.dur, s.delay, s.amp) }}
    >
      <svg viewBox={`${f(s.x)} ${f(s.y)} ${f(s.w)} ${f(s.h)}`} data-freeze="" className="block h-full w-full overflow-visible">
        <defs>
          <WallDefs id={id} />
        </defs>
        <g mask={`url(#wall-mask${id})`}>
          <path d={s.d} fill="var(--shade-leaf)" filter={`url(#dapple-blur${id})`} transform={SHADE_TRANSFORM} />
          {s.flecks && <path d={s.flecks} fill="var(--sun-fleck)" filter={`url(#fleck-blur${id})`} />}
        </g>
      </svg>
    </div>
  );
}

const f = (n: number) => Math.round(n * 10) / 10;

/** Foliage drawn in place, without a layer of its own. */
function SprayStill({ s }: { s: Spray }) {
  return (
    <g>
      <path d={s.stem} fill="var(--twig)" />
      {s.tones.map((d, i) => (d ? <path key={i} d={d} fill={`var(--leaf-${i + 1})`} stroke="var(--leaf-edge)" strokeWidth={0.6} /> : null))}
    </g>
  );
}

/** How long after mounting to snapshot the art: once the reveal has finished. */
const FREEZE_AFTER = 2400;

/**
 * `snapshot`: keep the drawn art as bitmaps once shown (see freeze.ts). Worth
 * it for the large desktop scene; on phones the smaller scene redraws about
 * as fast as the bitmaps come back, and taking them costs a slow phone
 * seconds of work, so it is left off there.
 */
export function BotanicalScene({ density = 1, snapshot = false, children }: { density?: number; snapshot?: boolean; children?: React.ReactNode }) {
  const art = useMemo(() => cachedArt(density), [density]);
  const root = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  // Keep the drawn scene as bitmaps (see freeze.ts). A theme change or a
  // resize puts the live vector art back at once and snapshots it again
  // when things settle.
  useEffect(() => {
    const el = root.current;
    if (!el || !snapshot) return;
    let thaw: (() => void) | null = null;
    let timer = window.setTimeout(() => (thaw = freezeScene(el)), FREEZE_AFTER);
    let size = `${el.clientWidth}x${el.clientHeight}`;
    const ro = new ResizeObserver(() => {
      const next = `${el.clientWidth}x${el.clientHeight}`;
      if (next === size) return;
      size = next;
      thaw?.();
      thaw = null;
      clearTimeout(timer);
      timer = window.setTimeout(() => (thaw = freezeScene(el)), 600);
    });
    ro.observe(el);
    return () => {
      ro.disconnect();
      clearTimeout(timer);
      thaw?.();
    };
  }, [theme, density, snapshot]);
  const back = art.sprays.filter((s) => s.group === "back");
  const crown = art.sprays.filter((s) => s.group === "crown");
  const front = art.sprays.filter((s) => s.group === "front" || s.group === "fringe");
  const full = place(0, 0, VIEW.w, VIEW.h);
  const box = `0 0 ${VIEW.w} ${VIEW.h}`;

  return (
    <div ref={root} className="botanical-scene pointer-events-none absolute inset-0 overflow-hidden">
      {/* light: the crown's shade on the wall and a warm glow behind it */}
      <svg aria-hidden className="absolute" style={full} viewBox={box} overflow="visible" data-freeze="300 40 20 40">
        <defs>
          <radialGradient id="sun-glow">
            <stop offset="0" stopColor="var(--sun-glow)" />
            <stop offset="1" stopColor="var(--sun-glow)" stopOpacity="0" />
          </radialGradient>
          {/* shadow softness grows with the distance between the caster and
              the wall: the whole crown is a broad blur, branches less so,
              single leaves least (but never crisp) */}
          <filter id="umbra-blur" filterUnits="userSpaceOnUse" x="-800" y="-600" width="3200" height="1800">
            <feGaussianBlur stdDeviation="26" />
          </filter>
          <filter id="wood-blur" filterUnits="userSpaceOnUse" x="-800" y="-600" width="3200" height="1800">
            <feGaussianBlur stdDeviation="6" />
          </filter>
          <filter id="off-frame-blur" filterUnits="userSpaceOnUse" x="-800" y="-600" width="3200" height="1800">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          <WallDefs id="" />
        </defs>
        {/* the sun, high on the right behind the crown */}
        <ellipse cx={1420} cy={40} rx={720} ry={560} fill="url(#sun-glow)" />
        <g mask="url(#wall-mask)" className="scene-dapple">
          {/* the crown's broad shade, and its branches */}
          <path d={art.umbra} fill="var(--shade-umbra)" filter="url(#umbra-blur)" transform={SHADE_TRANSFORM} />
          <path d={art.wood} fill="var(--shade-wood)" filter="url(#wood-blur)" transform={SHADE_TRANSFORM} />
          {/* foliage just outside the frame, in the top corner */}
          <path d={art.offFrame} fill="var(--shade-leaf)" filter="url(#off-frame-blur)" transform="translate(40 150) skewX(-12)" opacity={0.75} />
        </g>
      </svg>

      {art.dapple.map((s, i) => (
        <ShadeLayer key={i} s={s} i={i} />
      ))}

      {/* the inner crown, behind the wood: the sprays right against the limbs
          are drawn still; the broad masses of the crown sway a little */}
      <svg aria-hidden className="absolute" style={full} viewBox={box} overflow="visible" data-freeze="300 40 20 40">
        {back.map((s, i) => (
          <SprayStill key={i} s={s} />
        ))}
      </svg>
      {crown.map((s, i) => (
        <SprayLayer key={`c${i}`} s={s} alt={i % 2 === 0} />
      ))}

      {/* static wood, ground and stone */}
      <svg aria-hidden className="absolute" style={full} viewBox={box} overflow="visible" data-freeze="300 40 20 40">
        <defs>
          <clipPath id="wood-clip">
            <path d={art.wood} />
          </clipPath>
          <filter id="bark-soft" filterUnits="userSpaceOnUse" x="0" y="-200" width="1900" height="1200">
            <feGaussianBlur stdDeviation="3.5" />
          </filter>
          <filter id="shadow-soft" filterUnits="userSpaceOnUse" x="600" y="600" width="1300" height="400">
            <feGaussianBlur stdDeviation="9" />
          </filter>
          <linearGradient id="mound" x1="0" y1="0.2" x2="0" y2="1">
            <stop offset="0" stopColor="var(--moss-2)" />
            <stop offset="1" stopColor="var(--moss-1)" />
          </linearGradient>
          {/* stone lit from the upper right, turning into shade below and left */}
          <radialGradient id="rock" cx="0.7" cy="0.08" r="1.1" fx="0.72" fy="0.05">
            <stop offset="0" stopColor="var(--rock-3)" />
            <stop offset="0.4" stopColor="var(--rock-2)" />
            <stop offset="0.85" stopColor="var(--rock-1)" />
          </radialGradient>
          <linearGradient id="rock-foot" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0.45" stopColor="var(--rock-1)" stopOpacity="0" />
            <stop offset="1" stopColor="var(--rock-1)" stopOpacity="0.75" />
          </linearGradient>
        </defs>

        {/* fallen leaves */}
        <path d={art.fallen[1]} fill="var(--leaf-3)" />
        <path d={art.fallen[0]} fill="var(--leaf-4)" />

        {/* contact shadows on the floor */}
        <g filter="url(#shadow-soft)" fill="var(--scene-shadow)">
          <ellipse cx={1330} cy={884} rx={500} ry={24} />
          <ellipse cx={1250} cy={872} rx={70} ry={10} />
        </g>

        {/* wood: a crisp silhouette; inside it each limb's softly blended
            cylindrical shading and bark, branches first so the trunk
            overlaps where they join it */}
        <path d={art.wood} fill="var(--bark-1)" />
        <g clipPath="url(#wood-clip)">
          {art.limbs.map((l, i) => (
            <g key={i}>
              <g filter="url(#bark-soft)">
                <path d={l.d} fill="var(--bark-1)" />
                <path d={l.bands[0]} fill="var(--bark-2)" />
                <path d={l.bands[1]} fill="var(--bark-3)" />
                <path d={l.bands[2]} fill="var(--bark-4)" />
              </g>
              {l.fissures.map((g, j) => (
                <path key={`f${j}`} d={g.d} fill="none" stroke="var(--bark-line)" strokeWidth={g.w} strokeLinecap="round" strokeLinejoin="round" opacity={0.72} />
              ))}
              {l.ridges.map((g, j) => (
                <path key={`r${j}`} d={g.d} fill="none" stroke="var(--bark-light)" strokeWidth={g.w} strokeLinecap="round" strokeLinejoin="round" opacity={0.42} />
              ))}
            </g>
          ))}
        </g>
        <path d={art.twigs} fill="var(--twig)" />

        {/* the mossy mound the tree grows from */}
        <path d={art.mound} fill="url(#mound)" />
        {art.moss.map((d, i) => (d ? <path key={i} d={d} fill={`var(--leaf-${i + 1})`} /> : null))}

        {art.rocks.map((r, i) => (
          <g key={i}>
            <clipPath id={`rock-clip-${i}`}>
              <path d={r.d} />
            </clipPath>
            <path d={r.d} fill="url(#rock)" />
            <g clipPath={`url(#rock-clip-${i})`}>
              <path d={r.dark} fill="var(--rock-line)" opacity={0.45} />
              <path d={r.light} fill="var(--rock-3)" opacity={0.6} />
              <path d={r.d} fill="url(#rock-foot)" />
            </g>
          </g>
        ))}
      </svg>

      <svg aria-hidden className="scene-fringe absolute" style={full} viewBox={box} overflow="visible" data-freeze="300 40 20 40">
        <path d={art.fringeTwigs} fill="var(--twig)" />
      </svg>

      {art.tufts.map((t, i) => (
        <TuftLayer key={i} t={t} alt={i % 2 === 1} />
      ))}

      {front.map((s, i) => (
        <SprayLayer key={`f${i}`} s={s} alt={i % 2 === 0} />
      ))}

      {children}
    </div>
  );
}
