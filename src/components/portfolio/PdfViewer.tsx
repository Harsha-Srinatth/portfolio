import { useEffect } from "react";
import { Download, X } from "lucide-react";

type PdfViewerProps = {
  open: boolean;
  onClose: () => void;
  src: string;
  title: string;
  downloadName: string;
};

export function PdfViewer({ open, onClose, src, title, downloadName }: PdfViewerProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-background/95 backdrop-blur-md" role="dialog" aria-modal="true" aria-label={title}>
      <div className="flex items-center justify-between gap-4 border-b border-border bg-card/80 px-4 py-3 md:px-6">
        <div>
          <p className="text-[0.95rem] text-foreground">{title}</p>
          <p className="text-[0.8rem] text-muted-foreground">Press Esc to close</p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={src}
            download={downloadName}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-foreground/25 px-4 text-[0.88rem] text-foreground/80 transition-colors hover:border-foreground/60 hover:text-foreground"
          >
            <Download className="h-3.5 w-3.5" />
            Download
          </a>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close document viewer"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-foreground/25 text-foreground/80 transition-colors hover:border-foreground/60 hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-3 md:p-6">
        <iframe
          src={`${src}#toolbar=1&navpanes=0`}
          title={title}
          className="h-full w-full rounded-2xl border border-border bg-white shadow-2xl"
        />
      </div>
    </div>
  );
}
