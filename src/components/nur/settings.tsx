import { useState, type ReactNode } from "react";
import { useNav } from "@/components/nur/nav";
import { CitySearch, PageHead, ToggleRow } from "@/components/nur/ui";
import { playCall, playSoft, pulse } from "@/lib/audio";
import { placeTitle } from "@/lib/cities";
import { tx, type Lang, type Tri } from "@/lib/i18n";
import type { MadhabId, PrayerMethodId } from "@/lib/prayer";
import { useNur, type AdhanSound, type CompassUnit, type LeadMin, type ThemeMode } from "@/lib/store";

const METHODS: { id: PrayerMethodId; label: Tri }[] = [
  { id: "MoscowOfficial", label: { ru: "Москва [Оригинал]", ar: "موسكو [الأصل]", en: "Moscow [original]" } },
  { id: "UmmAlQura", label: { ru: "Умм аль-Кура", ar: "أم القرى", en: "Umm al-Qura" } },
  { id: "MWL", label: { ru: "Всемирная исламская лига", ar: "رابطة العالم الإسلامي", en: "Muslim World League" } },
  { id: "ISNA", label: { ru: "ISNA, Северная Америка", ar: "إسنا", en: "ISNA" } },
  { id: "Egypt", label: { ru: "Египет", ar: "مصر", en: "Egypt" } },
  { id: "Tehran", label: { ru: "Тегеран", ar: "طهران", en: "Tehran" } },
  { id: "Russia", label: { ru: "Россия, 16° и 15°", ar: "روسيا، ١٦° و١٥°", en: "Russia, 16° and 15°" } },
];

