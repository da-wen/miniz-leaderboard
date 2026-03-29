"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import type { Track } from "@/types";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { Sidebar } from "./Sidebar";

interface MobileNavProps {
  tracks: Track[];
  lang: string;
  dict: Dictionary;
}

export function MobileNav({ tracks, lang, dict }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className="lg:hidden">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-30 flex items-center gap-3 px-4 py-3 bg-slate-900 border-b border-slate-800">
        <button
          onClick={() => setIsOpen(true)}
          className="p-1 text-slate-400 hover:text-white"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <span>🏁</span>
          <span className="text-sm font-bold text-slate-50">Mini-Z {dict.nav.leaderboard}</span>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-200 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
          <span className="text-sm font-medium text-slate-300">{dict.nav.navigation}</span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 text-slate-400 hover:text-white"
            aria-label="Close navigation"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <Sidebar tracks={tracks} lang={lang} dict={dict} />
      </div>

      {/* Spacer for fixed top bar */}
      <div className="h-12" />
    </div>
  );
}
