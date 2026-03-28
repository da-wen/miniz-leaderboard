import { ChevronRight } from "lucide-react";

interface RulesAccordionProps {
  rules: string;
  className: string;
}

export function RulesAccordion({ rules, className }: RulesAccordionProps) {
  return (
    <details className="group mb-6 rounded-lg border border-slate-800 bg-slate-900">
      <summary className="flex cursor-pointer items-center gap-2 px-4 py-3 text-sm font-medium text-slate-300 hover:text-white list-none">
        <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
        {className} Rules
      </summary>
      <div className="px-4 pb-4 text-sm text-slate-400 leading-relaxed">
        {rules}
      </div>
    </details>
  );
}
