import { useState } from "react";
import { Award, FileText, Rocket, Trophy, type LucideIcon } from "lucide-react";

import { ACHIEVEMENTS } from "@/components/portfolio/data";
import { PdfViewer } from "@/components/portfolio/PdfViewer";
import { CountUp } from "./motion";
import { Section } from "./Section";
import { Card, Chip, IconChip } from "./ui";

const ICONS: LucideIcon[] = [Award, Trophy, Rocket];

/** The first figure in a sentence ("99-hour", "300+ teams") counts up as the card arrives. */
function WithFigure({ text }: { text: string }) {
  const m = /\d+/.exec(text);
  if (!m) return <>{text}</>;
  return (
    <>
      {text.slice(0, m.index)}
      <CountUp value={Number(m[0])} className="font-medium text-accent" />
      {text.slice(m.index + m[0].length)}
    </>
  );
}

export function Recognition() {
  const [certificate, setCertificate] = useState<string | null>(null);

  return (
    <Section id="achievements" title="Achievements and certifications." note="Courses completed and recognition earned along the way.">
      <ul className="grid gap-4 md:grid-cols-3 md:gap-5">
        {ACHIEVEMENTS.map((a, i) => {
          const Icon = ICONS[i] ?? Award;
          return (
            <Card as="li" key={a.title} className="reveal flex flex-col p-6 md:p-7" style={{ ["--i" as string]: i }}>
              <div className="flex items-center justify-between gap-3">
                <IconChip>
                  <Icon className="h-5 w-5" strokeWidth={1.6} />
                </IconChip>
                <div className="flex gap-1.5">
                  {a.badge === "udemy" && <Chip>Udemy</Chip>}
                  <Chip>{a.year}</Chip>
                </div>
              </div>
              <h3 className="font-display mt-6 text-[1.35rem] font-[400] leading-[1.25] tracking-[-0.01em]">{a.title}</h3>
              <p className="mt-3 text-pretty text-[0.95rem] leading-[1.6] text-foreground/75">
                <WithFigure text={a.detail} />
              </p>
              {a.certificateUrl && (
                <div className="mt-auto pt-6">
                  <button type="button" onClick={() => setCertificate(a.certificateUrl!)} className="btn btn-line !h-11 text-[0.9rem]">
                    <FileText className="h-4 w-4" strokeWidth={1.6} />
                    {a.certificateLabel ?? "View certificate"}
                  </button>
                </div>
              )}
            </Card>
          );
        })}
      </ul>

      <PdfViewer
        open={certificate !== null}
        onClose={() => setCertificate(null)}
        src={certificate ?? ""}
        title="Udemy-Ml-Certificate-Harsha.pdf"
        downloadName="Udemy-Ml-Certificate-Harsha.pdf"
      />
    </Section>
  );
}
