import type { ReactNode } from "react";

/**
 * Pictures for the "Off the keyboard" cards, drawn in the hero's palette and
 * light: a sunlit wall with soft leaf shadows, a warm floor, the sun high on
 * the right. Colours are CSS variables, so the pictures follow the theme.
 */

const FLOOR = 205;

/** `zoom` frames the subject: it is drawn larger and sits clear of the caption. */
function Scene({ id, children, table = false, zoom, bare = false }: { id: string; children: ReactNode; table?: boolean; zoom: string; bare?: boolean }) {
  // `bare`: a transparent overlay (just the subject), laid over another picture
  if (bare)
    return (
      <svg viewBox="0 0 400 300" className="absolute inset-0 block h-full w-full" aria-hidden preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id={`${id}-shadow`} x="-30%" y="-100%" width="160%" height="300%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>
        <g transform={zoom}>{children}</g>
      </svg>
    );
  return (
    <svg viewBox="0 0 400 300" className="block h-full w-full" aria-hidden preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`${id}-wall`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--hero-wall-1)" />
          <stop offset="1" stopColor="var(--hero-wall-2)" />
        </linearGradient>
        <linearGradient id={`${id}-floor`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--art-floor)" />
          <stop offset="1" stopColor="var(--hero-wall-2)" />
        </linearGradient>
        <radialGradient id={`${id}-sun`} cx="0.85" cy="0.05" r="0.75">
          <stop offset="0" stopColor="var(--sun-glow)" />
          <stop offset="1" stopColor="var(--sun-glow)" stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}-soft`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <filter id={`${id}-shadow`} x="-30%" y="-100%" width="160%" height="300%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
      {table ? (
        <rect width="400" height="300" fill={`url(#${id}-floor)`} />
      ) : (
        <>
          <rect width="400" height={FLOOR - 18} fill={`url(#${id}-wall)`} />
          <rect y={FLOOR - 18} width="400" height={318 - FLOOR} fill={`url(#${id}-floor)`} />
          <rect y={FLOOR - 18} width="400" height="1.5" fill="var(--scene-shadow)" opacity="0.25" />
        </>
      )}
      <rect width="400" height="300" fill={`url(#${id}-sun)`} />
      {/* leaf shadows from a tree out of frame, as in the hero */}
      <g filter={`url(#${id}-soft)`} fill="var(--shade-leaf)" opacity="0.7">
        {[
          [26, 22, 22, 9, -30],
          [52, 40, 18, 7, 20],
          [18, 62, 20, 8, 40],
          [70, 16, 16, 6, -10],
          [44, 82, 15, 6, -45],
          [88, 48, 14, 5, 30],
        ].map(([x, y, rx, ry, r], i) => (
          <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} transform={`rotate(${r} ${x} ${y})`} />
        ))}
      </g>
      <g transform={zoom}>{children}</g>
    </svg>
  );
}

/** A soft contact shadow on the floor, thrown a little to the left. */
function Shadow({ id, cx, rx, ry = 6, o = 0.55 }: { id: string; cx: number; rx: number; ry?: number; o?: number }) {
  return <ellipse cx={cx - 6} cy={FLOOR + 3} rx={rx} ry={ry} fill="var(--scene-shadow)" opacity={o} filter={`url(#${id}-shadow)`} />;
}

const MUSIC_ZOOM = `translate(206 ${FLOOR - 18}) scale(1.22) translate(-200 -${FLOOR})`;

/** The record against the wall (the back layer; its grooves turn in RecordSpin). */
function Music() {
  const id = "art-music";
  const cx = 246;
  const cy = 127;
  return (
    <Scene id={id} zoom={MUSIC_ZOOM}>
      <Shadow id={id} cx={cx} rx={70} />
      {/* a record, standing against the wall; its grooves and label turn */}
      <circle cx={cx} cy={cy} r={78} fill="var(--art-ink)" />
      {/* grooves and label: drawn by RecordSpin, a separate turning layer */}
    </Scene>
  );
}

