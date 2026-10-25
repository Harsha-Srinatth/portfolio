import { useState } from "react";
import { Award, Code2, FileText, GraduationCap, MapPin, type LucideIcon } from "lucide-react";

import { BEYOND_CODE, PERSON } from "@/components/portfolio/data";
import { ResumeViewer } from "@/components/portfolio/ResumeViewer";
import { LeafLight } from "./Ambient";
import { Contributions } from "./Contributions";
import { HobbyArt } from "./HobbyArt";
import { Section } from "./Section";
import { Card, GithubMark, IconChip, LinkedinMark } from "./ui";

const FACTS: { icon: LucideIcon; label: string; value: string }[] = [
  { icon: MapPin, label: "Based in", value: `${PERSON.location}, India` },
  { icon: GraduationCap, label: "Studying", value: "B.Tech CSBS at SRKR Engineering College" },
  { icon: Award, label: "CGPA", value: "8.75 / 10" },
  { icon: Code2, label: "Focus", value: "Full-stack, backend, real-time systems and applied ML" },
];

export function About() {
  const [resumeOpen, setResumeOpen] = useState(false);
  const [lead, more] = PERSON.summary;
  const github = PERSON.socials.find((s) => s.label === "GitHub");
  const linkedin = PERSON.socials.find((s) => s.label === "LinkedIn");

  return (
    <Section
      id="about"
      title="About"
      note="Who I am, what I build and how I like to work."
      backdrop={<LeafLight className="right-0 top-0 h-[34rem] w-[min(60rem,90vw)] opacity-80 [mask-image:radial-gradient(closest-side,#000_40%,transparent)]" />}
    >
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <p className="font-display max-w-[34rem] text-pretty text-[clamp(1.45rem,2.1vw,1.95rem)] font-[350] leading-[1.38] tracking-[-0.005em]">{lead}</p>
          <p className="mt-5 max-w-[32rem] text-pretty text-[1.02rem] leading-[1.7] text-foreground/70">{more}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => setResumeOpen(true)} className="btn btn-solid">
              <FileText className="h-4 w-4" strokeWidth={1.6} />
              Read my résumé
            </button>
            {github && (
              <a href={github.url} target="_blank" rel="noreferrer" aria-label="GitHub profile" className="grid h-[3.25rem] w-[3.25rem] place-items-center rounded-full border border-foreground/25 transition-colors duration-500 hover:border-foreground/60">
                <GithubMark className="h-5 w-5" />
              </a>
            )}
            {linkedin && (
              <a href={linkedin.url} target="_blank" rel="noreferrer" aria-label="LinkedIn profile" className="grid h-[3.25rem] w-[3.25rem] place-items-center rounded-full border border-foreground/25 transition-colors duration-500 hover:border-foreground/60">
                <LinkedinMark className="h-[1.1rem] w-[1.1rem]" />
              </a>
            )}
          </div>
        </div>

        <ul className="grid grid-cols-2 content-start gap-3 sm:gap-4 lg:col-span-7">
          {FACTS.map(({ icon: Icon, label, value }, i) => (
            <Card as="li" key={label} className="reveal flex flex-col items-start gap-3 p-4 sm:flex-row sm:gap-4 sm:p-5" style={{ ["--i" as string]: i % 2 }}>
              <IconChip>
                <Icon className="h-5 w-5" strokeWidth={1.6} />
              </IconChip>
              <div>
                <p className="text-[0.82rem] text-muted-foreground">{label}</p>
                <p className="mt-1 text-[0.92rem] leading-snug sm:text-[1rem]">{value}</p>
              </div>
            </Card>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <Contributions />
      </div>

      <div className="mt-16 md:mt-20">
        <h3 className="font-display text-[clamp(1.6rem,2.4vw,2.1rem)] font-[380] tracking-[-0.015em]">Off the keyboard</h3>
        <p className="mt-2 text-[0.98rem] text-muted-foreground">What I do when I’m not building.</p>
        <ul className="mt-7 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          {BEYOND_CODE.map((h, i) => (
            <li key={h.key} className="reveal relative overflow-hidden rounded-[1.4rem] border border-border bg-card" style={{ ["--i" as string]: i % 4 }}>
              {/* exactly the pictures' 4:3, so the turning record lines up */}
              <div className="aspect-[4/3]">
                <HobbyArt kind={h.key} />
              </div>
              <span className="absolute left-4 top-3.5 text-[0.78rem] tabular-nums text-foreground/55">{String(i + 1).padStart(2, "0")}</span>
              <div className="relative px-3.5 pb-3.5 pt-2.5 sm:absolute sm:inset-x-0 sm:bottom-0 sm:bg-gradient-to-t sm:from-card sm:from-35% sm:via-card/80 sm:to-transparent sm:px-5 sm:pb-4 sm:pt-12">
                <h4 className="font-display text-[1.15rem] font-[400] leading-tight sm:text-[1.35rem]">{h.label}</h4>
                <p className="mt-0.5 text-[0.8rem] leading-snug text-muted-foreground sm:text-[0.88rem]">{h.note}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <ResumeViewer open={resumeOpen} onClose={() => setResumeOpen(false)} />
    </Section>
  );
}
