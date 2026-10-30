import { Volume2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNav } from "@/components/nur/nav";
import { QiblaGlobe } from "@/components/nur/qibla-map";
import { Card } from "@/components/nur/ui";
import { playCall, playSoft, pulse } from "@/lib/audio";
import { placeTitle } from "@/lib/cities";
import { cardinal, formatClock, formatRemain } from "@/lib/format";
import { dayKey, digits } from "@/lib/hijri";
import { tx } from "@/lib/i18n";
import {
  currentSalah,
  distanceKm,
  nextMark,
  PRAYER_NAMES,
  prayerDay,
  qiblaBearing,
  SALAH,
  tomorrowFajr,
  type PrayerId,
} from "@/lib/prayer";
import { hijriOpts, useNur } from "@/lib/store";
import { useNow } from "@/components/nur/use-now";

export function PrayerScreen() {
  const lang = useNur((s) => s.lang);
  const place = useNur((s) => s.place);
  const method = useNur((s) => s.method);
  const madhab = useNur((s) => s.madhab);
  const mode = useNur((s) => s.hijriMode);
  const offset = useNur((s) => s.hijriOffset);
  const adhan = useNur((s) => s.adhan);
  const nav = useNav();
  const now = useNow();
  const [pane, setPane] = useState<"times" | "qibla">("times");
  const opts = useMemo(() => ({ mode, offset }), [mode, offset]);
  const key = dayKey(now);
  const slots = useMemo(
    () => (place ? prayerDay(new Date(), place, method, madhab, opts) : []),
    [place, method, madhab, opts, key],
  );
  const fajr = useMemo(
    () => (place ? tomorrowFajr(new Date(), place, method, madhab, opts) : null),
    [place, method, madhab, opts, key],
  );
  const current = currentSalah(now, slots);
  const upcoming = nextMark(now, slots, fajr);

  useEffect(() => {
    if (nav.qiblaTick === 0) return;
    setPane("qibla");
  }, [nav.qiblaTick]);

  async function play(id: PrayerId) {
    if (id === "sunrise") return;
    if (adhan === "vibrate") pulse([200, 80, 200]);
    else if (adhan === "soft") await playSoft();
    else await playCall();
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="grid grid-cols-2 border-b border-line bg-card">
        <button
          type="button"
          onClick={() => setPane("times")}
          className={`flex flex-col items-center gap-1 px-2 py-2.5 text-xs ${pane === "times" ? "text-goldink" : "text-soft"}`}
        >
          {tx(lang, { ru: "Времена", ar: "المواقيت", en: "Times" })}
          <span className={`h-0.5 w-8 rounded-full ${pane === "times" ? "bg-gold" : "bg-transparent"}`} />
        </button>
        <button
          type="button"
          onClick={() => setPane("qibla")}
          className={`flex flex-col items-center gap-1 px-2 py-2.5 text-xs ${pane === "qibla" ? "text-goldink" : "text-soft"}`}
        >
          {tx(lang, { ru: "Кибла", ar: "القبلة", en: "Qibla" })}
          <span className={`h-0.5 w-8 rounded-full ${pane === "qibla" ? "bg-gold" : "bg-transparent"}`} />
        </button>
      </div>
      {pane === "qibla" ? (
        <QiblaPane />
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto">
    <div className="space-y-4 px-4 pb-6 pt-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-soft">{tx(lang, { ru: "Город", ar: "المدينة", en: "City" })}</p>
          <h1 className="text-2xl font-semibold text-ink">{placeTitle(place, lang)}</h1>
          {method === "MoscowOfficial" ? (
            <p className="text-xs text-soft">{tx(lang, { ru: "Таблица Москвы", ar: "جدول موسكو", en: "Moscow table" })}</p>
          ) : null}
        </div>
        <button type="button" onClick={() => nav.goPage("settings")} className="text-sm text-goldink">
          {tx(lang, { ru: "Изменить", ar: "تغيير", en: "Change" })}
        </button>
      </div>

      <button
        type="button"
        onClick={() => nav.goPage("schedule")}
        className="flex h-11 w-full items-center justify-center rounded-full border border-line text-sm"
      >
        {tx(lang, { ru: "Расписание на месяц и год", ar: "جدول الشهر والسنة", en: "Month and year timetable" })}
      </button>

      {upcoming ? (
        <Card>
          <p className="text-xs text-soft">
            {tx(lang, { ru: "До следующего", ar: "حتى التالي", en: "Until next" })}
            {upcoming.tomorrow ? ` · ${tx(lang, { ru: "завтра", ar: "غداً", en: "tomorrow" })}` : ""}
          </p>
          <div className="flex items-end justify-between">
            <p className="text-xl font-semibold">{tx(lang, PRAYER_NAMES[upcoming.id])}</p>
            <p className="text-3xl font-semibold tabular-nums text-goldink">
              {formatRemain(upcoming.time.getTime() - now.getTime())}
            </p>
          </div>
        </Card>
      ) : (
        <Card>
          <p className="text-sm text-soft">
            {tx(lang, { ru: "Сначала выберите город.", ar: "اختر المدينة أولاً.", en: "Choose a city first." })}
          </p>
        </Card>
      )}

      <ul className="space-y-2">
        {slots.map((slot) => {
          const passed = slot.time.getTime() < now.getTime();
          const on = slot.id === current;
          const nxt = upcoming?.id === slot.id && !upcoming.tomorrow;
          return (
            <li
              key={slot.id}
              className={`flex items-center gap-3 rounded-3xl border px-4 py-3 ${
                on ? "border-transparent bg-header text-cream" : nxt ? "border-gold bg-card" : "border-line bg-card"
              } ${passed && !on ? "opacity-60" : ""}`}
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{tx(lang, PRAYER_NAMES[slot.id])}</p>
                <p className={`text-xs ${on ? "text-cream" : "text-soft"}`}>
                  {on
                    ? tx(lang, { ru: "сейчас", ar: "الآن", en: "now" })
                    : nxt
                      ? tx(lang, { ru: "следующий", ar: "التالي", en: "next" })
                      : passed
                        ? tx(lang, { ru: "прошёл", ar: "مضى", en: "passed" })
                        : ""}
                </p>
              </div>
              <p className="text-lg font-semibold tabular-nums">{formatClock(slot.time, place?.tz)}</p>
              {SALAH.includes(slot.id) ? (
                <button
                  type="button"
                  aria-label={tx(lang, { ru: "Азан", ar: "أذان", en: "Adhan" })}
                  onClick={() => void play(slot.id)}
                  className={`flex size-11 items-center justify-center rounded-full ${on ? "bg-cream/15 text-gold" : "bg-chip text-goldink"}`}
                >
                  <Volume2 className="size-5" />
                </button>
              ) : (
                <span className="size-11" />
              )}
            </li>
          );
        })}
      </ul>

      {place && Math.abs(place.lat) >= 48 ? (
        <p className="text-xs leading-5 text-soft">
          {tx(lang, {
            ru: "На широте выше 48° ночь делится по правилу высоких широт. Сверьте с местной мечетью.",
            ar: "فوق خط ٤٨ تُقسم الليل بقاعدة خطوط العرض العالية. راجع مسجدك.",
            en: "Above 48° the night is divided by the high-latitude rule. Check with your local mosque.",
          })}
        </p>
      ) : null}
        </div>
        </div>
      )}
    </div>
  );
}

