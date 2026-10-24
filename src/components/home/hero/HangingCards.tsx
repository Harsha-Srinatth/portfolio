import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { AudioLines, Camera, Code2, GraduationCap, Headphones, Play, UtensilsCrossed } from "lucide-react";

import { PERSON } from "@/components/portfolio/data";
import { HANGERS, VIEW, limbAt, sceneUnit as u, type Hanger } from "./treeArt";

/*
 * Three cards hanging from the tree. Card content is sized in `em`, and 1em
 * follows the scene unit, so the cards scale with the tree at every size.
 */

type HangerKey = keyof typeof HANGERS;

// one `swing` cycle is four slow swings of different reach (see styles.css)
const SWAY: Record<HangerKey, { dur: number; delay: number; amp: number }> = {
  music: { dur: 29, delay: -5, amp: 1.1 },
  profile: { dur: 34, delay: -17, amp: 0.8 },
  about: { dur: 26, delay: -11, amp: 1.3 },
};

function swayVars(key: HangerKey): CSSProperties {
  const s = SWAY[key];
  return { ["--dur" as string]: `${s.dur}s`, ["--delay" as string]: `${s.delay}s`, ["--amp" as string]: `${s.amp}deg` };
}

/* ------------------------------------------------------------------ */
/* Card faces                                                          */
/* ------------------------------------------------------------------ */

const paper =
  "rounded-[1.05em] border border-[var(--card-paper-border)] bg-[var(--card-paper)] text-[var(--card-paper-fg)] shadow-[var(--card-shadow)]";

function Index({ n }: { n: string }) {
  return <span className="text-[0.78em] tabular-nums opacity-60">{n}</span>;
}

function Waveform() {
  const bars = [3, 6, 4, 8, 5, 9, 6, 4, 7, 10, 6, 8, 4, 6, 9, 5, 7, 4, 6, 3];
  return (
    <span className="mt-[0.5em] flex h-[1em] items-end gap-[0.14em]" aria-hidden>
      {bars.map((b, i) => (
        <span key={i} className="w-[0.12em] rounded-full bg-current opacity-70" style={{ height: `${b * 10}%` }} />
      ))}
    </span>
  );
}

export function MusicCard() {
  return (
    <article
      aria-label="Music"
      className="flex h-full flex-col rounded-[1.05em] border border-[var(--card-dark-border)] p-[1.35em] text-[var(--card-dark-fg)] shadow-[var(--card-shadow)]"
      style={{ background: "linear-gradient(155deg, color-mix(in oklab, var(--card-dark) 82%, #a08a72) 0%, var(--card-dark) 45%, var(--card-dark-2) 100%)" }}
    >
      <div className="flex items-start justify-between">
        <AudioLines className="h-[1.7em] w-[1.7em]" strokeWidth={1.4} aria-hidden />
        <Index n="01" />
      </div>
      <h3 className="font-display mt-[0.75em] text-[1.75em] font-[400] leading-none tracking-[-0.02em]">Music</h3>
      <p className="mt-[0.5em] text-[0.88em] leading-[1.38] opacity-85">
        A constant companion that keeps me focused, creative and calm.
      </p>
      <div className="mt-auto flex items-center gap-[0.75em] border-t border-white/10 pt-[0.9em]">
        <span
          aria-hidden
          className="h-[3.3em] w-[3.3em] shrink-0 rounded-[0.45em]"
          style={{
            background:
              "radial-gradient(circle at 38% 62%, #ffd9a1 0 10%, transparent 11%), linear-gradient(180deg, #f2b06a 0%, #b9626a 48%, #4d3346 72%, #261d27 100%)",
          }}
        />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[0.7em] font-medium leading-tight">Lo-fi &amp; ambient</span>
          <span className="block truncate text-[0.6em] leading-tight opacity-60">What I code to</span>
          <Waveform />
        </span>
        {/* decorative: the site has no audio player, so this is not a control */}
        <span aria-hidden className="grid h-[2em] w-[2em] shrink-0 place-items-center rounded-full bg-[var(--card-dark-fg)] text-[var(--card-dark)]">
          <Play className="ml-[0.1em] h-[0.85em] w-[0.85em]" fill="currentColor" strokeWidth={0} />
        </span>
      </div>
    </article>
  );
}

const LIKE_ICONS = [Headphones, Code2, UtensilsCrossed, Camera];

