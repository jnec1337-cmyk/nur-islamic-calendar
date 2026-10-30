import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { HijriMode } from "@/lib/hijri";
import type { Lang } from "@/lib/i18n";
import type { MadhabId, PrayerMethodId } from "@/lib/prayer";

export type ThemeMode = "light" | "dark" | "system";
export type AdhanSound = "off" | "soft" | "call" | "vibrate";
export type LeadMin = 0 | 5 | 10 | 15;
export type CompassUnit = "deg" | "card";

export type Place = {
  source: "city" | "gps";
  cityId?: string;
  lat: number;
  lng: number;
  tz?: string;
};

type NurState = {
  lang: Lang;
  theme: ThemeMode;
  method: PrayerMethodId;
  madhab: MadhabId;
  hijriMode: HijriMode;
  hijriOffset: number;
  place: Place | null;
  adhan: AdhanSound;
  lead: LeadMin;
  vibrate: boolean;
  holidayReminders: boolean;
  fastingReminder: boolean;
  showMawlid: boolean;
  compassUnit: CompassUnit;
  onboarded: boolean;
  fasted: string[];
  reminders: string[];
  birthday: string;
  setLang: (lang: Lang) => void;
  setTheme: (theme: ThemeMode) => void;
  setMethod: (method: PrayerMethodId) => void;
  setMadhab: (madhab: MadhabId) => void;
  setHijriMode: (mode: HijriMode) => void;
  setOffset: (offset: number) => void;
  setPlace: (place: Place | null) => void;
  setAdhan: (adhan: AdhanSound) => void;
  setLead: (lead: LeadMin) => void;
  setVibrate: (vibrate: boolean) => void;
  setHolidayReminders: (value: boolean) => void;
  setFastingReminder: (value: boolean) => void;
  setShowMawlid: (value: boolean) => void;
  setCompassUnit: (unit: CompassUnit) => void;
  setOnboarded: (value: boolean) => void;
  toggleFast: (key: string) => void;
  toggleReminder: (key: string) => void;
  setBirthday: (birthday: string) => void;
};

export const useNur = create<NurState>()(
  persist(
    (set) => ({
      lang: "ru",
      theme: "system",
      method: "Russia",
      madhab: "Hanafi",
      hijriMode: "umm",
      hijriOffset: 0,
      place: null,
      adhan: "off",
      lead: 0,
      vibrate: false,
      holidayReminders: true,
      fastingReminder: true,
      showMawlid: false,
      compassUnit: "deg",
      onboarded: false,
      fasted: [],
      reminders: [],
      birthday: "",
      setLang: (lang) => set({ lang }),
      setTheme: (theme) => set({ theme }),
      setMethod: (method) => set({ method }),
      setMadhab: (madhab) => set({ madhab }),
      setHijriMode: (hijriMode) => set({ hijriMode }),
      setOffset: (hijriOffset) => set({ hijriOffset: Math.max(-2, Math.min(2, hijriOffset)) }),
      setPlace: (place) => set({ place }),
      setAdhan: (adhan) => set({ adhan }),
      setLead: (lead) => set({ lead }),
      setVibrate: (vibrate) => set({ vibrate }),
      setHolidayReminders: (holidayReminders) => set({ holidayReminders }),
      setFastingReminder: (fastingReminder) => set({ fastingReminder }),
      setShowMawlid: (showMawlid) => set({ showMawlid }),
      setCompassUnit: (compassUnit) => set({ compassUnit }),
      setOnboarded: (onboarded) => set({ onboarded }),
      toggleFast: (key) =>
        set((state) => ({
          fasted: state.fasted.includes(key) ? state.fasted.filter((item) => item !== key) : [...state.fasted, key],
        })),
      toggleReminder: (key) =>
        set((state) => ({
          reminders: state.reminders.includes(key)
            ? state.reminders.filter((item) => item !== key)
            : [...state.reminders, key],
        })),
      setBirthday: (birthday) => set({ birthday }),
    }),
    { name: "nur-settings", skipHydration: true },
  ),
);

export function hijriOpts(state: Pick<NurState, "hijriMode" | "hijriOffset">) {
  return { mode: state.hijriMode, offset: state.hijriOffset };
}
