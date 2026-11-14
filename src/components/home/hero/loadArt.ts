import { buildTreeArt, type TreeArt } from "./treeArt";

// the art is deterministic, so build each density once per page
const cache = new Map<number, Promise<TreeArt>>();

/**
 * The page's first script (TREE_BOOT in routes/__root.tsx) starts the worker
 * while the HTML is still arriving, long before this module has loaded, and
 * leaves its result here.
 */
declare global {
  interface Window {
    __tree?: { density: number; art: Promise<TreeArt> };
  }
}
if (typeof window !== "undefined" && window.__tree) {
  const early = window.__tree;
  cache.set(
    early.density,
    early.art.catch(() => buildTreeArt(early.density)),
  );
}

/** The tree for a density, built in a worker (or here, if workers are unavailable). */
export function loadArt(density: number) {
  let art = cache.get(density);
  if (!art) {
    art = new Promise<TreeArt>((resolve) => {
      try {
        const worker = new Worker(new URL("./treeWorker.ts", import.meta.url), { type: "module" });
        worker.onmessage = (e: MessageEvent<TreeArt>) => {
          resolve(e.data);
          worker.terminate();
        };
        worker.onerror = () => {
          resolve(buildTreeArt(density));
          worker.terminate();
        };
        worker.postMessage(density);
      } catch {
        resolve(buildTreeArt(density));
      }
    });
    cache.set(density, art);
  }
  return art;
}
