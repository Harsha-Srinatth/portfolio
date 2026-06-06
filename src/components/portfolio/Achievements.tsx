import { useState } from "react";
import { FileText } from "lucide-react";

import { ACHIEVEMENTS } from "./data";
import { PdfViewer } from "./PdfViewer";
import { SectionLabel } from "./Constellation";
import { RevealOnScroll } from "./RevealOnScroll";

function UdemyBadge() {
  return (
    <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-md bg-[#A435F0] px-1.5 font-mono text-[9px] font-bold uppercase tracking-wide text-white">
      U
    </span>
  );
}

export function Achievements() {
  const [certificate, setCertificate] = useState<{
    src: string;
    title: string;
    downloadName: string;
  } | null>(null);

  return (
    <section id="achievements" className="relative w-full overflow-hidden border-t border-border bg-background">
      <SectionLabel
        index="05"
        title="Achievements And Certifications"
        subtitle="What shipped, what moved the needle."
      />
      <RevealOnScroll delay={0.06} className="mx-auto max-w-[1600px] px-6 pb-32 md:px-12 lg:px-20">
        <ol className="relative space-y-6 border-l border-border pl-8">
          {ACHIEVEMENTS.map((a, i) => (
            <li key={i} className="relative">
              <span className="absolute -left-[37px] top-2 grid h-4 w-4 place-items-center rounded-full border border-primary bg-background">
                <span className="h-1.5 w-1.5 rounded-full bg-primary anim-glow" />
              </span>
              <div className="rounded-2xl border border-border bg-card/40 p-6 transition-colors hover:border-primary">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {a.badge === "udemy" && <UdemyBadge />}
                    <div className="font-display text-2xl tracking-tight">{a.title}</div>
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.35em] text-primary">
                    {a.year}
                  </div>
                </div>
                <p className="mt-3 text-muted-foreground">{a.detail}</p>

                {a.certificateUrl && (
                  <button
                    type="button"
                    data-cursor="link"
                    onClick={() =>
                      setCertificate({
                        src: a.certificateUrl!,
                        title: "Udemy-Ml-Certificate-Harsha.pdf",
                        downloadName: "Udemy-Ml-Certificate-Harsha.pdf",
                      })
                    }
                    className="mt-5 inline-flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    <FileText className="h-4 w-4" />
                    {a.certificateLabel ?? "View Certificate"}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ol>
      </RevealOnScroll>

      {certificate && (
        <PdfViewer
          open={Boolean(certificate)}
          onClose={() => setCertificate(null)}
          src={certificate.src}
          title={certificate.title}
          downloadName={certificate.downloadName}
        />
      )}
    </section>
  );
}
