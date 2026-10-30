import { useMemo, useState } from "react";
import { useNav } from "@/components/nur/nav";
import { PageHead, Primary } from "@/components/nur/ui";
import { DUAS } from "@/lib/content";
import { countShawwal, dayView, fastReasons, isForbiddenFast, wisdomFor } from "@/lib/day";
import { cardinal, formatClock, gregorianLong, weekdayShort } from "@/lib/format";
import { dayKey, digits, fromHijri, monthDates, monthMeta, parseKey, toHijri, today, yearLabel } from "@/lib/hijri";
import { tx } from "@/lib/i18n";
import { nextMark, PRAYER_NAMES, prayerDay, qiblaBearing, SALAH, tomorrowFajr } from "@/lib/prayer";
import { hijriOpts, useNur } from "@/lib/store";
import { FAST_REASON_TEXT } from "@/components/nur/sunnah";
import { useNow } from "@/components/nur/use-now";

export function FastingScreen() {
  const nav = useNav();
  const lang = useNur((s) => s.lang);
  const mode = useNur((s) => s.hijriMode);
  const offset = useNur((s) => s.hijriOffset);
  const showMawlid = useNur((s) => s.showMawlid);
  const fasted = useNur((s) => s.fasted);
  const toggleFast = useNur((s) => s.toggleFast);
  const opts = useMemo(() => ({ mode, offset }), [mode, offset]);
  const now = today();
  const hijri = toHijri(now, opts);
  const days = monthDates(hijri.year, hijri.month, opts);
  const monthKeys = days.map(dayKey);
  const kept = monthKeys.filter((key) => fasted.includes(key)).length;
  const recommended = days.filter((date) => fastReasons(toHijri(date, opts), date.getDay()).length > 0).length;
  const view = dayView(now, opts, showMawlid);
  const todayKey = dayKey(now);
  const shawwal = countShawwal(fasted, hijri.year, opts);

  return (
    <div>
      <PageHead title={tx(lang, { ru: "Пост по сунне", ar: "صيام السنة", en: "Sunnah fast" })} onBack={nav.back} />
      <div className="space-y-4 px-4 pb-8">
        <section className="rounded-3xl bg-header p-4 text-cream">
          <p className="text-sm text-gold">{monthMeta(hijri.month).ar}</p>
          <p className="mt-1 text-3xl font-semibold tabular-nums">
            {digits(kept, lang)}
            <span className="text-base font-medium text-cream"> / {digits(days.length, lang)}</span>
          </p>
          <p className="mt-1 text-sm">
            {tx(lang, {
              ru: `Отмечено в этом месяце. Рекомендованных дней: ${recommended}. Шавваль ${hijri.year}: ${shawwal} из 6.`,
              ar: `المؤشر في هذا الشهر. المستحب: ${digits(recommended, lang)}. شوال ${digits(hijri.year, lang)}: ${digits(shawwal, lang)} من ٦.`,
              en: `Marked this month. Recommended days: ${recommended}. Shawwal ${hijri.year}: ${shawwal} of 6.`,
            })}
          </p>
        </section>
        {view.forbidden ? (
          <p className="rounded-3xl border border-forbid px-4 py-3 text-sm text-forbid">
            {tx(lang, { ru: "Сегодня пост не допускается.", ar: "اليوم لا يُشرع الصيام.", en: "Fasting is not allowed today." })}
          </p>
        ) : (
          <Primary
            onClick={() => toggleFast(todayKey)}
            disabled={false}
          >
            {fasted.includes(todayKey)
              ? tx(lang, { ru: "Сегодня пост отмечен", ar: "أُشير صيام اليوم", en: "Today is marked" })
              : tx(lang, { ru: "Сегодня пощусь", ar: "أصوم اليوم", en: "I am fasting today" })}
          </Primary>
        )}
        <ul className="space-y-2">
          {days.map((date) => {
            const h = toHijri(date, opts);
            const reasons = fastReasons(h, date.getDay());
            const forbidden = isForbiddenFast(h);
            const key = dayKey(date);
            const future = date.getTime() > now.getTime() && !sameCivil(date, now);
            return (
              <li key={key} className="flex items-center gap-3 rounded-3xl border border-line bg-card px-3 py-2">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">
                    {digits(h.day, lang)} {lang === "en" ? monthMeta(h.month).en : monthMeta(h.month).ru}
                    <span className="text-soft"> · {weekdayShort(date, lang)} {digits(date.getDate(), lang)}</span>
                  </p>
                  <p className="text-xs text-soft">
                    {forbidden
                      ? tx(lang, { ru: "пост не допускается", ar: "لا يُصام", en: "not allowed" })
                      : h.month === 9
                        ? tx(lang, { ru: "обязательный пост", ar: "صيام واجب", en: "obligatory" })
                        : reasons.length
                          ? reasons.map((reason) => tx(lang, FAST_REASON_TEXT[reason])).join(" · ")
                          : tx(lang, { ru: "добровольный", ar: "تطوع", en: "voluntary" })}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={forbidden || future}
                  onClick={() => toggleFast(key)}
                  className={`size-11 rounded-full border text-sm ${fasted.includes(key) ? "border-gold bg-header text-cream" : "border-line"} disabled:opacity-30`}
                >
                  {fasted.includes(key) ? "✓" : ""}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function sameCivil(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function DuasScreen() {
  const nav = useNav();
  const lang = useNur((s) => s.lang);
  return (
    <div>
      <PageHead title={tx(lang, { ru: "Дуа", ar: "الأدعية", en: "Duas" })} onBack={nav.back} />
      <div className="space-y-3 px-4 pb-8">
        {DUAS.map((dua) => (
          <article key={dua.id} className="rounded-3xl border border-line bg-card p-4">
            <p className="text-xs text-goldink">{tx(lang, dua.when)}</p>
            <h2 className="text-lg font-semibold">{tx(lang, dua.title)}</h2>
            <p className="font-arabic mt-2 text-xl leading-loose">{dua.ar}</p>
            <p className="mt-2 text-sm leading-6">{tx(lang, dua.text)}</p>
            <p className="mt-2 text-xs text-soft">{tx(lang, dua.ref)}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

export function AyahScreen() {
  const nav = useNav();
  const lang = useNur((s) => s.lang);
  const quote = wisdomFor(today());
  return (
    <div>
      <PageHead title={tx(lang, { ru: "Аят и хадис", ar: "آية وحديث", en: "Ayah and hadith" })} onBack={nav.back} />
      <article className="mx-4 rounded-3xl border border-line bg-card p-5">
        <p className="text-xs text-goldink">
          {quote.kind === "ayah"
            ? tx(lang, { ru: "Аят", ar: "آية", en: "Ayah" })
            : tx(lang, { ru: "Хадис", ar: "حديث", en: "Hadith" })}
        </p>
        <p className="font-arabic mt-2 text-2xl leading-loose">{quote.ar}</p>
        <p className="mt-3 text-base leading-7">{tx(lang, quote.text)}</p>
        <p className="mt-3 text-sm text-soft">{tx(lang, quote.ref)}</p>
      </article>
    </div>
  );
}

export function AboutScreen() {
  const nav = useNav();
  const lang = useNur((s) => s.lang);
  const setOnboarded = useNur((s) => s.setOnboarded);
  return (
    <div>
      <PageHead title={tx(lang, { ru: "О приложении", ar: "عن التطبيق", en: "About" })} onBack={nav.back} />
      <div className="space-y-3 px-4 pb-8 text-sm leading-6">
        <p className="font-arabic text-2xl leading-loose text-goldink">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
        <p>
          {tx(lang, {
            ru: "Приложение создано для облегчения жизни мусульман, в частности со временем намаза, для друзей из Москвы выбирать \"Москва оригинал\" расписание по оригинальной таблице. Для друзей из других местностей, обратитесь к автору приложения, для добавления ваших регионов.",
            ar: "صُنع التطبيق لتيسير حياة المسلمين، ولا سيما في أوقات الصلاة. الأصدقاء في موسكو يختارون «موسكو الأصل»، وهو الجدول الأصلي. ومن كان في منطقة أخرى فليتواصل مع صاحب التطبيق لإضافة منطقته.",
            en: "The app was made to make life easier for Muslims, especially with prayer times. Friends in Moscow should choose “Moscow original”, the timetable from the original table. Friends elsewhere, contact the author of the app to add your region.",
          })}
        </p>
        <button type="button" className="text-goldink" onClick={() => setOnboarded(false)}>
          {tx(lang, { ru: "Показать введение снова", ar: "إعادة المقدمة", en: "Show the introduction again" })}
        </button>
      </div>
    </div>
  );
}

export function PrivacyScreen() {
  const nav = useNav();
  const lang = useNur((s) => s.lang);
  return (
    <div>
      <PageHead title={tx(lang, { ru: "Конфиденциальность", ar: "الخصوصية", en: "Privacy" })} onBack={nav.back} />
      <p className="px-4 pb-8 text-sm leading-7">
        {tx(lang, {
          ru: "Геолокация запрашивается только чтобы посчитать намаз и направление киблы. Координаты хранятся на этом устройстве и никуда не отправляются. Нет аккаунта и нет продажи данных. Рекламы на экранах намаза нет.",
          ar: "يُطلب الموقع لحساب الصلاة والقبلة فقط. تبقى الإحداثيات في الجهاز ولا تُباع. لا حساب، ولا إعلان في شاشات الصلاة.",
          en: "Location is requested only to calculate prayer times and the qibla. Coordinates stay on this device and are not sold. There is no account and no ads on the prayer screens.",
        })}
      </p>
    </div>
  );
}

export function ConverterScreen() {
  const nav = useNav();
  const lang = useNur((s) => s.lang);
  const mode = useNur((s) => s.hijriMode);
  const offset = useNur((s) => s.hijriOffset);
  const opts = useMemo(() => ({ mode, offset }), [mode, offset]);
  const base = today();
  const h0 = toHijri(base, opts);
  const [g, setG] = useState(dayKey(base));
  const [hy, setHy] = useState(h0.year);
  const [hm, setHm] = useState(h0.month);
  const [hd, setHd] = useState(h0.day);
  const gregorianDate = parseKey(g);
  const asHijri = toHijri(gregorianDate, opts);
  const back = fromHijri({ year: hy, month: hm, day: hd }, opts);

  return (
    <div>
      <PageHead title={tx(lang, { ru: "Перевод даты", ar: "تحويل التاريخ", en: "Convert a date" })} onBack={nav.back} />
      <div className="space-y-4 px-4 pb-8">
        <label className="block text-sm text-soft">
          {tx(lang, { ru: "Григорианская", ar: "ميلادي", en: "Gregorian" })}
          <input
            type="date"
            value={g}
            min="1900-04-30"
            max="2077-11-16"
            onChange={(event) => setG(event.target.value)}
            className="mt-1 h-12 w-full rounded-2xl border border-line bg-chip px-3 text-ink"
          />
        </label>
        <p className="font-arabic text-xl leading-loose">
          {digits(asHijri.day, lang)} {monthMeta(asHijri.month).ar}
        </p>
        <p className="text-sm">
          {lang === "en" ? monthMeta(asHijri.month).en : monthMeta(asHijri.month).ru} · {yearLabel(asHijri.year, lang)}
        </p>
        <div className="grid grid-cols-3 gap-2">
          <Num label={tx(lang, { ru: "Год", ar: "سنة", en: "Year" })} value={hy} onChange={setHy} />
          <Num label={tx(lang, { ru: "Месяц", ar: "شهر", en: "Month" })} value={hm} onChange={setHm} />
          <Num label={tx(lang, { ru: "День", ar: "يوم", en: "Day" })} value={hd} onChange={setHd} />
        </div>
        <p className="text-sm">
          {back
            ? gregorianLong(back, lang)
            : tx(lang, { ru: "Такого дня в этом месяце нет.", ar: "لا يوجد هذا اليوم في الشهر.", en: "That day is not in this month." })}
        </p>
        <p className="text-xs leading-5 text-soft">
          {mode === "umm"
            ? tx(lang, { ru: "Умм аль-Кура, 1318–1500 г.х.", ar: "أم القرى، ١٣١٨–١٥٠٠", en: "Umm al-Qura, 1318–1500 AH" })
            : tx(lang, { ru: "Табличный расчёт. Он может отличаться от Умм аль-Кура на день-два.", ar: "حساب جدولي، وقد يخالف أم القرى بيوم أو يومين.", en: "Tabular calculation. It can differ from Umm al-Qura by a day or two." })}
        </p>
      </div>
    </div>
  );
}

function Num({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <label className="text-xs text-soft">
      {label}
      <input
        inputMode="numeric"
        value={value}
        onChange={(event) => onChange(Number(event.target.value.replace(/[^\d]/g, "")) || 0)}
        className="mt-1 h-12 w-full rounded-2xl border border-line bg-chip px-2 text-base text-ink"
      />
    </label>
  );
}

export function WidgetsScreen() {
  const nav = useNav();
  const lang = useNur((s) => s.lang);
  const place = useNur((s) => s.place);
  const method = useNur((s) => s.method);
  const madhab = useNur((s) => s.madhab);
  const mode = useNur((s) => s.hijriMode);
  const offset = useNur((s) => s.hijriOffset);
  const unit = useNur((s) => s.compassUnit);
  const opts = useMemo(() => ({ mode, offset }), [mode, offset]);
  const now = useNow(30000);
  const h = toHijri(now, opts);
  const slots = place ? prayerDay(now, place, method, madhab, opts) : [];
  const fajr = place ? tomorrowFajr(now, place, method, madhab, opts) : null;
  const upcoming = nextMark(now, slots, fajr);
  const bearing = place ? Math.round(qiblaBearing(place.lat, place.lng)) : null;
  return (
    <div>
      <PageHead title={tx(lang, { ru: "Виджеты", ar: "البطاقات", en: "Widgets" })} onBack={nav.back} />
      <div className="space-y-4 px-4 pb-8">
        <p className="text-sm leading-6 text-soft">
          {tx(lang, {
            ru: "Так выглядят карточки главного экрана: дата хиджры и следующий намаз, либо все пять намазов.",
            ar: "هكذا تبدو بطاقة التاريخ والصلاة التالية، أو الصلوات الخمس.",
            en: "This is the home-screen card: the Hijri date and the next prayer, or all five prayers.",
          })}
        </p>
        <div className="rounded-3xl bg-header p-4 text-cream">
          <p className="font-arabic text-lg leading-loose text-gold">{monthMeta(h.month).ar}</p>
          <p className="text-4xl font-semibold tabular-nums">{digits(h.day, lang)}</p>
          <p className="text-sm">{yearLabel(h.year, lang)}</p>
          <p className="mt-3 text-sm text-gold">
            {upcoming ? `${tx(lang, PRAYER_NAMES[upcoming.id])} · ${formatClock(upcoming.time, place?.tz)}` : "—"}
          </p>
          {bearing != null ? (
            <p className="text-xs text-cream">
              {tx(lang, { ru: "Кибла", ar: "القبلة", en: "Qibla" })}{" "}
              {unit === "card" ? cardinal(bearing, lang) : `${digits(bearing, lang)}°`}
            </p>
          ) : null}
        </div>
        <div className="rounded-3xl border border-gold bg-header p-4 text-cream">
          <p className="mb-2 text-sm text-gold">{tx(lang, { ru: "Сегодня", ar: "اليوم", en: "Today" })}</p>
          <ul className="space-y-2">
            {slots.filter((slot) => SALAH.includes(slot.id)).map((slot) => (
              <li key={slot.id} className="flex justify-between text-sm">
                <span>{tx(lang, PRAYER_NAMES[slot.id])}</span>
                <span className="tabular-nums">{formatClock(slot.time, place?.tz)}</span>
              </li>
            ))}
            {slots.length === 0 ? <li className="text-sm">{tx(lang, { ru: "Выберите город", ar: "اختر مدينة", en: "Choose a city" })}</li> : null}
          </ul>
        </div>
      </div>
    </div>
  );
}
