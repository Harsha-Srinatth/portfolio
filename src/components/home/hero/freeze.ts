/**
 * Snapshot the scene's SVG art into bitmaps.
 *
 * Vector art with blur filters is expensive to draw, and the browser throws
 * its drawn copy away once the hero has been scrolled far out of view — so
 * coming back to the top meant redrawing everything, a visible stall. Once
 * the scene has been shown, each `svg[data-freeze]` is drawn once into a
 * <canvas> laid exactly over it and the SVG is hidden. A canvas keeps its
 * pixels, so scrolling back only puts saved images on screen again. The
 * swaying wrappers still move the canvases, so the animation is unchanged.
 *
 * `data-freeze` may hold a margin in viewBox units ("top right bottom left")
 * for art that spills outside its box (leaf tips, soft shadow edges).
 */

const SVG_NS = "http://www.w3.org/2000/svg";
const PAINT = ["fill", "stroke"] as const;
const MAX_DPR = 2;

/** Copy the computed colours of `from` onto `to`, so the snapshot needs no CSS variables. */
function bakeColours(from: Element, to: Element) {
  const cs = getComputedStyle(from);
  for (const p of PAINT) {
    const v = to.getAttribute(p);
    if (v?.includes("var(")) to.setAttribute(p, cs.getPropertyValue(p));
  }
  if (from.tagName === "stop") {
    const style = (to as SVGElement).style;
    style.stopColor = cs.stopColor;
    style.stopOpacity = cs.stopOpacity;
  }
}

function bakeTree(from: Element, to: Element) {
  bakeColours(from, to);
  const a = from.querySelectorAll("*");
  const b = to.querySelectorAll("*");
  a.forEach((el, i) => bakeColours(el, b[i]));
}

/** Bring in definitions (filters, masks, gradients) referenced from outside this SVG. */
function pullDefs(clone: SVGSVGElement) {
  const defs = document.createElementNS(SVG_NS, "defs");
  clone.prepend(defs);
  const have = new Set([...clone.querySelectorAll("[id]")].map((e) => e.id));
  for (let pass = 0; pass < 4; pass++) {
    const wanted = [...clone.outerHTML.matchAll(/url\(#([^)"']+)\)/g)].map((m) => m[1]).filter((id) => !have.has(id));
    if (!wanted.length) break;
    for (const id of new Set(wanted)) {
      const src = document.getElementById(id);
      if (!src) continue;
      const copy = src.cloneNode(true) as Element;
      bakeTree(src, copy);
      defs.append(copy);
      have.add(id);
    }
  }
}

type Frozen = { svg: SVGSVGElement; canvas: HTMLCanvasElement };

async function freezeOne(svg: SVGSVGElement, dpr: number): Promise<Frozen | null> {
  // art hidden on this layout (e.g. the fringe on narrower screens) stays as it is
  if (!svg.getClientRects().length) return null;
  const cs = getComputedStyle(svg);
  const w = parseFloat(cs.width);
  const h = parseFloat(cs.height);
  const vb = svg.viewBox.baseVal;
  if (!w || !h || !vb?.width) return null;

  const [t, r, b, l] = (svg.dataset.freeze || "12").split(" ").map(Number);
  const pad = { t, r: r ?? t, b: b ?? t, l: l ?? r ?? t };
  const sx = w / vb.width;
  const sy = h / vb.height;
  const cw = w + (pad.l + pad.r) * sx;
  const ch = h + (pad.t + pad.b) * sy;
  const pw = Math.ceil(cw * dpr);
  const ph = Math.ceil(ch * dpr);

  const clone = svg.cloneNode(true) as SVGSVGElement;
  bakeTree(svg, clone);
  pullDefs(clone);
  clone.removeAttribute("class");
  clone.removeAttribute("style");
  clone.setAttribute("xmlns", SVG_NS);
  clone.setAttribute("viewBox", `${vb.x - pad.l} ${vb.y - pad.t} ${vb.width + pad.l + pad.r} ${vb.height + pad.t + pad.b}`);
  clone.setAttribute("width", String(pw));
  clone.setAttribute("height", String(ph));
  clone.setAttribute("preserveAspectRatio", "none");

  const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)], { type: "image/svg+xml" }));
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const canvas = document.createElement("canvas");
    canvas.width = pw;
    canvas.height = ph;
    canvas.getContext("2d")!.drawImage(img, 0, 0, pw, ph);
    canvas.setAttribute("aria-hidden", "true");
    const s = canvas.style;
    s.position = "absolute";
    s.pointerEvents = "none";
    s.width = `${cw}px`;
    s.height = `${ch}px`;
    if (cs.position === "absolute") {
      // a full-scene layer: placed by right / bottom in the scene
      s.right = `${parseFloat(cs.right) - pad.r * sx}px`;
      s.bottom = `${parseFloat(cs.bottom) - pad.b * sy}px`;
    } else {
      // fills a swaying wrapper
      s.left = `${-pad.l * sx}px`;
      s.top = `${-pad.t * sy}px`;
    }
    return { svg, canvas };
  } catch {
    return null;
  } finally {
    URL.revokeObjectURL(url);
  }
}

const nextIdle = () =>
  new Promise<void>((res) => ("requestIdleCallback" in window ? window.requestIdleCallback(() => res(), { timeout: 300 }) : setTimeout(res, 16)));

/** Snapshot every `svg[data-freeze]` under `root`, a few at a time in idle moments. Returns a thaw function. */
export function freezeScene(root: HTMLElement) {
  let cancelled = false;
  const done: Frozen[] = [];
  const dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);

  (async () => {
    const svgs = [...root.querySelectorAll<SVGSVGElement>("svg[data-freeze]")];
    for (let i = 0; i < svgs.length && !cancelled; i += 8) {
      await nextIdle();
      const batch = await Promise.all(svgs.slice(i, i + 8).map((s) => freezeOne(s, dpr)));
      if (cancelled) return;
      // swap in the same frame: the canvas goes in, the vector art goes out
      for (const f of batch) {
        if (!f) continue;
        f.svg.after(f.canvas);
        // hidden, not removed: its definitions may still be referenced
        f.svg.style.visibility = "hidden";
        done.push(f);
      }
    }
  })();

  return () => {
    cancelled = true;
    for (const f of done) {
      f.canvas.remove();
      f.svg.style.visibility = "";
    }
    done.length = 0;
  };
}
