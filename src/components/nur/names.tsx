import { useMemo, useState } from "react";
import { BookReader } from "@/components/nur/book-reader";
import { ALLAH_NAMES } from "@/lib/names";
import { digits } from "@/lib/hijri";
import { tx } from "@/lib/i18n";
import { useNur } from "@/lib/store";

function fold(value: string): string {
  return value.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
}

export function NamesScreen() {
  const lang = useNur((s) => s.lang);
  const [section, setSection] = useState<"list" | "book">("list");

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {section === "list" ? (
        <div className="min-h-0 flex-1 overflow-y-auto">
          <NamesList onOpenBook={() => setSection("book")} />
        </div>
      ) : (
        <BookReader />
      )}
      <div className="grid grid-cols-2 border-t border-line bg-card">
        <button
          type="button"
          onClick={() => setSection("list")}
          className={`flex flex-col items-center gap-1 px-2 py-2.5 text-xs ${section === "list" ? "text-goldink" : "text-soft"}`}
        >
          {tx(lang, { ru: "99 имён", ar: "٩٩ اسماً", en: "99 names" })}
          <span className={`h-0.5 w-8 rounded-full ${section === "list" ? "bg-gold" : "bg-transparent"}`} />
        </button>
        <button
          type="button"
          onClick={() => setSection("book")}
          className={`flex flex-col items-center gap-1 px-2 py-2.5 text-xs ${section === "book" ? "text-goldink" : "text-soft"}`}
        >
          {tx(lang, { ru: "Книга", ar: "الكتاب", en: "Book" })}
          <span className={`h-0.5 w-8 rounded-full ${section === "book" ? "bg-gold" : "bg-transparent"}`} />
        </button>
      </div>
    </div>
  );
}

function NamesList({ onOpenBook }: { onOpenBook: () => void }) {
  const lang = useNur((s) => s.lang);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<number | null>(null);
  const needle = fold(query.trim());
  const list = useMemo(
    () =>
      ALLAH_NAMES.map((name, index) => ({ name, n: index + 1 })).filter(({ name, n }) => {
        if (!needle) return true;
        const blob = fold(`${n} ${name.ar} ${name.ru} ${name.en} ${name.mean.ru} ${name.mean.en} ${name.mean.ar}`);
        return blob.includes(needle);
      }),
    [needle],
  );

  return (
    <div className="px-4 pb-6 pt-4">
      <header>
        <h1 className="text-2xl font-semibold text-ink">
          {tx(lang, { ru: "99 имён Аллаха", ar: "أسماء الله الحسنى", en: "The 99 names of Allah" })}
        </h1>
        <p className="mt-1 text-sm leading-6 text-soft">
          {tx(lang, {
            ru: "Порядок и краткий смысл — по Саиду аль-Кахтани, в свете Корана и Сунны. Имён больше, чем девяносто девять.",
            ar: "الترتيب والمعنى المختصر عن سعيد القحطاني في ضوء الكتاب والسنة. والأسماء لا تُحد بعدد.",
            en: "Order and short meaning follow Sa'id al-Qahtani, in the light of the Quran and Sunnah. The names are not limited to ninety-nine.",
          })}
        </p>
      </header>

      <section className="mt-4 rounded-3xl bg-header p-4 text-cream">
        <p className="font-arabic text-lg leading-loose text-gold">
          إِنَّ لِلَّهِ تِسْعَةً وَتِسْعِينَ اسْمًا، مَنْ أَحْصَاهَا دَخَلَ الْجَنَّةَ
        </p>
        <p className="mt-1 text-sm leading-6">
          {tx(lang, {
            ru: "У Аллаха девяносто девять имён. Кто сочтёт их, войдёт в Рай.",
            ar: "إن لله تسعة وتسعين اسماً، من أحصاها دخل الجنة.",
            en: "Allah has ninety-nine names. Whoever enumerates them will enter Paradise.",
          })}
        </p>
        <p className="mt-1 text-xs text-gold">
          {tx(lang, { ru: "аль-Бухари и Муслим", ar: "البخاري ومسلم", en: "al-Bukhari and Muslim" })}
        </p>
      </section>

      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={tx(lang, { ru: "Найти имя", ar: "ابحث عن اسم", en: "Find a name" })}
        className="mt-4 h-12 w-full rounded-2xl border border-line bg-chip px-4 text-ink outline-none"
      />

      <ul className="mt-3 space-y-2">
        {list.map(({ name, n }) => {
          const expanded = open === n;
          return (
            <li key={n}>
              <button
                type="button"
                onClick={() => setOpen(expanded ? null : n)}
                className="w-full rounded-3xl border border-line bg-card px-4 py-3 text-start shadow-card"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-arabic text-xl leading-snug text-ink">{name.ar}</p>
                  <span className="shrink-0 text-xs tabular-nums text-goldink">{digits(n, lang)}</span>
                </div>
                <p className="text-sm font-medium text-ink">{lang === "ar" ? name.ru : lang === "en" ? name.en : name.ru}</p>
                <p className="mt-1 text-sm leading-6 text-soft">{tx(lang, name.mean)}</p>
                {expanded ? <p className="mt-2 text-xs text-goldink">{tx(lang, name.src)}</p> : null}
              </button>
            </li>
          );
        })}
      </ul>
      {list.length === 0 ? (
        <p className="mt-6 text-center text-sm text-soft">
          {tx(lang, { ru: "Такого имени нет в этом списке.", ar: "لا يوجد هذا الاسم في القائمة.", en: "That name is not in this list." })}
        </p>
      ) : null}

      <button type="button" onClick={onOpenBook} className="mt-4 w-full rounded-3xl bg-header p-4 text-start text-cream">
        <p className="text-xs text-gold">{tx(lang, { ru: "Книга", ar: "الكتاب", en: "Book" })}</p>
        <p className="mt-1 text-lg font-semibold leading-snug">
          {tx(lang, {
            ru: "Высочайший метод в разъяснении имён Аллаха",
            ar: "النهج الأسمى في شرح أسماء الله الحسنى",
            en: "The highest method in explaining the names of Allah",
          })}
        </p>
        <p className="mt-2 text-sm leading-6 text-cream/85">
          {tx(lang, {
            ru: "Мухаммад аль-Хамуд ан-Наждий. Перевод Райханы бинт Мухаммад. Читать по главам.",
            ar: "محمد الحمود النجدي. ترجمة ريحانة بنت محمد.",
            en: "Muhammad al-Hamud an-Najdi. Translation by Rayhana bint Muhammad. Read by chapter.",
          })}
        </p>
      </button>
    </div>
  );
}
