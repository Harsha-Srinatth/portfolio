/**
 * Procedural 2D botanical art for the hero, traced from the reference
 * composition. Everything is generated once (deterministically) as SVG path
 * data in a 1760 × 900 "scene" coordinate space (≈ reference pixels):
 *
 *  - wood: one stout, leaning trunk that forks high up, with smoothly tapering
 *    limbs, cylindrical shading (lit from the upper right) and ridged bark
 *  - foliage: leafy sprays — a thin stem with alternate, two-toned ovate
 *    leaves — each its own small layer so it can sway on its own
 *  - ground: a mossy mound with low ground cover, grass, boulders and pebbles
 *  - light: the canopy's dappled shadow on the wall, in pieces that drift as
 *    the sprays above them sway
 *
 * Colours are CSS variables (see styles.css) so both themes share the art.
 */

export const VIEW = { w: 1760, h: 900 };

/** A length of `n` scene units, in CSS (see --u in BotanicalScene). */
export const sceneUnit = (n: number) => `calc(var(--u) * ${n})`;

type P = [number, number];
type Pw = [number, number, number];

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const f1 = (n: number) => Math.round(n * 10) / 10;
const xy = (x: number, y: number) => `${f1(x)} ${f1(y)}`;

/** Dense, smooth centreline through control points (Catmull–Rom), with width. */
function spline(pts: Pw[], step = 4): Pw[] {
  const out: Pw[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const len = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
    const n = Math.max(2, Math.ceil(len / step));
    for (let s = 0; s < n; s++) {
      const t = s / n;
      const t2 = t * t;
      const t3 = t2 * t;
      const c = (a: number, b: number, cc: number, d: number) =>
        0.5 * (2 * b + (-a + cc) * t + (2 * a - 5 * b + 4 * cc - d) * t2 + (-a + 3 * b - 3 * cc + d) * t3);
      // width eases between control points so the taper has no kinks
      const e = t * t * (3 - 2 * t);
      out.push([c(p0[0], p1[0], p2[0], p3[0]), c(p0[1], p1[1], p2[1], p3[1]), p1[2] + (p2[2] - p1[2]) * e]);
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
}

function normals(line: Pw[]): P[] {
  return line.map((_, i) => {
    const a = line[Math.max(0, i - 1)];
    const b = line[Math.min(line.length - 1, i + 1)];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const l = Math.hypot(dx, dy) || 1;
    return [-dy / l, dx / l];
  });
}

/* ------------------------------------------------------------------ */
/* Wood                                                                */
/* ------------------------------------------------------------------ */

/** Sun high on the right, behind the tree. */
const LIGHT: P = [0.8, -0.6];

type Limb = { id: string; pts: Pw[]; bark: number; grain: number; fringe?: boolean };

const LIMBS: Limb[] = [
  // the trunk: rises out of the mound and leans up and to the left
  {
    id: "trunk",
    bark: 120,
    grain: 2.1,
    pts: [
      [1532, 812, 176],
      [1512, 744, 150],
      [1486, 682, 133],
      [1452, 616, 121],
      [1412, 550, 111],
      [1370, 486, 103],
      [1328, 422, 95],
      [1286, 360, 87],
      [1246, 302, 79],
      [1208, 248, 71],
      [1174, 196, 62],
      [1150, 142, 52],
      [1136, 88, 42],
      [1130, 34, 33],
      [1133, -24, 23],
      [1142, -92, 12],
    ],
  },
  // up and to the right from the fork
  {
    id: "rightUp",
    bark: 16,
    grain: 1.3,
    pts: [[1158, 186, 42], [1198, 140, 33], [1250, 104, 26], [1318, 78, 20], [1396, 58, 15], [1480, 45, 10.5], [1570, 37, 7], [1660, 33, 4]],
  },
  // the long left limb that carries the music card
  {
    id: "left",
    bark: 22,
    grain: 1.5,
    pts: [
      [1200, 240, 48],
      [1132, 202, 39],
      [1062, 168, 32],
      [990, 141, 26],
      [916, 121, 21],
      [840, 107, 16.5],
      [762, 101, 11.5],
      [702, 103, 6.5],
    ],
  },
  // a lower limb under it (the profile card hangs from this one)
  {
    id: "lowLeft",
    bark: 14,
    grain: 1.3,
    pts: [[1304, 384, 44], [1238, 343, 33], [1172, 309, 27], [1104, 283, 21], [1036, 265, 16], [966, 253, 12], [896, 247, 8.5], [828, 249, 5.5], [770, 258, 3]],
  },
  // the right limb from mid-trunk (the About card hangs from this one)
  {
    id: "right",
    bark: 22,
    grain: 1.6,
    pts: [[1350, 456, 62], [1380, 394, 49], [1424, 339, 40], [1478, 291, 32], [1540, 253, 25], [1606, 221, 19], [1676, 193, 14], [1746, 171, 9], [1800, 159, 6]],
  },
];

// thinner branches that carry foliage (flat colour, mostly under the leaves)
const TWIGS: Limb[] = [
  { id: "leftUp", bark: 0, grain: 0, pts: [[944, 128, 10], [904, 90, 7.5], [852, 54, 5.5], [790, 28, 3.8], [720, 12, 2.2]] },
  // the fringe: reaches toward the copy, shown only on the widest screens
  { id: "leftTip", bark: 0, grain: 0, fringe: true, pts: [[706, 103, 6.5], [640, 109, 5], [572, 121, 3.6], [520, 131, 2.4], [494, 136, 1.6]] },
  { id: "leftDroop", bark: 0, grain: 0, fringe: true, pts: [[690, 104, 5], [662, 136, 4.2], [630, 172, 3.2], [612, 208, 2]] },
  { id: "leaderLeft", bark: 0, grain: 0, pts: [[1132, 44, 13], [1072, 16, 9.5], [1004, -4, 6.5], [932, -18, 4]] },
  { id: "rightUpTwig", bark: 0, grain: 0, pts: [[1318, 78, 11], [1348, 32, 7.5], [1368, -18, 4]] },
  // a bough reaching in from just above the frame, so the top edge isn't bare
  { id: "topHang", bark: 0, grain: 0, pts: [[900, -40, 6], [820, -30, 4.8], [740, -18, 3.8], [700, -12, 3.4]] },
  { id: "topHangTip", bark: 0, grain: 0, fringe: true, pts: [[704, -12, 3.4], [660, -6, 3], [600, 3, 2.2], [566, 8, 1.5]] },
  { id: "rightDown", bark: 0, grain: 0, pts: [[1676, 193, 11], [1710, 262, 8], [1734, 342, 5.6], [1748, 430, 3.8], [1756, 520, 2.2]] },
  { id: "lowDroop", bark: 0, grain: 0, pts: [[1036, 265, 8.5], [1004, 302, 6.5], [982, 350, 4.6], [972, 404, 2.6]] },
  { id: "trunkSprig", bark: 0, grain: 0, pts: [[1444, 600, 15], [1514, 582, 10], [1586, 574, 6.5], [1652, 578, 3.5]] },
];

/** Smooth, low-frequency knobbliness along a limb's edges. */
function bumps(n: number, rand: () => number, amount: number) {
  const a = rand() * 9;
  const b = rand() * 9;
  return Array.from({ length: n }, (_, i) => 1 + amount * (0.65 * Math.sin(i * 0.11 + a) + 0.35 * Math.sin(i * 0.37 + b)));
}

/**
 * The strip of a limb between two offsets across its width, as fractions of
 * the half-width where +1 is the lit edge.
 */
function strip(line: Pw[], nrm: P[], s: number, bump: number[], a0: number, b0: number) {
  // work in the limb's own normal frame so every strip winds the same way
  // (overlapping limbs would otherwise cancel out under the nonzero rule)
  const a = Math.min(a0 * s, b0 * s);
  const b = Math.max(a0 * s, b0 * s);
  s = 1;
  const A: string[] = [];
  const B: string[] = [];
  for (let i = 0; i < line.length; i++) {
    const p = line[i];
    const hw = (p[2] / 2) * bump[i];
    const nx = nrm[i][0] * s;
    const ny = nrm[i][1] * s;
    A.push(xy(p[0] + nx * hw * a, p[1] + ny * hw * a));
    B.push(xy(p[0] + nx * hw * b, p[1] + ny * hw * b));
  }
  return `M${A.join("L")}L${B.reverse().join("L")}Z`;
}

/** Bark grain: long, slightly wavering lines that follow the limb, with cross-checks. */
function grain(line: Pw[], nrm: P[], s: number, bump: number[], rand: () => number, count: number, f0: number, f1_: number, cross: boolean) {
  const out: string[] = [];
  for (let k = 0; k < count; k++) {
    const f = f0 + rand() * (f1_ - f0);
    const start = Math.floor(rand() * line.length * 0.92);
    const len = Math.floor(14 + rand() * 46);
    const wob = rand() * 10;
    const pts: string[] = [];
    for (let i = start; i < Math.min(line.length, start + len); i++) {
      const p = line[i];
      const ff = Math.max(-0.97, Math.min(0.97, f + Math.sin(i * 0.17 + wob) * 0.035));
      const hw = (p[2] / 2) * bump[i];
      pts.push(xy(p[0] + nrm[i][0] * s * hw * ff, p[1] + nrm[i][1] * s * hw * ff));
      // the occasional short check across to the next ridge
      if (cross && rand() < 0.018 && p[2] > 18) {
        const g = ff + (rand() < 0.5 ? -1 : 1) * (0.1 + rand() * 0.08);
        const q = line[Math.min(line.length - 1, i + 3)];
        out.push(`M${xy(p[0] + nrm[i][0] * s * hw * ff, p[1] + nrm[i][1] * s * hw * ff)}L${xy(q[0] + nrm[i][0] * s * hw * g, q[1] + nrm[i][1] * s * hw * g)}`);
      }
    }
    if (pts.length > 1) out.push(`M${pts.join("L")}`);
  }
  return out.join("");
}

/* ------------------------------------------------------------------ */
/* Foliage                                                             */
/* ------------------------------------------------------------------ */

/** Leaf tones, darkest first: --leaf-1 … --leaf-6. */
export const LEAF_TONES = 6;

export type Spray = {
  /** bounding box in scene units */
  x: number;
  y: number;
  w: number;
  h: number;
  /** attachment point as a fraction of the box, for transform-origin */
  ox: number;
  oy: number;
  /** combined leaf halves, one path per tone, darkest first */
  tones: string[];
  veins: string;
  stem: string;
  /**
   * "back": inner sprays behind the wood, drawn still; "crown": the broad
   * masses of the crown, a few large slow layers; "front": the lit outer
   * sprays; "fringe": sprays reaching toward the copy, dropped on narrower
   * screens
   */
  group: "back" | "crown" | "front" | "fringe";
  dur: number;
  delay: number;
  amp: number;
};

/**
 * The copy and navigation, in scene units at the widest layout (where the
 * fringe sprays are shown): no leaves here. Leaves may tuck in beside the
 * short first line of the name, as in the reference.
 */
function blocked(x0: number, y0: number) {
  // jitter the test point (deterministically), so where foliage meets the
  // copy its edge is ragged like a real crown, not cut in a straight line
  const h = Math.sin(x0 * 12.9898 + y0 * 78.233) * 43758.5453;
  const j = h - Math.floor(h);
  const x = x0 + (j - 0.5) * 90;
  const y = y0 + ((j * 7.31) % 1 - 0.5) * 60;
  return (
    (x < 495 && y < 96) || // navigation
    (x < 372 && y > 160) || // "Harsha"
    (x < 600 && y > 270) || // "Srinatth Ryali"
    (x < 680 && y > 392) // subtitle, introduction, buttons
  );
}

class Sink {
  tones: string[][] = Array.from({ length: LEAF_TONES }, () => []);
  veins: string[] = [];
  stems: string[] = [];
  minX = Infinity;
  minY = Infinity;
  maxX = -Infinity;
  maxY = -Infinity;
  grow(x: number, y: number, r = 0) {
    this.minX = Math.min(this.minX, x - r);
    this.minY = Math.min(this.minY, y - r);
    this.maxX = Math.max(this.maxX, x + r);
    this.maxY = Math.max(this.maxY, y + r);
  }
}

const LEAF_LIGHT: P = [0.42, -0.9];

/**
 * An ovate leaf with a drawn-out tip, as two halves split along the midrib so
 * one side can catch the light. Returns [lit half, shaded half].
 */
function leafHalves(bx: number, by: number, ang: number, L: number, W: number): [string, string, string] {
  const dx = Math.cos(ang);
  const dy = Math.sin(ang);
  const px = -dy;
  const py = dx;
  const pt = (a: number, b: number) => xy(bx + dx * a + px * b, by + dy * a + py * b);
  const hw = W / 2;
  const half = (s: number) =>
    `M${pt(0, 0)}C${pt(L * 0.02, s * hw * 0.9)} ${pt(L * 0.3, s * hw * 1.2)} ${pt(L * 0.55, s * hw * 0.9)}` +
    `C${pt(L * 0.72, s * hw * 0.66)} ${pt(L * 0.86, s * hw * 0.22)} ${pt(L, 0)}Z`;
  const up = px * LEAF_LIGHT[0] + py * LEAF_LIGHT[1] > 0;
  const vein = `M${pt(L * 0.04, 0)}L${pt(L * 0.82, 0)}`;
  return up ? [half(1), half(-1), vein] : [half(-1), half(1), vein];
}

type SprayOpts = {
  len: number;
  leaf: number;
  /** how strongly the spray and its leaves bend down under their weight */
  sag: number;
  /** overall exposure to the light, 0 (deep inside) – 1 (sunlit edge) */
  expo: number;
  group: Spray["group"];
  fork?: boolean;
  /** shadow-only foliage outside the frame: not kept clear of the copy */
  free?: boolean;
};

function buildSpray(ax: number, ay: number, ang: number, o: SprayOpts, rand: () => number): Spray | null {
  const sink = new Sink();
  const step = 7;
  const n = Math.max(3, Math.round(o.len / step));
  const stem: Pw[] = [];
  let x = ax;
  let y = ay;
  let a = ang;
  for (let i = 0; i <= n; i++) {
    stem.push([x, y, 2.6 * (1 - i / n) + 0.8]);
    a += o.sag * 0.035 * Math.cos(a) + (rand() - 0.5) * 0.05;
    x += Math.cos(a) * step;
    y += Math.sin(a) * step;
  }
  const leaves: { z: number; tone: number; lit: string; shade: string; vein: string }[] = [];
  let tried = 0;
  const addLeaf = (bx: number, by: number, la: number, L: number) => {
    const cx = bx + Math.cos(la) * L * 0.5;
    const cy = by + Math.sin(la) * L * 0.5;
    tried++;
    if (!o.free && blocked(cx, cy)) return false;
    // leaves near the top and the right of the crown face the sun
    const height = 1 - Math.max(0, Math.min(1, (cy + 60) / 760));
    const e = o.expo * 0.55 + height * 0.3 + (cx - 900) / 3600 + (rand() - 0.5) * 0.75 - 0.04;
    const tone = Math.max(0, Math.min(LEAF_TONES - 1, Math.floor(e * LEAF_TONES)));
    // broad, ovate blades, some turned edge-on to us
    const W = L * (0.52 + rand() * 0.12) * (0.62 + rand() * 0.38);
    const [lit, shade, vein] = leafHalves(bx, by, la, L, W);
    leaves.push({ z: tone + rand() * 1.5, tone, lit, shade, vein });
    sink.grow(cx, cy, L * 0.62);
    return true;
  };
  // how far along the stem the last kept leaf grows: the stem ends there,
  // so no bare twig is left where leaves were cleared away from the copy
  let lastI = -1;

  // alternate leaves along the stem, largest mid-way, and one at the tip
  let side = rand() < 0.5 ? 1 : -1;
  const spacing = o.leaf * 0.34;
  let dist = o.len * 0.12;
  const total = n * step;
  while (dist < total - 4) {
    const i = Math.min(n, Math.round(dist / step));
    const p = stem[i];
    const prev = stem[Math.max(0, i - 1)];
    const next = stem[Math.min(n, i + 1)];
    const sa = Math.atan2(next[1] - prev[1], next[0] - prev[0]);
    let la = sa + side * (0.4 + rand() * 0.95);
    la += o.sag * 0.32 * Math.cos(la); // leaf blades droop a little
    const t = dist / total;
    const L = o.leaf * (0.62 + 0.38 * Math.sin(Math.PI * (0.22 + 0.7 * t))) * (0.88 + rand() * 0.24);
    if (addLeaf(p[0] + Math.cos(la) * 2.5, p[1] + Math.sin(la) * 2.5, la, L)) lastI = Math.max(lastI, i);
    side = -side;
    dist += spacing * (0.85 + rand() * 0.3);
  }
  if (o.fork) {
    const i = Math.round(n * (0.3 + rand() * 0.25));
    const p = stem[i];
    const q = stem[Math.min(n, i + 1)];
    const sa = Math.atan2(q[1] - p[1], q[0] - p[0]) + (rand() < 0.5 ? -1 : 1) * (0.5 + rand() * 0.4);
    let fx = p[0];
    let fy = p[1];
    let fa = sa;
    const m = Math.round(n * 0.55);
    const fork: Pw[] = [];
    let forkLast = -1;
    for (let k = 0; k <= m; k++) {
      fork.push([fx, fy, 1.8 * (1 - k / m) + 0.7]);
      fa += o.sag * 0.035 * Math.cos(fa);
      fx += Math.cos(fa) * step;
      fy += Math.sin(fa) * step;
      if (k > 1 && k % 2 === 0) {
        const la = fa + (k % 4 === 0 ? 1 : -1) * (0.45 + rand() * 0.9);
        if (addLeaf(fx, fy, la + o.sag * 0.3 * Math.cos(la), o.leaf * (0.7 + rand() * 0.3))) forkLast = k;
      }
    }
    fork.push([fx, fy, 0.7]); // where the tip leaf grows
    if (addLeaf(fx, fy, fa + (rand() - 0.5) * 0.4, o.leaf * (0.8 + rand() * 0.2))) forkLast = m;
    if (forkLast > 0) {
      const fl = spline(fork.slice(0, forkLast + 2), 6);
      sink.stems.push(strip(fl, normals(fl), 1, fl.map(() => 1), -1, 1));
      lastI = Math.max(lastI, i);
    }
  }

  const tip = stem[n];
  const pre = stem[n - 1];
  if (addLeaf(tip[0], tip[1], Math.atan2(tip[1] - pre[1], tip[0] - pre[0]) + (rand() - 0.5) * 0.3, o.leaf * (0.85 + rand() * 0.2))) lastI = n;
  // a spray that lost most of its leaves to the copy would be a bare stick
  if (leaves.length < tried * 0.6) return null;

  leaves.sort((p, q) => p.z - q.z);
  for (const l of leaves) {
    // the shaded half sits one tone darker (two on the brightest leaves)
    sink.tones[Math.max(0, l.tone - (l.tone >= 4 ? 2 : 1))].push(l.shade);
    sink.tones[l.tone].push(l.lit);
    if (l.tone >= 1 && o.group !== "back") sink.veins.push(l.vein);
  }

  // stem drawn only as far as the last leaf it carries
  const kept = stem.slice(0, Math.max(2, lastI + 1));
  const line = spline(kept, 6);
  const nrm = normals(line);
  sink.stems.push(strip(line, nrm, 1, line.map(() => 1), -1, 1));
  for (const p of kept) sink.grow(p[0], p[1], 2);
  sink.grow(ax, ay, 2);

  const pad = 3;
  const bx = sink.minX - pad;
  const by = sink.minY - pad;
  const w = sink.maxX - sink.minX + pad * 2;
  const h = sink.maxY - sink.minY + pad * 2;
  // longer, outer sprays move more; the slow, inner ones barely at all
  const reach = Math.min(1, o.len / 150);
  return {
    x: bx,
    y: by,
    w,
    h,
    ox: (ax - bx) / w,
    oy: (ay - by) / h,
    tones: sink.tones.map((t) => t.join("")),
    veins: sink.veins.join(""),
    stem: sink.stems.join(""),
    group: o.group,
    // one cycle holds a dozen or so gusts (see `breeze` in styles.css)
    dur: 30 + rand() * 12,
    delay: -rand() * 42,
    amp: 3.5 + reach * (1.5 + rand() * 2),
  };
}

/** Many sprays as one layer, swaying about (ax, ay). */
function mergeSprays(parts: Spray[], ax: number, ay: number, rand: () => number, group: Spray["group"] = "back"): Spray {
  const x = Math.min(...parts.map((p) => p.x));
  const y = Math.min(...parts.map((p) => p.y));
  const w = Math.max(...parts.map((p) => p.x + p.w)) - x;
  const h = Math.max(...parts.map((p) => p.y + p.h)) - y;
  return {
    x,
    y,
    w,
    h,
    ox: (ax - x) / w,
    oy: (ay - y) / h,
    tones: Array.from({ length: LEAF_TONES }, (_, k) => parts.map((p) => p.tones[k]).join("")),
    veins: parts.map((p) => p.veins).join(""),
    stem: parts.map((p) => p.stem).join(""),
    group,
    ...(group === "crown"
      ? { dur: 36 + rand() * 12, delay: -rand() * 48, amp: 1.4 + rand() * 0.8 }
      : { dur: 30 + rand() * 12, delay: -rand() * 42, amp: (parts.reduce((a, p) => a + p.amp, 0) / parts.length) * 0.9 }),
  };
}

/**
 * Neighbouring sprays on the same limb, `n` at a time, become one swaying
 * layer. Every swaying element costs the browser a little on each frame it
 * draws for other reasons (scrolling, the entrance animation), so fewer,
 * larger layers keep the page light — and neighbours on a twig do move
 * together. The foliage behind the wood is left alone: it is drawn still.
 */
function groupSprays(sprays: Spray[], n: number, rand: () => number) {
  const out: Spray[] = [];
  let run: Spray[] = [];
  const at = (s: Spray): P => [s.x + s.ox * s.w, s.y + s.oy * s.h];
  const flush = () => {
    if (run.length === 1) out.push(run[0]);
    else if (run.length) {
      // the layer turns about the middle of its sprays' stems, and no further
      // than keeps each stem's base within ~2.5 units of its branch
      const pts = run.map(at);
      const ax = pts.reduce((a, p) => a + p[0], 0) / pts.length;
      const ay = pts.reduce((a, p) => a + p[1], 0) / pts.length;
      const reach = Math.max(...pts.map((p) => Math.hypot(p[0] - ax, p[1] - ay)), 1);
      const m = mergeSprays(run, ax, ay, rand, run[0].group);
      m.amp = Math.min(m.amp, (2.5 / reach) * (180 / Math.PI));
      out.push(m);
    }
    run = [];
  };
  for (const s of sprays) {
    if (s.group === "back" || s.group === "crown") {
      flush();
      out.push(s);
      continue;
    }
    const first = run[0];
    if (first && (first.group !== s.group || run.length >= n || Math.hypot(at(first)[0] - at(s)[0], at(first)[1] - at(s)[1]) > 70)) flush();
    run.push(s);
  }
  flush();
  return out;
}

/** Limbs and twigs a leaf mass can grow from (not the fringe, which narrower screens hide). */
const ATTACH = () => [...LIMBS, ...TWIGS.filter((t) => !t.fringe)].map((l) => LINES.get(l.id)!);

/** The nearest point on any branch to (x, y). */
function nearestBranch(x: number, y: number): Pw {
  let best: Pw = [0, 0, 0];
  let d = Infinity;
  for (const line of ATTACH())
    for (const p of line) {
      const e = (p[0] - x) ** 2 + (p[1] - y) ** 2;
      if (e < d) {
        d = e;
        best = p;
      }
    }
  return best;
}

/**
 * Join each spray of a leaf mass to the nearest branch with a twig that
 * tapers from the branch to the spray, so no leaves float free. The twigs
 * sway with the mass, which turns about the middle of where they leave the
 * branches and only so far that their bases stay on the wood.
 */
function attachMass(m: Spray, anchors: P[]): Spray {
  const twigs: string[] = [];
  const bases: P[] = [];
  let minX = m.x;
  let minY = m.y;
  let maxX = m.x + m.w;
  let maxY = m.y + m.h;
  for (const [x, y] of anchors) {
    const [bx, by, bw] = nearestBranch(x, y);
    const len = Math.hypot(x - bx, y - by);
    if (len < 4) continue;
    // a gentle bow, the same every build
    const h = Math.sin(x * 3.7 + y * 1.3) * 0.5;
    const nx = -(y - by) / len;
    const ny = (x - bx) / len;
    const mid: Pw = [(x + bx) / 2 + nx * len * 0.12 * h, (y + by) / 2 + ny * len * 0.12 * h, 2.6];
    const line = spline([[bx, by, Math.min(bw * 0.5, 6)], mid, [x, y, 1.8]], 6);
    twigs.push(strip(line, normals(line), 1, line.map(() => 1), -1, 1));
    bases.push([bx, by]);
    minX = Math.min(minX, bx - 6);
    minY = Math.min(minY, by - 6);
    maxX = Math.max(maxX, bx + 6);
    maxY = Math.max(maxY, by + 6);
  }
  if (!bases.length) return m;
  const ax = bases.reduce((a, p) => a + p[0], 0) / bases.length;
  const ay = bases.reduce((a, p) => a + p[1], 0) / bases.length;
  const reach = Math.max(...bases.map((p) => Math.hypot(p[0] - ax, p[1] - ay)), 1);
  const w = maxX - minX;
  const h = maxY - minY;
  return {
    ...m,
    x: minX,
    y: minY,
    w,
    h,
    ox: (ax - minX) / w,
    oy: (ay - minY) / h,
    // twigs first, so the leaves lie over them
    stem: twigs.join("") + m.stem,
    amp: Math.max(0.3, Math.min(m.amp, (2.5 / reach) * (180 / Math.PI))),
  };
}

/** Neighbouring tufts, `n` at a time, as one layer (see groupSprays). */
function groupTufts(tufts: Tuft[], n: number) {
  const out: Tuft[] = [];
  let run: Tuft[] = [];
  const flush = () => {
    if (!run.length) return;
    const x = Math.min(...run.map((t) => t.x));
    const y = Math.min(...run.map((t) => t.y));
    out.push({
      ...run[0],
      x,
      y,
      w: Math.max(...run.map((t) => t.x + t.w)) - x,
      h: Math.max(...run.map((t) => t.y + t.h)) - y,
      tones: run[0].tones.map((_, k) => run.map((t) => t.tones[k]).join("")),
      blades: run.map((t) => t.blades).join(""),
    });
    run = [];
  };
  for (const t of tufts) {
    if (run.length && (run.length >= n || Math.abs(t.x - run[0].x) > 60 * n || Math.abs(t.y - run[0].y) > 80)) flush();
    run.push(t);
  }
  flush();
  return out;
}

/* ------------------------------------------------------------------ */
/* Ground, rocks and grass                                             */
/* ------------------------------------------------------------------ */

export type Tuft = { x: number; y: number; w: number; h: number; tones: string[]; blades: string; dur: number; delay: number; amp: number };

const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

/** Top edge of the mossy mound at a given x: low and uneven, heaped up round the trunk. */
const moundTop = (x: number) =>
  748 + 112 * (1 - smooth(860, 1260, x)) - 46 * Math.exp(-(((x - 1505) / 150) ** 2)) + 9 * Math.sin(x * 0.019) + 5 * Math.sin(x * 0.053);

/** A clump of low ground cover — small rounded leaves — with a few grass blades. */
function buildTuft(x0: number, x1: number, baseY: (x: number) => number, rand: () => number, expo: number, grass = true): Tuft {
  const sink = new Sink();
  const leaves: { z: number; tone: number; lit: string; shade: string }[] = [];
  const n = Math.round((x1 - x0) / 2.6);
  for (let i = 0; i < n; i++) {
    const bx = x0 + rand() * (x1 - x0);
    const by = baseY(bx) + 4 + rand() * 12;
    const la = -Math.PI / 2 + (rand() - 0.5) * 2.6;
    const L = 8 + rand() * 8;
    const e = expo + (rand() - 0.5) * 0.7 - (by - baseY(bx)) / 40;
    const tone = Math.max(0, Math.min(LEAF_TONES - 1, Math.floor(e * LEAF_TONES)));
    const [lit, shade] = leafHalves(bx, by, la, L, L * 0.66);
    leaves.push({ z: -by + rand() * 8, tone, lit, shade });
    sink.grow(bx, by, L);
  }
  leaves.sort((p, q) => p.z - q.z);
  for (const l of leaves) {
    sink.tones[Math.max(0, l.tone - 1)].push(l.shade);
    sink.tones[l.tone].push(l.lit);
  }
  // a few fine blades of grass catching the light
  const blades: string[] = [];
  const k = grass ? Math.floor(rand() * 2.4) : 0;
  for (let i = 0; i < k; i++) {
    const bx = x0 + rand() * (x1 - x0);
    const by = baseY(bx) + 8;
    const hgt = 12 + rand() * 22;
    const lean = (rand() - 0.35) * hgt * 0.5;
    const w = 0.8 + rand() * 0.7;
    const tx = bx + lean;
    const ty = by - hgt;
    const mx = bx + lean * 0.25;
    const my = by - hgt * 0.6;
    blades.push(`M${xy(bx - w, by)}Q${xy(mx - w * 0.5, my)} ${xy(tx, ty)}Q${xy(mx + w * 0.5, my)} ${xy(bx + w, by)}Z`);
    sink.grow(tx, ty, 2);
    sink.grow(bx, by, 2);
  }
  const pad = 2;
  const x = sink.minX - pad;
  const y = sink.minY - pad;
  return {
    x,
    y,
    w: sink.maxX - sink.minX + pad * 2,
    h: sink.maxY - sink.minY + pad * 2,
    tones: sink.tones.map((t) => t.join("")),
    blades: blades.join(""),
    dur: 26 + rand() * 10,
    delay: -rand() * 36,
    amp: 3.5 + rand() * 2.5,
  };
}

export type Rock = { d: string; cx: number; cy: number; rx: number; ry: number; light: string; dark: string };

/** A rounded boulder sitting in the ground, with a granular surface. */
function buildRock(cx: number, cy: number, rx: number, ry: number, rand: () => number): Rock {
  const a = rand() * 6;
  const b = rand() * 6;
  const pts: Pw[] = [];
  const n = 16;
  for (let i = 0; i <= n; i++) {
    const t = Math.PI + (i / n) * Math.PI; // the upper half: the rest is buried
    const k = 1 + 0.07 * Math.sin(t * 3 + a) + 0.04 * Math.sin(t * 7 + b);
    // flatter crown, fuller shoulders
    const sy = Math.sign(Math.sin(t)) * Math.pow(Math.abs(Math.sin(t)), 0.8);
    pts.push([cx + Math.cos(t) * rx * k, cy + sy * ry * k, 0]);
  }
  const line = spline(pts, 5);
  const d = `M${line.map((p) => xy(p[0], p[1])).join("L")}L${xy(cx + rx, cy + ry * 0.2)}L${xy(cx - rx, cy + ry * 0.2)}Z`;
  // speckles: pale grains on the sunlit crown, dark pits everywhere
  const light: string[] = [];
  const dark: string[] = [];
  const dots = Math.round((rx * ry) / 9);
  for (let i = 0; i < dots; i++) {
    const u = rand() * 2 - 1;
    const v = -rand();
    const x = cx + u * rx * 0.98;
    const y = cy + v * ry * 0.98;
    const r = 0.35 + rand() * rand() * 1.6;
    const dot = `M${xy(x - r, y)}a${f1(r)} ${f1(r)} 0 1 0 ${f1(r * 2)} 0a${f1(r)} ${f1(r)} 0 1 0 ${f1(-r * 2)} 0`;
    if (rand() < 0.45 + u * 0.2 - v * 0.15) light.push(dot);
    else dark.push(dot);
  }
  return { d, cx, cy, rx, ry, light: light.join(""), dark: dark.join("") };
}

/* ------------------------------------------------------------------ */

/** The light throws leaf shadows down and to the left onto the wall. */
const SHADE_DX = -300;
const SHADE_DY = 260;
const SHADE_SKEW = Math.tan((-16 * Math.PI) / 180);
export const SHADE_TRANSFORM = `translate(${SHADE_DX} ${SHADE_DY}) skewX(-16)`;

/**
 * A piece of the dappled wall shadow: its box (in wall coordinates), the leaf
 * paths that cast it (in tree coordinates) and the sun flecks — little
 * images of the sun let through between the leaves — inside it (in wall
 * coordinates).
 */
export type Shade = { x: number; y: number; w: number; h: number; d: string; flecks: string; fringe: boolean; dur: number; delay: number; amp: number };

/** An ellipse as a path, rotated by `rot` radians. */
function ellipse(cx: number, cy: number, rx: number, ry: number, rot: number) {
  const c = Math.cos(rot);
  const s = Math.sin(rot);
  const pts: string[] = [];
  for (let i = 0; i < 14; i++) {
    const t = (i / 14) * Math.PI * 2;
    const x = Math.cos(t) * rx;
    const y = Math.sin(t) * ry;
    pts.push(xy(cx + x * c - y * s, cy + x * s + y * c));
  }
  return `M${pts.join("L")}Z`;
}

export type Wood = {
  /** silhouette */
  d: string;
  /** shading bands across the limb, mid-tone to highlight */
  bands: string[];
  fissures: { d: string; w: number }[];
  ridges: { d: string; w: number }[];
};

export type TreeArt = {
  /** union of every limb's silhouette (the clip for the shading) */
  wood: string;
  /** limbs in paint order: branches first, so the trunk overlaps their bases */
  limbs: Wood[];
  twigs: string;
  fringeTwigs: string;
  sprays: Spray[];
  tufts: Tuft[];
  mound: string;
  moss: string[];
  rocks: Rock[];
  dapple: Shade[];
  /** ellipses roughly covering the crown (tree coordinates), cast as one soft shade */
  umbra: string;
  /** shadow-only foliage above the frame (tree coordinates) */
  offFrame: string;
  /** a few leaves fallen onto the floor: [lit, shaded] */
  fallen: [string, string];
};

const LINES = new Map<string, Pw[]>();
for (const l of [...LIMBS, ...TWIGS]) LINES.set(l.id, spline(l.pts));

/** The y of a limb's centreline at a given x (limbs used for hanging run left–right). */
function limbY(id: string, x: number) {
  const line = LINES.get(id)!;
  let best = line[0];
  for (const p of line) if (Math.abs(p[0] - x) < Math.abs(best[0] - x)) best = p;
  return best[1];
}

export function buildTreeArt(density = 1): TreeArt {
  const rand = rng(11);

  /* wood */
  const wood: string[] = [];
  const limbs: Wood[] = [];
  const BANDS: [number, number][] = [
    [-0.5, 0.25],
    [0.18, 0.7],
    [0.6, 0.93],
  ];
  for (const l of [...LIMBS].reverse()) {
    const line = LINES.get(l.id)!;
    const nrm = normals(line);
    // orient the normals toward the light, once per limb so it never flips
    const s = nrm.reduce((acc, n) => acc + n[0] * LIGHT[0] + n[1] * LIGHT[1], 0) >= 0 ? 1 : -1;
    const bump = bumps(line.length, rand, l.id === "trunk" ? 0.035 : 0.025);
    const d = strip(line, nrm, s, bump, -1, 1);
    wood.push(d);
    limbs.push({
      d,
      bands: BANDS.map(([a, b]) => strip(line, nrm, s, bump, a, b)),
      fissures: [
        { d: grain(line, nrm, s, bump, rand, l.bark, -0.95, 0.95, true), w: l.grain },
        { d: grain(line, nrm, s, bump, rand, Math.round(l.bark * 0.45), -0.95, -0.15, false), w: l.grain * 1.6 },
      ],
      ridges: [{ d: grain(line, nrm, s, bump, rand, Math.round(l.bark * 0.8), 0.0, 0.95, false), w: l.grain * 0.8 }],
    });
  }
  const twig = (t: Limb) => {
    const line = LINES.get(t.id)!;
    return strip(line, normals(line), 1, line.map(() => 1), -1, 1);
  };
  const twigs = TWIGS.filter((t) => !t.fringe).map(twig).join("");
  const fringeTwigs = TWIGS.filter((t) => t.fringe).map(twig).join("");

  /* foliage */
  const sprays: Spray[] = [];
  const keep = () => rand() < density;
  const add = (s: Spray | null) => s && sprays.push(s);

  type Along = { t0: number; t1: number; step: number; len: [number, number]; leaf: [number, number]; up?: number; sag?: number; expo?: number; back?: boolean };
  const along = (id: string, o: Along) => {
    const line = LINES.get(id)!;
    const nrm = normals(line);
    for (let t = o.t0; t <= o.t1 + 1e-6; t += o.step * (0.6 + rand() * 0.3)) {
      const i = Math.min(line.length - 1, Math.floor(t * (line.length - 1)));
      const p = line[i];
      const q = line[Math.min(line.length - 1, i + 2)];
      const tan = Math.atan2(q[1] - p[1], q[0] - p[0]);
      // pick the side of the limb: mostly the upper side
      let nx = nrm[i][0];
      let ny = nrm[i][1];
      const upper = rand() < (o.up ?? 0.68);
      if ((ny > 0) === upper) {
        nx = -nx;
        ny = -ny;
      }
      const out = Math.atan2(ny, nx);
      // between "away from the limb" and "onward along it"
      const ang = out + (tan - out) * (0.25 + rand() * 0.3) + (rand() - 0.5) * 0.5;
      const len = o.len[0] + rand() * (o.len[1] - o.len[0]);
      const leaf = o.leaf[0] + rand() * (o.leaf[1] - o.leaf[0]);
      const back = o.back ?? false;
      if (!keep()) continue;
      const group: Spray["group"] = back ? "back" : p[0] < 700 ? "fringe" : "front";
      add(
        buildSpray(p[0], p[1], ang, { len, leaf, sag: (o.sag ?? 0.6) * (upper ? 0.7 : 1.3), expo: (o.expo ?? 0.6) * (back ? 0.4 : 1), group, fork: rand() < 0.6 }, rand),
      );
    }
  };

  // behind the wood: darker, denser foliage that fills the crown
  const back = (id: string, t0: number, t1: number, step: number, len: [number, number], leaf: [number, number], up = 0.8) =>
    along(id, { t0, t1, step, len, leaf, up, back: true, sag: 0.5 });
  back("left", 0.12, 1, 0.08, [90, 140], [26, 36]);
  back("lowLeft", 0.15, 1, 0.12, [70, 120], [24, 32], 0.5);
  back("trunk", 0.72, 1, 0.07, [110, 160], [28, 38]);
  back("rightUp", 0.1, 1, 0.09, [100, 150], [28, 38]);
  back("right", 0.25, 1, 0.08, [90, 150], [26, 36], 0.6);
  back("rightDown", 0, 1, 0.16, [90, 130], [26, 34], 0.5);
  back("leaderLeft", 0, 1, 0.22, [100, 140], [26, 34]);
  back("leftUp", 0, 1, 0.25, [90, 130], [26, 34]);

  // the body of the crown: many short sprays packed into a few broad masses,
  // each mass moving as one slow, slight layer (the inside of a tree barely
  // stirs). Without them the canopy reads as sprays with daylight between.
  const MASSES: [number, number, number, number, number][] = [
    // cx, cy, rx, ry, exposure
    [930, 70, 260, 105, 0.35],
    [1240, 30, 230, 120, 0.45],
    [1520, 60, 210, 130, 0.5],
    [1690, 210, 120, 170, 0.45],
    [1720, 420, 70, 110, 0.35],
    [1030, 215, 140, 60, 0.25],
    [1400, 210, 120, 70, 0.3],
    [1290, 240, 90, 70, 0.3],
    [1060, 110, 110, 60, 0.3],
    [820, 160, 110, 55, 0.35],
    [745, 118, 70, 42, 0.4],
  ];
  for (const [mx, my, rx, ry, expo] of MASSES) {
    const parts: Spray[] = [];
    const anchors: P[] = [];
    const n = Math.round(((rx * ry) / 1500) * density);
    for (let i = 0; i < n; i++) {
      const a = rand() * Math.PI * 2;
      const r = Math.sqrt(rand());
      const x = mx + Math.cos(a) * rx * r;
      const y = my + Math.sin(a) * ry * r;
      const sp = buildSpray(x, y, rand() * Math.PI * 2, { len: 50 + rand() * 50, leaf: 26 + rand() * 10, sag: 0.6, expo, group: "back", fork: rand() < 0.5 }, rand);
      if (sp) {
        parts.push(sp);
        anchors.push([x, y]);
      }
    }
    if (parts.length) sprays.push(attachMass(mergeSprays(parts, mx, my, rand, "crown"), anchors));
  }

  // in front: the lit, layered sprays
  const front = (id: string, t0: number, t1: number, step: number, len: [number, number], leaf: [number, number], up = 0.68, sag = 0.6, expo = 0.62) =>
    along(id, { t0, t1, step, len, leaf, up, sag, expo });
  front("left", 0.2, 1, 0.045, [70, 130], [30, 44], 0.62, 0.7);
  front("left", 0.5, 1, 0.08, [60, 110], [30, 42], 0.2, 1.2); // hanging below the limb
  front("leftTip", 0, 1, 0.1, [70, 120], [30, 42], 0.45, 1);
  front("leftDroop", 0.1, 1, 0.18, [60, 100], [30, 40], 0.3, 1.2);
  front("leftUp", 0.1, 1, 0.12, [70, 120], [30, 42]);
  front("topHang", 0.05, 1, 0.12, [60, 120], [30, 42], 0.12, 1.3, 0.75);
  front("topHangTip", 0, 1, 0.12, [60, 110], [30, 42], 0.12, 1.3, 0.75);
  front("lowLeft", 0.3, 1, 0.08, [60, 110], [28, 40], 0.35, 1);
  front("lowDroop", 0.15, 1, 0.18, [60, 100], [28, 38], 0.3, 1.2);
  front("trunk", 0.78, 1, 0.05, [80, 130], [32, 46], 0.6, 0.5, 0.75);
  front("leaderLeft", 0.1, 1, 0.16, [80, 120], [32, 44], 0.7, 0.5, 0.75);
  front("rightUp", 0.25, 1, 0.07, [80, 130], [32, 46], 0.7, 0.5, 0.8);
  front("rightUpTwig", 0.2, 1, 0.3, [70, 110], [32, 44], 0.7, 0.5, 0.8);
  front("right", 0.35, 1, 0.065, [80, 140], [32, 46], 0.62, 0.6, 0.72);
  front("rightDown", 0.1, 1, 0.12, [70, 120], [30, 42], 0.4, 0.9, 0.6);
  front("trunkSprig", 0.25, 1, 0.22, [60, 100], [28, 38], 0.6, 0.8, 0.5);

  // The top of the crown. On desktop it runs off the top of the screen, but
  // the phone and tablet layout shows the whole tree, so the crown needs a
  // real, rounded top over the leader rather than stopping in a flat line.
  // (Its own seed, so the rest of the scene stays exactly as it was.)
  const rand3 = rng(47);
  const DOME: [number, number, number, number, number][] = [
    // cx, cy, rx, ry, exposure
    [1150, -150, 200, 85, 0.75],
    [960, -75, 160, 70, 0.65],
    [1360, -115, 190, 80, 0.75],
    [1570, -45, 160, 75, 0.7],
    [800, 0, 110, 55, 0.6],
  ];
  for (const [mx, my, rx, ry, expo] of DOME) {
    const parts: Spray[] = [];
    const anchors: P[] = [];
    const n = Math.round(((rx * ry) / 1300) * Math.max(density, 0.8));
    for (let i = 0; i < n; i++) {
      const a = rand3() * Math.PI * 2;
      const r = Math.sqrt(rand3());
      const sx = mx + Math.cos(a) * rx * r;
      const sy = my + Math.sin(a) * ry * r;
      const sp = buildSpray(sx, sy, rand3() * Math.PI * 2, { len: 55 + rand3() * 55, leaf: 28 + rand3() * 12, sag: 0.6, expo, group: "back", fork: rand3() < 0.5 }, rand3);
      if (sp) {
        parts.push(sp);
        anchors.push([sx, sy]);
      }
    }
    if (parts.length) sprays.push(attachMass(mergeSprays(parts, mx, my + ry, rand3, "crown"), anchors));
  }

  /* ground */
  const tufts: Tuft[] = [];
  for (let x = 860; x < 1760; x += 34 + rand() * 18) {
    if (rand() > Math.min(1, density + 0.2)) continue;
    tufts.push(buildTuft(x, x + 46 + rand() * 24, moundTop, rand, 0.45 + (x - 860) / 3000));
  }
  // a front fringe of ground cover, spilling onto the floor around the stones
  const floorEdge = (x: number) => 852 + 6 * Math.sin(x * 0.03);
  for (let x = 1120; x < 1760; x += 46 + rand() * 30) {
    if (rand() > density) continue;
    tufts.push(buildTuft(x, x + 40 + rand() * 20, floorEdge, rand, 0.35, false));
  }

  // the mound runs on past the right edge of the desktop frame, for the
  // tablet layout, which can show a little beyond it
  const mound =
    `M850 ${moundTop(850) + 8}` +
    Array.from({ length: 72 }, (_, i) => {
      const x = 850 + (i / 71) * 1450;
      return `L${xy(x, moundTop(x) + 10)}`;
    }).join("") +
    `L2300 868` +
    Array.from({ length: 60 }, (_, i) => {
      const x = 2300 - (i / 59) * 1450;
      return `L${xy(x, Math.max(moundTop(x) + 10, 860 + 5 * Math.sin(x * 0.05) + 3 * Math.sin(x * 0.17)))}`;
    }).join("") +
    `Z`;

  // static ground cover packed into the mound, darker toward its base
  const moss: string[][] = Array.from({ length: LEAF_TONES }, () => []);
  const mossN = Math.round(1500 * density);
  for (let i = 0; i < mossN; i++) {
    const x = 870 + rand() * 900;
    const top = moundTop(x) + 12;
    const y = top + rand() * (858 - top);
    const L = 7 + rand() * 7;
    const depth = (y - top) / Math.max(1, 858 - top);
    const tone = Math.max(0, Math.min(4, Math.floor((0.85 - depth * 0.75 + (rand() - 0.5) * 0.7) * 5)));
    const [lit, shade] = leafHalves(x, y, -Math.PI / 2 + (rand() - 0.5) * 2.8, L, L * 0.66);
    moss[Math.max(0, tone - 1)].push(shade);
    moss[tone].push(lit);
  }

  const rocks = [
    buildRock(1418, 850, 90, 104, rand),
    buildRock(1664, 850, 132, 118, rand),
    buildRock(1266, 860, 54, 30, rand),
    buildRock(1550, 864, 28, 17, rand),
    buildRock(1690, 866, 38, 19, rand),
    buildRock(1206, 868, 18, 9, rand),
  ];

  // the crown's dappled shadow, thrown down and to the left onto the wall, in
  // pieces that each drift with the sprays casting them
  const dapple: Shade[] = [];
  const caster = sprays.filter((s) => (s.group === "front" || s.group === "fringe") && s.x < 1150 && rand() < 0.75);
  for (const group of ["front", "fringe"] as const) {
    const own = caster.filter((s) => s.group === group).sort((a, b) => a.x - b.x);
    // fewer, larger pieces on the smaller layout
    const per = density < 1 ? 12 : 6;
    for (let i = 0; i < own.length; i += per) {
      const part = own.slice(i, i + per);
      // corners of each caster, thrown by the light (see SHADE_TRANSFORM)
      const pts = part.flatMap((s) => [
        [s.x, s.y],
        [s.x + s.w, s.y],
        [s.x, s.y + s.h],
        [s.x + s.w, s.y + s.h],
      ]).map(([x, y]) => [x + SHADE_SKEW * y + SHADE_DX, y + SHADE_DY]);
      const pad = 24;
      const x = Math.min(...pts.map((p) => p[0])) - pad;
      const y = Math.min(...pts.map((p) => p[1])) - pad;
      // sun flecks: where light slips between the leaves it lands as small
      // ellipses, drawn out along the direction the light travels
      const flecks: string[] = [];
      for (const s of part) {
        if (rand() > 0.7) continue;
        const cx = s.x + s.w * (0.3 + rand() * 0.4);
        const cy = s.y + s.h * (0.3 + rand() * 0.4);
        const wx = cx + SHADE_SKEW * cy + SHADE_DX;
        const wy = cy + SHADE_DY;
        if (wy > 730) continue;
        const r = 6 + rand() * 11;
        flecks.push(ellipse(wx, wy, r, r * (0.5 + rand() * 0.15), -0.95 + (rand() - 0.5) * 0.3));
      }
      dapple.push({
        x,
        y,
        w: Math.max(...pts.map((p) => p[0])) - x + pad,
        h: Math.min(780, Math.max(...pts.map((p) => p[1])) + pad) - y,
        d: part.flatMap((s) => s.tones).join(""),
        flecks: flecks.join(""),
        fringe: group === "fringe",
        dur: 32 + rand() * 12,
        delay: -rand() * 44,
        amp: 1.6 + rand() * 1,
      });
    }
  }

  // the crown as a whole: a broad, very soft shade on the wall behind it
  const umbra = sprays
    .filter((s) => s.x < 1500)
    .map((s) => ellipse(s.x + s.w / 2, s.y + s.h / 2, s.w * 0.42, s.h * 0.38, 0))
    .join("");

  // foliage just outside the frame, above and to the left, seen only as its
  // soft shadow in the top corner of the wall (as in the reference)
  const offFrame: string[] = [];
  for (let x = 30; x < 560; x += 60 + rand() * 30) {
    const s = buildSpray(x, -150 + rand() * 60, 1.6 + rand() * 0.8, { len: 90 + rand() * 50, leaf: 30 + rand() * 10, sag: 0.9, expo: 0.5, group: "back", fork: true, free: true }, rand);
    if (s) offFrame.push(...s.tones, s.stem);
  }

  // ground cover on that extra stretch of mound (its own seed, so the rest
  // of the scene stays exactly as it was)
  const rand2 = rng(31);
  for (let i = 0; i < Math.round(700 * density); i++) {
    const x = 1770 + rand2() * 500;
    const top = moundTop(x) + 12;
    const y = top + rand2() * (858 - top);
    const L = 7 + rand2() * 7;
    const depth = (y - top) / Math.max(1, 858 - top);
    const tone = Math.max(0, Math.min(4, Math.floor((0.85 - depth * 0.75 + (rand2() - 0.5) * 0.7) * 5)));
    const [lit, shade] = leafHalves(x, y, -Math.PI / 2 + (rand2() - 0.5) * 2.8, L, L * 0.66);
    moss[Math.max(0, tone - 1)].push(shade);
    moss[tone].push(lit);
  }

  const fallen: [string[], string[]] = [[], []];
  for (const [fx, fy] of [
    [548, 858],
    [612, 868],
    [705, 852],
    [790, 862],
    [826, 874],
    [1130, 880],
  ]) {
    const L = 9 + rand() * 6;
    // lying flat: seen almost edge-on
    const [lit, shade] = leafHalves(fx, fy, (rand() - 0.5) * 0.8 + (rand() < 0.5 ? Math.PI : 0), L, L * 0.34);
    fallen[0].push(lit);
    fallen[1].push(shade);
  }

  return {
    fallen: [fallen[0].join(""), fallen[1].join("")],
    wood: wood.join(""),
    limbs,
    twigs,
    fringeTwigs,
    sprays: groupSprays(sprays, density < 1 ? 5 : 2, rand),
    tufts: groupTufts(tufts, density < 1 ? 4 : 2),
    mound,
    moss: moss.map((m) => m.join("")),
    rocks,
    dapple,
    umbra,
    offFrame: offFrame.join(""),
  };
}

/* ------------------------------------------------------------------ */
/* Hanging cards: each cord starts on a limb's centreline              */
/* ------------------------------------------------------------------ */

/** `k` scales the card (and its type) relative to the desktop size. */
function hanger(limb: string, x: number, cardTop: number, w: number, h: number, tilt: number, k = 1) {
  const y = limbY(limb, x);
  return { x, y, cord: cardTop - y, w: w * k, h: h * k, tilt, k };
}

export type Hanger = ReturnType<typeof hanger>;

export const HANGERS = {
  music: hanger("left", 826, 216, 240, 286, 0.8),
  profile: hanger("lowLeft", 1140, 398, 228, 362, 0),
  about: hanger("right", 1534, 340, 248, 272, -2.6),
};

/**
 * For the phone and tablet layout, where cards are placed at run time: the
 * y of the first limb in `ids` that passes over `x`, or null.
 */
export function limbAt(ids: string[], x: number) {
  for (const id of ids) {
    const line = LINES.get(id)!;
    const xs = line.map((p) => p[0]);
    if (x >= Math.min(...xs) && x <= Math.max(...xs)) return limbY(id, x);
  }
  return null;
}
