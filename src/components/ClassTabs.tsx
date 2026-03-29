"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { RacingClass } from "@/types";

interface ClassTabsProps {
  trackSlug: string;
  classes: RacingClass[];
  lang: string;
}

export function ClassTabs({ trackSlug, classes, lang }: ClassTabsProps) {
  const pathname = usePathname();

  return (
    <div className="overflow-x-auto">
      <div className="flex border-b border-slate-800 min-w-max">
        {classes.map((cls) => {
          const href = `/${lang}/tracks/${trackSlug}/${cls.slug}`;
          const isActive = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={cls.slug}
              href={href}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                isActive
                  ? "text-white border-red-500"
                  : "text-slate-400 hover:text-slate-300 border-transparent"
              }`}
            >
              {cls.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
