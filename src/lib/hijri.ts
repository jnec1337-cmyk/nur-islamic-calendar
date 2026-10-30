import umalquraImport from "@umalqura/core";
import type { Lang } from "@/lib/i18n";

type UqDate = { hy: number; hm: number; hd: number; date: Date };
type UqFn = {
  (date: Date): UqDate;
  (hy: number, hm: number, hd: number): UqDate;
};

function loadUq(mod: unknown): UqFn {
  if (typeof mod === "function") return mod as UqFn;
  if (mod && typeof mod === "object" && "default" in mod) {
    const inner = (mod as { default: unknown }).default;
    if (typeof inner === "function") return inner as UqFn;
  }
  throw new Error("umalqura");
}

const umalqura = loadUq(umalquraImport);

export type HijriDate = { year: number; month: number; day: number };
export type HijriMode = "umm" | "calc";
export type HijriOpts = { mode: HijriMode; offset: number };

export const HIJRI_MONTHS: { ar: string; ru: string; en: string }[] = [
  { ar: "ٱلْمُحَرَّم", ru: "Мухаррам", en: "Muharram" },
  { ar: "صَفَر", ru: "Сафар", en: "Safar" },
  { ar: "رَبِيع ٱلْأَوَّل", ru: "Раби аль-авваль", en: "Rabi al-Awwal" },
  { ar: "رَبِيع ٱلثَّانِي", ru: "Раби ас-сани", en: "Rabi al-Thani" },
  { ar: "جُمَادَى ٱلْأُولَى", ru: "Джумада аль-уля", en: "Jumada al-Ula" },
  { ar: "جُمَادَى ٱلْآخِرَة", ru: "Джумада аль-ахира", en: "Jumada al-Akhirah" },
  { ar: "رَجَب", ru: "Раджаб", en: "Rajab" },
  { ar: "شَعْبَان", ru: "Шабан", en: "Sha'ban" },
  { ar: "رَمَضَان", ru: "Рамадан", en: "Ramadan" },
  { ar: "شَوَّال", ru: "Шавваль", en: "Shawwal" },
  { ar: "ذُو ٱلْقَعْدَة", ru: "Зуль-када", en: "Dhul-Qi'dah" },
  { ar: "ذُو ٱلْحِجَّة", ru: "Зуль-хиджжа", en: "Dhul-Hijjah" },
];

const AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";

export function digits(value: number | string, lang: Lang): string {
  const raw = String(value);
  if (lang !== "ar") return raw;
  return raw.replace(/\d/g, (d) => AR_DIGITS[Number(d)] ?? d);
}

export function monthMeta(month: number) {
  return HIJRI_MONTHS[month - 1] ?? HIJRI_MONTHS[0]!;
}

export function atNoon(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0);
}

export function today(): Date {
  return atNoon(new Date());
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days, 12, 0, 0, 0);
}

export function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function dayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseKey(key: string): Date {
  const [ys, ms, ds] = key.split("-");
  return new Date(Number(ys), Number(ms) - 1, Number(ds), 12, 0, 0, 0);
}

export function mondayIndex(date: Date): number {
  return (date.getDay() + 6) % 7;
}

function kuwaiti(date: Date): HijriDate {
  let day = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();
  let m = month + 1;
  let y = year;
  if (m < 3) {
    y -= 1;
    m += 12;
  }
  let a = Math.floor(y / 100);
  let b = 2 - a + Math.floor(a / 4);
  if (y < 1583) b = 0;
  if (y === 1582) {
    if (m > 10) b = -10;
    if (m === 10) {
      b = 0;
      if (day > 4) b = -10;
    }
  }
  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524;
  let l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  l = l - 10631 * n + 354;
  const j =
    Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719) +
    Math.floor(l / 5670) * Math.floor((43 * l) / 15238);
  l =
    l -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29;
  m = Math.floor((24 * l) / 709);
  day = l - Math.floor((709 * m) / 24);
  year = 30 * n + j - 30;
  return { year, month: m, day };
}

function ummFrom(date: Date): HijriDate {
  const inst = umalqura(atNoon(date));
  return { year: inst.hy, month: inst.hm, day: inst.hd };
}

export function toHijri(date: Date, opts: HijriOpts): HijriDate {
  const shifted = addDays(atNoon(date), opts.offset);
  if (opts.mode === "calc") return kuwaiti(shifted);
  try {
    return ummFrom(shifted);
  } catch {
    return kuwaiti(shifted);
  }
}

function compareH(a: HijriDate, b: HijriDate): number {
  if (a.year !== b.year) return a.year - b.year;
  if (a.month !== b.month) return a.month - b.month;
  return a.day - b.day;
}

const EPOCH = new Date(1900, 0, 1, 12);

function dateByIndex(index: number): Date {
  return new Date(EPOCH.getFullYear(), EPOCH.getMonth(), EPOCH.getDate() + index, 12);
}

function tabularToGregorian(h: HijriDate): Date {
  let lo = 0;
  let hi = 365 * 210;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const date = dateByIndex(mid);
    const got = kuwaiti(date);
    const cmp = compareH(got, h);
    if (cmp === 0) return date;
    if (cmp < 0) lo = mid + 1;
    else hi = mid - 1;
  }
  throw new Error("tabular range");
}

function ummToGregorian(h: HijriDate): Date {
  const inst = umalqura(h.year, h.month, h.day);
  return atNoon(inst.date);
}

export function fromHijri(h: HijriDate, opts: HijriOpts): Date | null {
  try {
    if (h.month < 1 || h.month > 12 || h.day < 1 || h.day > 30) return null;
    if (h.year < 1318 || h.year > 1500) return null;
    const civil = opts.mode === "calc" ? tabularToGregorian(h) : ummToGregorian(h);
    const shifted = addDays(civil, -opts.offset);
    const back = toHijri(shifted, opts);
    if (back.year !== h.year || back.month !== h.month || back.day !== h.day) return null;
    return shifted;
  } catch {
    return null;
  }
}

export function monthDates(year: number, month: number, opts: HijriOpts): Date[] {
  const first = fromHijri({ year, month, day: 1 }, opts);
  if (!first) return [];
  const days: Date[] = [];
  for (let i = 0; i < 31; i += 1) {
    const date = addDays(first, i);
    const h = toHijri(date, opts);
    if (h.year !== year || h.month !== month) break;
    days.push(date);
  }
  return days;
}

export function shiftMonth(
  year: number,
  month: number,
  delta: number,
): { year: number; month: number } | null {
  let m = month + delta;
  let y = year;
  while (m > 12) {
    m -= 12;
    y += 1;
  }
  while (m < 1) {
    m += 12;
    y -= 1;
  }
  if (y < 1318 || y > 1500) return null;
  return { year: y, month: m };
}

export function yearLabel(year: number, lang: Lang): string {
  if (lang === "ar") return `${digits(year, lang)} هـ`;
  if (lang === "en") return `${year} AH`;
  return `${year} г.х.`;
}
