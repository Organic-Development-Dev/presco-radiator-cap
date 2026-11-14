/** Languages with an introduction page at /<code>/. English is the main site at /. */
export const LOCALES = [
  { code: "de", name: "Deutsch", dir: "ltr" },
  { code: "es", name: "Español", dir: "ltr" },
  { code: "fr", name: "Français", dir: "ltr" },
  { code: "it", name: "Italiano", dir: "ltr" },
  { code: "pt", name: "Português", dir: "ltr" },
  { code: "ar", name: "العربية", dir: "rtl" },
  { code: "zh", name: "中文", dir: "ltr" },
] as const;

export type LocaleCode = (typeof LOCALES)[number]["code"];

export const isLocale = (value: string): value is LocaleCode => LOCALES.some((l) => l.code === value);
export const localeInfo = (code: string) => LOCALES.find((l) => l.code === code);
