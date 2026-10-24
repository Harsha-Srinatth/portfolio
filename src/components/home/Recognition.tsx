import { useState } from "react";
import { FileText } from "lucide-react";

import { ACHIEVEMENTS } from "@/components/portfolio/data";
import { PdfViewer } from "@/components/portfolio/PdfViewer";
import { Section } from "./Section";

export function Recognition() {
  const [certificate, setCertificate] = useState<string | null>(null);

  return (
    <Section id="achievements" title="Recognition" note="Achievements and certifications.">
      <ul className="border-t border-border">
        {ACHIEVEMENTS.map((a) => (
          <li key={a.title} className="grid gap-3 border-b border-border py-9 md:grid-cols-[9rem_1fr]">
            <span className="pt-1 text-[0.85rem] text-muted-foreground">{a.year}</span>
            <div className="max-w-[44rem]">
              <h3 className="font-display text-[clamp(1.4rem,2vw,1.8rem)] font-[370] leading-[1.2] tracking-[-0.01em]">
                {a.title}
                {a.badge === "udemy" && <span className="ml-3 align-middle text-[0.8rem] text-muted-foreground">Udemy</span>}
              </h3>
              <p className="mt-3 text-pretty text-[1rem] leading-[1.7] text-foreground/75">{a.detail}</p>
              {a.certificateUrl && (
                <button type="button" onClick={() => setCertificate(a.certificateUrl!)} className="btn btn-line mt-6 !h-11 text-[0.9rem]">
                  <FileText className="h-4 w-4" strokeWidth={1.6} />
                  {a.certificateLabel ?? "View certificate"}
                </button>
              )}
            </div>
          </li>
        ))}
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
