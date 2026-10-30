import { OCCASIONS, WISDOM, ruleMatches, type Occasion, type Quote, type Rule } from "@/lib/content";
import { addDays, atNoon, toHijri, type HijriDate, type HijriOpts } from "@/lib/hijri";

export type FastReason = "mon" | "thu" | "white" | "tasua" | "ashura" | "arafah" | "shawwal";

export type DayMarks = {
  sunnah: boolean;
  forbidden: boolean;
  gold: boolean;
  crescent: boolean;
  ramadan: boolean;
  info: boolean;
};

function monthWide(rule: Rule | undefined): boolean {
  return rule?.type === "month" || rule?.type === "months";
}

export function isForbiddenFast(h: HijriDate): boolean {
  if (h.month === 10 && h.day === 1) return true;
  if (h.month === 12 && h.day >= 10 && h.day <= 13) return true;
  return false;
}

export function fastReasons(h: HijriDate, weekday: number): FastReason[] {
  if (isForbiddenFast(h) || h.month === 9) return [];
  const reasons: FastReason[] = [];
  if (weekday === 1) reasons.push("mon");
  if (weekday === 4) reasons.push("thu");
  if (h.day === 13 || h.day === 14 || h.day === 15) reasons.push("white");
  if (h.month === 1 && h.day === 9) reasons.push("tasua");
  if (h.month === 1 && h.day === 10) reasons.push("ashura");
  if (h.month === 12 && h.day === 9) reasons.push("arafah");
  if (h.month === 10 && h.day >= 2 && h.day <= 7) reasons.push("shawwal");
  return reasons;
}

export function matchingOccasions(h: HijriDate, weekday: number, showMawlid: boolean): Occasion[] {
  return OCCASIONS.filter((item) => {
    if (item.disputed && !showMawlid) return false;
    if (monthWide(item.rule)) return false;
    return ruleMatches(item.rule, h.month, h.day, weekday);
  }).sort((a, b) => a.priority - b.priority);
}

export function marksFor(h: HijriDate, weekday: number, showMawlid: boolean): DayMarks {
  const matched = matchingOccasions(h, weekday, showMawlid);
  const reasons = fastReasons(h, weekday);
  return {
    sunnah: reasons.length > 0,
    forbidden: isForbiddenFast(h),
    gold: matched.some((item) => item.frame === "gold"),
    crescent: h.day === 1,
    ramadan: h.month === 9,
    info: matched.some((item) => item.section === "event" || item.section === "disputed"),
  };
}

export type DayView = {
  date: Date;
  hijri: HijriDate;
  weekday: number;
  forbidden: boolean;
  obligatory: boolean;
  reasons: FastReason[];
  matched: Occasion[];
  heroes: Occasion[];
};

export function dayView(date: Date, opts: HijriOpts, showMawlid: boolean): DayView {
  const noon = atNoon(date);
  const hijri = toHijri(noon, opts);
  const weekday = noon.getDay();
  const matched = matchingOccasions(hijri, weekday, showMawlid);
  return {
    date: noon,
    hijri,
    weekday,
    forbidden: isForbiddenFast(hijri),
    obligatory: hijri.month === 9,
    reasons: fastReasons(hijri, weekday),
    matched,
    heroes: matched.filter((item) => item.hero),
  };
}

export function monthBanner(h: HijriDate): "ramadan" | "muharram" | "sacred" | null {
  if (h.month === 9) return "ramadan";
  if (h.month === 1) return "muharram";
  if (h.month === 7 || h.month === 11 || h.month === 12) return "sacred";
  return null;
}

export function wisdomFor(date: Date): Quote {
  const start = new Date(date.getFullYear(), 0, 1, 12);
  const noon = atNoon(date);
  const index = Math.round((noon.getTime() - start.getTime()) / 86400000);
  const mod = ((index % WISDOM.length) + WISDOM.length) % WISDOM.length;
  return WISDOM[mod]!;
}

export function nextOccasionDate(item: Occasion, from: Date, opts: HijriOpts): Date | null {
  if (!item.rule || monthWide(item.rule)) return null;
  const start = atNoon(from);
  for (let i = 0; i < 380; i += 1) {
    const date = addDays(start, i);
    const h = toHijri(date, opts);
    if (ruleMatches(item.rule, h.month, h.day, date.getDay())) return date;
  }
  return null;
}

export function countShawwal(keys: string[], year: number, opts: HijriOpts): number {
  let count = 0;
  for (const key of keys) {
    const [ys, ms, ds] = key.split("-");
    const date = new Date(Number(ys), Number(ms) - 1, Number(ds), 12);
    const h = toHijri(date, opts);
    if (h.year === year && h.month === 10 && h.day > 1 && h.day <= 30) count += 1;
  }
  return count;
}
