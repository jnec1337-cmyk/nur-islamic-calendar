import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { dayView, marksFor } from "@/lib/day";
import { gregorianLong, gregorianShort, weekdayLong, WEEKDAYS_MON } from "@/lib/format";
import {
  dayKey,
  digits,
  fromHijri,
  mondayIndex,
  monthDates,
  monthMeta,
  shiftMonth,
  toHijri,
  today,
  yearLabel,
  type HijriDate,
} from "@/lib/hijri";
import { tx, type Tri } from "@/lib/i18n";
import { hijriOpts, useNur } from "@/lib/store";
import { Card, Primary, Sheet } from "@/components/nur/ui";

export function CalendarScreen() {
  const lang = useNur((s) => s.lang);
  const mode = useNur((s) => s.hijriMode);
  const offset = useNur((s) => s.hijriOffset);
  const showMawlid = useNur((s) => s.showMawlid);
  const reminders = useNur((s) => s.reminders);
  const toggleReminder = useNur((s) => s.toggleReminder);
  const setMode = useNur((s) => s.setHijriMode);
  const setOffset = useNur((s) => s.setOffset);
  const opts = useMemo(() => ({ mode, offset }), [mode, offset]);
  const initial = toHijri(today(), opts);
  const [cursor, setCursor] = useState<HijriDate>({ year: initial.year, month: initial.month, day: 1 });
  const [view, setView] = useState<"month" | "year">("month");
  const [picked, setPicked] = useState<string | null>(null);
  const startX = useRef<number | null>(null);
  const days = useMemo(() => monthDates(cursor.year, cursor.month, opts), [cursor.year, cursor.month, opts]);
  const month = monthMeta(cursor.month);
  const blanks = days[0] ? mondayIndex(days[0]) : 0;
  const cells: (Date | null)[] = [...Array.from({ length: blanks }, () => null), ...days];
  while (cells.length % 7 !== 0) cells.push(null);
  const pickedDate = picked ? days.find((date) => dayKey(date) === picked) ?? null : null;
  const detail = pickedDate ? dayView(pickedDate, opts, showMawlid) : null;

  function move(delta: number) {
    const next = shiftMonth(cursor.year, cursor.month, delta);
    if (next) setCursor({ year: next.year, month: next.month, day: 1 });
  }

  return (
    <div className="px-4 pb-6 pt-4">
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
        <button type="button" className="flex size-11 items-center justify-center" onClick={() => move(view === "year" ? -12 : -1)} aria-label="prev">
          <ChevronLeft className="size-6 rtl:rotate-180" />
        </button>
        <div className="min-w-0 text-center">
          <p className={view === "year" ? "text-xl font-semibold text-ink" : "font-arabic text-xl leading-loose text-ink"}>
            {view === "year" ? yearLabel(cursor.year, lang) : month.ar}
          </p>
          {view === "month" ? (
            <p className="text-sm text-soft">
              {lang === "ar" ? month.ru : lang === "en" ? month.en : month.ru} · {yearLabel(cursor.year, lang)}
            </p>
          ) : null}
        </div>
        <button type="button" className="flex size-11 items-center justify-center" onClick={() => move(view === "year" ? 12 : 1)} aria-label="next">
          <ChevronRight className="size-6 rtl:rotate-180" />
        </button>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setMode(mode === "umm" ? "calc" : "umm")}
          className="rounded-full bg-chip px-3 py-2 text-xs text-ink"
        >
          {mode === "umm"
            ? tx(lang, { ru: "Умм аль-Кура", ar: "أم القرى", en: "Umm al-Qura" })
            : tx(lang, { ru: "Расчётный", ar: "حسابي", en: "Calculated" })}
        </button>
        {[-2, -1, 0, 1, 2].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setOffset(value)}
            className={`rounded-full px-3 py-2 text-xs ${offset === value ? "bg-header text-cream" : "bg-chip text-ink"}`}
          >
            {value > 0 ? `+${value}` : value}
          </button>
        ))}
        <button
          type="button"
          className="rounded-full bg-chip px-3 py-2 text-xs text-goldink"
          onClick={() => {
            const now = toHijri(today(), opts);
            setCursor({ year: now.year, month: now.month, day: 1 });
            setView("month");
          }}
        >
          {tx(lang, { ru: "Сегодня", ar: "اليوم", en: "Today" })}
        </button>
      </div>

      {view === "month" ? (
        <div
          onTouchStart={(event) => {
            startX.current = event.changedTouches[0]?.clientX ?? null;
          }}
          onTouchEnd={(event) => {
            if (startX.current == null) return;
            const dx = (event.changedTouches[0]?.clientX ?? 0) - startX.current;
            startX.current = null;
            if (Math.abs(dx) < 48) return;
            const forward = lang === "ar" ? dx > 0 : dx < 0;
            move(forward ? 1 : -1);
          }}
        >
          <div className="mb-1 grid grid-cols-7 gap-1">
            {WEEKDAYS_MON[lang].map((name, index) => (
              <p key={name} className={`py-1 text-center text-xs ${index === 4 ? "text-goldink" : "text-soft"}`}>
                {name}
              </p>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((date, index) => {
              if (!date) return <span key={`e-${index}`} />;
              const h = toHijri(date, opts);
              const mark = marksFor(h, date.getDay(), showMawlid);
              const isToday = dayKey(date) === dayKey(today());
              return (
                <button
                  key={dayKey(date)}
                  type="button"
                  onClick={() => setPicked(dayKey(date))}
                  className={`relative flex h-14 flex-col items-center justify-center rounded-2xl ${
                    isToday ? "bg-header text-cream" : "bg-card text-ink"
                  } ${mark.gold ? "ring-2 ring-gold" : ""} ${mark.ramadan && !isToday ? "border-b-2 border-mark" : ""}`}
                >
                  <span className="text-sm font-semibold tabular-nums">{digits(h.day, lang)}</span>
                  <span className={`text-xs ${isToday ? "text-cream" : "text-soft"}`}>{digits(date.getDate(), lang)}</span>
                  <span className="absolute bottom-1 flex gap-0.5">
                    {mark.sunnah ? <i className="size-1.5 rounded-full bg-mark" /> : null}
                    {mark.forbidden ? <i className="size-1.5 rounded-full bg-forbid" /> : null}
                    {mark.info ? <i className="size-1.5 rounded-full bg-gold" /> : null}
                  </span>
                  {mark.crescent ? <span className="absolute end-1 top-1 size-2 rounded-full border border-gold" /> : null}
                </button>
              );
            })}
          </div>
          <Legend />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 12 }, (_, index) => {
            const m = index + 1;
            const meta = monthMeta(m);
            const start = fromHijri({ year: cursor.year, month: m, day: 1 }, opts);
            const active = m === cursor.month;
            return (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setCursor({ year: cursor.year, month: m, day: 1 });
                  setView("month");
                }}
                className={`rounded-3xl border px-3 py-3 text-start ${active ? "border-gold bg-chip" : "border-line bg-card"}`}
              >
                <p className="font-arabic text-lg leading-loose">{meta.ar}</p>
                <p className="text-xs text-soft">{lang === "en" ? meta.en : meta.ru}</p>
                {start ? <p className="mt-1 text-xs text-soft">{gregorianShort(start, lang)}</p> : null}
              </button>
            );
          })}
        </div>
      )}

      {detail ? (
        <Sheet
          title={`${digits(detail.hijri.day, lang)} ${monthMeta(detail.hijri.month).ar}`}
          onClose={() => setPicked(null)}
        >
          <p className="text-sm text-soft">
            {lang === "ar" ? monthMeta(detail.hijri.month).ru : lang === "en" ? monthMeta(detail.hijri.month).en : monthMeta(detail.hijri.month).ru} · {yearLabel(detail.hijri.year, lang)}
          </p>
          <p className="text-sm text-ink">
            {weekdayLong(detail.date, lang)} · {gregorianLong(detail.date, lang)}
          </p>
          <p className="mt-3 text-sm font-medium text-ink">
            {detail.forbidden
              ? tx(lang, { ru: "Пост не допускается", ar: "لا يُصام", en: "Fasting is not allowed" })
              : detail.obligatory
                ? tx(lang, { ru: "Обязательный пост", ar: "صيام واجب", en: "Obligatory fast" })
                : detail.reasons.length
                  ? tx(lang, { ru: "Рекомендован пост по сунне", ar: "صيام مستحب", en: "A Sunnah fast" })
                  : tx(lang, { ru: "Обычный день", ar: "يوم عادي", en: "An ordinary day" })}
          </p>
          {detail.matched.map((item) => (
            <Card key={item.id} className="mt-3">
              <p className="font-arabic text-lg leading-loose">{tx(lang, item.name)}</p>
              <p className="text-sm leading-6 text-ink">{tx(lang, item.meaning)}</p>
              <p className="mt-2 text-sm leading-6 text-ink">{tx(lang, item.dos)}</p>
              <p className="mt-1 text-sm leading-6 text-soft">{tx(lang, item.dont)}</p>
              <p className="mt-2 font-arabic text-base leading-loose">{item.quote.ar}</p>
              <p className="text-sm leading-6">{tx(lang, item.quote.text)}</p>
              <p className="text-xs text-soft">{tx(lang, item.quote.ref)}</p>
            </Card>
          ))}
          <div className="mt-4">
            <Primary onClick={() => toggleReminder(dayKey(detail.date))}>
              {reminders.includes(dayKey(detail.date))
                ? tx(lang, { ru: "Напоминание стоит", ar: "التذكير مضبوط", en: "Reminder set" })
                : tx(lang, { ru: "Добавить напоминание", ar: "إضافة تذكير", en: "Add a reminder" })}
            </Primary>
            <p className="mt-2 text-center text-xs text-soft">
              {tx(lang, {
                ru: "Утром в этот день, если разрешены уведомления.",
                ar: "صباحاً في هذا اليوم إذا سُمح بالإشعارات.",
                en: "In the morning, if notifications are allowed.",
              })}
            </p>
          </div>
        </Sheet>
      ) : null}
    </div>
  );
}

function Legend() {
  const lang = useNur((s) => s.lang);
  const items: { swatch: string; text: Tri }[] = [
    { swatch: "bg-mark", text: { ru: "сунна-пост", ar: "صيام سنة", en: "Sunnah fast" } },
    { swatch: "bg-gold", text: { ru: "великий день", ar: "يوم عظيم", en: "a great day" } },
    { swatch: "bg-forbid", text: { ru: "пост нельзя", ar: "لا يُصام", en: "no fasting" } },
    { swatch: "bg-ink", text: { ru: "начало месяца", ar: "غرة", en: "new month" } },
  ];
  return (
    <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1">
      {items.map((item) => (
        <li key={item.text.ru} className="flex items-center gap-1 text-xs text-soft">
          <i className={`size-2 rounded-full ${item.swatch}`} />
          {tx(lang, item.text)}
        </li>
      ))}
    </ul>
  );
}
