import { useState } from "react";
import { ArrowUpRight, Check, Copy } from "lucide-react";

import { PERSON } from "@/components/portfolio/data";
import { Section } from "./Section";

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable: the link itself still works */
    }
  };
  return (
    <button
      type="button"
      onClick={() => void copy()}
      aria-label={copied ? `${label} copied` : `Copy ${label}`}
      className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-foreground/20 text-foreground/70 transition-colors duration-500 hover:border-foreground/60 hover:text-foreground"
    >
      {copied ? <Check className="h-4 w-4" strokeWidth={1.6} /> : <Copy className="h-4 w-4" strokeWidth={1.6} />}
    </button>
  );
}

export function Contact() {
  const tel = PERSON.phone.replace(/\s+/g, "");
  const channels = [
    { label: "Email", value: PERSON.email, href: `mailto:${PERSON.email}`, copy: true },
    { label: "Phone", value: PERSON.phone, href: `tel:${tel}`, copy: true },
    ...PERSON.socials.map((s) => ({ label: s.label, value: s.handle, href: s.url, copy: false })),
  ];

  return (
    <Section id="transmissions" title="Contact" note="Usually replies within a day.">
      <p className="font-display max-w-[44rem] text-balance text-[clamp(1.9rem,3.6vw,3.3rem)] font-[340] leading-[1.12] tracking-[-0.02em]">
        Have an idea, a difficult problem or a role in mind? I’d like to hear about it.
      </p>

      <ul className="mt-12 max-w-[46rem] border-t border-border">
        {channels.map((c) => {
          const external = c.href.startsWith("http");
          return (
            <li key={c.label} className="flex items-center gap-4 border-b border-border py-5">
              <span className="w-24 shrink-0 text-[0.85rem] text-muted-foreground">{c.label}</span>
              <a
                href={c.href}
                {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                className="group flex min-w-0 flex-1 items-center gap-2 text-[clamp(1rem,1.6vw,1.25rem)]"
              >
                <span className="link-underline truncate">{c.value}</span>
                {external && (
                  <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.6} />
                )}
              </a>
              {c.copy && <CopyButton value={c.value} label={c.label.toLowerCase()} />}
            </li>
          );
        })}
      </ul>

      <dl className="mt-10 grid max-w-[46rem] grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <dt className="text-[0.82rem] text-muted-foreground">Open to</dt>
          <dd className="mt-1.5">Backend, full-stack and AI engineering roles</dd>
        </div>
        <div>
          <dt className="text-[0.82rem] text-muted-foreground">Based in</dt>
          <dd className="mt-1.5">{PERSON.location}, India</dd>
        </div>
      </dl>
    </Section>
  );
}