export function ProfileCard() {
  return (
    <article aria-label="Things I like" className={`flex h-full flex-col p-[1.25em] ${paper}`}>
      <div className="flex items-start justify-between">
        <span className="font-display text-[1.75em] leading-none tracking-[-0.06em]" style={{ fontVariationSettings: '"opsz" 144' }}>
          HS
        </span>
        <Index n="02" />
      </div>
      <div className="mx-auto mt-[0.9em] h-[8.4em] w-[8.4em] shrink-0 overflow-hidden rounded-full border-[0.25em] border-[var(--card-paper)] shadow-[0_0.3em_0.9em_-0.3em_rgba(60,40,20,0.35)]">
        {PERSON.photo ? (
          <img src={PERSON.photo} alt={PERSON.fullName} className="h-full w-full object-cover" />
        ) : (
          <span
            role="img"
            aria-label={`${PERSON.fullName}, monogram`}
            className="font-display grid h-full w-full place-items-center text-[3em] tracking-[-0.06em] text-[#f7efe2]"
            style={{ background: "radial-gradient(circle at 30% 25%, #9d8164 0%, #5f4834 55%, #3b2c20 100%)" }}
          >
            HS
          </span>
        )}
      </div>
      <h3 className="font-display mt-[1em] text-[1.1em] font-[450]">Things I Like</h3>
      <ul className="mt-[0.55em] space-y-[0.55em] text-[0.74em]">
        {PERSON.likes.map((like, i) => {
          const Icon = LIKE_ICONS[i % LIKE_ICONS.length];
          return (
            <li key={like} className="flex items-center gap-[0.7em]">
              <Icon className="h-[1.25em] w-[1.25em] shrink-0 opacity-80" strokeWidth={1.6} aria-hidden />
              {like}
            </li>
          );
        })}
      </ul>
    </article>
  );
}

export function AboutCard() {
  return (
    <article aria-label="About me" className={`flex h-full flex-col p-[1.35em] ${paper}`}>
      <div className="flex items-start justify-between">
        <span className="grid h-[2.6em] w-[2.6em] place-items-center rounded-[0.6em] bg-[var(--card-chip)]" aria-hidden>
          <GraduationCap className="h-[1.45em] w-[1.45em]" strokeWidth={1.5} />
        </span>
        <Index n="03" />
      </div>
      <h3 className="font-display mt-[0.8em] text-[1.75em] font-[400] leading-none tracking-[-0.02em]">About Me</h3>
      <p className="mt-[0.6em] text-[0.88em] leading-[1.4] opacity-85">CSBS student at SRKR Engineering College, Bhimavaram.</p>
      <ul className="mt-auto flex flex-wrap gap-[0.45em] pt-[0.8em] text-[0.66em]" aria-label="Tags">
        {["CSBS", "SRKR", "Bhimavaram"].map((t) => (
          <li key={t} className="rounded-full border border-[var(--card-paper-border)] bg-[var(--card-tag)] px-[0.95em] py-[0.4em]">
            {t}
          </li>
        ))}
      </ul>
    </article>
  );
}

const FACES: Record<HangerKey, () => ReactNode> = {
  music: MusicCard,
  profile: ProfileCard,
  about: AboutCard,
};

/* ------------------------------------------------------------------ */
/* In the scene                                                        */
/* ------------------------------------------------------------------ */

/** Where the cord meets the card: a small brass eyelet just inside the top edge. */
const EYELET = 0.62; // em from the card's top edge to the eyelet's centre

/** The knot over the branch and the eyelet on the card. */
function Eyelet() {
  return (
    <span
      aria-hidden
      className="absolute left-1/2 z-10 h-[0.62em] w-[0.62em] -translate-x-1/2 -translate-y-1/2 rounded-full border-[0.14em] border-[var(--cord-ring)] bg-[color-mix(in_oklab,var(--cord)_70%,black)] shadow-[0_0.06em_0.12em_rgb(0_0_0/0.3)]"
      style={{ top: `${EYELET}em` }}
    />
  );
}

/**
 * A card on a cord, swinging as one piece around the point where the cord
 * meets the branch. The cord runs down over the card's top edge to the
 * eyelet, so the two can never come apart.
 */
function SceneHanger({ k, h }: { k: HangerKey; h: Hanger }) {
  const Face = FACES[k];
  return (
    <div
      className="card-sway absolute"
      style={{
        right: u(VIEW.w - (h.x + h.w / 2)),
        bottom: u(VIEW.h - (h.y + h.cord + h.h)),
        width: u(h.w),
        height: u(h.cord + h.h),
        transformOrigin: "50% 0%",
        fontSize: u(16 * h.k),
        ...swayVars(k),
      }}
    >
      <span
        aria-hidden
        className="absolute left-1/2 top-0 z-10 w-[0.11em] -translate-x-1/2 rounded-full bg-[var(--cord)]"
        style={{ height: `calc(${u(h.cord)} + ${EYELET}em)` }}
      />
      {/* the cord's loop over the branch */}
      <span aria-hidden className="absolute left-1/2 top-[-0.22em] z-10 h-[0.44em] w-[0.3em] -translate-x-1/2 rounded-full bg-[var(--cord)]" />
      <div className="absolute inset-x-0 bottom-0" style={{ height: u(h.h), transform: `rotate(${h.tilt}deg)`, transformOrigin: "50% 0%" }}>
        <Eyelet />
        <Face />
      </div>
    </div>
  );
}

