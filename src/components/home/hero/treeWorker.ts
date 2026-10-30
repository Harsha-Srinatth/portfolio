import { buildTreeArt } from "./treeArt";

/** Generates the tree off the main thread, so hydration and the loader stay smooth. */
self.onmessage = (e: MessageEvent<number>) => {
  self.postMessage(buildTreeArt(e.data));
};
