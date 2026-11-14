/**
 * "The hero has finished arriving." The sections below the first screen wait
 * for this before their scripts load and start up (see routes/index.tsx), so
 * that work never competes with the tree's reveal. It also resolves the
 * moment the visitor scrolls, taps or types, and after a few seconds in any
 * case, so nothing below is ever left waiting. On the server it is already
 * resolved.
 */
let done: () => void = () => {};

export const heroReady: Promise<void> =
  typeof window === "undefined"
    ? Promise.resolve()
    : new Promise<void>((resolve) => {
        const events = ["pointerdown", "keydown", "wheel", "touchstart", "scroll"] as const;
        done = () => {
          events.forEach((e) => window.removeEventListener(e, done));
          resolve();
        };
        events.forEach((e) => window.addEventListener(e, done, { passive: true, once: true }));
        window.setTimeout(done, 9000);
      });

export function markHeroReady() {
  done();
}
