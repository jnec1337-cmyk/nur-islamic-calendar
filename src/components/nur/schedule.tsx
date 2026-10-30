import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNav } from "@/components/nur/nav";
import { PageHead } from "@/components/nur/ui";
import { formatClock } from "@/lib/format";
import { digits } from "@/lib/hijri";
import { localeOf, tx, type Lang } from "@/lib/i18n";
import { PRAYER_NAMES, prayerDay, type PrayerId } from "@/lib/prayer";
import { hijriOpts, useNur } from "@/lib/store";

const COLS: PrayerId[] = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"];

const HEAD: Record<PrayerId, { ru: string; ar: string; en: string }> = {
  ...PRAYER_NAMES,
  sunrise: { ru: "Шурук", ar: "الشروق", en: "Shuruq" },
};

export function ScheduleScreen() {
  const nav = useNav();
  const lang = useNur((s) => s.lang);
  const place = useNur((s) => s.place);
  const method = useNur((s) => s.method);
  const madhab = useNur((s) => s.madhab);
  const mode = useNur((s) => s.hijriMode);
  const offset = useNur((s) => s.hijriOffset);
  const opts = useMemo(() => hijriOpts({ hijriMode: mode, hijriOffset: offset }), [mode, offset]);
  const today = new Date();
  const [view, setView] = useState<"month" | "year">("month");
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const tables = useMemo(() => {
    if (!place) return [];
    const months = view === "year" ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] : [month];
    return months.map((index) => {
      const count = new Date(year, index + 1, 0).getDate();
      const rows = [];
      for (let day = 1; day <= count; day++) {
        const date = new Date(year, index, day, 12, 0, 0, 0);
        rows.push({ day, slots: prayerDay(date, place, method, madhab, opts) });
      }
      return { month: index, rows };
    });
  }, [place, view, year, month, method, madhab, opts]);

  useEffect(() => {
    const row = document.getElementById("nur-today-prayer");
    row?.scrollIntoView({ block: "center" });
  }, [view, year, month]);

  function move(delta: number) {
    if (view === "year") {
      setYear((value) => value + delta);
      return;
    }
    const next = new Date(year, month + delta, 1);
    setYear(next.getFullYear());
    setMonth(next.getMonth());
  }

  const title =
    view === "year"
      ? digits(year, lang)
      : `${monthName(year, month, lang)} ${digits(year, lang)}`;

  return (
    <div className="pb-6">
      <PageHead title={tx(lang, { ru: "Расписание", ar: "الجدول", en: "Timetable" })} onBack={nav.back} />
      <div className="px-3">
        <div className="mb-3 flex rounded-full bg-chip p-1">
          {(["month", "year"] as const).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setView(id)}
              className={`h-10 flex-1 rounded-full text-sm ${view === id ? "bg-header text-cream" : "text-ink"}`}
            >
              {id === "month"
                ? tx(lang, { ru: "Месяц", ar: "شهر", en: "Month" })
                : tx(lang, { ru: "Год", ar: "سنة", en: "Year" })}
            </button>
          ))}
        </div>
        <div className="mb-3 flex items-center justify-between gap-2">
          <button type="button" className="flex size-11 items-center justify-center" onClick={() => move(-1)} aria-label="prev">
            <ChevronLeft className="size-6 rtl:rotate-180" />
          </button>
          <p className="text-lg font-semibold text-ink">{title}</p>
          <button type="button" className="flex size-11 items-center justify-center" onClick={() => move(1)} aria-label="next">
            <ChevronRight className="size-6 rtl:rotate-180" />
          </button>
        </div>
        {!place ? (
          <p className="px-2 text-sm leading-6 text-soft">
            {tx(lang, { ru: "Сначала выберите город.", ar: "اختر المدينة أولاً.", en: "Choose a city first." })}
          </p>
        ) : (
          <div className="space-y-4">
            {tables.map((table) => (
              <MonthTable
                key={table.month}
                year={year}
                month={table.month}
                rows={table.rows}
                lang={lang}
                tz={place.tz}
                showTitle={view === "year"}
                today={today}
                onOpen={
                  view === "year"
                    ? () => {
                        setMonth(table.month);
                        setView("month");
                      }
                    : undefined
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MonthTable({
  year,
  month,
  rows,
  lang,
  tz,
  showTitle,
  today,
  onOpen,
}: {
  year: number;
  month: number;
  rows: { day: number; slots: { id: PrayerId; time: Date }[] }[];
  lang: Lang;
  tz?: string;
  showTitle: boolean;
  today: Date;
  onOpen?: () => void;
}) {
  const isToday = (day: number) =>
    today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
  return (
    <section className="overflow-hidden rounded-3xl border border-line bg-card">
      {showTitle ? (
        <button type="button" onClick={onOpen} className="w-full px-3 py-2 text-center text-sm font-semibold text-ink">
          {monthName(year, month, lang)}
        </button>
      ) : null}
      <div className="grid grid-cols-[1.7rem_repeat(6,minmax(0,1fr))] border-t border-line text-[10px] leading-tight">
        <div className="bg-chip py-2" />
        {COLS.map((id) => (
          <div key={id} className="bg-chip px-0.5 py-2 text-center text-soft">
            {tx(lang, HEAD[id])}
          </div>
        ))}
        {rows.map((row) => {
          const mark = isToday(row.day);
          return (
            <div key={row.day} className="contents">
              <div
                id={mark ? "nur-today-prayer" : undefined}
                className={`border-t border-line py-1.5 text-center tabular-nums ${mark ? "bg-header text-cream" : "text-soft"}`}
              >
                {digits(row.day, lang)}
              </div>
              {COLS.map((id) => {
                const slot = row.slots.find((item) => item.id === id);
                const clock = slot ? digits(formatClock(slot.time, tz), lang) : "—";
                return (
                  <div
                    key={id}
                    className={`border-t border-line py-1.5 text-center tabular-nums ${mark ? "bg-header text-cream" : "text-ink"}`}
                  >
                    {clock}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function monthName(year: number, month: number, lang: Lang): string {
  const raw = new Intl.DateTimeFormat(localeOf(lang), { month: "long" }).format(new Date(year, month, 1));
  return raw.charAt(0).toLocaleUpperCase(localeOf(lang)) + raw.slice(1);
}
