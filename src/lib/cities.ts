import type { Lang, Tri } from "@/lib/i18n";
import { tx } from "@/lib/i18n";

export type City = {
  id: string;
  ru: string;
  en: string;
  ar: string;
  country: Tri;
  lat: number;
  lng: number;
  tz: string;
  popular?: boolean;
};

function c(
  id: string,
  ru: string,
  en: string,
  ar: string,
  cru: string,
  cen: string,
  car: string,
  lat: number,
  lng: number,
  tz: string,
  popular = false,
): City {
  return { id, ru, en, ar, country: { ru: cru, en: cen, ar: car }, lat, lng, tz, popular };
}

export const CITIES: City[] = [
  c("mecca", "Мекка", "Makkah", "مكة", "Саудовская Аравия", "Saudi Arabia", "السعودية", 21.4225, 39.8262, "Asia/Riyadh", true),
  c("medina", "Медина", "Madinah", "المدينة", "Саудовская Аравия", "Saudi Arabia", "السعودية", 24.4672, 39.6111, "Asia/Riyadh", true),
  c("riyadh", "Эр-Рияд", "Riyadh", "الرياض", "Саудовская Аравия", "Saudi Arabia", "السعودية", 24.7136, 46.6753, "Asia/Riyadh"),
  c("jeddah", "Джидда", "Jeddah", "جدة", "Саудовская Аравия", "Saudi Arabia", "السعودية", 21.5433, 39.1728, "Asia/Riyadh"),
  c("moscow", "Москва", "Moscow", "موسكو", "Россия", "Russia", "روسيا", 55.7558, 37.6173, "Europe/Moscow", true),
  c("spb", "Санкт-Петербург", "Saint Petersburg", "سانت بطرسبرغ", "Россия", "Russia", "روسيا", 59.9343, 30.3351, "Europe/Moscow"),
  c("kazan", "Казань", "Kazan", "قازان", "Россия", "Russia", "روسيا", 55.7887, 49.1221, "Europe/Moscow", true),
  c("ufa", "Уфа", "Ufa", "أوفا", "Россия", "Russia", "روسيا", 54.7388, 55.9721, "Asia/Yekaterinburg", true),
  c("grozny", "Грозный", "Grozny", "غروزني", "Россия", "Russia", "روسيا", 43.3178, 45.6982, "Europe/Moscow", true),
  c("makhachkala", "Махачкала", "Makhachkala", "محج قلعة", "Россия", "Russia", "روسيا", 42.9849, 47.5047, "Europe/Moscow", true),
  c("derbent", "Дербент", "Derbent", "دربند", "Россия", "Russia", "روسيا", 42.0578, 48.2906, "Europe/Moscow"),
  c("nalchik", "Нальчик", "Nalchik", "نالتشيك", "Россия", "Russia", "روسيا", 43.4853, 43.6071, "Europe/Moscow"),
  c("astrakhan", "Астрахань", "Astrakhan", "أستراخان", "Россия", "Russia", "روسيا", 46.3497, 48.0408, "Europe/Astrakhan"),
  c("nn", "Нижний Новгород", "Nizhny Novgorod", "نيجني نوفغورود", "Россия", "Russia", "روسيا", 56.3269, 44.0059, "Europe/Moscow"),
  c("samara", "Самара", "Samara", "سامارا", "Россия", "Russia", "روسيا", 53.1959, 50.1002, "Europe/Samara"),
  c("yekat", "Екатеринбург", "Yekaterinburg", "يكاترينبورغ", "Россия", "Russia", "روسيا", 56.8389, 60.6057, "Asia/Yekaterinburg"),
  c("nsk", "Новосибирск", "Novosibirsk", "نوفوسيبيرسك", "Россия", "Russia", "روسيا", 55.0084, 82.9357, "Asia/Novosibirsk"),
  c("omsk", "Омск", "Omsk", "أومسك", "Россия", "Russia", "روسيا", 54.9885, 73.3242, "Asia/Omsk"),
  c("chel", "Челябинск", "Chelyabinsk", "تشيليابينسك", "Россия", "Russia", "روسيا", 55.1644, 61.4368, "Asia/Yekaterinburg"),
  c("krasnodar", "Краснодар", "Krasnodar", "كراسنودار", "Россия", "Russia", "روسيا", 45.0355, 38.9753, "Europe/Moscow"),
  c("rostov", "Ростов-на-Дону", "Rostov-on-Don", "روستوف", "Россия", "Russia", "روسيا", 47.2357, 39.7015, "Europe/Moscow"),
  c("almet", "Альметьевск", "Almetyevsk", "ألماتييفسك", "Россия", "Russia", "روسيا", 54.9014, 52.2971, "Europe/Moscow"),
  c("istanbul", "Стамбул", "Istanbul", "إسطنبول", "Турция", "Turkey", "تركيا", 41.0082, 28.9784, "Europe/Istanbul", true),
  c("ankara", "Анкара", "Ankara", "أنقرة", "Турция", "Turkey", "تركيا", 39.9334, 32.8597, "Europe/Istanbul"),
  c("cairo", "Каир", "Cairo", "القاهرة", "Египет", "Egypt", "مصر", 30.0444, 31.2357, "Africa/Cairo", true),
  c("alex", "Александрия", "Alexandria", "الإسكندرية", "Египет", "Egypt", "مصر", 31.2001, 29.9187, "Africa/Cairo"),
  c("dubai", "Дубай", "Dubai", "دبي", "ОАЭ", "UAE", "الإمارات", 25.2048, 55.2708, "Asia/Dubai", true),
  c("abudhabi", "Абу-Даби", "Abu Dhabi", "أبوظبي", "ОАЭ", "UAE", "الإمارات", 24.4539, 54.3773, "Asia/Dubai"),
  c("doha", "Доха", "Doha", "الدوحة", "Катар", "Qatar", "قطر", 25.2854, 51.531, "Asia/Qatar"),
  c("kuwait", "Эль-Кувейт", "Kuwait City", "الكويت", "Кувейт", "Kuwait", "الكويت", 29.3759, 47.9774, "Asia/Kuwait"),
  c("manama", "Манама", "Manama", "المنامة", "Бахрейн", "Bahrain", "البحرين", 26.2235, 50.5876, "Asia/Bahrain"),
  c("muscat", "Маскат", "Muscat", "مسقط", "Оман", "Oman", "عُمان", 23.588, 58.3829, "Asia/Muscat"),
  c("amman", "Амман", "Amman", "عمّان", "Иордания", "Jordan", "الأردن", 31.9454, 35.9284, "Asia/Amman"),
  c("quds", "Аль-Кудс", "Jerusalem", "القدس", "Палестина", "Palestine", "فلسطين", 31.778, 35.2354, "Asia/Jerusalem", true),
  c("damascus", "Дамаск", "Damascus", "دمشق", "Сирия", "Syria", "سوريا", 33.5138, 36.2765, "Asia/Damascus"),
  c("beirut", "Бейрут", "Beirut", "بيروت", "Ливан", "Lebanon", "لبنان", 33.8938, 35.5018, "Asia/Beirut"),
  c("baghdad", "Багдад", "Baghdad", "بغداد", "Ирак", "Iraq", "العراق", 33.3152, 44.3661, "Asia/Baghdad"),
  c("sanaa", "Сана", "Sana'a", "صنعاء", "Йемен", "Yemen", "اليمن", 15.3694, 44.191, "Asia/Aden"),
  c("tehran", "Тегеран", "Tehran", "طهران", "Иран", "Iran", "إيران", 35.6892, 51.389, "Asia/Tehran"),
  c("karachi", "Карачи", "Karachi", "كراتشي", "Пакистан", "Pakistan", "باكستان", 24.8607, 67.0011, "Asia/Karachi"),
  c("lahore", "Лахор", "Lahore", "لاهور", "Пакистан", "Pakistan", "باكستان", 31.5204, 74.3587, "Asia/Karachi"),
  c("islamabad", "Исламабад", "Islamabad", "إسلام آباد", "Пакистан", "Pakistan", "باكستان", 33.6844, 73.0479, "Asia/Karachi"),
  c("delhi", "Дели", "Delhi", "دلهي", "Индия", "India", "الهند", 28.6139, 77.209, "Asia/Kolkata"),
  c("mumbai", "Мумбаи", "Mumbai", "مومباي", "Индия", "India", "الهند", 19.076, 72.8777, "Asia/Kolkata"),
  c("dhaka", "Дакка", "Dhaka", "دكا", "Бангладеш", "Bangladesh", "بنغلاديش", 23.8103, 90.4125, "Asia/Dhaka"),
  c("jakarta", "Джакарта", "Jakarta", "جاكرتا", "Индонезия", "Indonesia", "إندونيسيا", -6.2088, 106.8456, "Asia/Jakarta"),
  c("kl", "Куала-Лумпур", "Kuala Lumpur", "كوالالمبور", "Малайзия", "Malaysia", "ماليزيا", 3.139, 101.6869, "Asia/Kuala_Lumpur"),
  c("singapore", "Сингапур", "Singapore", "سنغافورة", "Сингапур", "Singapore", "سنغافورة", 1.3521, 103.8198, "Asia/Singapore"),
  c("tashkent", "Ташкент", "Tashkent", "طشقند", "Узбекистан", "Uzbekistan", "أوزبكستان", 41.2995, 69.2401, "Asia/Tashkent"),
  c("almaty", "Алматы", "Almaty", "ألماتي", "Казахстан", "Kazakhstan", "كازاخستان", 43.222, 76.8512, "Asia/Almaty"),
  c("astana", "Астана", "Astana", "أستانا", "Казахстан", "Kazakhstan", "كازاخстан", 51.1694, 71.4491, "Asia/Almaty"),
  c("bishkek", "Бишкек", "Bishkek", "بشكيك", "Кыргызстан", "Kyrgyzstan", "قيرغيزستان", 42.8746, 74.5698, "Asia/Bishkek"),
  c("dushanbe", "Душанбе", "Dushanbe", "دوشنبه", "Таджикистан", "Tajikistan", "طاجيكستان", 38.5598, 68.787, "Asia/Dushanbe"),
  c("baku", "Баку", "Baku", "باكو", "Азербайджан", "Azerbaijan", "أذربيجان", 40.4093, 49.8671, "Asia/Baku"),
  c("minsk", "Минск", "Minsk", "مينسك", "Беларусь", "Belarus", "بيلاروس", 53.9006, 27.559, "Europe/Minsk"),
  c("kyiv", "Киев", "Kyiv", "كييف", "Украина", "Ukraine", "أوكرانيا", 50.4501, 30.5234, "Europe/Kyiv"),
  c("london", "Лондон", "London", "لندن", "Британия", "Britain", "بريطانيا", 51.5074, -0.1278, "Europe/London"),
  c("paris", "Париж", "Paris", "باريس", "Франция", "France", "فرنسا", 48.8566, 2.3522, "Europe/Paris"),
  c("berlin", "Берлин", "Berlin", "برلين", "Германия", "Germany", "ألمانيا", 52.52, 13.405, "Europe/Berlin"),
  c("sarajevo", "Сараево", "Sarajevo", "سراييفو", "Босния", "Bosnia", "البوسنة", 43.8563, 18.4131, "Europe/Sarajevo"),
  c("casablanca", "Касабланка", "Casablanca", "الدار البيضاء", "Марокко", "Morocco", "المغرب", 33.5731, -7.5898, "Africa/Casablanca"),
  c("tunis", "Тунис", "Tunis", "تونس", "Тунис", "Tunisia", "تونس", 36.8065, 10.1815, "Africa/Tunis"),
  c("algiers", "Алжир", "Algiers", "الجزائر", "Алжир", "Algeria", "الجزائر", 36.7538, 3.0588, "Africa/Algiers"),
  c("tripoli", "Триполи", "Tripoli", "طرابلس", "Ливия", "Libya", "ليبيا", 32.8872, 13.1913, "Africa/Tripoli"),
  c("khartoum", "Хартум", "Khartoum", "الخرطوم", "Судан", "Sudan", "السودان", 15.5007, 32.5599, "Africa/Khartoum"),
  c("lagos", "Лагос", "Lagos", "لاغوس", "Нигерия", "Nigeria", "نيجيريا", 6.5244, 3.3792, "Africa/Lagos"),
  c("nyc", "Нью-Йорк", "New York", "نيويورك", "США", "USA", "أمريكا", 40.7128, -74.006, "America/New_York"),
  c("dearborn", "Дирборн", "Dearborn", "ديربورن", "США", "USA", "أمريكا", 42.3223, -83.1763, "America/Detroit"),
  c("toronto", "Торонто", "Toronto", "تورونتو", "Канада", "Canada", "كندا", 43.6532, -79.3832, "America/Toronto"),
  c("chicago", "Чикаго", "Chicago", "شيكاغو", "США", "USA", "أمريكا", 41.8781, -87.6298, "America/Chicago"),
];

