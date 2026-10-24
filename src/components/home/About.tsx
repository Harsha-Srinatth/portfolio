import { useState } from "react";
import { ArrowUpRight, FileText } from "lucide-react";

import { BEYOND_CODE, GITHUB, PERSON } from "@/components/portfolio/data";
import { ResumeViewer } from "@/components/portfolio/ResumeViewer";
import { Section } from "./Section";

export function About() {
  const [resumeOpen, setResumeOpen] = useState(false);
  const [lead, ...rest] = PERSON.about;
  const github = PERSON.socials.find((s) => s.label === "GitHub");

  const facts: { term: string; detail: string }[] = [
    { term: "Based in", detail: `${PERSON.location}, India` },
    { term: "Studying", detail: `${PERSON.education.replace(" — ", ", ")} · SRKR Engineering College` },
    { term: "Focus", detail: "Full-stack and backend engineering, real-time systems, applied machine learning" },
    { term: "Off the keyboard", detail: `${BEYOND_CODE.map((b) => b.label).join(", ")} · ${PERSON.also.replace("Music · ", "")} music` },
  ];

  return (
    <Section id="about" title="About" note="Who I am, what I build and how I like to work.">
      <p className="font-display max-w-[40rem] text-pretty text-[clamp(1.45rem,2.1vw,1.95rem)] font-[350] leading-[1.42] tracking-[-0.005em]">
        {lead}
      </p>
      {rest.map((p) => (
        <p key={p.slice(0, 24)} className="mt-7 max-w-[38rem] text-pretty text-[1.05rem] leading-[1.75] text-foreground/75">
          {p}
        </p>
      ))}

      <dl className="mt-14 grid max-w-[46rem] grid-cols-1 gap-x-10 gap-y-7 border-t border-border pt-10 sm:grid-cols-2">
        {facts.map((f) => (
          <div key={f.term}>
            <dt className="text-[0.82rem] text-muted-foreground">{f.term}</dt>
            <dd className="mt-1.5 text-[1rem] leading-relaxed">{f.detail}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-4">
        <button type="button" onClick={() => setResumeOpen(true)} className="btn btn-solid">
          <FileText className="h-4 w-4" strokeWidth={1.6} />
          Read my résumé
        </button>
        {github && (
          <a href={github.url} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 text-[0.95rem]">
            <span className="link-underline">GitHub</span>
            <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.6} />
            <span className="text-muted-foreground">
              {GITHUB.totalContributions} contributions in {GITHUB.year}, {GITHUB.repoCount} repositories
            </span>
          </a>
        )}
      </div>

      <ResumeViewer open={resumeOpen} onClose={() => setResumeOpen(false)} />
    </Section>
  );
}