/** The headphones resting in front of the record (the front layer). */
function Headphones() {
  const id = "art-music-front";
  return (
    <Scene id={id} zoom={MUSIC_ZOOM} bare>
      {/* the light's sheen on the record stays put while the grooves turn */}
      <path d="M276 61 A72 72 0 0 1 314 105" fill="none" stroke="var(--art-cream)" strokeOpacity="0.22" strokeWidth="9" strokeLinecap="round" />
      <path d="M194 173 A70 70 0 0 1 182 149" fill="none" stroke="var(--art-cream)" strokeOpacity="0.08" strokeWidth="7" strokeLinecap="round" />
      <Shadow id={id} cx={124} rx={30} ry={5} o={0.6} />
      <Shadow id={id} cx={204} rx={28} ry={5} o={0.6} />
      <path d="M112 152 C104 62 218 58 210 156" fill="none" stroke="var(--bark-2)" strokeWidth="13" strokeLinecap="round" />
      <path d="M115 148 C110 72 212 68 206 150" fill="none" stroke="var(--bark-4)" strokeOpacity="0.55" strokeWidth="3" strokeLinecap="round" />
      {/* yokes */}
      <rect x="106" y="140" width="10" height="20" rx="3" fill="var(--art-metal)" />
      <rect x="205" y="144" width="10" height="20" rx="3" fill="var(--art-metal)" />
      {/* cups: shell, cushion, light on the shell */}
      <ellipse cx="118" cy="174" rx="23" ry="31" fill="var(--art-ink-2)" />
      <ellipse cx="127" cy="174" rx="15" ry="25" fill="var(--bark-2)" />
      <ellipse cx="111" cy="160" rx="5" ry="10" fill="var(--art-metal)" opacity="0.35" />
      <ellipse cx="210" cy="177" rx="22" ry="29" fill="var(--art-ink-2)" />
      <ellipse cx="201" cy="177" rx="14" ry="23" fill="var(--bark-2)" />
      <ellipse cx="219" cy="164" rx="5" ry="10" fill="var(--art-metal)" opacity="0.45" />
    </Scene>
  );
}

function Badminton() {
  const id = "art-badminton";
  // racket strings, clipped to the head
  const strings: string[] = [];
  for (let x = -36; x <= 36; x += 8) strings.push(`M${x} -166V-54`);
  for (let y = -158; y <= -60; y += 8) strings.push(`M-42 ${y}H42`);
  return (
    <Scene id={id} zoom={`translate(196 ${FLOOR - 18}) scale(1.08) translate(-200 -${FLOOR})`}>
      <defs>
        <clipPath id={`${id}-head`}>
          <ellipse cx="0" cy="-110" rx="37" ry="49" />
        </clipPath>
      </defs>
      {/* racket leaning on the wall, its handle on the floor */}
      <Shadow id={id} cx={262} rx={22} ry={4} />
      <ellipse cx="190" cy="112" rx="34" ry="44" fill="var(--shade-leaf)" opacity="0.5" filter={`url(#${id}-soft)`} transform="translate(-26 18) rotate(-24 190 112)" />
      <g transform={`translate(262 ${FLOOR}) rotate(-24)`}>
        <rect x="-6.5" y="-46" width="13" height="46" rx="5" fill="var(--bark-3)" />
        {[-40, -32, -24, -16, -8].map((y) => (
          <path key={y} d={`M-6.5 ${y + 4}L6.5 ${y}`} stroke="var(--bark-2)" strokeWidth="1.6" />
        ))}
        <rect x="-2.5" y="-62" width="5" height="18" fill="var(--art-metal)" />
        <path d="M-2.5 -60 L-12 -56 M2.5 -60 L12 -56" stroke="var(--accent)" strokeWidth="3.5" strokeLinecap="round" />
        <g clipPath={`url(#${id}-head)`}>
          <ellipse cx="0" cy="-110" rx="37" ry="49" fill="var(--hero-wall-1)" opacity="0.25" />
          <path d={strings.join("")} stroke="var(--art-cream)" strokeWidth="1.1" opacity="0.85" />
        </g>
        <ellipse cx="0" cy="-110" rx="40" ry="52" fill="none" stroke="var(--accent)" strokeWidth="6.5" />
        <path d="M24 -150 A40 52 0 0 1 38 -122" fill="none" stroke="var(--art-cream)" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* a shuttlecock lying on the floor */}
      <Shadow id={id} cx={128} rx={40} ry={5} o={0.5} />
      <g transform={`translate(98 ${FLOOR - 13}) rotate(-12)`}>
        <path d="M6 -9 L62 -28 L62 28 L6 9 Z" fill="var(--art-cream)" />
        {[-24, -14, -4, 6, 16, 24].map((y) => (
          <path key={y} d={`M8 ${y * 0.3} L62 ${y}`} stroke="var(--rock-3)" strokeWidth="1" opacity="0.8" />
        ))}
        <path d="M62 -28 Q66 -21 62 -14 Q66 -7 62 0 Q66 7 62 14 Q66 21 62 28" fill="none" stroke="var(--rock-3)" strokeWidth="1.2" />
        <path d="M20 -13 L22 13" stroke="var(--accent)" strokeWidth="2" opacity="0.7" />
        <circle cx="0" cy="0" r="12" fill="var(--art-cream)" />
        <path d="M2 -12 A12 12 0 0 1 2 12" fill="var(--bark-4)" />
        <circle cx="-3" cy="-4" r="3" fill="#fff" opacity="0.45" />
      </g>
    </Scene>
  );
}

