import { BookOpen, CalendarDays, Compass, Moon, Settings } from "lucide-react";
import { useMemo } from "react";
import { useNav } from "@/components/nur/nav";
import { SunsetMosque } from "@/components/nur/ornament";
import { Card, Primary } from "@/components/nur/ui";
import { OCCASIONS } from "@/lib/content";
import { dayView, monthBanner, wisdomFor, type FastReason } from "@/lib/day";
import { formatClock, formatRemain, gregorianLong, weekdayLong } from "@/lib/format";
import { addDays, dayKey, digits, monthMeta, toHijri, yearLabel } from "@/lib/hijri";
import { tx, type Tri } from "@/lib/i18n";
import { currentSalah, nextMark, PRAYER_NAMES, prayerDay, tomorrowFajr } from "@/lib/prayer";
import { hijriOpts, useNur } from "@/lib/store";
import { useNow } from "@/components/nur/use-now";

const REASON: Record<FastReason, Tri> = {
  mon: { ru: "понедельник", ar: "الاثنين", en: "Monday" },
  thu: { ru: "четверг", ar: "الخميس", en: "Thursday" },
  white: { ru: "белые дни", ar: "الأيام البيض", en: "the white days" },
  tasua: { ru: "Тасу‘а", ar: "تاسوعاء", en: "Tasua" },
  ashura: { ru: "Ашура", ar: "عاشوراء", en: "Ashura" },
  arafah: { ru: "день Арафа", ar: "يوم عرفة", en: "Arafah" },
  shawwal: { ru: "шесть дней шавваля", ar: "ست شوال", en: "Shawwal" },
};

const BANNER: Record<"ramadan" | "muharram" | "sacred", Tri> = {
  ramadan: { ru: "Рамадан — месяц обязательного поста", ar: "رمضان شهر الصيام الواجب", en: "Ramadan, the month of obligatory fasting" },
  muharram: {
    ru: "Мухаррам — лучший месяц для поста после Рамадана и один из запретных",
    ar: "المحرم أفضل الصيام بعد رمضان، وهو شهر حرام",
    en: "Muharram is the best fast after Ramadan, and a sacred month",
  },
  sacred: { ru: "Запретный месяц: берегите себя от обид", ar: "شهر حرام: يُعظم فيه اجتناب الظلم", en: "A sacred month: be especially careful of harm" },
};

