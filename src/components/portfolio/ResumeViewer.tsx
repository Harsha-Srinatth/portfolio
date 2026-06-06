import { PERSON } from "./data";

import { PdfViewer } from "./PdfViewer";

type ResumeViewerProps = {
  open: boolean;
  onClose: () => void;
};

export function ResumeViewer({ open, onClose }: ResumeViewerProps) {
  return (
    <PdfViewer
      open={open}
      onClose={onClose}
      src={PERSON.resumeUrl}
      title="harsha_res.pdf"
      downloadName="harsha_res.pdf"
    />
  );
}
