import type { Tri } from "@/lib/i18n";

export type Quote = {
  kind: "ayah" | "hadith";
  ar: string;
  text: Tri;
  ref: Tri;
};

export type Rule =
  | { type: "days"; month: number; days: number[] }
  | { type: "span"; month: number; from: number; to: number }
  | { type: "weekdays"; days: number[] }
  | { type: "month"; month: number }
  | { type: "months"; months: number[] };

export type Occasion = {
  id: string;
  section: "eid" | "great" | "event" | "disputed" | "practice";
  priority: number;
  hero: boolean;
  frame: "gold" | "none";
  disputed?: boolean;
  rule?: Rule;
  name: Tri;
  when: Tri;
  meaning: Tri;
  dos: Tri;
  dont: Tri;
  quote: Quote;
};

const bukhariMuslim: Tri = {
  ru: "аль-Бухари и Муслим",
  ar: "رواه البخاري ومسلم",
  en: "Bukhari and Muslim",
};
const muslim: Tri = { ru: "Муслим", ar: "رواه مسلم", en: "Muslim" };
const bukhari: Tri = { ru: "аль-Бухари", ar: "رواه البخاري", en: "Bukhari" };
const tirmidhi: Tri = { ru: "ат-Тирмизи", ar: "رواه الترمذي", en: "Tirmidhi" };
const abuDawud: Tri = { ru: "Абу Дауд", ar: "رواه أبو داود", en: "Abu Dawud" };