function QiblaPane() {
  const lang = useNur((s) => s.lang);
  const place = useNur((s) => s.place);
  const unit = useNur((s) => s.compassUnit);
  const nav = useNav();
  const bearing = place ? qiblaBearing(place.lat, place.lng) : null;
  const km = place ? distanceKm(place.lat, place.lng) : null;
  const label =
    bearing == null ? "—" : unit === "card" ? cardinal(bearing, lang) : `${digits(Math.round(bearing), lang)}°`;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-end justify-between gap-3 px-4 pb-1 pt-3">
        <div className="min-w-0">
          <p className="text-xs text-soft">{tx(lang, { ru: "Кибла", ar: "القبلة", en: "Qibla" })}</p>
          <h1 className="truncate text-2xl font-semibold text-ink">{placeTitle(place, lang)}</h1>
          <p className="text-sm text-soft">
            {label}
            {bearing != null && unit === "deg" ? ` · ${cardinal(bearing, lang)}` : ""}
            {km != null ? ` · ${digits(km, lang)} ${tx(lang, { ru: "км", ar: "كم", en: "km" })}` : ""}
          </p>
        </div>
        <button type="button" onClick={() => nav.goPage("settings")} className="text-sm text-goldink">
          {tx(lang, { ru: "Город", ar: "المدينة", en: "City" })}
        </button>
      </div>
      {place && bearing != null ? (
        <QiblaGlobe lat={place.lat} lng={place.lng} bearing={bearing} />
      ) : (
        <div className="px-4 pt-6">
          <Card>
            <p className="text-sm leading-6 text-soft">
              {tx(lang, {
                ru: "Выберите город — и на глобусе появится дуга киблы до Каабы.",
                ar: "اختر المدينة ليظهر قوس القبلة إلى الكعبة.",
                en: "Choose a city and the qibla arc to the Kaaba will appear on the globe.",
              })}
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}

