import fs from "fs";
import path from "path";
import type { Track, RacingClass, LapTimeEntry, SortField } from "@/types";
import { i18n } from "@/lib/i18n/config";

const dataDir = path.join(process.cwd(), "data");

export function getTracks(): Track[] {
  const raw = fs.readFileSync(path.join(dataDir, "tracks.json"), "utf-8");
  return JSON.parse(raw);
}

export function getClasses(): RacingClass[] {
  const raw = fs.readFileSync(path.join(dataDir, "classes.json"), "utf-8");
  return JSON.parse(raw);
}

export function getClassBySlug(slug: string): RacingClass | undefined {
  return getClasses().find((c) => c.slug === slug);
}

export function getTrackBySlug(slug: string): Track | undefined {
  return getTracks().find((t) => t.slug === slug);
}

export function getResults(trackSlug: string, classSlug: string): LapTimeEntry[] {
  const filePath = path.join(dataDir, "results", `${trackSlug}_${classSlug}.json`);
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

export function getDefaultSort(trackSlug: string, classSlug: string): SortField {
  const track = getTrackBySlug(trackSlug);
  const trackClass = track?.classes.find((c) => c.classSlug === classSlug);
  const racingClass = getClassBySlug(classSlug);

  return trackClass?.defaultSort ?? racingClass?.defaultSort ?? "bestLaptime";
}

export function getLocalizedRules(classSlug: string, lang: string): string {
  const racingClass = getClassBySlug(classSlug);
  if (!racingClass) return "";

  const rules = racingClass.rules;
  return rules[lang as keyof typeof rules]
    ?? rules[i18n.defaultLocale as keyof typeof rules]
    ?? "";
}
