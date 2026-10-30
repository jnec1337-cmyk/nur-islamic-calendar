import { ChevronLeft } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { cityTitle, locate, nearestCity, searchCities, type City } from "@/lib/cities";
import { tx, type Tri } from "@/lib/i18n";
import { useNur, type Place } from "@/lib/store";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-3xl border border-line bg-card p-4 shadow-card ${className}`}>{children}</section>;
}

export function Primary({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="flex h-12 w-full items-center justify-center rounded-full bg-btn px-4 text-sm font-semibold text-onbtn disabled:opacity-40"
    >
      {children}
    </button>
  );
}

export function PageHead({ title, onBack }: { title: string; onBack: () => void }) {
  const lang = useNur((s) => s.lang);
  const back = tx(lang, { ru: "Назад", ar: "رجوع", en: "Back" });
  return (
    <div className="sticky top-0 z-10 flex items-center gap-2 bg-canvas/95 px-2 py-2 backdrop-blur">
      <button
        type="button"
        onClick={onBack}
        aria-label={back}
        className="flex size-11 items-center justify-center rounded-full text-ink"
      >
        <ChevronLeft className="size-6 rtl:rotate-180" />
      </button>
      <h1 className="min-w-0 flex-1 truncate text-lg font-semibold text-ink">{title}</h1>
    </div>
  );
}

export function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const lang = useNur((s) => s.lang);
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-night/60" onClick={onClose}>
      <div
        role="dialog"
        aria-label={title}
        className="max-h-[86dvh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-card px-5 pb-8 pt-4 shadow-card"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-line" />
        <div className="mb-3 flex items-start justify-between gap-3">
          <h2 className="text-lg font-semibold text-ink">{title}</h2>
          <button type="button" onClick={onClose} className="text-sm text-goldink">
            {tx(lang, { ru: "Закрыть", ar: "إغلاق", en: "Close" })}
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ToggleRow({
  label,
  hint,
  on,
  onChange,
}: {
  label: string;
  hint?: string;
  on: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className="flex w-full items-center gap-3 rounded-3xl border border-line bg-card px-4 py-3 text-start"
    >
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-ink">{label}</span>
        {hint ? <span className="mt-1 block text-xs leading-5 text-soft">{hint}</span> : null}
      </span>
      <span className={`h-7 w-12 shrink-0 rounded-full p-1 ${on ? "bg-btn" : "bg-line"}`}>
        <span className={`block size-5 rounded-full bg-cream ${on ? "translate-x-5 rtl:-translate-x-5" : ""}`} />
      </span>
    </button>
  );
}

export function cityToPlace(city: City): Place {
  return { source: "city", cityId: city.id, lat: city.lat, lng: city.lng, tz: city.tz };
}

export function gpsToPlace(lat: number, lng: number): Place {
  const near = nearestCity(lat, lng);
  return {
    source: "gps",
    cityId: near && near.km < 80 ? near.city.id : undefined,
    lat,
    lng,
  };
}

export function CitySearch({ onPick }: { onPick: (place: Place) => void }) {
  const lang = useNur((s) => s.lang);
  const [query, setQuery] = useState("");
  const [note, setNote] = useState<Tri | null>(null);
  const [pending, setPending] = useState(false);
  const list = useMemo(() => searchCities(query), [query]);
  return (
    <div>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={tx(lang, { ru: "Город", ar: "المدينة", en: "City" })}
        className="h-12 w-full rounded-2xl border border-line bg-chip px-4 text-ink outline-none"
      />
      <button
        type="button"
        className="mt-2 flex h-11 w-full items-center justify-center rounded-full border border-line text-sm text-ink"
        onClick={() => {
          setPending(true);
          setNote(null);
          locate(
            (lat, lng) => {
              setPending(false);
              onPick(gpsToPlace(lat, lng));
            },
            (text) => {
              setPending(false);
              setNote(text);
            },
          );
        }}
      >
        {pending
          ? tx(lang, { ru: "Определяем…", ar: "جارٍ التحديد…", en: "Locating…" })
          : tx(lang, { ru: "Определить по GPS", ar: "تحديد الموقع", en: "Use GPS" })}
      </button>
      {note ? <p className="mt-2 text-sm text-danger">{tx(lang, note)}</p> : null}
      <ul className="mt-2 max-h-64 overflow-y-auto">
        {list.map((city) => (
          <li key={city.id}>
            <button
              type="button"
              onClick={() => onPick(cityToPlace(city))}
              className="flex w-full flex-col rounded-2xl px-3 py-3 text-start hover:bg-chip"
            >
              <span className="text-sm font-medium text-ink">{cityTitle(city, lang)}</span>
              <span className="text-xs text-soft">{tx(lang, city.country)}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