export function cityById(id: string | undefined): City | undefined {
  if (!id) return undefined;
  return CITIES.find((city) => city.id === id);
}

function fold(value: string): string {
  return value
    .toLowerCase()
    .replaceAll("ё", "е")
    .replaceAll("أ", "ا")
    .replaceAll("إ", "ا")
    .replaceAll("آ", "ا")
    .replaceAll("ة", "ه")
    .replaceAll("ى", "ي")
    .replaceAll("ـ", "");
}

export function searchCities(query: string): City[] {
  const q = fold(query.trim());
  if (!q) return CITIES.filter((city) => city.popular);
  return CITIES.filter((city) => {
    const blob = fold(`${city.ru} ${city.en} ${city.ar} ${city.country.ru} ${city.country.en} ${city.country.ar}`);
    return blob.includes(q);
  }).slice(0, 24);
}

export function cityTitle(city: City, lang: Lang): string {
  return city[lang];
}

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const r = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * r * Math.asin(Math.sqrt(a));
}

export function nearestCity(lat: number, lng: number): { city: City; km: number } | null {
  let best: { city: City; km: number } | null = null;
  for (const city of CITIES) {
    const km = haversine(lat, lng, city.lat, city.lng);
    if (!best || km < best.km) best = { city, km };
  }
  return best;
}

