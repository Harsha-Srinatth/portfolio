import { incrementLike } from "@/lib/api/stats.functions";

/**
 * The like button lives in two places (the hero's Like card and the footer).
 * They share one "already liked" flag (localStorage, as before) and tell each
 * other, and the page's like count, through window events.
 */

export const LIKED_KEY = "rhs.liked";
const LIKED_EVENT = "rhs:liked";
export const LIKES_EVENT = "rhs:likes";

export function readLiked() {
  try {
    return localStorage.getItem(LIKED_KEY) === "1";
  } catch {
    return false;
  }
}

export function subscribeLiked(cb: () => void) {
  window.addEventListener(LIKED_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(LIKED_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

/** Record one like on the server, remember it in this browser, and tell the page. */
export async function sendLike() {
  const updated = await incrementLike();
  try {
    localStorage.setItem(LIKED_KEY, "1");
  } catch {
    /* storage unavailable */
  }
  window.dispatchEvent(new CustomEvent(LIKES_EVENT, { detail: updated.likes }));
  window.dispatchEvent(new Event(LIKED_EVENT));
  return updated.likes;
}
