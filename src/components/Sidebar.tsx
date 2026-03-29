import type { Track } from "@/types";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { SidebarNav } from "./SidebarNav";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface SidebarProps {
  tracks: Track[];
  lang: string;
  dict: Dictionary;
}

export function Sidebar({ tracks, lang, dict }: SidebarProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏁</span>
          <div>
            <div className="text-sm font-bold text-slate-50 leading-tight">Mini-Z</div>
            <div className="text-xs text-slate-400 leading-tight">{dict.nav.leaderboard}</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="px-3 mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
          {dict.nav.tracks}
        </p>
        <SidebarNav tracks={tracks} lang={lang} />
      </nav>
      <LanguageSwitcher currentLang={lang} />
    </div>
  );
}