export const OCCASIONS: Occasion[] = [
  {
    id: "eid-fitr",
    section: "eid",
    priority: 1,
    hero: true,
    frame: "gold",
    rule: { type: "days", month: 10, days: [1] },
    name: { ru: "Ид аль-Фитр", ar: "عيد الفطر", en: "Eid al-Fitr" },
    when: { ru: "1 шавваля", ar: "١ شوّال", en: "1 Shawwal" },
    meaning: {
      ru: "Праздник разговения после Рамадана. Один из двух праздников Ислама.",
      ar: "عيد الفطر بعد رمضان. أحد عيدي المسلمين.",
      en: "The festival of breaking the fast after Ramadan. One of the two festivals of Islam.",
    },
    dos: {
      ru: "Намаз ида, закят аль-фитр до намаза, такбир, радость и поддержание родства.",
      ar: "صلاة العيد، وزكاة الفطر قبل الصلاة، والتكبير، وصلة الرحم.",
      en: "The Eid prayer, zakat al-fitr before the prayer, takbir, and keeping family ties.",
    },
    dont: {
      ru: "Пост в этот день запрещён.",
      ar: "يُنهى عن صيام هذا اليوم.",
      en: "Fasting on this day is forbidden.",
    },
    quote: {
      kind: "hadith",
      ar: "نَهَى رَسُولُ اللَّهِ ﷺ عَنْ صَوْمِ يَوْمِ الْفِطْرِ وَيَوْمِ النَّحْرِ",
      text: {
        ru: "Посланник Аллаха ﷺ запретил поститься в день Фитра и в день жертвоприношения.",
        ar: "نهى رسول الله ﷺ عن صوم يوم الفطر ويوم النحر.",
        en: "The Messenger of Allah ﷺ forbade fasting on the day of Fitr and the day of sacrifice.",
      },
      ref: bukhariMuslim,
    },
  },
  {
    id: "eid-adha",
    section: "eid",
    priority: 1,
    hero: true,
    frame: "gold",
    rule: { type: "days", month: 12, days: [10] },
    name: { ru: "Ид аль-Адха", ar: "عيد الأضحى", en: "Eid al-Adha" },
    when: { ru: "10 зуль-хиджжа", ar: "١٠ ذو الحجة", en: "10 Dhul-Hijjah" },
    meaning: {
      ru: "Праздник жертвоприношения. Второй из двух праздников Ислама.",
      ar: "عيد الأضحى. العيد الثاني من عيدي الإسلام.",
      en: "The festival of sacrifice. The second of the two festivals of Islam.",
    },
    dos: {
      ru: "Намаз ида, такбир и жертва для того, кто может. Мясо — семье, близким и нуждающимся.",
      ar: "صلاة العيد والتكبير والأضحية لمن قدر، ويُطعِم منها أهله والمساكين.",
      en: "The Eid prayer, takbir, and a sacrifice for whoever is able. Share the meat.",
    },
    dont: {
      ru: "Пост в этот день запрещён.",
      ar: "يُنهى عن صيام هذا اليوم.",
      en: "Fasting on this day is forbidden.",
    },
    quote: {
      kind: "hadith",
      ar: "نَهَى رَسُولُ اللَّهِ ﷺ عَنْ صَوْمِ يَوْمِ الْفِطْرِ وَيَوْمِ النَّحْرِ",
      text: {
        ru: "Посланник Аллаха ﷺ запретил поститься в день Фитра и в день жертвоприношения.",
        ar: "نهى رسول الله ﷺ عن صوم يوم الفطر ويوم النحر.",
        en: "The Messenger of Allah ﷺ forbade fasting on Eid al-Fitr and the day of sacrifice.",
      },
      ref: bukhariMuslim,
    },
  },
  {
    id: "arafah",
    section: "great",
    priority: 2,
    hero: true,
    frame: "gold",
    rule: { type: "days", month: 12, days: [9] },
    name: { ru: "День Арафа", ar: "يوم عرفة", en: "Day of Arafah" },
    when: { ru: "9 зуль-хиджжа", ar: "٩ ذو الحجة", en: "9 Dhul-Hijjah" },
    meaning: {
      ru: "Лучший день года. Паломники стоят на Арафате. Для остальных — лучший день для поста и дуа.",
      ar: "أفضل أيام السنة. الحاج بعرفة، ولغير الحاج صيام ودعاء.",
      en: "The best day of the year. Pilgrims stand at Arafah. Others are encouraged to fast and make dua.",
    },
    dos: {
      ru: "Пост тем, кто не на хадже. Много дуа и такбир.",
      ar: "الصيام لغير الحاج، والإكثار من الدعاء والتكبير.",
      en: "Fast if you are not on Hajj. Make abundant dua and takbir.",
    },
    dont: {
      ru: "Пост не обязателен. Паломник на Арафате в этот день не постится.",
      ar: "ليس الصيام واجباً، والحاج بعرفة لا يصوم.",
      en: "The fast is not obligatory. The pilgrim at Arafah does not fast.",
    },
    quote: {
      kind: "hadith",
      ar: "صِيَامُ يَوْمِ عَرَفَةَ أَحْتَسِبُ عَلَى اللَّهِ أَنْ يُكَفِّرَ السَّنَةَ الَّتِي قَبْلَهُ وَالسَّنَةَ الَّتِي بَعْدَهُ",
      text: {
        ru: "Пост в день Арафа: я надеюсь на Аллаха, что он искупит предыдущий и следующий год.",
        ar: "صيام يوم عرفة أحتسب على الله أن يكفر السنة التي قبله والتي بعده.",
        en: "Fasting Arafah, I hope, expiates the year before it and the year after it.",
      },
      ref: muslim,
    },
  },
  {
    id: "ten-days",
    section: "great",
    priority: 6,
    hero: true,
    frame: "gold",
    rule: { type: "span", month: 12, from: 1, to: 10 },
    name: { ru: "Первые десять дней зуль-хиджжа", ar: "عشر ذي الحجة", en: "The first ten of Dhul-Hijjah" },
    when: { ru: "1–10 зуль-хиджжа", ar: "١–١٠ ذو الحجة", en: "1–10 Dhul-Hijjah" },
    meaning: {
      ru: "Лучшие дни мира для благих дел: поминание, пост в подходящие дни, милостыня, жертва.",
      ar: "أفضل أيام الدنيا للعمل الصالح: الذكر والصدقة والأضحية.",
      en: "The best days of the world for good deeds: remembrance, charity, and sacrifice.",
    },
    dos: {
      ru: "Увеличить благие дела и такбир. Пост — кроме дня ида.",
      ar: "الإكثار من العمل الصالح والتكبير. والصيام فيما يُشرع، لا يوم العيد.",
      en: "Increase good deeds and takbir. Fast on the days fasting is allowed, not on Eid.",
    },
    dont: {
      ru: "10-е число — праздник, пост в него запрещён.",
      ar: "اليوم العاشر عيد، وصيامه منهي عنه.",
      en: "The 10th is Eid. Fasting it is forbidden.",
    },
    quote: {
      kind: "hadith",
      ar: "مَا مِنْ أَيَّامٍ الْعَمَلُ الصَّالِحُ فِيهِنَّ أَحَبُّ إِلَى اللَّهِ مِنْ هَذِهِ الْأَيَّامِ الْعَشْرِ",
      text: {
        ru: "Нет дней, в которые благое дело любимее Аллаху, чем эти десять дней.",
        ar: "ما من أيام العمل الصالح فيهن أحب إلى الله من هذه الأيام العشر.",
        en: "There are no days in which righteous deeds are dearer to Allah than these ten.",
      },
      ref: bukhari,
    },
  },
  {
    id: "tashreeq",
    section: "great",
    priority: 3,
    hero: true,
    frame: "gold",
    rule: { type: "days", month: 12, days: [11, 12, 13] },
    name: { ru: "Дни ташрика", ar: "أيام التشريق", en: "Days of Tashreeq" },
    when: { ru: "11, 12 и 13 зуль-хиджжа", ar: "١١ و١٢ و١٣ ذو الحجة", en: "11, 12 and 13 Dhul-Hijjah" },
    meaning: {
      ru: "Дни еды, питья и поминания Аллаха после жертвоприношения.",
      ar: "أيام أكل وشرب وذكر لله بعد النحر.",
      en: "Days of eating, drinking, and remembering Allah after the sacrifice.",
    },
    dos: {
      ru: "Такбир. Есть и радоваться дозволенным. Поминать Аллаха.",
      ar: "التكبير والأكل من النسك وذكر الله.",
      en: "Say the takbir, eat from what is lawful, and remember Allah.",
    },
    dont: {
      ru: "Пост в эти дни не допускается. Исключение в хадисе касается паломника, который не принёс жертву.",
      ar: "لا يُصام فيها. وجاء استثناء الحاج الذي لم يجد الهدي.",
      en: "Fasting is not allowed. A hadith makes an exception for the pilgrim who has no sacrificial animal.",
    },
    quote: {
      kind: "hadith",
      ar: "أَيَّامُ التَّشْرِيقِ أَيَّامُ أَكْلٍ وَشُرْبٍ وَذِكْرٍ لِلَّهِ",
      text: {
        ru: "Дни ташрика — дни еды, питья и поминания Аллаха.",
        ar: "أيام التشريق أيام أكل وشرب وذكر لله.",
        en: "The days of Tashreeq are days of eating, drinking, and remembrance of Allah.",
      },
      ref: muslim,
    },
  },
  {
    id: "ashura",
    section: "great",
    priority: 2,
    hero: true,
    frame: "gold",
    rule: { type: "days", month: 1, days: [10] },
    name: { ru: "Ашура", ar: "عاشوراء", en: "Ashura" },
    when: { ru: "10 мухаррама", ar: "١٠ محرم", en: "10 Muharram" },
    meaning: {
      ru: "День, в который Пророк ﷺ постился и велел поститься. Лучше соединить его с 9-м или с 11-м.",
      ar: "يوم صامه النبي ﷺ وأمر بصيامه. والأفضل ضم التاسع أو الحادي عشر.",
      en: "A day the Prophet ﷺ fasted and told others to fast. Prefer pairing it with the 9th or the 11th.",
    },
    dos: {
      ru: "Пост. Предпочтительно 9 и 10, либо 10 и 11, чтобы не уподобляться другим общинам в посте одного лишь 10-го.",
      ar: "الصيام. والأولى التاسع مع العاشر، أو العاشر مع الحادي عشر.",
      en: "Fast. Preferably the 9th with the 10th, or the 10th with the 11th.",
    },
    dont: {
      ru: "Не устраивать обрядов скорби или праздника, которых не было в сунне.",
      ar: "لا تُحدَث طقوس لم تأتِ بها السنة.",
      en: "Do not add rituals of mourning or celebration that the Sunnah did not bring.",
    },
    quote: {
      kind: "hadith",
      ar: "صِيَامُ يَوْمِ عَاشُورَاءَ أَحْتَسِبُ عَلَى اللَّهِ أَنْ يُكَفِّرَ السَّنَةَ الَّتِي قَبْلَهُ",
      text: {
        ru: "Пост в день Ашура: я надеюсь на Аллаха, что он искупит предыдущий год.",
        ar: "صيام يوم عاشوراء أحتسب على الله أن يكفر السنة التي قبله.",
        en: "Fasting Ashura, I hope, expiates the year before it.",
      },
      ref: muslim,
    },
  },
  {
    id: "tasua",
    section: "great",
    priority: 3,
    hero: true,
    frame: "gold",
    rule: { type: "days", month: 1, days: [9] },
    name: { ru: "Тасу‘а", ar: "تاسوعاء", en: "Tasua" },
    when: { ru: "9 мухаррама", ar: "٩ محرم", en: "9 Muharram" },
    meaning: {
      ru: "День перед Ашурой. Пророк ﷺ хотел поститься в него вместе с десятым.",
      ar: "اليوم التاسع. أراد النبي ﷺ صيامه مع العاشر.",
      en: "The day before Ashura. The Prophet ﷺ intended to fast it together with the tenth.",
    },
    dos: {
      ru: "Пост вместе с Ашурой.",
      ar: "صيامه مع عاشوراء.",
      en: "Fast it together with Ashura.",
    },
    dont: {
      ru: "Не заменяет Ашуру, а дополняет её.",
      ar: "لا يغني عن عاشوراء، بل يُضم إليه.",
      en: "It does not replace Ashura. It is added to it.",
    },
    quote: {
      kind: "hadith",
      ar: "لَئِنْ بَقِيتُ إِلَى قَابِلٍ لَأَصُومَنَّ التَّاسِعَ",
      text: {
        ru: "Если доживу до следующего года, непременно буду поститься и в девятый день.",
        ar: "لئن بقيت إلى قابل لأصومن التاسع.",
        en: "If I live until next year, I shall certainly fast the ninth.",
      },
      ref: muslim,
    },
  },
  {
    id: "laylat",
    section: "great",
    priority: 2,
    hero: true,
    frame: "gold",
    rule: { type: "days", month: 9, days: [21, 23, 25, 27, 29] },
    name: { ru: "Ляйлят аль-Кадр", ar: "ليلة القدر", en: "Laylat al-Qadr" },
    when: {
      ru: "Нечётные из последних десяти ночей Рамадана",
      ar: "الأوتار من العشر الأواخر من رمضان",
      en: "The odd nights of the last ten of Ramadan",
    },
    meaning: {
      ru: "Ночь лучше тысячи месяцев. Её ищут в последние десять ночей, особенно в нечётные. Точная ночь не закреплена одним числом.",
      ar: "ليلة خير من ألف شهر. تُلتمس في العشر الأواخر، وآكدها الأوتار.",
      en: "A night better than a thousand months. It is sought in the last ten nights, especially the odd ones.",
    },
    dos: {
      ru: "Ночной намаз, Коран и дуа: «О Аллах, Ты Прощающий, любишь прощение, прости меня».",
      ar: "قيام الليل والقرآن والدعاء: اللهم إنك عفو تحب العفو فاعف عني.",
      en: "Night prayer, Quran, and the dua: O Allah, You are Pardoning and love pardon, so pardon me.",
    },
    dont: {
      ru: "Не утверждать, что это обязательно 27-я ночь, и не оставлять остальные нечётные.",
      ar: "لا يُجزم بأنها ليلة سبع وعشرين ويُهمل ما سواها.",
      en: "Do not insist it must be the 27th and neglect the other odd nights.",
    },
    quote: {
      kind: "ayah",
      ar: "لَيْلَةُ الْقَدْرِ خَيْرٌ مِنْ أَلْفِ شَهْرٍ",
      text: {
        ru: "Ночь предопределения лучше тысячи месяцев.",
        ar: "ليلة القدر خير من ألف شهر.",
        en: "The Night of Decree is better than a thousand months.",
      },
      ref: { ru: "Коран, 97:3", ar: "القرآن، القدر ٣", en: "Quran 97:3" },
    },
  },
  {
    id: "ramadan",
    section: "great",
    priority: 4,
    hero: true,
    frame: "gold",
    rule: { type: "days", month: 9, days: [1] },
    name: { ru: "Начало Рамадана", ar: "غرة رمضان", en: "Start of Ramadan" },
    when: { ru: "1 рамадана", ar: "١ رمضان", en: "1 Ramadan" },
    meaning: {
      ru: "Начало месяца обязательного поста. Ночь наступает с магриба накануне.",
      ar: "بداية شهر الصيام الواجب. ويدخل بليلة غرة رمضان بعد المغرب.",
      en: "The start of the month of obligatory fasting. The night begins at Maghrib.",
    },
    dos: {
      ru: "Пост всего месяца, намаз, Коран, щедрость.",
      ar: "صيام الشهر والصلاة والقرآن والصدقة.",
      en: "Fast the month, pray, read the Quran, and give in charity.",
    },
    dont: {
      ru: "Не начинать пост наугад, если местное видение луны ещё не подтверждено.",
      ar: "لا يُبدأ بالصيام جزماً قبل ثبوت الشهر.",
      en: "Do not treat the start as certain before the month is established locally.",
    },
    quote: {
      kind: "ayah",
      ar: "شَهْرُ رَمَضَانَ الَّذِي أُنزِلَ فِيهِ الْقُرْآنُ",
      text: {
        ru: "Месяц Рамадан, в который ниспослан Коран.",
        ar: "شهر رمضان الذي أنزل فيه القرآن.",
        en: "The month of Ramadan in which the Quran was sent down.",
      },
      ref: { ru: "Коран, 2:185", ar: "القرآن، البقرة ١٨٥", en: "Quran 2:185" },
    },
  },
  {
    id: "shawwal",
    section: "great",
    priority: 8,
    hero: false,
    frame: "none",
    rule: { type: "span", month: 10, from: 2, to: 7 },
    name: { ru: "Шесть дней шавваля", ar: "ست من شوال", en: "Six days of Shawwal" },
    when: {
      ru: "Любые шесть дней шавваля после ида. В календаре подсвечены 2–7 как удобное начало.",
      ar: "أي ستة أيام من شوال بعد العيد. وأُبرز ٢–٧ تيسيراً.",
      en: "Any six days of Shawwal after Eid. Days 2–7 are highlighted as an easy start.",
    },
    meaning: {
      ru: "Кто добавил шесть дней после Рамадана, подобен постившемуся весь год.",
      ar: "من أتبع رمضان ستاً من شوال كان كصيام الدهر.",
      en: "Whoever adds six days of Shawwal after Ramadan is like one who fasted the whole year.",
    },
    dos: {
      ru: "Пост в любые шесть дней месяца, подряд или раздельно, только не в день ида.",
      ar: "صيام ستة أيام متفرقة أو متتابعة، لا يوم العيد.",
      en: "Fast any six days, together or apart, but not on Eid itself.",
    },
    dont: {
      ru: "Не поститься 1 шавваля.",
      ar: "لا يُصام يوم العيد.",
      en: "Do not fast on 1 Shawwal.",
    },
    quote: {
      kind: "hadith",
      ar: "مَنْ صَامَ رَمَضَانَ ثُمَّ أَتْبَعَهُ سِتًّا مِنْ شَوَّالٍ كَانَ كَصِيَامِ الدَّهْرِ",
      text: {
        ru: "Кто постился в Рамадан, а затем шесть дней шавваля, тот как постившийся весь год.",
        ar: "من صام رمضان ثم أتبعه ستاً من شوال كان كصيام الدهر.",
        en: "Whoever fasts Ramadan and follows it with six of Shawwal, it is like fasting the whole year.",
      },
      ref: muslim,
    },
  },
  {
    id: "white",
    section: "practice",
    priority: 9,
    hero: false,
    frame: "none",
    rule: { type: "days", month: 0, days: [13, 14, 15] },
    name: { ru: "Белые дни", ar: "الأيام البيض", en: "The white days" },
    when: { ru: "13, 14 и 15 каждого лунного месяца", ar: "١٣ و١٤ و١٥ من كل شهر", en: "13, 14 and 15 of every lunar month" },
    meaning: {
      ru: "Три дня середины лунного месяца. Их пост Пророк ﷺ любил и советовал.",
      ar: "ثلاثة أيام من وسط الشهر كان النبي ﷺ يصومها.",
      en: "Three mid-month days the Prophet ﷺ liked to fast.",
    },
    dos: {
      ru: "Пост, если день не совпал с запретным.",
      ar: "صيامها ما لم توافق يوماً منهيّاً عن صيامه.",
      en: "Fast them unless the day is one on which fasting is forbidden.",
    },
    dont: {
      ru: "Если белый день выпал на ид или ташрик, пост не держат.",
      ar: "إن وافقت عيداً أو أيام التشريق فلا تُصام.",
      en: "If one falls on Eid or Tashreeq, it is not fasted.",
    },
    quote: {
      kind: "hadith",
      ar: "إِذَا صُمْتَ مِنَ الشَّهْرِ ثَلَاثَةَ أَيَّامٍ فَصُمْ ثَلَاثَ عَشْرَةَ وَأَرْبَعَ عَشْرَةَ وَخَمْسَ عَشْرَةَ",
      text: {
        ru: "Если постишься три дня в месяце, то постись тринадцатый, четырнадцатый и пятнадцатый.",
        ar: "إذا صمت من الشهر ثلاثة أيام فصم ثلاث عشرة وأربع عشرة وخمس عشرة.",
        en: "If you fast three days of the month, fast the thirteenth, fourteenth and fifteenth.",
      },
      ref: { ru: "Абу Дауд и ат-Тирмизи", ar: "أبو داود والترمذي", en: "Abu Dawud and Tirmidhi" },
    },
  },
  {
    id: "week-fast",
    section: "practice",
    priority: 10,
    hero: false,
    frame: "none",
    rule: { type: "weekdays", days: [1, 4] },
    name: { ru: "Понедельник и четверг", ar: "الاثنين والخميس", en: "Monday and Thursday" },
    when: { ru: "Каждую неделю", ar: "كل أسبوع", en: "Every week" },
    meaning: {
      ru: "Пророк ﷺ любил поститься в эти дни: дела представляются Аллаху.",
      ar: "كان النبي ﷺ يتحرّى صيامهما، لأن الأعمال تُعرض فيهما.",
      en: "The Prophet ﷺ liked to fast them, because deeds are presented on these days.",
    },
    dos: {
      ru: "Добровольный пост, если нет запрета этого дня.",
      ar: "صيام تطوع ما لم يكن اليوم منهياً عن صيامه.",
      en: "A voluntary fast, unless fasting that day is forbidden.",
    },
    dont: {
      ru: "Это сунна, не долг. Пропуск без греха.",
      ar: "سنة لا فريضة، وتركها ليس إثماً.",
      en: "It is Sunnah, not a duty. Missing it is not a sin.",
    },
    quote: {
      kind: "hadith",
      ar: "تُعْرَضُ الْأَعْمَالُ يَوْمَ الِاثْنَيْنِ وَالْخَمِيسِ، فَأُحِبُّ أَنْ يُعْرَضَ عَمَلِي وَأَنَا صَائِمٌ",
      text: {
        ru: "Дела представляются в понедельник и четверг, и я люблю, чтобы моё дело представлялось, когда я пощусь.",
        ar: "تُعرض الأعمال يوم الاثنين والخميس، فأحب أن يُعرض عملي وأنا صائم.",
        en: "Deeds are shown on Monday and Thursday, and I like mine to be shown while I am fasting.",
      },
      ref: tirmidhi,
    },
  },
  {
    id: "muharram-fast",
    section: "practice",
    priority: 11,
    hero: false,
    frame: "none",
    rule: { type: "month", month: 1 },
    name: { ru: "Пост в мухарраме", ar: "صيام المحرم", en: "Fasting in Muharram" },
    when: { ru: "Весь мухаррам, особенно 9 и 10", ar: "شهر المحرم، وآكده ٩ و١٠", en: "The month of Muharram, especially the 9th and 10th" },
    meaning: {
      ru: "Лучший месяц для добровольного поста после Рамадана.",
      ar: "أفضل الصيام بعد رمضان شهر الله المحرم.",
      en: "The best month to fast after Ramadan.",
    },
    dos: {
      ru: "Поститься по силам. Не обязан каждый день.",
      ar: "صيام ما تيسّر، وليس كل يوم واجباً.",
      en: "Fast what is easy. Not every day is required.",
    },
    dont: {
      ru: "Не объявлять пост всего месяца обязательным.",
      ar: "لا يُجعل صيام الشهر كله فريضة.",
      en: "Do not treat fasting the whole month as an obligation.",
    },
    quote: {
      kind: "hadith",
      ar: "أَفْضَلُ الصِّيَامِ بَعْدَ رَمَضَانَ شَهْرُ اللَّهِ الْمُحَرَّمُ",
      text: {
        ru: "Лучший пост после Рамадана — месяц Аллаха мухаррам.",
        ar: "أفضل الصيام بعد رمضان شهر الله المحرم.",
        en: "The best fast after Ramadan is Allah's month of Muharram.",
      },
      ref: muslim,
    },
  },
  {
    id: "sacred",
    section: "practice",
    priority: 12,
    hero: false,
    frame: "none",
    rule: { type: "months", months: [12, 1, 7, 11] },
    name: { ru: "Четыре запретных месяца", ar: "الأشهر الحرم", en: "The four sacred months" },
    when: {
      ru: "Зуль-када, зуль-хиджжа, мухаррам и раджаб",
      ar: "ذو القعدة وذو الحجة والمحرم ورجب",
      en: "Dhul-Qi'dah, Dhul-Hijjah, Muharram and Rajab",
    },
    meaning: {
      ru: "Аллах назвал четыре месяца запретными. В них особенно берегут себя от обид.",
      ar: "سمى الله أربعة أشهراً حرماً، فيُعظم فيها اجتناب الظلم.",
      en: "Allah named four months sacred. Wrongdoing in them is especially grave.",
    },
    dos: {
      ru: "Больше осторожности в словах и делах. Пост в них хорош, но обязателен только Рамадан.",
      ar: "مزيد الاحتياط. والصيام فيها حسن، والواجب رمضان وحده.",
      en: "Be more careful in words and deeds. Fasting them is good. Only Ramadan is obligatory.",
    },
    dont: {
      ru: "Не выделять раджаб особым обязательным постом или праздником, которого нет в достоверной сунне.",
      ar: "لا يُخص رجب بصيام واجب أو عيد لم تثبت به سنة.",
      en: "Do not single out Rajab with an obligatory fast or a festival that has no sound Sunnah.",
    },
    quote: {
      kind: "ayah",
      ar: "إِنَّ عِدَّةَ الشُّهُورِ عِندَ اللَّهِ اثْنَا عَشَرَ شَهْرًا ... مِنْهَا أَرْبَعَةٌ حُرُمٌ",
      text: {
        ru: "Воистину, число месяцев у Аллаха — двенадцать... из них четыре запретных.",
        ar: "إن عدة الشهور عند الله اثنا عشر شهراً... منها أربعة حرم.",
        en: "The number of months with Allah is twelve... of them four are sacred.",
      },
      ref: { ru: "Коран, 9:36", ar: "القرآن، التوبة ٣٦", en: "Quran 9:36" },
    },
  },
  {
    id: "new-year",
    section: "event",
    priority: 5,
    hero: true,
    frame: "none",
    rule: { type: "days", month: 1, days: [1] },
    name: { ru: "Начало хиджры", ar: "رأس السنة الهجرية", en: "Start of the Hijri year" },
    when: { ru: "1 мухаррама", ar: "١ محرم", en: "1 Muharram" },
    meaning: {
      ru: "Начало лунного года. Это счёт лет от хиджры, а не праздник Ислама.",
      ar: "مطلع العام القمري. هو تاريخ، لا عيد من أعياد الإسلام.",
      en: "The start of the lunar year. It is a date, not one of the festivals of Islam.",
    },
    dos: {
      ru: "Можно вспомнить хиджру Пророка ﷺ без новогоднего торжества.",
      ar: "يُتذكر الهجرة بلا احتفال كعيد.",
      en: "The Hijrah may be remembered, without treating the day as a festival.",
    },
    dont: {
      ru: "Не отмечать как новогодний праздник и не считать его третьим идом.",
      ar: "لا يُجعل عيداً ثالثاً ولا احتفال رأس سنة.",
      en: "Do not make it a third Eid or a New Year celebration.",
    },
    quote: {
      kind: "hadith",
      ar: "أَفْضَلُ الصِّيَامِ بَعْدَ رَمَضَانَ شَهْرُ اللَّهِ الْمُحَرَّمُ",
      text: {
        ru: "Лучший пост после Рамадана — месяц Аллаха мухаррам.",
        ar: "أفضل الصيام بعد رمضان شهر الله المحرم.",
        en: "The best fast after Ramadan is Muharram.",
      },
      ref: muslim,
    },
  },
  {
    id: "isra",
    section: "event",
    priority: 5,
    hero: true,
    frame: "none",
    rule: { type: "days", month: 7, days: [27] },
    name: { ru: "Исра и Мирадж", ar: "الإسراء والمعراج", en: "Isra and Mi'raj" },
    when: { ru: "27 раджаба — дата, в которой учёные разошлись", ar: "٢٧ رجب، والتاريخ مختلف فيه", en: "27 Rajab — the date is disputed" },
    meaning: {
      ru: "Ночное путешествие Пророка ﷺ достоверно. Точный день года в надёжном хадисе не закреплён. Это напоминание, не праздник.",
      ar: "الإسراء ثابت بالقرآن. وتعيين ليلته من السنة مختلف فيه. فهو تذكير لا عيد.",
      en: "The night journey is established. Fixing this calendar date is not. It is a reminder, not a festival.",
    },
    dos: {
      ru: "Прочитать аят об Исра. Обычные намаз и дуа, без особого обряда этой ночи.",
      ar: "تذكّر الآية. والعبادة المعتادة بلا شعار خاص بالليلة.",
      en: "Read the verse of Isra. Ordinary worship, without a special rite for the night.",
    },
    dont: {
      ru: "Не устраивать особого праздника и не утверждать дату как бесспорную.",
      ar: "لا يُحدَث عيد، ولا يُجزم بالتاريخ.",
      en: "Do not invent a festival or treat the date as certain.",
    },
    quote: {
      kind: "ayah",
      ar: "سُبْحَانَ الَّذِي أَسْرَىٰ بِعَبْدِهِ لَيْلًا مِنَ الْمَسْجِدِ الْحَرَامِ إِلَى الْمَسْجِدِ الْأَقْصَى",
      text: {
        ru: "Пречист Тот, Кто перенёс ночью Своего раба из Заповедной мечети в мечеть аль-Акса.",
        ar: "سبحان الذي أسرى بعبده ليلاً من المسجد الحرام إلى المسجد الأقصى.",
        en: "Glory be to Him who took His servant by night from the Sacred Mosque to al-Aqsa.",
      },
      ref: { ru: "Коран, 17:1", ar: "القرآن، الإسراء ١", en: "Quran 17:1" },
    },
  },
  {
    id: "shaban",
    section: "event",
    priority: 5,
    hero: true,
    frame: "none",
    rule: { type: "days", month: 8, days: [15] },
    name: { ru: "Середина шабана", ar: "نصف شعبان", en: "Mid-Sha'ban" },
    when: { ru: "15 шабана", ar: "١٥ شعبان", en: "15 Sha'ban" },
    meaning: {
      ru: "Часть сообщений об особом достоинстве этой ночи слабые, и учёные разошлись. Можно увеличить обычное поклонение без нововведения.",
      ar: "وردت أخبار، وفيها ضعف، واختلف العلماء. تُزاد العبادة المعتادة بلا بدعة.",
      en: "Reports about a special virtue are weak, and scholars differed. Ordinary worship may increase, without innovation.",
    },
    dos: {
      ru: "Обычный намаз, дуа и пост дня, если человек и так постится добровольно.",
      ar: "الصلاة والدعاء المعتاد، وصيام النهار إن كان يصوم تطوعاً.",
      en: "Ordinary prayer and dua. A voluntary fast of the day is fine if one already fasts voluntarily.",
    },
    dont: {
      ru: "Не выделять ночь особым коллективным обрядом, которого не было у Пророка ﷺ.",
      ar: "لا يُخص الليل باحتفال جماعي لم يفعله النبي ﷺ.",
      en: "Do not single the night out with a gathering the Prophet ﷺ did not do.",
    },
    quote: {
      kind: "hadith",
      ar: "مَنْ أَحْدَثَ فِي أَمْرِنَا هَذَا مَا لَيْسَ مِنْهُ فَهُوَ رَدٌّ",
      text: {
        ru: "Кто внесёт в это наше дело то, чего в нём нет, то будет отвергнуто.",
        ar: "من أحدث في أمرنا هذا ما ليس منه فهو رد.",
        en: "Whoever introduces into this matter of ours what is not part of it, it will be rejected.",
      },
      ref: bukhariMuslim,
    },
  },
];

