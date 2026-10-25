import { useState, type ReactNode } from "react";
import { ArrowUpRight, Briefcase, Check, Copy, Mail, MapPin, Phone } from "lucide-react";

import { PERSON } from "@/components/portfolio/data";
import { Section } from "./Section";
import { Card, GithubMark, IconChip, LinkedinMark } from "./ui";

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
      className="relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-foreground/20 text-foreground/70 transition-colors duration-500 hover:border-foreground/60 hover:text-foreground"
    >
      {copied ? <Check className="h-4 w-4" strokeWidth={1.6} /> : <Copy className="h-4 w-4" strokeWidth={1.6} />}
    </button>
  );
}

export function Contact() {
  const tel = PERSON.phone.replace(/\s+/g, "");
  const icon = (label: string): ReactNode =>
    label === "Email" ? (
      <Mail className="h-5 w-5" strokeWidth={1.6} />
    ) : label === "Phone" ? (
      <Phone className="h-5 w-5" strokeWidth={1.6} />
    ) : label === "GitHub" ? (
      <GithubMark className="h-5 w-5" />
    ) : (
      <LinkedinMark className="h-[1.1rem] w-[1.1rem]" />
    );
  const channels = [
    { label: "Email", value: PERSON.email, href: `mailto:${PERSON.email}`, copy: true },
    { label: "Phone", value: PERSON.phone, href: `tel:${tel}`, copy: true },
    ...PERSON.socials.map((s) => ({ label: s.label, value: s.handle, href: s.url, copy: false })),
  ];

  return (
    <Section id="transmissions" title="Contact" note="Usually replies within a day.">
      <div className="grid gap-10 xl:grid-cols-12 xl:gap-8">
        <div className="xl:col-span-5">
          <p className="font-display max-w-[30rem] text-balance text-[clamp(1.8rem,3vw,2.7rem)] font-[340] leading-[1.15] tracking-[-0.02em]">
            Have an idea, a difficult problem or a role in mind? I’d like to hear about it.
          </p>
          <ul className="mt-8 space-y-4">
            <li className="flex items-center gap-3">
              <IconChip className="!h-9 !w-9">
                <Briefcase className="h-4 w-4" strokeWidth={1.6} />
              </IconChip>
              <span>
                <span className="block text-[0.8rem] text-muted-foreground">Open to</span>
                Backend, full-stack and AI engineering roles
              </span>
            </li>
            <li className="flex items-center gap-3">
              <IconChip className="!h-9 !w-9">
                <MapPin className="h-4 w-4" strokeWidth={1.6} />
              </IconChip>
              <span>
                <span className="block text-[0.8rem] text-muted-foreground">Based in</span>
                {PERSON.location}, India
              </span>
            </li>
          </ul>
        </div>

        <ul className="grid content-start gap-4 sm:grid-cols-2 xl:col-span-7">
          {channels.map((c, i) => {
            const external = c.href.startsWith("http");
            return (
              <Card as="li" key={c.label} className="reveal relative flex items-center gap-4 p-5 transition-colors duration-300 hover:border-foreground/30" style={{ ["--i" as string]: i % 2 }}>
                <IconChip>{icon(c.label)}</IconChip>
                <div className="min-w-0 flex-1">
                  <p className="text-[0.8rem] text-muted-foreground">{c.label}</p>
                  <a
                    href={c.href}
                    {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                    className="mt-0.5 flex items-center gap-1.5 text-[0.98rem] after:absolute after:inset-0 after:rounded-[1.4rem]"
                  >
                    <span className="truncate">{c.value}</span>
                    {external && <ArrowUpRight className="h-4 w-4 shrink-0" strokeWidth={1.6} />}
                  </a>
                </div>
                {c.copy && <CopyButton value={c.value} label={c.label.toLowerCase()} />}
              </Card>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
