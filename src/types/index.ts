import type { Locale } from "@/lib/i18n/config";

export type SortField = "bestLaptime" | "threeConsecutiveLaps";

export type LocalizedText = Partial<Record<Locale, string>>;

export interface RacingClass {
  name: string;
  slug: string;
  rules: LocalizedText;
  defaultSort: SortField;
}

export interface TrackClass {
  classSlug: string;
  defaultSort?: SortField;
}

export interface Track {
  name: string;
  slug: string;
  classes: TrackClass[];
}

export interface LapTimeEntry {
  driver: string;
  carModel: string;
  bestLaptime: number | null;
  threeConsecutiveLaps: number | null;
  updatedBestLaptime: string | null;
  updatedThreeConsecutiveLaps: string | null;
}
