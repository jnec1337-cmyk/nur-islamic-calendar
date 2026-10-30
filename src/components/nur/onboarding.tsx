import { useState } from "react";
import { CrescentStar } from "@/components/nur/ornament";
import { CitySearch, Primary } from "@/components/nur/ui";
import { tx, type Tri } from "@/lib/i18n";
import type { PrayerMethodId } from "@/lib/prayer";
import { useNur, type Place } from "@/lib/store";

const STEPS: { title: Tri; body: Tri }[] = [
  {
    title: { ru: "Знай день по хиджре и по сунне", ar: "اعرف يومك بالهجري والسنة", en: "Know the day by Hijri and Sunnah" },
    body: {
      ru: "Два праздника, дни поста и то, что передано достоверно. Без лишнего шума.",
      ar: "عيدا الإسلام وأيام الصيام وما ثبت. بلا ضجيج.",
      en: "The two festivals, the fasts, and what is soundly transmitted. Quietly.",
    },
  },
  {
    title: { ru: "Намаз и кибла по твоему городу", ar: "الصلاة والقبلة لمدينتك", en: "Prayer and qibla for your city" },
    body: {
      ru: "Времена считаются на год вперёд и остаются на устройстве, без аккаунта.",
      ar: "تُحسب المواقيت لسنة قادمة وتبقى في الجهاز، بلا حساب.",
      en: "Times are calculated a year ahead and stay on the device. No account.",
    },
  },
];

export function Onboarding() {
  const lang = useNur((s) => s.lang);
  const setLang = useNur((s) => s.setLang);
  const method = useNur((s) => s.method);
  const setMethod = useNur((s) => s.setMethod);
  const madhab = useNur((s) => s.madhab);
  const setMadhab = useNur((s) => s.setMadhab);
  const setPlace = useNur((s) => s.setPlace);
  const setOnboarded = useNur((s) => s.setOnboarded);
  const [step, setStep] = useState(0);
  const [place, setLocal] = useState<Place | null>(null);

  return (
    <div className="flex h-full flex-col px-5 pb-6 pt-8">
      <div className="mb-6 flex items-center justify-between">
        <CrescentStar className="size-10 text-goldink" />
        <div className="flex gap-1">
          {(["ru", "ar", "en"] as const).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setLang(id)}
              className={`rounded-full px-3 py-2 text-xs ${lang === id ? "bg-header text-cream" : "bg-chip text-ink"}`}
            >
              {id === "ru" ? "РУ" : id === "ar" ? "ع" : "EN"}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-4 flex gap-1">
        {[0, 1, 2].map((index) => (
          <span key={index} className={`h-1 flex-1 rounded-full ${index <= step ? "bg-gold" : "bg-line"}`} />
        ))}
      </div>
      {step < 2 ? (
        <div className="flex flex-1 flex-col">
          <h1 className="text-3xl font-semibold leading-tight text-ink">{tx(lang, STEPS[step]!.title)}</h1>
          <p className="mt-3 text-base leading-7 text-soft">{tx(lang, STEPS[step]!.body)}</p>
          <div className="mt-auto">
            <Primary onClick={() => setStep(step + 1)}>{tx(lang, { ru: "Дальше", ar: "التالي", en: "Next" })}</Primary>
          </div>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col">
          <h1 className="text-2xl font-semibold text-ink">
            {tx(lang, { ru: "Город и расчёт", ar: "المدينة والحساب", en: "City and calculation" })}
          </h1>
          <p className="mt-1 text-sm leading-6 text-soft">
            {tx(lang, {
              ru: "Геолокация только для намаза и киблы. Можно начать и без неё.",
              ar: "الموقع للصلاة والقبلة فقط. ويمكن البدء دونه.",
              en: "Location is only for prayer and qibla. You can start without it.",
            })}
          </p>
          <div className="mt-3 min-h-0 flex-1 overflow-y-auto">
            <CitySearch
              onPick={(next) => {
                setLocal(next);
                setPlace(next);
              }}
            />
            <p className="mb-2 mt-4 text-sm text-soft">{tx(lang, { ru: "Метод намаза", ar: "طريقة الصلاة", en: "Prayer method" })}</p>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  ["MoscowOfficial", { ru: "Москва [Оригинал]", ar: "موسكو [الأصل]", en: "Moscow [original]" }],
                  ["Russia", { ru: "Россия", ar: "روسيا", en: "Russia" }],
                  ["UmmAlQura", { ru: "Умм аль-Кура", ar: "أم القرى", en: "Umm al-Qura" }],
                  ["MWL", { ru: "Лига", ar: "الرابطة", en: "League" }],
                  ["ISNA", { ru: "ISNA", ar: "إسنا", en: "ISNA" }],
                  ["Egypt", { ru: "Египет", ar: "مصر", en: "Egypt" }],
                  ["Tehran", { ru: "Тегеран", ar: "طهران", en: "Tehran" }],
                ] as [PrayerMethodId, Tri][]
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setMethod(id)}
                  className={`${id === "MoscowOfficial" ? "col-span-2" : ""} h-11 rounded-full px-3 text-sm ${method === id ? "bg-header text-cream" : "bg-chip text-ink"}`}
                >
                  {tx(lang, label)}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setMadhab(madhab === "Hanafi" ? "Shafi" : "Hanafi")}
              className="mt-3 h-11 w-full rounded-full border border-line text-sm"
            >
              {madhab === "Hanafi"
                ? tx(lang, { ru: "Аср: ханафи", ar: "العصر: حنفي", en: "Asr: Hanafi" })
                : tx(lang, { ru: "Аср: стандарт", ar: "العصر: الجمهور", en: "Asr: standard" })}
            </button>
            {place ? <p className="mt-2 text-xs text-goldink">{tx(lang, { ru: "Место сохранено на устройстве.", ar: "حُفظ المكان في الجهاز.", en: "The place is saved on this device." })}</p> : null}
          </div>
          <div className="mt-3">
            <Primary onClick={() => setOnboarded(true)}>{tx(lang, { ru: "Начать", ar: "ابدأ", en: "Begin" })}</Primary>
            <p className="mt-2 text-center text-xs text-soft">{tx(lang, { ru: "Без аккаунта", ar: "دون حساب", en: "No account" })}</p>
          </div>
        </div>
      )}
    </div>
  );
}
