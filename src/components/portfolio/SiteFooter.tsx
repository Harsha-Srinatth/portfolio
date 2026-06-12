import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

import { recordLike, recordVisitor } from "@/lib/api/stats-api";
import { RevealOnScroll } from "./RevealOnScroll";

const LIKED_KEY = "rhs.liked";
const STATS_VERSION_KEY = "rhs.stats.version";
const STATS_VERSION = "4";

export function SiteFooter() {
  const [visitor, setVisitor] = useState<number | null>(null);
  const [hearts, setHearts] = useState(0);
  const [liked, setLiked] = useState(false);
  const [burst, setBurst] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (localStorage.getItem(STATS_VERSION_KEY) !== STATS_VERSION) {
        localStorage.removeItem("rhs.visited");
        localStorage.removeItem("rhs.visitor.number");
        localStorage.removeItem(LIKED_KEY);
        localStorage.setItem(STATS_VERSION_KEY, STATS_VERSION);
      }

      setLiked(localStorage.getItem(LIKED_KEY) === "1");

      try {
        const updated = await recordVisitor();
        setVisitor(updated.visitors);
        setHearts(updated.likes);
      } catch (error) {
        console.error("[stats] Failed to load portfolio counters", error);
        setVisitor(null);
      }
    };

    void init();
  }, []);

  const toggleHeart = async () => {
    if (liked) return;

    try {
      const updated = await recordLike();
      setHearts(updated.likes);
    } catch (error) {
      console.error("[stats] Failed to record like", error);
      setHearts((count) => count + 1);
    }

    setLiked(true);
    setBurst(true);
    localStorage.setItem(LIKED_KEY, "1");
    setTimeout(() => setBurst(false), 700);
  };

  return (
    <footer className="relative w-full border-t border-border bg-background">
      <RevealOnScroll className="mx-auto max-w-[1600px] px-6 py-16 md:px-12 lg:px-20">
        {/* Impressed? */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.4em] text-primary">
              if this portfolio impressed you
            </div>
            <p className="mt-3 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
              Leave a quiet, professional applause. One tap — it counts as a
              standing ovation in my book.
            </p>
          </div>

          <button
            onClick={() => void toggleHeart()}
            data-cursor="link"
            disabled={liked}
            className={`group relative flex items-center gap-4 rounded-2xl border px-6 py-5 transition-all ${
              liked
                ? "border-primary bg-primary/10"
                : "border-border bg-card/40 hover:border-primary"
            }`}
            aria-label="Appreciate this portfolio"
          >
            <span
              className={`relative grid h-12 w-12 place-items-center rounded-full border transition-colors ${
                liked ? "border-primary bg-primary/20" : "border-border"
              }`}
            >
              <Heart
                className={`h-5 w-5 transition-all ${
                  liked ? "fill-primary text-primary scale-110" : "text-foreground"
                } ${burst ? "scale-150" : ""}`}
              />
              {burst && (
                <span className="pointer-events-none absolute inset-0 animate-ping rounded-full border-2 border-primary" />
              )}
            </span>
            <span className="text-left">
              <span className="block font-display text-3xl tracking-tight">{hearts}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                {liked ? "thank you ✦" : "hearts · tap once"}
              </span>
            </span>
          </button>
        </div>

        {/* Visitor + signature */}
        <div className="mt-16 flex flex-col gap-6 border-t border-border pt-8 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl text-sm normal-case tracking-normal text-muted-foreground">
            <span className="italic text-foreground">
              "The best way to predict the future is to invent it."
            </span>
            <span className="ml-2">— Alan Kay</span>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <span>
              Total visits{" "}
              <span className="text-foreground">
                {visitor !== null ? visitor.toLocaleString() : "—"}
              </span>
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-primary anim-glow" />
            <span>© 2026 Ryali Harsha Srinatth · built by hand</span>
          </div>
        </div>
      </RevealOnScroll>
    </footer>
  );
}
