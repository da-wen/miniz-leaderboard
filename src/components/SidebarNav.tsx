"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Track } from "@/types";

interface SidebarNavProps {
  tracks: Track[];
  lang: string;
}

export function SidebarNav({ tracks, lang }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <ul className="space-y-1">
      {tracks.map((track) => {
        const firstClass = track.classes[0].classSlug;
        const href = `/${lang}/tracks/${track.slug}/${firstClass}`;
        const isActive = pathname.startsWith(`/${lang}/tracks/${track.slug}`);

        return (
          <li key={track.slug}>
            <Link
              href={href}
              className={`flex items-center px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-red-500/10 border-l-2 border-red-500 text-white pl-[10px]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800 border-l-2 border-transparent"
              }`}
            >
              {track.name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
