"use client";

import { useEffect, useState } from "react";

export default function ResumeViewer({
  url,
  filename,
}: {
  url: string;
  filename?: string;
}) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setExpanded(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded]);

  return (
    <div className="flex flex-col items-center gap-6">
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="group relative block w-full max-w-sm aspect-[8.5/11] border-[1.5px] border-gridOutline overflow-hidden cursor-zoom-in"
      >
        <iframe
          src={`${url}#toolbar=0&view=FitH`}
          title="Resume preview"
          className="absolute inset-0 w-full h-full pointer-events-none bg-bg"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-text/0 group-hover:bg-text/10 transition-colors duration-200">
          <span className="font-satoshi text-xs tracking-widest uppercase px-4 py-2 rounded-full bg-text text-bg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Click to Expand
          </span>
        </div>
      </button>

      <a
        href={url}
        download={filename ?? "resume.pdf"}
        className="font-satoshi text-xs tracking-widest uppercase px-6 py-3 rounded-full border-[1.5px] border-text text-text hover:bg-text hover:text-bg transition-colors duration-200"
      >
        Download Resume
      </a>

      {expanded && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
          onClick={() => setExpanded(false)}
        >
          <button
            className="absolute top-5 right-6 text-white/70 hover:text-white text-3xl leading-none font-light"
            onClick={() => setExpanded(false)}
            aria-label="Close"
          >
            ×
          </button>
          <a
            href={url}
            download={filename ?? "resume.pdf"}
            onClick={(e) => e.stopPropagation()}
            className="absolute top-6 right-20 font-satoshi text-xs tracking-widest uppercase text-white/70 hover:text-white transition-colors"
          >
            Download
          </a>
          <div
            className="relative w-[90vw] h-[90vh] bg-bg"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe src={url} title="Resume" className="w-full h-full" />
          </div>
        </div>
      )}
    </div>
  );
}
