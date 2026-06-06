import { useState } from "react";
import { PERSON } from "./data";
import { SectionLabel } from "./Constellation";
import { RevealOnScroll } from "./RevealOnScroll";

export function Transmissions() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = (v: string) => {
    navigator.clipboard?.writeText(v);
    setCopied(v);
    setTimeout(() => setCopied(null), 1400);
  };

  return (
    <section id="transmissions" className="relative w-full overflow-hidden border-t border-border bg-background">
      <SectionLabel index="08" title="Transmissions" subtitle="Open channels. Send something interesting." />
      <RevealOnScroll delay={0.06} className="mx-auto grid max-w-[1600px] grid-cols-1 gap-12 px-6 pb-32 md:px-12 lg:grid-cols-12 lg:px-20">
        {/* Big invitation */}
        <div className="lg:col-span-7">
          <p className="font-display text-[clamp(2rem,5.5vw,5rem)] leading-[0.95] tracking-tight text-balance">
            Let's talk about{" "}
            <span className="text-primary">innovative ideas</span>,{" "}
            <span className="italic">challenging problems</span>,{" "}
            <span className="text-foreground">impactful products</span>, or{" "}
            <span className="text-muted-foreground">
              opportunities to build something meaningful together.
            </span>
          </p>

          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Channel label="Email" value={PERSON.email} copied={copied} onCopy={copy} />
            <Channel label="Cipher / signal" value={PERSON.phone} copied={copied} onCopy={copy} />
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
            {PERSON.socials.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                data-cursor="link"
                className="group inline-flex items-center gap-3 rounded-full border border-border bg-card/40 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary anim-glow" />
                {s.label}
                <span className="text-foreground/60 group-hover:text-foreground">{s.handle}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Card / coordinates */}
        <aside className="lg:col-span-5">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card/50 p-8 grid-paper">
            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary">
              transmission card
            </div>
            <div className="mt-6 font-display text-3xl leading-tight tracking-tight">
              {PERSON.fullName}
            </div>

            <dl className="mt-8 space-y-3 font-mono text-[11px] uppercase tracking-[0.3em]">
              <Row k="located" v={PERSON.location} />
              <Row k="education" v={PERSON.education} />
              <Row k="response" v="≤ 24h, usually faster" />
              <Row k="open to" v="Backend · Full-stack · AI roles" />
            </dl>

            <div className="mt-10 flex items-end justify-between">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                signed
              </div>
              <div className="font-display text-3xl italic tracking-tight text-primary">
                — {PERSON.shortName}
              </div>
            </div>
          </div>
        </aside>
      </RevealOnScroll>

    </section>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-dashed border-border pb-2">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="text-foreground">{v}</dd>
    </div>
  );
}

function Channel({
  label,
  value,
  copied,
  onCopy,
}: {
  label: string;
  value: string;
  copied: string | null;
  onCopy: (v: string) => void;
}) {
  const isCopied = copied === value;
  return (
    <button
      data-cursor="link"
      onClick={() => onCopy(value)}
      className="group relative flex items-center justify-between gap-4 rounded-2xl border border-border bg-card/40 px-5 py-4 text-left transition-colors hover:border-primary"
    >
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          {label}
        </div>
        <div className="mt-1 font-display text-xl tracking-tight">{value}</div>
      </div>
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary opacity-0 transition-opacity group-hover:opacity-100">
        {isCopied ? "copied ✓" : "copy ↵"}
      </div>
    </button>
  );
}