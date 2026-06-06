import { useEffect, useRef, useState } from "react";
import { PERSON } from "./data";

function formatLocalTime() {
  const d = new Date();
  return (
    d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) +
    " UTC" +
    (-d.getTimezoneOffset() / 60 >= 0 ? "+" : "") +
    -d.getTimezoneOffset() / 60
  );
}

export function Observatory() {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({ x: 0, y: 0 });
  const [time, setTime] = useState(formatLocalTime);

  useEffect(() => {
    const id = setInterval(() => setTime(formatLocalTime()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      setT({ x, y });
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section
      ref={ref}
      id="index"
      className="relative min-h-[100svh] w-full overflow-hidden grid-paper"
    >
      {/* Scanline */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent anim-scan opacity-60" />

      {/* Corner registration marks */}
      <CornerMarks />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1600px] flex-col px-6 pt-28 pb-16 md:px-12 lg:px-20">
        {/* Top meta line */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          <Meta label="Subject" value={PERSON.shortName + " · " + PERSON.initials} />
          <Meta label="Designation" value="OBS-2026.06" />
          <Meta label="Local time" value={time} />
          <Meta label="Coordinates" value="Bhimavaram · 16.54N 81.52E" />
        </div>

        {/* Main spread */}
        <div className="mt-16 grid flex-1 grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-8">
          {/* Name + tagline */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div
              className="transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ transform: `translate3d(${t.x * -10}px, ${t.y * -10}px, 0)` }}
            >
              <p className="font-mono text-xs uppercase tracking-[0.45em] text-primary">
                Specimen no. 001 — Living
              </p>
              <h1 className="font-display mt-6 text-[clamp(2.8rem,9.5vw,8.5rem)] leading-[0.88] tracking-[-0.04em] text-balance">
                <span className="block">Ryali</span>
                <span className="block">Harsha</span>
                <span className="block italic font-light">
                  Srinatth
                </span>
              </h1>
              <p className="mt-10 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
                {PERSON.tagline}{" "}
                <span className="text-foreground">{PERSON.taglineContext}</span>
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                <span className="text-foreground">↓ start drifting</span>
                <span>or press <kbd className="rounded border border-border px-1.5 py-0.5">K</kbd> for the index</span>
              </div>
            </div>
          </div>

          {/* Specimen plate */}
          <div className="lg:col-span-5 relative">
            <SpecimenPlate tilt={t} />
          </div>
        </div>

        {/* Bottom edge */}
        <div className="mt-auto pt-16 grid grid-cols-2 md:grid-cols-4 gap-6 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          <Meta label="Status" value="Composing" pulse />
          <Meta label="Open work" value="College360X · MERN + ML" />
          <Meta label="Reading" value="Lispector · Stoppard" />
          <Meta label="Listening" value="Hiroshi Yoshimura" />
        </div>
      </div>
    </section>
  );
}

function Meta({ label, value, pulse }: { label: string; value: string; pulse?: boolean }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="text-muted-foreground/70">{label}</span>
      <span className="text-foreground flex items-center gap-2">
        {pulse && <span className="h-1.5 w-1.5 rounded-full bg-primary anim-glow" />}
        {value}
      </span>
    </div>
  );
}

function CornerMarks() {
  const corners = [
    "top-6 left-6",
    "top-6 right-6 rotate-90",
    "bottom-6 left-6 -rotate-90",
    "bottom-6 right-6 rotate-180",
  ];
  return (
    <>
      {corners.map((c, i) => (
        <div key={i} className={`pointer-events-none absolute h-6 w-6 ${c}`} aria-hidden>
          <div className="absolute top-0 left-0 h-full w-px bg-foreground/30" />
          <div className="absolute top-0 left-0 h-px w-full bg-foreground/30" />
        </div>
      ))}
    </>
  );
}

function SpecimenPlate({ tilt }: { tilt: { x: number; y: number } }) {
  return (
    <div
      className="relative aspect-square w-full max-w-[520px] mx-auto"
      style={{
        transform: `perspective(1400px) rotateX(${tilt.y * 8}deg) rotateY(${tilt.x * -8}deg)`,
        transformStyle: "preserve-3d",
        transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border border-border" />
      <div className="absolute inset-6 rounded-full border border-dashed border-border anim-orbit" />
      <div className="absolute inset-16 rounded-full border border-border/60" />

      {/* Orbiting marks */}
      <div className="absolute inset-0 anim-orbit" style={{ animationDuration: "60s" }}>
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <div
            key={deg}
            className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
            style={{
              transform: `translate(-50%,-50%) rotate(${deg}deg) translateY(-50%) translateY(12px)`,
            }}
          />
        ))}
      </div>
      <div
        className="absolute inset-6 anim-orbit"
        style={{ animationDuration: "120s", animationDirection: "reverse" }}
      >
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <div
            key={deg}
            className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/60"
            style={{
              transform: `translate(-50%,-50%) rotate(${deg}deg) translateY(-50%) translateY(8px)`,
            }}
          />
        ))}
      </div>

      {/* Core */}
      <div className="absolute inset-[28%] rounded-full bg-gradient-to-br from-primary to-accent opacity-90 blur-xl anim-glow" />
      <div className="absolute inset-[34%] rounded-full bg-gradient-to-br from-primary to-accent" />
      <div className="absolute inset-[34%] rounded-full ring-1 ring-foreground/40 grid place-items-center">
        <div className="text-center font-mono text-[9px] uppercase tracking-[0.35em] text-primary-foreground/90">
          <div>RHS · live</div>
          <div className="opacity-60 mt-1">obs-26</div>
        </div>
      </div>

      {/* Radial labels */}
      {[
        { t: "systems", a: 12 },
        { t: "interfaces", a: 72 },
        { t: "signal", a: 144 },
        { t: "form", a: 216 },
        { t: "field", a: 288 },
      ].map(({ t, a }) => (
        <div
          key={t}
          className="absolute left-1/2 top-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
          style={{
            transform: `translate(-50%,-50%) rotate(${a}deg) translateY(-200%) rotate(${-a}deg)`,
          }}
        >
          {t}
        </div>
      ))}
    </div>
  );
}