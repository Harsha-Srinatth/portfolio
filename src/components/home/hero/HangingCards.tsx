import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { AudioLines, Camera, Code2, Headphones, Heart, Pause, Play, UtensilsCrossed } from "lucide-react";

import { PERSON } from "@/components/portfolio/data";
import { readLiked, sendLike, subscribeLiked } from "../likeStore";
import { toast } from "../toastStore";
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
  like: { dur: 26, delay: -11, amp: 1.3 },
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
  return <span className="text-[0.85em] tabular-nums opacity-70">{n}</span>;
}

/** A sine curve, two periods wide, for the waves to slide along. */
function sine(amp: number, periods: number, phase: number) {
  const w = 200;
  const pts: string[] = [];
  for (let i = 0; i <= 120; i++) {
    const x = (i / 120) * w;
    pts.push(`${x.toFixed(1)} ${(20 + Math.sin((x / w) * Math.PI * 2 * periods + phase) * amp).toFixed(2)}`);
  }
  return `M${pts.join("L")}`;
}

/** Three layered waves in a strip: they slide, and swell and ebb, while playing. */
function Waves({ playing }: { playing: boolean }) {
  const layers = [
    { amp: 13, periods: 2, phase: 0, o: 0.95, w: 1.8, speed: 3.2, swell: "0s" },
    { amp: 9, periods: 3, phase: 1.6, o: 0.6, w: 1.4, speed: 4.6, swell: "-0.7s" },
    { amp: 6, periods: 4, phase: 3.1, o: 0.38, w: 1.2, speed: 6.1, swell: "-1.3s" },
  ];
  const state = playing ? "running" : "paused";
  return (
    <div className="wave-field relative min-h-[2.6em] flex-1 overflow-hidden" style={{ opacity: playing ? 1 : 0 }} aria-hidden>
      {layers.map((l, i) => (
        <div key={i} className="wave-swell absolute inset-0" style={{ animationDelay: l.swell, animationPlayState: state }}>
          <div className="wave flex h-full w-[200%]" style={{ ["--wd" as string]: `${l.speed}s`, animationPlayState: state }}>
            {[0, 1].map((k) => (
              <svg key={k} viewBox="0 0 200 40" preserveAspectRatio="none" className="h-full w-1/2">
                <path d={sine(l.amp, l.periods, l.phase)} fill="none" stroke="currentColor" strokeOpacity={l.o} strokeWidth={l.w} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              </svg>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function MusicCard() {
  const [playing, setPlaying] = useState(false);
  const toggle = () => {
    // there is no track yet: the button only shows what playing will look like
    if (!playing) toast("Coming soon");
    setPlaying((p) => !p);
  };
  return (
    <article
      aria-label="Music"
      className="flex h-full flex-col rounded-[1.05em] border border-[var(--card-dark-border)] p-[1.35em] text-[var(--card-dark-fg)] shadow-[var(--card-shadow)]"
      style={{ background: "linear-gradient(155deg, color-mix(in oklab, var(--card-dark) 82%, #a08a72) 0%, var(--card-dark) 45%, var(--card-dark-2) 100%)" }}
    >
      <div className="flex items-start justify-between">
        <AudioLines className="h-[1.9em] w-[1.9em]" strokeWidth={1.5} aria-hidden />
        <Index n="01" />
      </div>
      <h3 className="font-display mt-[0.6em] text-[1.9em] font-[420] leading-none tracking-[-0.02em]">Music</h3>
      <p className="card-extra mt-[0.5em] text-[0.96em] leading-[1.35]">A constant companion that keeps me focused, creative and calm.</p>

      <Waves playing={playing} />

      <div className="mt-auto flex items-center gap-[0.8em] border-t border-white/15 pt-[0.85em]">
        <span className="min-w-0 flex-1">
          <span className="block text-[1.12em] font-medium leading-tight">{PERSON.song.title}</span>
          <span className="card-extra block truncate text-[0.88em] leading-tight opacity-80">{PERSON.song.note}</span>
        </span>
        <button
          type="button"
          onClick={toggle}
          aria-pressed={playing}
          aria-label={playing ? "Pause" : "Play"}
          className="grid h-[2.7em] w-[2.7em] shrink-0 place-items-center rounded-full bg-[var(--card-dark-fg)] text-[var(--card-dark)] transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          {playing ? <Pause className="h-[1.05em] w-[1.05em]" fill="currentColor" strokeWidth={0} /> : <Play className="ml-[0.12em] h-[1.05em] w-[1.05em]" fill="currentColor" strokeWidth={0} />}
        </button>
      </div>
    </article>
  );
}

const LIKE_ICONS = [Headphones, Code2, UtensilsCrossed, Camera];

export function ProfileCard() {
  return (
    <article aria-label="My interests" className={`flex h-full flex-col p-[1.25em] ${paper}`}>
      <div className="flex items-start justify-between">
        <span className="font-display text-[1.75em] leading-none tracking-[-0.06em]" style={{ fontVariationSettings: '"opsz" 144' }}>
          HS
        </span>
        <Index n="02" />
      </div>
      <div className="mx-auto mt-[0.9em] h-[8.4em] w-[8.4em] shrink-0 overflow-hidden rounded-full border-[0.25em] border-[var(--card-paper)] shadow-[0_0.3em_0.9em_-0.3em_rgba(60,40,20,0.35)]">
        {PERSON.photo ? (
          <img
            src={PERSON.photo}
            alt={PERSON.fullName}
            className="h-full w-full object-cover"
            style={
              PERSON.photoPosition
                ? {
                    objectPosition: PERSON.photoPosition,
                    transform: `scale(${PERSON.photoScale ?? 1})`,
                    transformOrigin: PERSON.photoPosition,
                  }
                : undefined
            }
          />
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
      <h3 className="font-display mt-[0.9em] text-[1.2em] font-[450] leading-tight">My interests</h3>
      <ul className="mt-[0.45em] space-y-[0.4em] text-[0.84em] leading-tight">
        {PERSON.likes.map((like, i) => {
          const Icon = LIKE_ICONS[i % LIKE_ICONS.length];
          return (
            <li key={like} className={`flex items-center gap-[0.65em] ${i > 1 ? "card-extra" : ""}`}>
              <Icon className="h-[1.25em] w-[1.25em] shrink-0" strokeWidth={1.7} aria-hidden />
              {like}
            </li>
          );
        })}
      </ul>
    </article>
  );
}

/** A Like card: one tap sends a like (the same one as the footer's); the heart turns red. */
export function LikeCard() {
  const likedBefore = useSyncExternalStore(subscribeLiked, readLiked, () => false);
  const [pending, setPending] = useState(false);
  const liked = likedBefore;
  const tap = async () => {
    if (liked || pending) return;
    setPending(true);
    try {
      await sendLike();
    } catch (error) {
      console.error("[stats] Failed to record like", error);
      toast("Couldn’t send your like. Try again");
    } finally {
      setPending(false);
    }
  };
  return (
    <article aria-label="Like" className={`flex h-full flex-col items-center p-[1.35em] text-center ${paper}`}>
      <div className="flex w-full items-start justify-end">
        <Index n="03" />
      </div>
      <button
        type="button"
        onClick={() => void tap()}
        disabled={liked || pending}
        aria-pressed={liked}
        aria-label={liked ? "You liked this site" : "Like this site"}
        className="like-heart mt-[0.2em] grid h-[5.6em] w-[5.6em] place-items-center rounded-full bg-[var(--card-chip)] transition-transform duration-200 hover:scale-105 active:scale-95 disabled:cursor-default"
      >
        <Heart className={`h-[2.6em] w-[2.6em] transition-colors duration-300 ${liked ? "like-pop fill-[#e5384f] text-[#e5384f]" : ""}`} strokeWidth={1.6} aria-hidden />
      </button>
      <h3 className="font-display mt-[0.75em] text-[1.6em] font-[420] leading-tight">{liked ? "Thank you!" : "Liked it?"}</h3>
      <p className="mt-[0.35em] text-[1em] leading-snug">{liked ? "Your like is counted." : "Tap the heart."}</p>
    </article>
  );
}

const FACES: Record<HangerKey, () => ReactNode> = {
  music: MusicCard,
  profile: ProfileCard,
  like: LikeCard,
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
      <SceneHanger k="like" h={HANGERS.like} />
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

const KEYS: HangerKey[] = ["music", "profile", "like"];
/** Card size in desktop units, the limbs each may hang from, cord and tilt. */
const COMPACT: Record<HangerKey, { w: number; h: number; limbs: string[]; cord: number; tilt: number }> = {
  music: { w: 240, h: 286, limbs: ["left", "lowLeft"], cord: 40, tilt: 0.6 },
  profile: { w: 228, h: 362, limbs: ["left", "rightUp", "lowLeft"], cord: 150, tilt: 0 },
  like: { w: 248, h: 272, limbs: ["right", "rightUp"], cord: 110, tilt: -1.4 },
};
/** Text on phones and tablets is set larger than the card's own scale, and the least important lines are left out (.card-extra). */
const COMPACT_TEXT = 1;
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
      className="card-sway card-compact absolute"
      style={{ left: p.left, top: p.top, width: p.w, height: p.cord + p.h, transformOrigin: "50% 0%", fontSize: 16 * p.scale * COMPACT_TEXT, ...swayVars(p.k) }}
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
