import { playCall, playSoft, pulse } from "@/lib/audio";
import { OCCASIONS } from "@/lib/content";
import { dayView, fastReasons } from "@/lib/day";
import { tx } from "@/lib/i18n";
import { addDays, atNoon, dayKey, today, toHijri } from "@/lib/hijri";
import { PRAYER_NAMES, prayerDay, tomorrowFajr } from "@/lib/prayer";
import { hijriOpts, useNur } from "@/lib/store";

const HOLIDAYS = new Set(["eid-fitr", "eid-adha", "arafah", "ashura", "ramadan", "laylat"]);
const session = new Set<string>();

function seen(key: string): boolean {
  if (session.has(key)) return true;
  try {
    const raw = localStorage.getItem("nur-notify-log");
    const obj = raw ? (JSON.parse(raw) as Record<string, number>) : {};
    if (obj[key]) {
      session.add(key);
      return true;
    }
  } catch {
    return false;
  }
  return false;
}

function mark(key: string) {
  session.add(key);
  try {
    const raw = localStorage.getItem("nur-notify-log");
    const obj = raw ? (JSON.parse(raw) as Record<string, number>) : {};
    obj[key] = Date.now();
    const cutoff = Date.now() - 4 * 86400000;
    for (const [id, time] of Object.entries(obj)) {
      if (time < cutoff) delete obj[id];
    }
    localStorage.setItem("nur-notify-log", JSON.stringify(obj));
  } catch {
    /* ignore quota */
  }
}

function within(now: number, target: number): boolean {
  return now >= target && now - target < 2 * 60 * 1000;
}

function ping(title: string, body: string) {
  if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
  try {
    new Notification(title, { body, silent: true });
  } catch {
    /* embedded preview may block notifications */
  }
}

export function tickReminders() {
  const state = useNur.getState();
  if (!state.onboarded) return;
  const now = new Date();
  const noon = today();
  const opts = hijriOpts(state);
  const nowMs = now.getTime();

  if (state.place && state.adhan !== "off") {
    const slots = prayerDay(noon, state.place, state.method, state.madhab, opts);
    const fajrNext = tomorrowFajr(noon, state.place, state.method, state.madhab, opts);
    const watch = [
      ...slots.filter((slot) => slot.id !== "sunrise"),
      ...(fajrNext ? [{ id: "fajr" as const, time: fajrNext }] : []),
    ];
    for (const slot of watch) {
      const target = slot.time.getTime() - state.lead * 60000;
      const key = `prayer-${dayKey(slot.time)}-${slot.id}-${state.lead}`;
      if (!within(nowMs, target) || seen(key)) continue;
      mark(key);
      const name = tx(state.lang, PRAYER_NAMES[slot.id]);
      ping("Нур", name);
      if (state.adhan === "soft") void playSoft().catch(() => {});
      if (state.adhan === "call") void playCall().catch(() => {});
      if (state.adhan === "vibrate" || state.vibrate) pulse([180, 80, 180, 80, 240]);
    }
  }

  const hour = now.getHours();
  const minute = now.getMinutes();
  if (state.holidayReminders && hour === 8 && minute < 2) {
    const view = dayView(noon, opts, state.showMawlid);
    for (const item of view.heroes) {
      if (!HOLIDAYS.has(item.id)) continue;
      const key = `morn-${dayKey(noon)}-${item.id}`;
      if (seen(key)) continue;
      mark(key);
      ping("Нур", tx(state.lang, item.name));
    }
  }
  if (state.holidayReminders && hour === 18 && minute < 2) {
    const next = dayView(addDays(noon, 1), opts, state.showMawlid);
    for (const item of next.heroes) {
      if (!HOLIDAYS.has(item.id)) continue;
      const key = `eve-${dayKey(noon)}-${item.id}`;
      if (seen(key)) continue;
      mark(key);
      ping("Нур", tx(state.lang, item.name));
    }
  }
  if (state.fastingReminder && hour === 20 && minute < 2) {
    const tomorrow = addDays(noon, 1);
    const h = toHijri(tomorrow, opts);
    const reasons = fastReasons(h, tomorrow.getDay());
    if (reasons.length > 0) {
      const key = `fast-${dayKey(noon)}`;
      if (!seen(key)) {
        mark(key);
        ping(
          "Нур",
          tx(state.lang, {
            ru: "Завтра сунна-пост",
            ar: "غداً صيام سنة",
            en: "A Sunnah fast tomorrow",
          }),
        );
      }
    }
  }
  if (hour === 8 && minute < 2) {
    const keyDay = dayKey(noon);
    if (state.reminders.includes(keyDay)) {
      const key = `user-${keyDay}`;
      if (!seen(key)) {
        mark(key);
        ping(
          "Нур",
          tx(state.lang, { ru: "Напоминание об этом дне", ar: "تذكير بهذا اليوم", en: "Reminder for this day" }),
        );
      }
    }
  }
}

export const REMINDER_OCCASIONS = OCCASIONS;

export function atMorning(date: Date): Date {
  const noon = atNoon(date);
  return new Date(noon.getFullYear(), noon.getMonth(), noon.getDate(), 8, 0, 0, 0);
}
