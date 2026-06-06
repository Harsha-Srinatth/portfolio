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
    <div className="fixed inset-0 z-[100] flex flex-col bg-background/95 backdrop-blur-md">
      <div className="flex items-center justify-between gap-4 border-b border-border bg-card/80 px-4 py-3 md:px-6">
        <div>
          <p className="font-mono text-sm text-foreground">{title}</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            PDF preview — scroll or use viewer controls
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={src}
            download={downloadName}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <Download className="h-3.5 w-3.5" />
            Download
          </a>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close document viewer"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
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
