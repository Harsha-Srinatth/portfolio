import { useState, useSyncExternalStore } from "react";
import { Heart } from "lucide-react";

import { incrementLike } from "@/lib/api/stats.functions";

function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n.toLocaleString("en-IN") + (s[(v - 20) % 10] ?? s[v] ?? s[0]);
}

const LIKED_KEY = "rhs.liked";

type FooterProps = {
  visitorCount: number | null;
  hearts: number | null;
  onHeartsChange: (hearts: number) => void;
};

/**
 * Applause and visitor count. Both read from and write to the existing stats
 * store (Upstash Redis in production) — nothing here is initialised locally.
 * One applause per browser, as before.
 */
function readLiked() {
  try {
    return localStorage.getItem(LIKED_KEY) === "1";
  } catch {
    return false;
  }
}
const noSubscribe = () => () => {};

export function Footer({ visitorCount, hearts, onHeartsChange }: FooterProps) {
  // Previously applauded in this browser (read after hydration, never on the server).
  const likedBefore = useSyncExternalStore(noSubscribe, readLiked, () => false);
  const [likedNow, setLiked] = useState(false);
  const liked = likedBefore || likedNow;
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);

  const applaud = async () => {
    if (liked || pending) return;
    setPending(true);
    setFailed(false);
    try {
      const updated = await incrementLike();
      onHeartsChange(updated.likes);
      setLiked(true);
      try {
        localStorage.setItem(LIKED_KEY, "1");
      } catch {
        /* storage unavailable */
      }
    } catch (error) {
      console.error("[stats] Failed to record like", error);
      setFailed(true);
    } finally {
      setPending(false);
    }
  };

  return (
    <footer className="relative border-t border-border">
      <div className="mx-auto grid max-w-[1680px] grid-cols-1 gap-12 px-6 py-20 md:px-12 lg:grid-cols-12 lg:px-16">
        <div className="lg:col-span-4">
          <p className="font-display text-[clamp(1.6rem,2.4vw,2.2rem)] font-[360] leading-[1.15] tracking-[-0.015em]">
            Enjoyed the visit?
          </p>
          <p className="mt-3 max-w-[22rem] text-[0.98rem] leading-relaxed text-muted-foreground">
            Leave a quiet round of applause. One tap is enough.
          </p>
        </div>

        <div className="lg:col-span-8">
          <div className="flex flex-wrap items-center gap-5">
            <button
              type="button"
              onClick={() => void applaud()}
              disabled={liked || pending}
              aria-pressed={liked}
              className={`btn ${liked ? "btn-solid" : "btn-line"} disabled:cursor-default`}
            >
              <Heart className={`h-4 w-4 transition-transform duration-500 ${liked ? "scale-110 fill-current" : ""}`} strokeWidth={1.6} />
              {liked ? "Thank you" : pending ? "Sending…" : "Applaud"}
            </button>
            <p className="text-[0.98rem]" aria-live="polite">
              {hearts === null ? (
                <span className="text-muted-foreground">Loading applause…</span>
              ) : (
                <>
                  <span className="font-display text-[1.6rem] tabular-nums">{hearts.toLocaleString("en-IN")}</span>{" "}
                  <span className="text-muted-foreground">{hearts === 1 ? "person has" : "people have"} applauded</span>
                </>
              )}
            </p>
          </div>
          {failed && (
            <p className="mt-3 text-[0.9rem] text-destructive" role="alert">
              Your applause didn’t reach the server. Check your connection and tap again.
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
    </footer>
  );
}
