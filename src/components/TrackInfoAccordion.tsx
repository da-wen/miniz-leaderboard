"use client";

import DOMPurify from "isomorphic-dompurify";
import { ChevronRight } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SANITIZE_CONFIG: any = {
  ALLOWED_TAGS: [
    "b", "i", "em", "strong", "u", "s",
    "p", "br", "hr",
    "h3", "h4",
    "ul", "ol", "li",
    "a",
    "span", "code",
    "table", "thead", "tbody", "tr", "th", "td",
  ],
  ALLOWED_ATTR: ["href", "target", "rel", "class"],
};

interface TrackInfoAccordionProps {
  info: string;
  label: string;
}

export function TrackInfoAccordion({ info, label }: TrackInfoAccordionProps) {
  const sanitizedInfo = DOMPurify.sanitize(info, SANITIZE_CONFIG);

  return (
    <details className="group mb-6 rounded-lg border border-slate-800 bg-slate-900">
      <summary className="flex cursor-pointer items-center gap-2 px-4 py-3 text-sm font-medium text-slate-300 hover:text-white list-none">
        <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
        {label}
      </summary>
      <div
        className="px-4 pb-4 prose prose-sm prose-invert max-w-none prose-p:text-slate-400 prose-li:text-slate-400 prose-headings:text-slate-300 prose-a:text-blue-400 prose-code:text-slate-300 prose-hr:border-slate-700 prose-table:text-slate-400 overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: sanitizedInfo }}
      />
    </details>
  );
}
