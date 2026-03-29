export const i18n = {
  defaultLocale: "de",
  locales: ["en", "de"],
} as const;

export type Locale = (typeof i18n)["locales"][number];

export function isValidLocale(lang: string): lang is Locale {
  return i18n.locales.includes(lang as Locale);
}

export function localizedHref(lang: string, path: string): string {
  return `/${lang}${path}`;
}
