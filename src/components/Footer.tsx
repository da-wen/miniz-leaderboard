import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/dictionaries";

interface FooterProps {
  lang: string;
  dict: Dictionary;
}

export function Footer({ lang, dict }: FooterProps) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-slate-800 px-6 py-3 text-xs text-slate-500 flex items-center justify-center gap-3">
      <span>© {year}</span>
      <span>·</span>
      <Link
        href={`/${lang}/impressum`}
        className="text-slate-400 hover:text-slate-200 transition-colors"
      >
        {dict.footer.imprint}
      </Link>
    </footer>
  );
}