export function SettingsScreen() {
  const nav = useNav();
  const lang = useNur((s) => s.lang);
  const theme = useNur((s) => s.theme);
  const method = useNur((s) => s.method);
  const madhab = useNur((s) => s.madhab);
  const hijriMode = useNur((s) => s.hijriMode);
  const offset = useNur((s) => s.hijriOffset);
  const place = useNur((s) => s.place);
  const adhan = useNur((s) => s.adhan);
  const lead = useNur((s) => s.lead);
  const vibrate = useNur((s) => s.vibrate);
  const holidayReminders = useNur((s) => s.holidayReminders);
  const fastingReminder = useNur((s) => s.fastingReminder);
  const compassUnit = useNur((s) => s.compassUnit);
  const set = useNur();
  const [notice, setNotice] = useState<string | null>(null);

  async function allowNotifications() {
    if (typeof Notification === "undefined") {
      setNotice(tx(lang, { ru: "Этот браузер не показывает уведомления.", ar: "هذا المتصفح لا يعرض إشعارات.", en: "This browser does not show notifications." }));
      return;
    }
    const result = await Notification.requestPermission();
    setNotice(
      result === "granted"
        ? tx(lang, { ru: "Уведомления разрешены.", ar: "سُمح بالإشعارات.", en: "Notifications allowed." })
        : tx(lang, { ru: "Без разрешения напоминание останется внутри приложения.", ar: "بلا إذن يبقى التذكير داخل التطبيق.", en: "Without permission, reminders stay inside the app." }),
    );
  }

  return (
    <div>
      <PageHead title={tx(lang, { ru: "Настройки", ar: "الإعدادات", en: "Settings" })} onBack={nav.back} />
      <div className="space-y-6 px-4 pb-8">
        <Field label={tx(lang, { ru: "Язык", ar: "اللغة", en: "Language" })}>
          <Seg
            value={lang}
            onChange={(value) => set.setLang(value as Lang)}
            options={[
              { id: "ru", label: "Русский" },
              { id: "ar", label: "العربية" },
              { id: "en", label: "English" },
            ]}
          />
        </Field>
        <Field label={tx(lang, { ru: "Тема", ar: "المظهر", en: "Theme" })}>
          <Seg
            value={theme}
            onChange={(value) => set.setTheme(value as ThemeMode)}
            options={[
              { id: "light", label: tx(lang, { ru: "Светлая", ar: "فاتح", en: "Light" }) },
              { id: "dark", label: tx(lang, { ru: "Тёмная", ar: "داكن", en: "Dark" }) },
              { id: "system", label: tx(lang, { ru: "Система", ar: "النظام", en: "System" }) },
            ]}
          />
        </Field>
        <Field label={tx(lang, { ru: "Город", ar: "المدينة", en: "City" })}>
          <p className="mb-2 text-sm text-ink">{placeTitle(place, lang)}</p>
          <CitySearch onPick={(next) => set.setPlace(next)} />
        </Field>
        <Field label={tx(lang, { ru: "Метод намаза", ar: "طريقة الحساب", en: "Prayer method" })}>
          <div className="space-y-2">
            {METHODS.map((item) => (
              <Choice key={item.id} active={method === item.id} label={tx(lang, item.label)} onClick={() => set.setMethod(item.id)} />
            ))}
          </div>
          {method === "MoscowOfficial" ? (
            <p className="mt-2 text-xs leading-5 text-soft">
              {tx(lang, {
                ru: "Время из официальной таблицы Москвы, одно и то же каждый год. Аср уже задан в таблице. Для другого города это расписание не подходит.",
                ar: "الأوقات من جدول موسكو الرسمي، وهو نفسه كل سنة. العصر مثبت في الجدول. لا يصلح لمدينة أخرى.",
                en: "Times come from the official Moscow table and repeat each year. Asr is already fixed in the table. It is not for another city.",
              })}
            </p>
          ) : null}
        </Field>
        <Field label={tx(lang, { ru: "Аср", ar: "العصر", en: "Asr" })}>
          <Seg
            value={madhab}
            onChange={(value) => set.setMadhab(value as MadhabId)}
            options={[
              { id: "Shafi", label: tx(lang, { ru: "Стандарт", ar: "الجمهور", en: "Standard" }) },
              { id: "Hanafi", label: tx(lang, { ru: "Ханафи", ar: "حنفي", en: "Hanafi" }) },
            ]}
          />
        </Field>
        <Field label={tx(lang, { ru: "Календарь хиджры", ar: "التقويم الهجري", en: "Hijri calendar" })}>
          <Seg
            value={hijriMode}
            onChange={(value) => set.setHijriMode(value === "calc" ? "calc" : "umm")}
            options={[
              { id: "umm", label: tx(lang, { ru: "Умм аль-Кура", ar: "أم القرى", en: "Umm al-Qura" }) },
              { id: "calc", label: tx(lang, { ru: "Расчётный", ar: "حسابي", en: "Calculated" }) },
            ]}
          />
          <p className="mt-2 text-xs leading-5 text-soft">
            {tx(lang, { ru: "Поправка к местному видению луны", ar: "تعديل لرؤية الهلال المحلية", en: "Adjustment for local moon sighting" })}
          </p>
          <div className="mt-2">
            <Seg
              value={String(offset)}
              onChange={(value) => set.setOffset(Number(value))}
              options={[-2, -1, 0, 1, 2].map((value) => ({ id: String(value), label: value > 0 ? `+${value}` : String(value) }))}
            />
          </div>
        </Field>
        <Field label={tx(lang, { ru: "Звук азана", ar: "صوت الأذان", en: "Adhan sound" })}>
          <Seg
            value={adhan}
            onChange={(value) => set.setAdhan(value as AdhanSound)}
            options={[
              { id: "off", label: tx(lang, { ru: "Нет", ar: "بدون", en: "Off" }) },
              { id: "soft", label: tx(lang, { ru: "Тихий", ar: "هادئ", en: "Soft" }) },
              { id: "call", label: tx(lang, { ru: "Зов", ar: "نداء", en: "Call" }) },
              { id: "vibrate", label: tx(lang, { ru: "Вибро", ar: "اهتزاز", en: "Vibrate" }) },
            ]}
          />
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button type="button" className="h-11 rounded-full border border-line text-sm" onClick={() => void playSoft()}>
              {tx(lang, { ru: "Слушать тихий", ar: "سماع الهادئ", en: "Play soft" })}
            </button>
            <button type="button" className="h-11 rounded-full border border-line text-sm" onClick={() => void playCall()}>
              {tx(lang, { ru: "Слушать зов", ar: "سماع النداء", en: "Play call" })}
            </button>
          </div>
          <p className="mt-2 text-xs leading-5 text-soft">
            {tx(lang, {
              ru: "Это спокойный сигнал, не запись муэдзина. Напоминание звучит, пока приложение открыто.",
              ar: "إشارة هادئة، ليست تسجيلاً لمؤذن. والتنبيه يعمل والتطبيق مفتوح.",
              en: "A calm signal, not a muezzin recording. It sounds while the app is open.",
            })}
          </p>
        </Field>
        <Field label={tx(lang, { ru: "За сколько минут", ar: "قبل كم دقيقة", en: "Minutes before" })}>
          <Seg
            value={String(lead)}
            onChange={(value) => set.setLead(Number(value) as LeadMin)}
            options={[0, 5, 10, 15].map((value) => ({ id: String(value), label: String(value) }))}
          />
        </Field>
        <ToggleRow
          label={tx(lang, { ru: "Вибрация", ar: "الاهتزاز", en: "Vibration" })}
          on={vibrate}
          onChange={(value) => {
            set.setVibrate(value);
            if (value) pulse([40]);
          }}
        />
        <ToggleRow
          label={tx(lang, { ru: "Праздники", ar: "الأعياد", en: "Festivals" })}
          hint={tx(lang, { ru: "Накануне вечером и утром в день события", ar: "عشية اليوم وصباح الحدث", en: "The evening before and the morning of" })}
          on={holidayReminders}
          onChange={set.setHolidayReminders}
        />
        <ToggleRow
          label={tx(lang, { ru: "Пост накануне", ar: "تذكير الصيام", en: "Fasting eve" })}
          hint={tx(lang, { ru: "Вечером перед сунна-постом", ar: "مساء اليوم السابق لصيام السنة", en: "The evening before a Sunnah fast" })}
          on={fastingReminder}
          onChange={set.setFastingReminder}
        />
        <button type="button" onClick={() => void allowNotifications()} className="h-11 w-full rounded-full border border-line text-sm">
          {tx(lang, { ru: "Разрешить уведомления", ar: "السماح بالإشعارات", en: "Allow notifications" })}
        </button>
        {notice ? <p className="text-sm text-soft">{notice}</p> : null}
        <Field label={tx(lang, { ru: "Компас", ar: "البوصلة", en: "Compass" })}>
          <Seg
            value={compassUnit}
            onChange={(value) => set.setCompassUnit(value as CompassUnit)}
            options={[
              { id: "deg", label: tx(lang, { ru: "Градусы", ar: "درجات", en: "Degrees" }) },
              { id: "card", label: tx(lang, { ru: "Стороны", ar: "جهات", en: "Cardinal" }) },
            ]}
          />
        </Field>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-soft">{label}</span>
      {children}
    </label>
  );
}

function Seg({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { id: string; label: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-1 rounded-3xl bg-chip p-1">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          className={`min-h-10 flex-1 rounded-full px-2 py-2 text-sm ${value === option.id ? "bg-header text-cream" : "text-ink"}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function Choice({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-12 w-full items-center justify-between rounded-2xl border px-4 text-start text-sm ${
        active ? "border-gold bg-chip" : "border-line bg-card"
      }`}
    >
      <span>{label}</span>
      {active ? <span className="size-2 rounded-full bg-gold" /> : null}
    </button>
  );
}
