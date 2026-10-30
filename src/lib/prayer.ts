import {
  CalculationMethod,
  Coordinates,
  HighLatitudeRule,
  Madhab,
  PolarCircleResolution,
  PrayerTimes,
  Qibla,
} from "adhan";
import { addDays, atNoon, toHijri, type HijriOpts } from "@/lib/hijri";
import { moscowSlots } from "@/lib/moscow-timetable";

export type PrayerId = "fajr" | "sunrise" | "dhuhr" | "asr" | "maghrib" | "isha";
export type PrayerMethodId = "MoscowOfficial" | "UmmAlQura" | "MWL" | "ISNA" | "Egypt" | "Tehran" | "Russia";
export type MadhabId = "Shafi" | "Hanafi";

export type PrayerSlot = {
  id: PrayerId;
  time: Date;
};

const ORDER: PrayerId[] = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"];

export const PRAYER_NAMES: Record<PrayerId, { ru: string; ar: string; en: string }> = {
  fajr: { ru: "Фаджр", ar: "الفجر", en: "Fajr" },
  sunrise: { ru: "Восход", ar: "الشروق", en: "Sunrise" },
  dhuhr: { ru: "Зухр", ar: "الظهر", en: "Dhuhr" },
  asr: { ru: "Аср", ar: "العصر", en: "Asr" },
  maghrib: { ru: "Магриб", ar: "المغرب", en: "Maghrib" },
  isha: { ru: "Иша", ar: "العشاء", en: "Isha" },
};

export const SALAH: PrayerId[] = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

function paramsFor(method: Exclude<PrayerMethodId, "MoscowOfficial">, madhab: MadhabId, hijriMonth: number) {
  const params =
    method === "UmmAlQura"
      ? CalculationMethod.UmmAlQura()
      : method === "MWL"
        ? CalculationMethod.MuslimWorldLeague()
        : method === "ISNA"
          ? CalculationMethod.NorthAmerica()
          : method === "Egypt"
            ? CalculationMethod.Egyptian()
            : method === "Tehran"
              ? CalculationMethod.Tehran()
              : CalculationMethod.Other();
  if (method === "Russia") {
    params.fajrAngle = 16;
    params.ishaAngle = 15;
  }
  params.madhab = madhab === "Hanafi" ? Madhab.Hanafi : Madhab.Shafi;
  params.polarCircleResolution = PolarCircleResolution.AqrabYaum;
  if (method === "UmmAlQura" && hijriMonth === 9) params.adjustments.isha += 30;
  return params;
}

export function prayerDay(
  date: Date,
  place: { lat: number; lng: number },
  method: PrayerMethodId,
  madhab: MadhabId,
  opts: HijriOpts,
): PrayerSlot[] {
  if (method === "MoscowOfficial") {
    return moscowSlots(date.getFullYear(), date.getMonth() + 1, date.getDate());
  }
  const noon = atNoon(date);
  const hijri = toHijri(noon, opts);
  const coordinates = new Coordinates(place.lat, place.lng);
  const params = paramsFor(method, madhab, hijri.month);
  params.highLatitudeRule = HighLatitudeRule.recommended(coordinates);
  const times = new PrayerTimes(coordinates, noon, params);
  const map: Record<PrayerId, Date> = {
    fajr: times.fajr,
    sunrise: times.sunrise,
    dhuhr: times.dhuhr,
    asr: times.asr,
    maghrib: times.maghrib,
    isha: times.isha,
  };
  return ORDER.map((id) => ({ id, time: map[id] })).filter((slot) => !Number.isNaN(slot.time?.getTime?.()));
}

export function currentSalah(now: Date, slots: PrayerSlot[]): PrayerId | null {
  const at = (id: PrayerId) => slots.find((slot) => slot.id === id)?.time.getTime();
  const t = now.getTime();
  const fajr = at("fajr");
  const sunrise = at("sunrise");
  const dhuhr = at("dhuhr");
  const asr = at("asr");
  const maghrib = at("maghrib");
  const isha = at("isha");
  if (isha != null && t >= isha) return "isha";
  if (maghrib != null && t >= maghrib) return "maghrib";
  if (asr != null && t >= asr) return "asr";
  if (dhuhr != null && t >= dhuhr) return "dhuhr";
  if (fajr != null && sunrise != null && t >= fajr && t < sunrise) return "fajr";
  return null;
}

export function nextMark(
  now: Date,
  slots: PrayerSlot[],
  tomorrowFajr: Date | null,
): { id: PrayerId; time: Date; tomorrow: boolean } | null {
  for (const slot of slots) {
    if (slot.time.getTime() > now.getTime()) return { id: slot.id, time: slot.time, tomorrow: false };
  }
  if (tomorrowFajr && !Number.isNaN(tomorrowFajr.getTime())) {
    return { id: "fajr", time: tomorrowFajr, tomorrow: true };
  }
  return null;
}

export function qiblaBearing(lat: number, lng: number): number {
  return Qibla(new Coordinates(lat, lng));
}

export const KAABA = { lat: 21.4225, lng: 39.8262 };

export function distanceKm(lat: number, lng: number): number {
  const r = 6371;
  const dLat = ((KAABA.lat - lat) * Math.PI) / 180;
  const dLng = ((KAABA.lng - lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat * Math.PI) / 180) * Math.cos((KAABA.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * r * Math.asin(Math.sqrt(a)));
}

export function tomorrowFajr(
  date: Date,
  place: { lat: number; lng: number },
  method: PrayerMethodId,
  madhab: MadhabId,
  opts: HijriOpts,
): Date | null {
  const slots = prayerDay(addDays(date, 1), place, method, madhab, opts);
  return slots.find((slot) => slot.id === "fajr")?.time ?? null;
}
