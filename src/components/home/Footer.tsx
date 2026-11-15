import { useState, useSyncExternalStore } from "react";
import { ArrowUp, Heart } from "lucide-react";

import { Ground } from "./Ambient";
import { CountUp } from "./motion";
import { readLiked, sendLike, subscribeLiked } from "./likeStore";
import { useStats } from "./statsStore";
import { useInView } from "./useInView";

function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n.toLocaleString("en-IN") + (s[(v - 20) % 10] ?? s[v] ?? s[0]);
}

// leaves and hearts thrown from the Like button, each with its own direction
const BURST = Array.from({ length: 12 }, (_, i) => {
  const a = (i / 12) * Math.PI * 2 + (i % 2) * 0.3;
  const d = 46 + (i % 3) * 16;
  return { dx: Math.cos(a) * d, dy: Math.sin(a) * d - 14, r: (i % 2 ? 1 : -1) * (90 + i * 20), c: ["#e5384f", "var(--leaf-4)", "var(--brass)", "var(--leaf-5)"][i % 4] };
});

function Burst() {
  return (
    <span aria-hidden className="burst pointer-events-none absolute left-7 top-1/2">
      {BURST.map((b, i) => (
        <i key={i} style={{ ["--dx" as string]: `${b.dx.toFixed(0)}px`, ["--dy" as string]: `${b.dy.toFixed(0)}px`, ["--r" as string]: `${b.r}deg`, ["--c" as string]: b.c }} />
      ))}
    </span>
  );
}

/**
 * Applause and visitor count. Both read from and write to the existing stats
 * store (Upstash Redis in production) — nothing here is initialised locally.
 * One applause per browser, as before.
 */
export function Footer() {
  const { visitors: visitorCount, likes: hearts } = useStats();
  // Previously applauded in this browser (read after hydration, never on the server).
  const likedBefore = useSyncExternalStore(subscribeLiked, readLiked, () => false);
  const [likedNow, setLiked] = useState(false);
  const liked = likedBefore || likedNow;
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  const [ref, live] = useInView<HTMLElement>();

  const applaud = async () => {
    if (liked || pending) return;
    setPending(true);
    setFailed(false);
    try {
      // sendLike tells the page the new count itself (LIKES_EVENT)
      await sendLike();
      setLiked(true);
    } catch (error) {
      console.error("[stats] Failed to record like", error);
      setFailed(true);
    } finally {
      setPending(false);
    }
  };

  return (
    <footer ref={ref} data-live={live} className="relative">
      <div className="mx-auto grid max-w-[1920px] grid-cols-1 gap-12 px-6 pb-10 pt-20 md:px-12 md:pb-14 lg:grid-cols-12 wide:px-[clamp(3rem,3.8vw,5.5rem)]">
        <div className="lg:col-span-4">
          <p className="font-display text-[clamp(1.6rem,2.4vw,2.2rem)] font-[360] leading-[1.15] tracking-[-0.015em]">
            Enjoyed the visit?
          </p>
          <p className="mt-3 max-w-[22rem] text-[0.98rem] leading-relaxed text-muted-foreground">
            Tap the heart if you liked it. One tap is enough.
          </p>
          <a href="#index" className="group mt-7 inline-flex items-center gap-3 text-[0.95rem] text-foreground/80 transition-colors hover:text-foreground">
            <span aria-hidden className="grid h-10 w-10 place-items-center rounded-full border border-foreground/25 transition-[border-color,transform] duration-500 ease-[var(--ease-stone)] group-hover:-translate-y-1 group-hover:border-foreground/60">
              <ArrowUp className="h-4 w-4" strokeWidth={1.6} />
            </span>
            <span className="link-underline">Back to the tree</span>
          </a>
        </div>

        <div className="lg:col-span-8">
          <div className="flex flex-wrap items-center gap-5">
            <button
              type="button"
              onClick={() => void applaud()}
              disabled={liked || pending}
              aria-pressed={liked}
              className="btn btn-line relative disabled:cursor-default"
            >
              {likedNow && <Burst />}
              <Heart className={`h-4 w-4 transition-[transform,color,fill] duration-500 ${liked ? "scale-110 fill-[#e5384f] text-[#e5384f]" : ""}`} strokeWidth={1.6} />
              {liked ? "Thank you" : pending ? "Sending…" : "Like"}
            </button>
            <p className="text-[0.98rem]" aria-live="polite">
              {hearts === null ? (
                <span className="text-muted-foreground">Loading likes…</span>
              ) : (
                <>
                  <CountUp value={hearts} duration={900} className="font-display text-[1.6rem]" />{" "}
                  <span className="text-muted-foreground">{hearts === 1 ? "person" : "people"} liked this</span>
                </>
              )}
            </p>
          </div>
          {failed && (
            <p className="mt-3 text-[0.9rem] text-destructive" role="alert">
              Your like didn’t reach the server. Check your connection and tap again.
            </p>
          )}

          <div className="mt-14 flex flex-col gap-4 border-t border-border pt-8 text-[0.88rem] text-muted-foreground md:flex-row md:items-center md:justify-between">
            <p>
              <span className="italic text-foreground/80">“The best way to predict the future is to invent it.”</span> Alan Kay
            </p>
            <p className="flex flex-wrap gap-x-6 gap-y-1">
              <span>
                {visitorCount !== null ? (
                  <>
                    You are the <span className="text-foreground">{ordinal(visitorCount)}</span> visitor
                  </>
                ) : (
                  "Counting visitors…"
                )}
              </span>
              <span>© {new Date().getFullYear()} Harsha Srinatth Ryali</span>
            </p>
          </div>
        </div>
      </div>
      {/* the page ends on the same ground the hero begins with */}
      <Ground />
    </footer>
  );
}
