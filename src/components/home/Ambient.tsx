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

/** The ground the page ends on: grass and small plants. */
export function Ground() {
  // tufts of grass blades, generated once (deterministic)
  const tufts: string[][] = [[], []];
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let x = 8; x < 1600; x += 7 + rand() * 9) {
    const h = 10 + rand() * 26;
    const lean = (rand() - 0.4) * h * 0.5;
    const w = 1.2 + rand() * 1.1;
    tufts[Math.floor(rand() * 2)].push(`M${x - w} 64 Q${x + lean * 0.3} ${64 - h * 0.6} ${x + lean} ${64 - h} Q${x + lean * 0.3 + w} ${64 - h * 0.6} ${x + w} 64 Z`);
  }
  const plants: { x: number; s: number }[] = [];
  for (let x = 40; x < 1600; x += 120 + rand() * 160) plants.push({ x, s: 0.7 + rand() * 0.6 });
  const plant = (p: { x: number; s: number }, i: number) => (
    <g key={i} transform={`translate(${p.x} 64) scale(${p.s})`}>
      <path d="M0 0 C-2 -10 -8 -16 -16 -18 C-12 -10 -6 -4 0 0 Z" fill="var(--leaf-5)" />
      <path d="M0 0 C2 -12 8 -20 16 -22 C14 -12 8 -4 0 0 Z" fill="var(--leaf-4)" />
      <path d="M0 0 C0 -10 2 -20 0 -28 C-3 -20 -2 -10 0 0 Z" fill="var(--leaf-3)" />
    </g>
  );
  // Each moving part is its own HTML layer (the SVG inside it stays still),
  // so the sway runs on the compositor instead of repainting the strip.
  const layer = (cls: string, children: React.ReactNode) => (
    <div className={`ambient absolute inset-0 ${cls}`}>
      <svg viewBox="0 0 1600 72" preserveAspectRatio="xMidYMax slice" className="h-full w-full">
        {children}
      </svg>
    </div>
  );
  return (
    <div aria-hidden className="pointer-events-none relative h-[72px] w-full overflow-hidden">
      <svg viewBox="0 0 1600 72" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full">
        <rect y="62" width="1600" height="10" fill="var(--moss-2)" opacity="0.55" />
      </svg>
      {layer(
        "grass-a",
        <>
          <path d={tufts[0].join("")} fill="var(--leaf-4)" />
          {plants.filter((_, i) => i % 2).map(plant)}
        </>,
      )}
      {layer(
        "grass-b",
        <>
          <path d={tufts[1].join("")} fill="var(--leaf-3)" />
          {plants.filter((_, i) => !(i % 2)).map(plant)}
        </>,
      )}
    </div>
  );
}
