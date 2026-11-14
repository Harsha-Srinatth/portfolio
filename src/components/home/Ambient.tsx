/**
 * Quiet environmental details for the sections below the hero, continuing
 * its world: the tree's dappled light on the wall, a vine that grows along
 * the path, and the ground the page ends on. All decorative (aria-hidden),
 * transform-only, paused off screen and still with reduced motion.
 */

/** Sunlight through leaves, drifting slowly over the wall behind a section. */
export function LeafLight({ className = "" }: { className?: string }) {
  const leaves: [number, number, number, number, number][] = [
    [120, 60, 46, 17, -28],
    [210, 110, 40, 14, 18],
    [80, 170, 44, 15, 36],
    [300, 50, 34, 12, -8],
    [270, 190, 38, 13, -40],
    [170, 250, 42, 15, 24],
    [360, 140, 30, 11, 52],
    [40, 260, 32, 12, -18],
    [330, 270, 36, 12, 10],
    [420, 220, 28, 10, -30],
  ];
  return (
    <div aria-hidden className={`pointer-events-none absolute ${className}`}>
      <div className="ambient leaf-light h-full w-full">
        <svg viewBox="0 0 480 320" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="leaf-light-sun" cx="0.75" cy="0.25" r="0.7">
              <stop offset="0" stopColor="var(--sun-glow)" />
              <stop offset="1" stopColor="var(--sun-glow)" stopOpacity="0" />
            </radialGradient>
            <filter id="leaf-light-blur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="9" />
            </filter>
          </defs>
          <rect width="480" height="320" fill="url(#leaf-light-sun)" opacity="0.7" />
          <g filter="url(#leaf-light-blur)" fill="var(--shade-leaf)" opacity="0.55">
            {leaves.map(([x, y, rx, ry, r], i) => (
              <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} transform={`rotate(${r} ${x} ${y})`} />
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
}

/**
 * A vine that grows across the three stages of the Path as it scrolls into
 * view, unfurling a leaf above each stage (scroll-driven CSS; where that is
 * unsupported it is simply drawn in full).
 */
export function Vine() {
  const nodes = [16.7, 50, 83.3];
  return (
    <div aria-hidden className="vine pointer-events-none relative mb-2 hidden h-16 md:block">
      <svg viewBox="0 0 1200 64" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
        <path
          className="vine-stem"
          pathLength={1}
          d="M0 44 C120 30 160 52 200 40 S330 22 420 38 S560 56 600 40 S760 20 840 36 S960 54 1000 40 S1120 26 1200 34"
          fill="none"
          stroke="var(--twig)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
      {nodes.map((x, i) => (
        <span key={x} className="vine-leaf absolute top-[18px]" style={{ left: `${x}%`, ["--i" as string]: i }}>
          <svg viewBox="0 0 40 36" className="h-9 w-10 -translate-x-1/2 overflow-visible">
            <g className="vine-leaf-g">
              <path d="M20 30 C10 26 4 16 8 6 C16 6 22 16 20 30 Z" fill="var(--leaf-4)" />
              <path d="M20 30 C30 24 36 14 32 4 C24 6 18 16 20 30 Z" fill="var(--leaf-3)" />
              <path d="M20 30 L10 9 M20 30 L30 7" stroke="var(--leaf-vein)" strokeWidth="1" fill="none" />
            </g>
            <circle cx="20" cy="31" r="3" fill="var(--twig)" />
          </svg>
        </span>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The ground the page ends on                                          */
/* ------------------------------------------------------------------ */

const GW = 1600;
const GH = 170;
const n1 = (n: number) => n.toFixed(1);

/** The lie of the land: a far rise behind, and the near bank the grass grows on. */
const farY = (x: number) => 86 - 20 * Math.sin(x / 250 + 2.1) - 7 * Math.sin(x / 91 + 0.4);
const nearY = (x: number) => 122 - 13 * Math.sin(x / 205 + 0.7) - 6 * Math.sin(x / 71 + 1.9);

/** A closed shape from a ridge line down to the bottom edge. */
function bank(y: (x: number) => number) {
  let d = `M0 ${GH}L0 ${n1(y(0))}`;
  for (let x = 20; x <= GW; x += 20) d += `L${x} ${n1(y(x))}`;
  return `${d}L${GW} ${GH}Z`;
}

/** A stone, lit from the upper right like the ones under the tree. */
function Stone({ x, w, h, i }: { x: number; w: number; h: number; i: number }) {
  const y = nearY(x) + 5;
  const d = `M${n1(x - w / 2)} ${n1(y)}C${n1(x - w * 0.52)} ${n1(y - h * 0.7)} ${n1(x - w * 0.2)} ${n1(y - h * 1.05)} ${n1(x + w * 0.08)} ${n1(y - h)}C${n1(x + w * 0.38)} ${n1(y - h * 0.94)} ${n1(x + w * 0.56)} ${n1(y - h * 0.5)} ${n1(x + w / 2)} ${n1(y)}Z`;
  return (
    <g>
      <clipPath id={`ground-stone-${i}`}>
        <path d={d} />
      </clipPath>
      <path d={d} fill="url(#ground-rock)" />
      <g clipPath={`url(#ground-stone-${i})`}>
        <ellipse cx={x + w * 0.16} cy={y - h * 0.86} rx={w * 0.3} ry={h * 0.2} fill="var(--rock-3)" opacity="0.55" />
        <ellipse cx={x - w * 0.2} cy={y - h * 0.08} rx={w * 0.5} ry={h * 0.3} fill="var(--rock-line)" opacity="0.4" />
      </g>
    </g>
  );
}

/** Where everything on the ground goes. Seeded, so the server and the browser draw the same ground. */
function scatter() {
  let seed = 11;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

  // grass: blades rooted along the bank, in two layers that lean out of step
  const blades: string[][] = [[], [], []];
  for (let x = 4; x < GW; x += 5 + rand() * 7) {
    const base = nearY(x) + 3;
    const h = 12 + rand() * 30;
    const lean = (rand() - 0.42) * h * 0.55;
    const w = 1.3 + rand() * 1.2;
    const tone = rand();
    blades[tone < 0.45 ? 0 : tone < 0.9 ? 1 : 2].push(
      `M${n1(x - w)} ${n1(base)}Q${n1(x + lean * 0.3)} ${n1(base - h * 0.6)} ${n1(x + lean)} ${n1(base - h)}Q${n1(x + lean * 0.3 + w)} ${n1(base - h * 0.6)} ${n1(x + w)} ${n1(base)}Z`,
    );
  }
  // low, leafy plants
  const plants: { x: number; s: number }[] = [];
  for (let x = 50; x < GW; x += 110 + rand() * 150) plants.push({ x, s: 0.75 + rand() * 0.65 });
  // wildflowers, in the site's brass
  const flowers: { x: number; h: number; lean: number }[] = [];
  for (let x = 120; x < GW; x += 90 + rand() * 190) flowers.push({ x, h: 22 + rand() * 16, lean: (rand() - 0.5) * 10 });
  // leaves that have come down
  const fallen: string[][] = [[], []];
  for (let x = 30; x < GW; x += 60 + rand() * 120) {
    const y = nearY(x) + 9 + rand() * 16;
    const a = rand() * Math.PI;
    const dx = Math.cos(a) * 7;
    const dy = Math.sin(a) * 3;
    fallen[rand() < 0.5 ? 0 : 1].push(`M${n1(x - dx)} ${n1(y - dy)}Q${n1(x - dy * 1.6)} ${n1(y + dx * 0.45)} ${n1(x + dx)} ${n1(y + dy)}Q${n1(x + dy * 1.6)} ${n1(y - dx * 0.45)} ${n1(x - dx)} ${n1(y - dy)}Z`);
  }
  return { blades, plants, flowers, fallen };
}
const SCATTER = scatter();

/**
 * The ground the page ends on, echoing the mound the tree grows from: a far
 * rise, a mossy bank with stones, wildflowers and fallen leaves, grass
 * leaning in the breeze, and a sapling in the middle (the one the page began
 * with). Fireflies come out over it at night.
 */
export function Ground() {
  const { blades, plants, flowers, fallen } = SCATTER;
  // wildflowers, in the site's brass
  const plant = (p: { x: number; s: number }, i: number) => (
    <g key={i} transform={`translate(${n1(p.x)} ${n1(nearY(p.x) + 3)}) scale(${p.s.toFixed(2)})`}>
      <path d="M0 0 C-2 -10 -8 -16 -16 -18 C-12 -10 -6 -4 0 0 Z" fill="var(--leaf-5)" />
      <path d="M0 0 C2 -12 8 -20 16 -22 C14 -12 8 -4 0 0 Z" fill="var(--leaf-4)" />
      <path d="M0 0 C0 -10 2 -20 0 -28 C-3 -20 -2 -10 0 0 Z" fill="var(--leaf-3)" />
    </g>
  );
  const flower = (f: { x: number; h: number; lean: number }, i: number) => {
    const y = nearY(f.x) + 3;
    const tx = f.x + f.lean;
    const ty = y - f.h;
    return (
      <g key={i}>
        <path d={`M${n1(f.x)} ${n1(y)}Q${n1(f.x + f.lean * 0.2)} ${n1(y - f.h * 0.6)} ${n1(tx)} ${n1(ty)}`} stroke="var(--leaf-3)" strokeWidth="1.3" fill="none" strokeLinecap="round" />
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse key={a} cx={tx} cy={ty - 3.4} rx="2" ry="3.4" fill="var(--brass)" transform={`rotate(${a} ${n1(tx)} ${n1(ty)})`} />
        ))}
        <circle cx={tx} cy={ty} r="1.7" fill="var(--art-cream)" />
      </g>
    );
  };
  // the sapling, where the page began
  const sx = 800;
  const sy = nearY(sx) + 3;
  const sapLeaves = [
    { y: 16, r: -152, s: 1 },
    { y: 19, r: -24, s: 0.95 },
    { y: 31, r: -142, s: 0.84 },
    { y: 34, r: -34, s: 0.8 },
    { y: 46, r: -84, s: 0.74 },
  ];

  const box = `0 0 ${GW} ${GH}`;
  // Each moving part is its own HTML layer (the SVG inside it stays still),
  // so the sway runs on the compositor instead of repainting the strip.
  const layer = (cls: string, children: React.ReactNode) => (
    <div className={`ambient absolute inset-0 ${cls}`}>
      <svg viewBox={box} preserveAspectRatio="xMidYMax slice" className="h-full w-full">
        {children}
      </svg>
    </div>
  );
  const flies = [
    [8, 30, 34],
    [22, 52, 27],
    [37, 24, 31],
    [51, 46, 38],
    [64, 28, 29],
    [78, 50, 35],
    [91, 34, 26],
  ];
  return (
    <div aria-hidden className="pointer-events-none relative h-[120px] w-full overflow-hidden md:h-[170px]" style={{ ["--u" as string]: "1px" }}>
      <svg viewBox={box} preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="ground-far" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--leaf-3)" stopOpacity="0.42" />
            <stop offset="1" stopColor="var(--moss-2)" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="ground-near" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--leaf-2)" />
            <stop offset="0.45" stopColor="var(--moss-2)" />
            <stop offset="1" stopColor="var(--moss-1)" />
          </linearGradient>
          <radialGradient id="ground-rock" cx="0.7" cy="0.08" r="1.1">
            <stop offset="0" stopColor="var(--rock-3)" />
            <stop offset="0.4" stopColor="var(--rock-2)" />
            <stop offset="0.9" stopColor="var(--rock-1)" />
          </radialGradient>
        </defs>
        <path d={bank(farY)} fill="url(#ground-far)" />
        <path d={bank(nearY)} fill="url(#ground-near)" />
        <path d={fallen[0].join("")} fill="var(--leaf-5)" opacity="0.8" />
        <path d={fallen[1].join("")} fill="var(--brass)" opacity="0.7" />
        <Stone x={236} w={92} h={40} i={0} />
        <Stone x={310} w={54} h={24} i={1} />
        <Stone x={690} w={46} h={20} i={2} />
        <Stone x={1262} w={104} h={46} i={3} />
        <Stone x={1190} w={50} h={22} i={4} />
      </svg>
      {layer(
        "grass-b",
        <>
          <path d={blades[1].join("")} fill="var(--leaf-3)" />
          {plants.filter((_, i) => !(i % 2)).map(plant)}
          {flowers.filter((_, i) => i % 2).map(flower)}
        </>,
      )}
      {layer(
        "grass-a",
        <>
          <path d={blades[0].join("")} fill="var(--leaf-4)" />
          <path d={blades[2].join("")} fill="var(--leaf-5)" />
          {plants.filter((_, i) => i % 2).map(plant)}
          {flowers.filter((_, i) => !(i % 2)).map(flower)}
          <g transform={`translate(${sx} ${n1(sy)})`}>
            <path d="M0 0C-1.5 -18 2.5 -32 0 -50C-1 -58 0.5 -64 0 -70" stroke="var(--sapling-stem)" strokeWidth="2.6" strokeLinecap="round" fill="none" />
            {sapLeaves.map((l) => (
              <path key={l.y} d="M0 0C5 -7 17 -8 24 0C17 7 5 6 0 0Z" fill={l.r < -90 ? "var(--sapling-leaf-1)" : "var(--sapling-leaf-2)"} transform={`translate(0 ${-l.y - 14}) rotate(${l.r}) scale(${l.s})`} />
            ))}
          </g>
        </>,
      )}
      {flies.map(([x, y, dur], i) => (
        <div key={i} className="firefly ambient h-[46px] w-[90px]" style={{ left: `${x}%`, top: `${y}%`, ["--dur" as string]: `${dur}s`, ["--delay" as string]: `${-i * 3.7}s` }}>
          <i className="ambient" />
        </div>
      ))}
    </div>
  );
}
