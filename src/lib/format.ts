import type { Lang } from "@/lib/i18n";
import { localeOf } from "@/lib/i18n";
import { digits, monthMeta, type HijriDate } from "@/lib/hijri";

export function gregorianLong(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(localeOf(lang), {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function gregorianShort(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(localeOf(lang), {
    day: "numeric",
    month: "short",
  }).format(date);
}

export function weekdayLong(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(localeOf(lang), { weekday: "long" }).format(date);
}

export function weekdayShort(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(localeOf(lang), { weekday: "short" }).format(date);
}

export const WEEKDAYS_MON: Record<Lang, string[]> = {
  ru: ["пн", "вт", "ср", "чт", "пт", "сб", "вс"],
  en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  ar: ["إث", "ثل", "أر", "خم", "جم", "سب", "أح"],
};

export function formatClock(date: Date, timeZone?: string): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone,
    }).format(date);
  } catch {
    return new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  }
}

export function formatRemain(ms: number): string {
  const safe = Math.max(0, ms);
  const total = Math.floor(safe / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  if (h > 0) return `${h}:${pad(m)}:${pad(s)}`;
  return `${m}:${pad(s)}`;
}

export function hijriLine(h: HijriDate, lang: Lang): string {
  const month = monthMeta(h.month);
  const local = lang === "ar" ? month.ar : lang === "en" ? month.en : month.ru;
  return `${digits(h.day, lang)} ${local} ${digits(h.year, lang)}`;
}

const CARDS: Record<Lang, string[]> = {
  ru: ["С", "СВ", "В", "ЮВ", "Ю", "ЮЗ", "З", "СЗ"],
  en: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"],
  ar: ["شمال", "ش.ق", "شرق", "ج.ق", "جنوب", "ج.غ", "غرب", "ش.غ"],
};

export function cardinal(deg: number, lang: Lang): string {
  const index = Math.round((((deg % 360) + 360) % 360) / 45) % 8;
  return CARDS[lang][index] ?? CARDS[lang][0]!;
}
