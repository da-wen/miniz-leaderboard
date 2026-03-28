"use client";

import { useState, useMemo } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import type { LapTimeEntry, SortField } from "@/types";
import { LapTime } from "./LapTime";

interface LeaderboardTableProps {
  entries: LapTimeEntry[];
  defaultSort: SortField;
}

const MEDALS = ["🥇", "🥈", "🥉"];

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getMostRecentDate(entry: LapTimeEntry): string | null {
  const dates = [entry.updatedBestLaptime, entry.updatedThreeConsecutiveLaps].filter(
    Boolean
  ) as string[];
  if (dates.length === 0) return null;
  return dates.sort().at(-1) ?? null;
}

export function LeaderboardTable({ entries, defaultSort }: LeaderboardTableProps) {
  const [sortField, setSortField] = useState<SortField>(defaultSort);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const sorted = useMemo(() => {
    return [...entries].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (aVal === null && bVal === null) return 0;
      if (aVal === null) return 1;
      if (bVal === null) return -1;
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    });
  }, [entries, sortField, sortDirection]);

  function handleSort(field: SortField) {
    if (field === sortField) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }

  function SortIcon({ field }: { field: SortField }) {
    if (field !== sortField) return null;
    return sortDirection === "asc" ? (
      <ArrowUp className="inline h-3 w-3 ml-1" />
    ) : (
      <ArrowDown className="inline h-3 w-3 ml-1" />
    );
  }

  if (entries.length === 0) {
    return (
      <p className="text-slate-400 text-sm py-8 text-center">
        No lap times recorded yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-950 sticky top-0">
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400 w-12">
              #
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400 sticky left-0 bg-slate-950">
              Driver
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
              Car Model
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400 cursor-pointer hover:text-slate-200 select-none whitespace-nowrap"
              onClick={() => handleSort("bestLaptime")}
            >
              Best Laptime
              <SortIcon field="bestLaptime" />
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400 cursor-pointer hover:text-slate-200 select-none whitespace-nowrap"
              onClick={() => handleSort("threeConsecutiveLaps")}
            >
              3 Consecutive Laps
              <SortIcon field="threeConsecutiveLaps" />
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
              Updated
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((entry, index) => (
            <tr
              key={`${entry.driver}-${index}`}
              className="border-b border-slate-800/50 hover:bg-slate-800/50 even:bg-slate-900/50"
            >
              <td className="px-4 py-3 text-slate-400">
                {index < 3 ? (
                  <span>{MEDALS[index]}</span>
                ) : (
                  <span className="text-slate-500">{index + 1}</span>
                )}
              </td>
              <td className="px-4 py-3 font-medium text-slate-50 sticky left-0 bg-inherit">
                {entry.driver}
              </td>
              <td className="px-4 py-3 text-slate-300">{entry.carModel}</td>
              <td className="px-4 py-3">
                <LapTime time={entry.bestLaptime} />
              </td>
              <td className="px-4 py-3">
                <LapTime time={entry.threeConsecutiveLaps} />
              </td>
              <td className="px-4 py-3 text-xs text-slate-500">
                {formatDate(getMostRecentDate(entry))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