export function Today() {
  const lang = useNur((s) => s.lang);
  const place = useNur((s) => s.place);
  const method = useNur((s) => s.method);
  const madhab = useNur((s) => s.madhab);
  const mode = useNur((s) => s.hijriMode);
  const offset = useNur((s) => s.hijriOffset);
  const showMawlid = useNur((s) => s.showMawlid);
  const nav = useNav();
  const now = useNow();
  const opts = useMemo(() => ({ mode, offset }), [mode, offset]);
  const key = dayKey(now);
  const view = useMemo(() => dayView(new Date(), opts, showMawlid), [key, opts, showMawlid]);
  const slots = useMemo(
    () => (place ? prayerDay(view.date, place, method, madhab, opts) : []),
    [place, view.date, method, madhab, opts],
  );
  const nextFajr = useMemo(
    () => (place ? tomorrowFajr(view.date, place, method, madhab, opts) : null),
    [place, view.date, method, madhab, opts],
  );
  const current = currentSalah(now, slots);
  const upcoming = nextMark(now, slots, nextFajr);
  const month = monthMeta(view.hijri.month);
  const localMonth = lang === "en" ? month.en : month.ru;
  const maghrib = slots.find((slot) => slot.id === "maghrib")?.time;
  const afterMaghrib = maghrib ? now.getTime() >= maghrib.getTime() && now.getDate() === view.date.getDate() : false;
  const nextHijri = toHijri(addDays(view.date, 1), opts);
  const banner = monthBanner(view.hijri);
  const hero = view.heroes[0];
  const wisdom = wisdomFor(view.date);
  const focus = hero ?? view.matched[0];

  const actions = [
    { id: "qibla", label: tx(lang, { ru: "Кибла", ar: "القبلة", en: "Qibla" }), icon: Compass, run: () => nav.goQibla() },
    { id: "cal", label: tx(lang, { ru: "Календарь", ar: "التقويم", en: "Calendar" }), icon: CalendarDays, run: () => nav.goTab("calendar") },
    { id: "fast", label: tx(lang, { ru: "Пост", ar: "الصيام", en: "Fast" }), icon: Moon, run: () => nav.goPage("fasting") },
    { id: "sunnah", label: tx(lang, { ru: "Сунна", ar: "السنة", en: "Sunnah" }), icon: BookOpen, run: () => nav.goTab("sunnah") },
    { id: "set", label: tx(lang, { ru: "Настройки", ar: "الإعدادات", en: "Settings" }), icon: Settings, run: () => nav.goPage("settings") },
  ];

  return (
    <div>
      <header className="relative overflow-hidden bg-header px-5 pb-10 pt-6 text-cream">
        <SunsetMosque className="pointer-events-none absolute inset-0 h-full w-full" />
        <div className="relative text-center [text-shadow:0_1px_10px_rgba(7,20,16,0.72)]">
          <p className="font-display text-xl leading-loose text-gold">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
          <p className="mt-1 text-7xl font-semibold leading-none tabular-nums">{digits(view.hijri.day, lang)}</p>
          <p className="font-arabic mt-2 text-2xl leading-loose text-gold">{month.ar}</p>
          {lang !== "ar" ? <p className="text-sm text-cream">{localMonth}</p> : <p className="text-sm text-cream">{month.ru}</p>}
          <p className="mt-1 text-sm tracking-wide">{yearLabel(view.hijri.year, lang)}</p>
          <p className="mt-3 text-sm capitalize text-cream">
            {weekdayLong(view.date, lang)} · {gregorianLong(view.date, lang)}
          </p>
          {view.weekday === 5 ? (
            <p className="mt-2 text-sm text-gold">
              {tx(lang, { ru: "Пятница — лучший день недели", ar: "الجمعة خير يوم طلعت عليه الشمس", en: "Friday is the best day the sun rises on" })}
            </p>
          ) : null}
          {afterMaghrib ? (
            <p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-cream">
              {tx(lang, {
                ru: `После заката по шариату начался следующий день: ${digits(nextHijri.day, "ru")} ${monthMeta(nextHijri.month).ru}`,
                ar: `بعد المغرب بدأ اليوم التالي شرعاً: ${digits(nextHijri.day, "ar")} ${monthMeta(nextHijri.month).ar}`,
                en: `After sunset the next day has begun: ${nextHijri.day} ${monthMeta(nextHijri.month).en}`,
              })}
            </p>
          ) : null}
        </div>
      </header>

      <div className="space-y-4 px-4 pb-6 pt-4">
        <Card>
          {upcoming ? (
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-xs text-soft">
                  {upcoming.id === "sunrise"
                    ? tx(lang, { ru: "Дальше", ar: "التالي", en: "Next" })
                    : tx(lang, { ru: "Следующий намаз", ar: "الصلاة التالية", en: "Next prayer" })}
                  {upcoming.tomorrow ? ` · ${tx(lang, { ru: "завтра", ar: "غداً", en: "tomorrow" })}` : ""}
                </p>
                <p className="text-xl font-semibold text-ink">{tx(lang, PRAYER_NAMES[upcoming.id])}</p>
                <p className="text-3xl font-semibold tabular-nums text-goldink">
                  {formatRemain(upcoming.time.getTime() - now.getTime())}
                </p>
              </div>
              <p className="text-lg font-semibold tabular-nums text-ink">{formatClock(upcoming.time, place?.tz)}</p>
            </div>
          ) : (
            <p className="mb-3 text-sm text-soft">
              {tx(lang, {
                ru: "Выберите город — и времена намаза посчитаются на устройстве.",
                ar: "اختر مدينة لتُحسب مواقيت الصلاة على الجهاز.",
                en: "Choose a city and prayer times are calculated on this device.",
              })}
            </p>
          )}
          {slots.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {slots.map((slot) => {
                const on = slot.id === current;
                const nxt = upcoming?.id === slot.id && !upcoming.tomorrow;
                return (
                  <div
                    key={slot.id}
                    className={`rounded-2xl px-2 py-2 ${on ? "bg-header text-cream" : nxt ? "bg-chip ring-2 ring-gold" : "bg-chip"}`}
                  >
                    <p className={`text-xs ${on ? "text-cream" : "text-soft"}`}>{tx(lang, PRAYER_NAMES[slot.id])}</p>
                    <p className="text-sm font-semibold tabular-nums">{formatClock(slot.time, place?.tz)}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <Primary onClick={() => nav.goPage("settings")}>
              {tx(lang, { ru: "Выбрать город", ar: "اختيار المدينة", en: "Choose a city" })}
            </Primary>
          )}
        </Card>

        <div className="grid grid-cols-5 gap-2">
          {actions.map((action) => (
            <button key={action.id} type="button" onClick={action.run} className="flex flex-col items-center gap-1 text-center">
              <span className="flex size-11 items-center justify-center rounded-full bg-header text-gold">
                <action.icon className="size-5" />
              </span>
              <span className="text-xs leading-4 text-ink">{action.label}</span>
            </button>
          ))}
        </div>

        {banner && !hero ? <p className="px-1 text-sm leading-5 text-soft">{tx(lang, BANNER[banner])}</p> : null}

        <Card>
          <p className="text-xs tracking-wide text-goldink">
            {tx(lang, { ru: "Сегодня по сунне", ar: "اليوم في السنة", en: "Today in the Sunnah" })}
          </p>
          {view.forbidden ? (
            <>
              <h2 className="mt-1 font-arabic text-xl leading-loose text-ink">{focus ? tx(lang, focus.name) : ""}</h2>
              <p className="text-sm font-medium text-forbid">
                {tx(lang, { ru: "Сегодня пост не допускается.", ar: "لا يُشرع الصيام اليوم.", en: "Fasting is not allowed today." })}
              </p>
              {focus ? <QuoteBlock quote={focus.quote} /> : null}
            </>
          ) : hero ? (
            <>
              <p className="font-arabic mt-1 text-xl leading-loose text-ink">{tx(lang, hero.name)}</p>
              {lang !== "ar" ? <p className="text-sm text-soft">{hero.name.ru}</p> : null}
              <p className="mt-2 text-sm leading-6 text-ink">{tx(lang, hero.meaning)}</p>
              <p className="mt-2 text-sm leading-6 text-ink">{tx(lang, hero.dos)}</p>
              {view.obligatory ? (
                <p className="mt-2 text-sm text-goldink">
                  {tx(lang, { ru: "Идёт обязательный пост Рамадана.", ar: "صيام رمضان الواجب قائم.", en: "The obligatory fast of Ramadan continues." })}
                </p>
              ) : null}
              {view.reasons.length > 0 ? (
                <p className="mt-2 text-sm text-mark">
                  {tx(lang, { ru: "Также пост по сунне", ar: "وفيه صيام سنة", en: "Also a Sunnah fast" })}
                  : {view.reasons.map((reason) => tx(lang, REASON[reason])).join(" · ")}
                </p>
              ) : null}
              <QuoteBlock quote={hero.quote} />
            </>
          ) : view.reasons.length > 0 ? (
            <>
              <h2 className="mt-1 text-lg font-semibold text-ink">
                {tx(lang, { ru: "Рекомендован пост", ar: "يُستحب الصيام", en: "A fast is recommended" })}
              </h2>
              <p className="mt-1 text-sm leading-6 text-ink">
                {view.reasons.map((reason) => tx(lang, REASON[reason])).join(" · ")}
              </p>
              {focus ? <QuoteBlock quote={focus.quote} /> : null}
            </>
          ) : view.obligatory ? (
            <>
              <h2 className="mt-1 text-lg font-semibold text-ink">
                {tx(lang, { ru: "Обязательный пост Рамадана", ar: "صيام رمضان الواجب", en: "The obligatory fast of Ramadan" })}
              </h2>
              <QuoteBlock quote={OCCASIONS.find((item) => item.id === "ramadan")!.quote} />
            </>
          ) : (
            <QuoteBlock quote={wisdom} />
          )}
        </Card>
      </div>
    </div>
  );
}

function QuoteBlock({ quote }: { quote: { ar: string; text: Tri; ref: Tri } }) {
  const lang = useNur((s) => s.lang);
  return (
    <div className="mt-3 border-s-2 border-gold ps-3">
      <p className="font-arabic text-lg leading-loose text-ink">{quote.ar}</p>
      <p className="text-sm leading-6 text-ink">{tx(lang, quote.text)}</p>
      <p className="mt-1 text-xs text-soft">{tx(lang, quote.ref)}</p>
    </div>
  );
}