export function SceneCards() {
  return (
    <div className="pointer-events-auto">
      <SceneHanger k="music" h={HANGERS.music} />
      <SceneHanger k="profile" h={HANGERS.profile} />
      <SceneHanger k="about" h={HANGERS.about} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Phones and tablets                                                  */
/* ------------------------------------------------------------------ */

/** Pixels per scene unit in the stacked frame (screen width `w`): the same as --u in styles.css. */
const stackUnit = (w: number, h: number) => Math.min(h / 1180, w / 980);
/** The scene's left edge in the frame: the same as `left` in styles.css. */
const stackLeft = (w: number, unit: number) => Math.max(0, (w - unit * 1220) * 0.6);

const KEYS: HangerKey[] = ["music", "profile", "about"];
/** Card size in desktop units, the limbs each may hang from, cord and tilt. */
const COMPACT: Record<HangerKey, { w: number; h: number; limbs: string[]; cord: number; tilt: number }> = {
  music: { w: 240, h: 286, limbs: ["left", "lowLeft"], cord: 40, tilt: 0.6 },
  profile: { w: 228, h: 362, limbs: ["left", "rightUp", "lowLeft"], cord: 150, tilt: 0 },
  about: { w: 248, h: 272, limbs: ["right", "rightUp"], cord: 110, tilt: -1.4 },
};
/** Leftmost scene x that still has foliage on the smaller layout (the fringe is hidden). */
const TREE_LEFT = 640;

type Placed = { k: HangerKey; left: number; top: number; cord: number; w: number; h: number; scale: number };

/**
 * Lay the three cards out side by side under the crown, as large as the
 * width allows, each hanging from a limb directly above it and ending above
 * the bottom of the frame.
 */
function layout(w: number, h: number): Placed[] {
  const unit = stackUnit(w, h);
  const top = 900 - h / unit; // scene y at the top of the frame
  const toPx = (y: number) => (y - top) * unit;
  // screen pixels <-> scene x (scene x 540 sits at the scene's left edge)
  const sceneLeft = stackLeft(w, unit);
  const toX = (px: number) => 540 + (px - sceneLeft) / unit;
  const fromX = (x: number) => sceneLeft + (x - 540) * unit;
  const margin = Math.max(16, w * 0.045);
  const gap = Math.max(6, w * 0.02);
  // the cards stay over the tree, not out on the bare wall
  const lo = Math.max(margin, fromX(TREE_LEFT));
  const room = w - margin - lo;
  const total = KEYS.reduce((a, k) => a + COMPACT[k].w, 0);
  let scale = Math.min((w * 1.4) / 1200, (room - gap * 2) / total, (h * 0.52) / COMPACT.profile.h);

  for (let attempt = 0; attempt < 6; attempt++) {
    const span = total * scale + gap * 2;
    let x = lo + (room - span) / 2;
    const out: Placed[] = [];
    let fits = true;
    for (const k of KEYS) {
      const c = COMPACT[k];
      const cw = c.w * scale;
      const ch = c.h * scale;
      const cx = x + cw / 2;
      const limb = limbAt(c.limbs, toX(cx));
      const hang = limb === null ? toPx(140) : toPx(limb);
      const floor = h * 0.97 - ch - hang;
      const cord = Math.max(10, Math.min(c.cord * scale, floor));
      if (floor < 10) fits = false;
      // positioned inside the scene element, which starts at sceneLeft
      out.push({ k, left: x - sceneLeft, top: hang, cord, w: cw, h: ch, scale });
      x += cw + gap;
    }
    if (fits) return out;
    scale *= 0.92;
  }
  return [];
}

function CompactHanger({ p }: { p: Placed }) {
  const Face = FACES[p.k];
  return (
    <div
      className="card-sway absolute"
      style={{ left: p.left, top: p.top, width: p.w, height: p.cord + p.h, transformOrigin: "50% 0%", fontSize: 16 * p.scale, ...swayVars(p.k) }}
    >
      <span
        aria-hidden
        className="absolute left-1/2 top-0 z-10 w-[0.11em] -translate-x-1/2 rounded-full bg-[var(--cord)]"
        style={{ height: `calc(${p.cord}px + ${EYELET}em)` }}
      />
      <span aria-hidden className="absolute left-1/2 top-[-0.22em] z-10 h-[0.44em] w-[0.3em] -translate-x-1/2 rounded-full bg-[var(--cord)]" />
      <div className="absolute inset-x-0 bottom-0" style={{ height: p.h, transform: `rotate(${COMPACT[p.k].tilt}deg)`, transformOrigin: "50% 0%" }}>
        <Eyelet />
        <Face />
      </div>
    </div>
  );
}

/** The cards on the phone and tablet layout, re-laid out when the frame resizes. */
export function CompactCards() {
  const ref = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);
  useEffect(() => {
    const frame = ref.current?.parentElement?.parentElement;
    if (!frame) return;
    const ro = new ResizeObserver(() => {
      const next = { w: frame.clientWidth, h: frame.clientHeight };
      setBox((b) => (b && b.w === next.w && b.h === next.h ? b : next));
    });
    ro.observe(frame);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} className="pointer-events-auto absolute inset-0">
      {box && layout(box.w, box.h).map((p) => <CompactHanger key={p.k} p={p} />)}
    </div>
  );
}