export const WISDOM: Quote[] = [
  {
    kind: "ayah",
    ar: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    text: {
      ru: "Воистину, поминанием Аллаха успокаиваются сердца.",
      ar: "ألا بذكر الله تطمئن القلوب.",
      en: "Verily, in the remembrance of Allah do hearts find rest.",
    },
    ref: { ru: "Коран, 13:28", ar: "القرآن، الرعد ٢٨", en: "Quran 13:28" },
  },
  {
    kind: "hadith",
    ar: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ",
    text: {
      ru: "Поистине, дела оцениваются по намерениям.",
      ar: "إنما الأعمال بالنيات.",
      en: "Actions are only by intentions.",
    },
    ref: bukhariMuslim,
  },
  {
    kind: "ayah",
    ar: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
    text: {
      ru: "Воистину, за трудностью — облегчение.",
      ar: "فإن مع العسر يسرا.",
      en: "For indeed, with hardship comes ease.",
    },
    ref: { ru: "Коран, 94:5", ar: "القرآن، الشرح ٥", en: "Quran 94:5" },
  },
  {
    kind: "hadith",
    ar: "تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ صَدَقَةٌ",
    text: {
      ru: "Твоя улыбка брату — милостыня.",
      ar: "تبسمك في وجه أخيك صدقة.",
      en: "Your smile to your brother is charity.",
    },
    ref: tirmidhi,
  },
  {
    kind: "ayah",
    ar: "فَاذْكُرُونِي أَذْكُرْكُمْ",
    text: {
      ru: "Поминайте Меня, и Я буду помнить о вас.",
      ar: "فاذكروني أذكركم.",
      en: "Remember Me, and I will remember you.",
    },
    ref: { ru: "Коран, 2:152", ar: "القرآن، البقرة ١٥٢", en: "Quran 2:152" },
  },
  {
    kind: "hadith",
    ar: "الْمُؤْمِنُ الْقَوِيُّ خَيْرٌ وَأَحَبُّ إِلَى اللَّهِ مِنَ الْمُؤْمِنِ الضَّعِيفِ",
    text: {
      ru: "Сильный верующий лучше и любимее Аллаху, чем слабый верующий. И в каждом есть благо.",
      ar: "المؤمن القوي خير وأحب إلى الله من المؤمن الضعيف، وفي كل خير.",
      en: "The strong believer is better and dearer to Allah than the weak believer, and there is good in both.",
    },
    ref: muslim,
  },
  {
    kind: "ayah",
    ar: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
    text: {
      ru: "Довольно нам Аллаха, и как прекрасен этот Покровитель.",
      ar: "حسبنا الله ونعم الوكيل.",
      en: "Allah is enough for us, and how excellent a trustee He is.",
    },
    ref: { ru: "Коран, 3:173", ar: "القرآن، آل عمران ١٧٣", en: "Quran 3:173" },
  },
  {
    kind: "hadith",
    ar: "الطُّهُورُ شَطْرُ الْإِيمَانِ",
    text: {
      ru: "Очищение — половина веры.",
      ar: "الطهور شطر الإيمان.",
      en: "Purification is half of faith.",
    },
    ref: muslim,
  },
  {
    kind: "ayah",
    ar: "قُلْ هُوَ اللَّهُ أَحَدٌ",
    text: {
      ru: "Скажи: Он — Аллах Единый.",
      ar: "قل هو الله أحد.",
      en: "Say: He is Allah, One.",
    },
    ref: { ru: "Коран, 112:1", ar: "القرآن، الإخلاص ١", en: "Quran 112:1" },
  },
  {
    kind: "hadith",
    ar: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    text: {
      ru: "Кто верует в Аллаха и Последний день, пусть говорит благое или молчит.",
      ar: "من كان يؤمن بالله واليوم الآخر فليقل خيراً أو ليصمت.",
      en: "Whoever believes in Allah and the Last Day, let him speak good or remain silent.",
    },
    ref: bukhariMuslim,
  },
];