function Cricket() {
  const id = "art-cricket";
  const stumps = [214, 240, 266];
  return (
    <Scene id={id} zoom={`translate(196 ${FLOOR - 18}) scale(1.06) translate(-200 -${FLOOR})`}>
      <defs>
        <linearGradient id={`${id}-wood`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="var(--bark-3)" />
          <stop offset="0.6" stopColor="var(--bark-4)" />
          <stop offset="1" stopColor="var(--bark-light)" />
        </linearGradient>
        <radialGradient id={`${id}-ball`} cx="0.68" cy="0.3" r="0.8">
          <stop offset="0" stopColor="color-mix(in oklab, var(--art-red) 70%, #fff)" />
          <stop offset="0.55" stopColor="var(--art-red)" />
          <stop offset="1" stopColor="color-mix(in oklab, var(--art-red) 60%, #000)" />
        </radialGradient>
      </defs>
      {/* stumps and bails */}
      <Shadow id={id} cx={240} rx={46} ry={5} />
      {stumps.map((x) => (
        <g key={x}>
          <rect x={x - 5} y="58" width="10" height={FLOOR - 58} rx="3" fill={`url(#${id}-wood)`} />
          <rect x={x - 5} y={FLOOR - 26} width="10" height="26" fill="var(--bark-3)" opacity="0.35" />
        </g>
      ))}
      <rect x="213" y="51" width="27" height="6" rx="3" fill="var(--bark-4)" />
      <rect x="241" y="51" width="27" height="6" rx="3" fill="var(--bark-4)" />
      {/* shadows of the stumps on the wall, from the sun on the right */}
      <g opacity="0.35" fill="var(--shade-wood)" filter={`url(#${id}-soft)`}>
        {stumps.map((x) => (
          <rect key={x} x={x - 26} y="70" width="8" height={FLOOR - 70} transform={`skewX(-8)`} />
        ))}
      </g>

      {/* a bat, leaning on the stumps */}
      <Shadow id={id} cx={176} rx={18} ry={4} />
      <g transform={`translate(176 ${FLOOR}) rotate(17)`}>
        <rect x="-14" y="-122" width="28" height="122" rx="7" fill="color-mix(in oklab, var(--bark-light) 70%, var(--art-cream))" />
        <rect x="4" y="-122" width="10" height="122" rx="5" fill="var(--bark-4)" opacity="0.35" />
        <rect x="-4" y="-174" width="8" height="56" rx="3" fill="var(--art-ink-2)" />
        {[-168, -158, -148, -138, -128].map((y) => (
          <path key={y} d={`M-4 ${y + 3}L4 ${y}`} stroke="var(--bark-2)" strokeWidth="1.4" />
        ))}
      </g>

      {/* the ball, in front */}
      <Shadow id={id} cx={128} rx={22} ry={4} o={0.65} />
      <circle cx="128" cy={FLOOR - 21} r="21" fill={`url(#${id}-ball)`} />
      <path d={`M114 ${FLOOR - 37} Q130 ${FLOOR - 22} 140 ${FLOOR - 3}`} fill="none" stroke="var(--art-cream)" strokeWidth="1.3" opacity="0.85" />
      <path d={`M119 ${FLOOR - 40} Q135 ${FLOOR - 25} 145 ${FLOOR - 6}`} fill="none" stroke="var(--art-cream)" strokeWidth="1.3" opacity="0.85" />
      <ellipse cx="136" cy={FLOOR - 33} rx="5" ry="3" fill="#fff" opacity="0.3" transform={`rotate(-30 136 ${FLOOR - 33})`} />
    </Scene>
  );
}

function Carrom() {
  const id = "art-carrom";
  const c = 200;
  const m = 130;
  const coins: [number, number, "ink" | "cream"][] = [
    [0, -14, "ink"],
    [12, -7, "cream"],
    [12, 7, "ink"],
    [0, 14, "cream"],
    [-12, 7, "ink"],
    [-12, -7, "cream"],
    [38, 30, "cream"],
    [-44, -26, "ink"],
    [26, -46, "ink"],
  ];
  return (
    <Scene id={id} table zoom="translate(200 106) scale(0.8) translate(-200 -130)">
      {/* seen from above, lying on a table */}
      <rect x={c - 104} y={m - 104} width="208" height="208" rx="12" fill="var(--scene-shadow)" opacity="0.5" filter={`url(#${id}-soft)`} transform="translate(-8 10) rotate(-6 200 130)" />
      <g transform={`rotate(-6 ${c} ${m})`}>
        <rect x={c - 104} y={m - 104} width="208" height="208" rx="12" fill="var(--bark-3)" />
        <rect x={c - 104} y={m - 104} width="208" height="208" rx="12" fill="none" stroke="var(--bark-light)" strokeOpacity="0.45" strokeWidth="2" />
        <rect x={c - 90} y={m - 90} width="180" height="180" rx="3" fill="color-mix(in oklab, var(--art-cream) 82%, var(--bark-light))" />
        {/* pockets */}
        {[
          [-80, -80],
          [80, -80],
          [-80, 80],
          [80, 80],
        ].map(([x, y]) => (
          <circle key={`${x}${y}`} cx={c + x} cy={m + y} r="9" fill="var(--art-ink)" />
        ))}
        {/* baselines on each side */}
        {[0, 90, 180, 270].map((r) => (
          <g key={r} transform={`rotate(${r} ${c} ${m})`} stroke="var(--art-ink-2)" strokeWidth="1" fill="none">
            <path d={`M${c - 50} ${m + 62}H${c + 50}M${c - 50} ${m + 70}H${c + 50}`} />
            <circle cx={c - 50} cy={m + 66} r="4" fill="var(--art-red)" stroke="none" />
            <circle cx={c + 50} cy={m + 66} r="4" fill="var(--art-red)" stroke="none" />
            <path d={`M${c - 62} ${m + 62}L${c - 74} ${m + 74}`} />
          </g>
        ))}
        <circle cx={c} cy={m} r="30" fill="none" stroke="var(--art-red)" strokeWidth="1.4" />
        <circle cx={c} cy={m} r="24" fill="none" stroke="var(--art-ink-2)" strokeWidth="0.8" />
        {/* the coins, the queen in the middle, and the striker */}
        {coins.map(([x, y, k], i) => (
          <g key={i}>
            <circle cx={c + x + 1} cy={m + y + 1.5} r="6.5" fill="var(--scene-shadow)" opacity="0.5" />
            <circle cx={c + x} cy={m + y} r="6.5" fill={k === "ink" ? "var(--art-ink-2)" : "var(--art-cream)"} />
            <circle cx={c + x} cy={m + y} r="4" fill="none" stroke={k === "ink" ? "var(--bark-3)" : "var(--rock-3)"} strokeWidth="0.9" />
          </g>
        ))}
        <circle cx={c + 1} cy={m + 1.5} r="6.5" fill="var(--scene-shadow)" opacity="0.5" />
        <circle cx={c} cy={m} r="6.5" fill="var(--art-red)" />
        <circle cx={c + 20 + 1} cy={m + 66 + 2} r="10" fill="var(--scene-shadow)" opacity="0.5" />
        <circle cx={c + 20} cy={m + 66} r="10" fill="var(--art-cream)" />
        <circle cx={c + 20} cy={m + 66} r="6.5" fill="none" stroke="var(--accent)" strokeWidth="1.6" />
      </g>
    </Scene>
  );
}

const ART = { music: Music, badminton: Badminton, cricket: Cricket, carrom: Carrom } as const;

/**
 * The record's grooves and label, turning, as an HTML layer over the Music
 * picture (so it spins on the compositor rather than repainting the
 * picture's blurred light). Its geometry matches the record in Music().
 */
function RecordSpin() {
  // the record's centre and radius in the 400 × 300 picture, after its zoom
  const k = 1.22;
  const cx = 206 + (246 - 200) * k;
  const cy = FLOOR - 18 + (127 - FLOOR) * k;
  const r = 78 * k;
  return (
    <div
      aria-hidden
      className="ambient spin-record absolute"
      style={{ left: `${((cx - r) / 400) * 100}%`, top: `${((cy - r) / 300) * 100}%`, width: `${((2 * r) / 400) * 100}%`, aspectRatio: "1" }}
    >
      <svg viewBox="-78 -78 156 156" className="block h-full w-full">
        {[70, 63, 56, 49, 42, 35].map((rr) => (
          <circle key={rr} r={rr} fill="none" stroke="var(--art-ink-2)" strokeWidth="1.6" strokeDasharray={rr % 2 ? "40 3" : "60 4"} />
        ))}
        <circle r={25} fill="var(--accent)" />
        <circle r={17} fill="none" stroke="var(--art-cream)" strokeOpacity="0.45" strokeWidth="1.2" strokeDasharray="22 6" />
        <path d="M-9 -13 h18" stroke="var(--art-cream)" strokeOpacity="0.5" strokeWidth="1.6" strokeLinecap="round" />
        <circle r={3.5} fill="var(--hero-wall-2)" />
      </svg>
    </div>
  );
}

export function HobbyArt({ kind }: { kind: keyof typeof ART }) {
  const Art = ART[kind];
  return (
    <div className="relative h-full w-full">
      <Art />
      {kind === "music" && (
        <>
          <RecordSpin />
          <Headphones />
        </>
      )}
    </div>
  );
}
