"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe } from "lucide-react";
import { i18n } from "@/lib/i18n/config";

interface LanguageSwitcherProps {
  currentLang: string;
}

export function LanguageSwitcher({ currentLang }: LanguageSwitcherProps) {
  const pathname = usePathname();

  function getLocalizedPath(targetLang: string): string {
    const segments = pathname.split("/");
    segments[1] = targetLang;
    return segments.join("/");
  }

  return (
    <div
      className="flex items-center gap-2 px-6 py-4 border-t border-slate-800"
      aria-label="Switch language"
    >
      <Globe className="h-4 w-4 text-slate-400" />
      <div className="flex items-center gap-2 text-sm">
        {i18n.locales.map((locale, index) => (
          <span key={locale} className="flex items-center gap-2">
            {index > 0 && <span className="text-slate-600">|</span>}
            <Link
              href={getLocalizedPath(locale)}
              aria-current={locale === currentLang ? "true" : undefined}
              className={
                locale === currentLang
                  ? "text-white font-medium"
                  : "text-slate-400 hover:text-slate-200 transition-colors"
              }
            >
              {locale.toUpperCase()}
            </Link>
          </span>
        ))}
      </div>
    </div>
  );
}
