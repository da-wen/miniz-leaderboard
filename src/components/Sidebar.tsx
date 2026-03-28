import type { Track } from "@/types";
import { SidebarNav } from "./SidebarNav";

interface SidebarProps {
  tracks: Track[];
}

export function Sidebar({ tracks }: SidebarProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏁</span>
          <div>
            <div className="text-sm font-bold text-slate-50 leading-tight">Mini-Z</div>
            <div className="text-xs text-slate-400 leading-tight">Leaderboard</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="px-3 mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
          Tracks
        </p>
        <SidebarNav tracks={tracks} />
      </nav>
    </div>
  );
}