export const DUAS: {
  id: string;
  title: Tri;
  when: Tri;
  ar: string;
  text: Tri;
  ref: Tri;
}[] = [
  {
    id: "arafah-dua",
    title: { ru: "День Арафа", ar: "يوم عرفة", en: "Day of Arafah" },
    when: { ru: "Лучшее поминание в этот день", ar: "أفضل الدعاء في هذا اليوم", en: "The best remembrance of the day" },
    ar: "لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
    text: {
      ru: "Нет божества, кроме Аллаха, одного, без сотоварища. Ему власть и хвала, и Он над всякой вещью мощен.",
      ar: "لا إله إلا الله وحده لا شريك له، له الملك وله الحمد، وهو على كل شيء قدير.",
      en: "There is no god but Allah alone, without partner. His is the dominion and praise, and He is over all things competent.",
    },
    ref: tirmidhi,
  },
  {
    id: "qadr-dua",
    title: { ru: "Ляйлят аль-Кадр", ar: "ليلة القدر", en: "Laylat al-Qadr" },
    when: { ru: "Дуа, которому научил Пророк ﷺ Аишу", ar: "دعت به عائشة رضي الله عنها", en: "The dua taught to Aisha" },
    ar: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
    text: {
      ru: "О Аллах, поистине, Ты Прощающий, любишь прощение, так прости же меня.",
      ar: "اللهم إنك عفو تحب العفو فاعف عني.",
      en: "O Allah, You are Pardoning and love pardon, so pardon me.",
    },
    ref: tirmidhi,
  },
  {
    id: "iftar-dua",
    title: { ru: "Разговение", ar: "الإفطار", en: "Breaking the fast" },
    when: { ru: "После ифтара", ar: "عند الإفطار", en: "At iftar" },
    ar: "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ",
    text: {
      ru: "Ушла жажда, жилы напитались, и награда утвердилась, если пожелает Аллах.",
      ar: "ذهب الظمأ وابتلت العروق وثبت الأجر إن شاء الله.",
      en: "Thirst is gone, the veins are quenched, and the reward is confirmed, if Allah wills.",
    },
    ref: abuDawud,
  },
  {
    id: "takbir",
    title: { ru: "Такбир ташрика", ar: "تكبير التشريق", en: "Takbir of Tashreeq" },
    when: {
      ru: "С дня Арафа и в дни ташрика",
      ar: "من يوم عرفة وأيام التشريق",
      en: "From Arafah through the days of Tashreeq",
    },
    ar: "اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، لَا إِلَٰهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، وَلِلَّهِ الْحَمْدُ",
    text: {
      ru: "Аллах велик, Аллах велик. Нет божества, кроме Аллаха. Аллах велик, Аллах велик, и хвала Аллаху.",
      ar: "الله أكبر الله أكبر، لا إله إلا الله، والله أكبر الله أكبر، ولله الحمد.",
      en: "Allah is the greatest, Allah is the greatest. There is no god but Allah. Allah is the greatest, and to Allah is praise.",
    },
    ref: { ru: "передано от сподвижников", ar: "ثابت عن الصحابة", en: "Reported from the Companions" },
  },
];

export function ruleMatches(rule: Rule | undefined, month: number, day: number, weekday: number): boolean {
  if (!rule) return false;
  if (rule.type === "days") {
    if (rule.month === 0) return rule.days.includes(day);
    return month === rule.month && rule.days.includes(day);
  }
  if (rule.type === "span") return month === rule.month && day >= rule.from && day <= rule.to;
  if (rule.type === "weekdays") return rule.days.includes(weekday);
  if (rule.type === "month") return month === rule.month;
  return rule.months.includes(month);
}
