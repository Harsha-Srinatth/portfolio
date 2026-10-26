import { PERSON } from "./data";

import { PdfViewer } from "./PdfViewer";

type ResumeViewerProps = {
  open: boolean;
  onClose: () => void;
};

export function ResumeViewer({ open, onClose }: ResumeViewerProps) {
  const fileName = PERSON.resumeUrl.split("/").pop() ?? "resume.pdf";
  return (
    <PdfViewer
      open={open}
      onClose={onClose}
      src={PERSON.resumeUrl}
      title={fileName}
      downloadName={fileName}
    />
  );
}
