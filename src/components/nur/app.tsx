import { BookOpen, CalendarDays, Ellipsis, Moon, ScrollText, SunMedium } from "lucide-react";
import { useEffect, useState } from "react";
import { CalendarScreen } from "@/components/nur/calendar";
import { BirthdayScreen } from "@/components/nur/birthday";
import {
  AboutScreen,
  AyahScreen,
  ConverterScreen,
  DuasScreen,
  FastingScreen,
  PrivacyScreen,
  WidgetsScreen,
} from "@/components/nur/extras";
import { MoreScreen } from "@/components/nur/more";
import { NamesScreen } from "@/components/nur/names";
import { NavProvider, type NavApi, type PageName, type Tab } from "@/components/nur/nav";
import { Onboarding } from "@/components/nur/onboarding";
import { PrayerScreen } from "@/components/nur/prayer";
import { ScheduleScreen } from "@/components/nur/schedule";
import { SettingsScreen } from "@/components/nur/settings";
import { SunnahScreen } from "@/components/nur/sunnah";
import { Today } from "@/components/nur/today";
import { tx, type Tri } from "@/lib/i18n";
import { tickReminders } from "@/lib/notify";
import { useNur } from "@/lib/store";

const TABS: { id: Tab; icon: typeof Moon; label: Tri }[] = [
  { id: "today", icon: SunMedium, label: { ru: "Сегодня", ar: "اليوم", en: "Today" } },
  { id: "calendar", icon: CalendarDays, label: { ru: "Календарь", ar: "التقويم", en: "Calendar" } },
  { id: "prayer", icon: Moon, label: { ru: "Намаз", ar: "الصلاة", en: "Prayer" } },
  { id: "names", icon: ScrollText, label: { ru: "Имена", ar: "الأسماء", en: "Names" } },
  { id: "sunnah", icon: BookOpen, label: { ru: "Сунна", ar: "السنة", en: "Sunnah" } },
  { id: "more", icon: Ellipsis, label: { ru: "Ещё", ar: "المزيد", en: "More" } },
];

export function NurApp() {
  const [tab, setTab] = useState<Tab>("today");
  const [page, setPage] = useState<PageName | null>(null);
  const [qiblaTick, setQiblaTick] = useState(0);
  const onboarded = useNur((s) => s.onboarded);
  const lang = useNur((s) => s.lang);
  const theme = useNur((s) => s.theme);

  useEffect(() => {
    void useNur.persist.rehydrate();
  }, []);

  useEffect(() => {
    const apply = () => {
      const mode = useNur.getState().theme;
      const dark =
        mode === "dark" ||
        (mode !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches);
      document.documentElement.classList.toggle("dark", dark);
    };
    apply();
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = lang === "ar" ? "ar" : lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  useEffect(() => {
    if (!import.meta.env.PROD || !("serviceWorker" in navigator)) return;
    void navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);

  useEffect(() => {
    if (!onboarded) return;
    const run = () => {
      try {
        tickReminders();
      } catch {
        /* reminders must never break the screen */
      }
    };
    run();
    const id = window.setInterval(run, 15000);
    const onVis = () => {
      if (document.visibilityState === "visible") run();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [onboarded]);

  const api: NavApi = {
    tab,
    page,
    qiblaTick,
    goTab: (next) => {
      setPage(null);
      setTab(next);
    },
    goPage: (next) => setPage(next),
    goQibla: () => {
      setPage(null);
      setTab("prayer");
      setQiblaTick((value) => value + 1);
    },
    back: () => setPage(null),
  };

  let body = <Today />;
  if (!onboarded) body = <Onboarding />;
  else if (page === "settings") body = <SettingsScreen />;
  else if (page === "fasting") body = <FastingScreen />;
  else if (page === "duas") body = <DuasScreen />;
  else if (page === "ayah") body = <AyahScreen />;
  else if (page === "about") body = <AboutScreen />;
  else if (page === "privacy") body = <PrivacyScreen />;
  else if (page === "converter") body = <ConverterScreen />;
  else if (page === "widgets") body = <WidgetsScreen />;
  else if (page === "schedule") body = <ScheduleScreen />;
  else if (page === "birthday") body = <BirthdayScreen />;
  else if (tab === "calendar") body = <CalendarScreen />;
  else if (tab === "prayer") body = <PrayerScreen />;
  else if (tab === "names") body = <NamesScreen />;
  else if (tab === "sunnah") body = <SunnahScreen />;
  else if (tab === "more") body = <MoreScreen />;

  return (
    <div className="min-h-dvh bg-night">
      <div
        dir={lang === "ar" ? "rtl" : "ltr"}
        className="relative mx-auto flex h-dvh w-full max-w-md flex-col overflow-hidden bg-canvas text-ink"
      >
        <NavProvider value={api}>
          <div key={`${page ?? tab}-${onboarded ? "in" : "out"}`} className="rise flex min-h-0 flex-1 flex-col overflow-hidden">
            {onboarded && page == null && (tab === "names" || tab === "prayer") ? (
              body
            ) : (
              <div className="min-h-0 flex-1 overflow-y-auto">{body}</div>
            )}
          </div>
          {onboarded ? (
              <nav className="safe-bottom grid grid-cols-6 border-t border-line bg-card">
                {TABS.map((item) => {
                  const active = page == null && tab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => api.goTab(item.id)}
                      className={`flex flex-col items-center gap-1 px-0.5 py-2 text-[10px] leading-tight ${active ? "text-goldink" : "text-soft"}`}
                    >
                      <item.icon className="size-4" />
                      <span>{tx(lang, item.label)}</span>
                      <span className={`h-0.5 w-6 rounded-full ${active ? "bg-gold" : "bg-transparent"}`} />
                    </button>
                  );
                })}
              </nav>
            ) : null}
          </NavProvider>
      </div>
    </div>
  );
}
