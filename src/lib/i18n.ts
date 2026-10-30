export type Lang = "ru" | "ar" | "en";
export type Tri = Record<Lang, string>;

export function tx(lang: Lang, text: Tri): string {
  return text[lang];
}

export function localeOf(lang: Lang): string {
  if (lang === "ar") return "ar";
  if (lang === "en") return "en-GB";
  return "ru-RU";
}