export const GEO_FAIL: Tri = {
  ru: "Не удалось определить место. Выберите город из списка.",
  ar: "تعذر تحديد الموقع. اختر مدينة من القائمة.",
  en: "Location was not found. Choose a city from the list.",
};

export const GEO_NONE: Tri = {
  ru: "Геолокация в этом браузере недоступна.",
  ar: "الموقع غير متاح في هذا المتصفح.",
  en: "Location is not available in this browser.",
};

export function locate(onOk: (lat: number, lng: number) => void, onErr: (text: Tri) => void) {
  if (!navigator.geolocation) {
    onErr(GEO_NONE);
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => onOk(pos.coords.latitude, pos.coords.longitude),
    () => onErr(GEO_FAIL),
    { enableHighAccuracy: true, timeout: 12000, maximumAge: 600000 },
  );
}

export function placeTitle(
  place: { source: "city" | "gps"; cityId?: string } | null,
  lang: Lang,
): string {
  if (!place) {
    return tx(lang, { ru: "Город не выбран", ar: "لم تُختر مدينة", en: "No city yet" });
  }
  const city = cityById(place.cityId);
  const name = city ? city[lang] : tx(lang, { ru: "Моё место", ar: "موقعي", en: "My location" });
  if (place.source === "gps") return `${name} · GPS`;
  return name;
}
