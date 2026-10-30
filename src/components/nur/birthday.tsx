import { useMemo } from "react";
import { useNav } from "@/components/nur/nav";
import { PageHead } from "@/components/nur/ui";
import { gregorianLong } from "@/lib/format";
import { digits, monthMeta, parseKey, today, toHijri, yearLabel, type HijriDate } from "@/lib/hijri";
import { tx, type Lang } from "@/lib/i18n";
import { hijriOpts, useNur } from "@/lib/store";

export function BirthdayScreen() {
  const nav = useNav();
  const lang = useNur((s) => s.lang);
  const mode = useNur((s) => s.hijriMode);
  const offset = useNur((s) => s.hijriOffset);
  const birthday = useNur((s) => s.birthday);
  const setBirthday = useNur((s) => s.setBirthday);
  const opts = useMemo(() => hijriOpts({ hijriMode: mode, hijriOffset: offset }), [mode, offset]);
  const now = today();
  const born = birthday ? parseKey(birthday) : null;
  const valid = born != null && !Number.isNaN(born.getTime());
  const birthH = valid ? toHijri(born, opts) : null;
  const todayH = toHijri(now, opts);
  const future = valid && born.getTime() > now.getTime();
  const age = birthH && !future ? hijriAge(birthH, todayH) : null;
  const onBirthday = birthH != null && !future && birthH.month === todayH.month && birthH.day === todayH.day;

  return (
    <div>
      <PageHead title={tx(lang, { ru: "День рождения", ar: "يوم الميلاد", en: "Birthday" })} onBack={nav.back} />
      <div className="space-y-4 px-4 pb-8">
        <label className="block text-sm text-soft">
          {tx(lang, { ru: "Дата по григорианскому календарю", ar: "التاريخ الميلادي", en: "Gregorian date" })}
          <input
            type="date"
            value={birthday}
            min="1900-01-01"
            max="2100-12-31"
            onChange={(event) => setBirthday(event.target.value)}
            className="mt-1 h-12 w-full rounded-2xl border border-line bg-chip px-3 text-ink"
          />
        </label>

        {!valid ? (
          <p className="text-sm leading-6 text-soft">
            {tx(lang, {
              ru: "Введите дату рождения. В ответ будет возраст по календарю хиджры.",
              ar: "أدخل تاريخ الميلاد، فيظهر العمر بالتقويم الهجري.",
              en: "Enter a birth date. The answer is your age in the Hijri calendar.",
            })}
          </p>
        ) : future ? (
          <p className="text-sm leading-6">
            {tx(lang, { ru: "Эта дата ещё впереди.", ar: "هذا التاريخ لم يأتِ بعد.", en: "That date is still ahead." })}
          </p>
        ) : birthH && age != null ? (
          <section className="rounded-3xl bg-header p-5 text-cream">
            <p className="text-sm text-gold">
              {tx(lang, { ru: "По календарю хиджры", ar: "بالتقويم الهجري", en: "By the Hijri calendar" })}
            </p>
            <p className="mt-1 text-6xl font-semibold tabular-nums">{digits(age, lang)}</p>
            <p className="text-lg">{yearsWord(age, lang)}</p>
            {onBirthday ? (
              <p className="mt-3 text-sm text-gold">
                {tx(lang, { ru: "Сегодня день рождения по хиджре.", ar: "اليوم عيد الميلاد الهجري.", en: "Today is the Hijri birthday." })}
              </p>
            ) : null}
          </section>
        ) : null}

        {birthH && !future ? (
          <section className="rounded-3xl border border-line bg-card p-4">
            <p className="text-xs text-soft">{tx(lang, { ru: "Дата рождения по хиджре", ar: "الميلاد هجرياً", en: "Hijri birth date" })}</p>
            <p className="font-arabic mt-1 text-2xl leading-loose">
              {digits(birthH.day, lang)} {monthMeta(birthH.month).ar}
            </p>
            <p className="text-sm">
              {lang === "en" ? monthMeta(birthH.month).en : monthMeta(birthH.month).ru} · {yearLabel(birthH.year, lang)}
            </p>
            <p className="mt-3 text-xs text-soft">{gregorianLong(born!, lang)}</p>
          </section>
        ) : null}

        <p className="text-xs leading-5 text-soft">
          {tx(lang, {
            ru: "Считаются полные годы хиджры. Год короче григорианского, поэтому число больше обычного возраста. Учитывается календарь из настроек.",
            ar: "تُحسب السنوات الهجرية التامة. السنة الهجرية أقصر، فالرقم أكبر من العمر الميلادي. يُراعى التقويم المختار في الإعدادات.",
            en: "Completed Hijri years. A Hijri year is shorter, so the number is higher than a Gregorian age. The calendar from Settings is used.",
          })}
        </p>
      </div>
    </div>
  );
}

function hijriAge(birth: HijriDate, now: HijriDate): number {
  let years = now.year - birth.year;
  if (now.month < birth.month || (now.month === birth.month && now.day < birth.day)) years -= 1;
  return Math.max(0, years);
}

function yearsWord(age: number, lang: Lang): string {
  if (lang === "ar") return age === 1 ? "سنة" : "سنوات";
  if (lang === "en") return age === 1 ? "year" : "years";
  const n10 = age % 10;
  const n100 = age % 100;
  if (n10 === 1 && n100 !== 11) return "год";
  if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) return "года";
  return "лет";
}
