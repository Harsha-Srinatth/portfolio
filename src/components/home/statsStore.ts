import { useSyncExternalStore } from "react";

/**
 * The page's visitor and like counts, kept outside React state on purpose.
 *
 * They arrive from the server a moment after the page loads. Held as state in
 * the page component, that arrival re-rendered the whole page, including the
 * sections below the hero whose scripts have not started yet (they wait for
 * the tree, see routes/index.tsx). React cannot update a section it has not
 * started, so it threw away that section's server-drawn content and showed
 * nothing until its script loaded: everything below the hero vanished for a
 * few seconds. Here, only the footer (which reads them) re-renders.
 */
type Stats = { visitors: number | null; likes: number | null };

let stats: Stats = { visitors: null, likes: null };
const EMPTY: Stats = { visitors: null, likes: null };
const listeners = new Set<() => void>();

export function setStats(next: Partial<Stats>) {
  stats = { ...stats, ...next };
  listeners.forEach((l) => l());
}

export function useStats() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => stats,
    () => EMPTY,
  );
}
