import { useMemo, useState } from "react";
import { useNav } from "@/components/nur/nav";
import { Card } from "@/components/nur/ui";
import { OCCASIONS, type Occasion } from "@/lib/content";
import { gregorianLong } from "@/lib/format";
import { nextOccasionDate, type FastReason } from "@/lib/day";
import { today } from "@/lib/hijri";
import { tx, type Tri } from "@/lib/i18n";
import { hijriOpts, useNur } from "@/lib/store";

const SECTIONS: { id: Occasion["section"]; title: Tri }[] = [
  { id: "eid", title: { ru: "Два праздника Ислама", ar: "عيدا الإسلام", en: "The two festivals of Islam" } },
  { id: "great", title: { ru: "Великие дни по сунне", ar: "أيام فاضلة في السنة", en: "Great days in the Sunnah" } },
  { id: "event", title: { ru: "События, не праздники", ar: "أحداث وليست أعياداً", en: "Events, not festivals" } },
  { id: "practice", title: { ru: "Постоянная сунна", ar: "سنن مستمرة", en: "Ongoing Sunnah" } },
];

export function SunnahScreen() {
  const lang = useNur((s) => s.lang);
  const mode = useNur((s) => s.hijriMode);
  const offset = useNur((s) => s.hijriOffset);
  const nav = useNav();
  const opts = useMemo(() => ({ mode, offset }), [mode, offset]);
  const [open, setOpen] = useState<string | null>("eid-fitr");
  const now = today();

  return (
    <div className="space-y-5 px-4 pb-6 pt-4">
      <header>
        <h1 className="text-2xl font-semibold text-ink">{tx(lang, { ru: "Сунна и праздники", ar: "السنة والأعياد", en: "Sunnah and festivals" })}</h1>
        <p className="mt-1 text-sm leading-6 text-soft">
          {tx(lang, {
            ru: "Только то, что подтверждено Кораном и достоверной сунной. Где учёные разошлись — одна спокойная строка.",
            ar: "ما ثبت بالقرآن والسنة. وحيث اختلف العلماء فسطر هادئ.",
            en: "What the Quran and sound Sunnah confirm. Where scholars differ, one calm line.",
          })}
        </p>
      </header>
      <button type="button" onClick={() => nav.goPage("fasting")} className="w-full rounded-3xl bg-header px-4 py-4 text-start text-cream">
        <p className="text-sm text-gold">{tx(lang, { ru: "Трекер", ar: "المتابعة", en: "Tracker" })}</p>
        <p className="text-lg font-semibold">{tx(lang, { ru: "Пост по сунне", ar: "صيام السنة", en: "Sunnah fasting" })}</p>
      </button>
      {SECTIONS.map((section) => (
        <section key={section.id}>
          <h2 className="mb-2 text-sm font-semibold tracking-wide text-goldink">{tx(lang, section.title)}</h2>
          <div className="space-y-2">
            {OCCASIONS.filter((item) => item.section === section.id).map((item) => {
              const next = nextOccasionDate(item, now, opts);
              const expanded = open === item.id;
              return (
                <Card key={item.id}>
                  <button type="button" onClick={() => setOpen(expanded ? null : item.id)} className="w-full px-4 py-3 text-start">
                    <p className="font-arabic text-lg leading-loose text-ink">{item.name.ar}</p>
                    <p className="text-sm text-ink">{lang === "ar" ? item.name.ru : tx(lang, item.name)}</p>
                    <p className="text-xs text-soft">
                      {tx(lang, item.when)}
                      {next ? ` · ${gregorianLong(next, lang)}` : ""}
                    </p>
                  </button>
                  {expanded ? (
                    <div className="space-y-2 border-t border-line px-4 py-3 text-sm leading-6">
                      <p>{tx(lang, item.meaning)}</p>
                      <p>
                        <span className="text-goldink">{tx(lang, { ru: "По сунне. ", ar: "في السنة. ", en: "In the Sunnah. " })}</span>
                        {tx(lang, item.dos)}
                      </p>
                      <p className="text-soft">{tx(lang, item.dont)}</p>
                      <p className="font-arabic text-base leading-loose">{item.quote.ar}</p>
                      <p>{tx(lang, item.quote.text)}</p>
                      <p className="text-xs text-soft">{tx(lang, item.quote.ref)}</p>
                    </div>
                  ) : null}
                </Card>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

export const FAST_REASON_TEXT: Record<FastReason, Tri> = {
  mon: { ru: "Понедельник", ar: "الاثنين", en: "Monday" },
  thu: { ru: "Четверг", ar: "الخميس", en: "Thursday" },
  white: { ru: "Белый день", ar: "يوم أبيض", en: "White day" },
  tasua: { ru: "Тасу‘а", ar: "تاسوعاء", en: "Tasua" },
  ashura: { ru: "Ашура", ar: "عاشوراء", en: "Ashura" },
  arafah: { ru: "Арафа", ar: "عرفة", en: "Arafah" },
  shawwal: { ru: "Шавваль", ar: "شوال", en: "Shawwal" },
};
