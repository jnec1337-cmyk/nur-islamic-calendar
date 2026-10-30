import { Bell, BookOpen, CalendarRange, Cake, Compass, Info, LayoutGrid, Share2, Shield } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useNav, type PageName } from "@/components/nur/nav";
import { tx, type Tri } from "@/lib/i18n";
import { useNur } from "@/lib/store";

const ITEMS: { id: string; page?: PageName; qibla?: boolean; icon: LucideIcon; label: Tri; hint: Tri }[] = [
  {
    id: "qibla",
    qibla: true,
    icon: Compass,
    label: { ru: "Кибла", ar: "القبلة", en: "Qibla" },
    hint: { ru: "Направление и расстояние до Каабы", ar: "الجهة والمسافة إلى الكعبة", en: "Direction and distance to the Kaaba" },
  },
  {
    id: "duas",
    page: "duas",
    icon: BookOpen,
    label: { ru: "Дуа особых дней", ar: "أدعية الأيام", en: "Duas" },
    hint: { ru: "Арафа, Кадр, ифтар, такбир", ar: "عرفة والقدر والإفطار والتكبير", en: "Arafah, Qadr, iftar, takbir" },
  },
  {
    id: "ayah",
    page: "ayah",
    icon: Bell,
    label: { ru: "Аят и хадис дня", ar: "آية وحديث اليوم", en: "Ayah and hadith" },
    hint: { ru: "Коротко, с источником", ar: "قصير مع المصدر", en: "Short, with a source" },
  },
  {
    id: "widgets",
    page: "widgets",
    icon: LayoutGrid,
    label: { ru: "Виджеты", ar: "البطاقات", en: "Widgets" },
    hint: { ru: "Дата хиджры и намазы", ar: "التاريخ والمواقيت", en: "Hijri date and prayers" },
  },
  {
    id: "convert",
    page: "converter",
    icon: CalendarRange,
    label: { ru: "Перевод даты", ar: "تحويل التاريخ", en: "Date converter" },
    hint: { ru: "Григорианская и хиджра", ar: "ميلادي وهجري", en: "Gregorian and Hijri" },
  },
  {
    id: "birthday",
    page: "birthday",
    icon: Cake,
    label: { ru: "День рождения", ar: "يوم الميلاد", en: "Birthday" },
    hint: { ru: "Сколько лет по хиджре", ar: "العمر بالهجري", en: "Age in Hijri years" },
  },
  {
    id: "about",
    page: "about",
    icon: Info,
    label: { ru: "О приложении", ar: "عن التطبيق", en: "About" },
    hint: { ru: "Расчёт и видение луны", ar: "الحساب ورؤية الهلال", en: "Calculation and moon sighting" },
  },
  {
    id: "privacy",
    page: "privacy",
    icon: Shield,
    label: { ru: "Конфиденциальность", ar: "الخصوصية", en: "Privacy" },
    hint: { ru: "Геолокация только для намаза", ar: "الموقع للصلاة فقط", en: "Location only for prayer" },
  },
];

export function MoreScreen() {
  const lang = useNur((s) => s.lang);
  const nav = useNav();
  return (
    <div className="px-4 pb-6 pt-4">
      <h1 className="text-2xl font-semibold text-ink">{tx(lang, { ru: "Ещё", ar: "المزيد", en: "More" })}</h1>
      <ul className="mt-4 space-y-2">
        {ITEMS.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => {
                if (item.qibla) nav.goQibla();
                else if (item.page) nav.goPage(item.page);
              }}
              className="flex w-full items-center gap-3 rounded-3xl border border-line bg-card px-4 py-3 text-start"
            >
              <span className="flex size-11 items-center justify-center rounded-full bg-header text-gold">
                <item.icon className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-ink">{tx(lang, item.label)}</span>
                <span className="block text-xs text-soft">{tx(lang, item.hint)}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full border border-line text-sm"
        onClick={() => {
          const text = tx(lang, {
            ru: "Нур — исламский календарь: хиджра, намаз и сунна.",
            ar: "نور — التقويم الإسلامي: الهجرة والصلاة والسنة.",
            en: "Nur — an Islamic calendar: Hijri, prayer and Sunnah.",
          });
          const payload = { title: "Нур", text, url: window.location.href };
          if (navigator.share) void navigator.share(payload).catch(() => {});
          else void navigator.clipboard?.writeText(`${text} ${payload.url}`);
        }}
      >
        <Share2 className="size-4" />
        {tx(lang, { ru: "Поделиться", ar: "مشاركة", en: "Share" })}
      </button>
      <p className="mt-3 text-center text-xs leading-5 text-soft">
        {tx(lang, {
          ru: "Если «Нур» помогает, расскажите о нём близким. Рекламы в намазе нет.",
          ar: "إن نفعك نور فأخبره أهلك. لا إعلان في شاشات الصلاة.",
          en: "If Nur helps, tell your family. There are no ads on the prayer screens.",
        })}
      </p>
    </div>
  );
}
