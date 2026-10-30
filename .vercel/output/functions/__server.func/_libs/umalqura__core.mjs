//#region node_modules/@umalqura/core/dist/index.esm.js
var DateMapping = function() {
	function DateMapping(monthsLengthFlags, gy, gm, gd) {
		this.hijriMonthsLengthFlags = monthsLengthFlags;
		this.gregorianDate = new Date(gy, gm, gd);
	}
	return DateMapping;
}();
var DatePart;
(function(DatePart) {
	DatePart[DatePart["Year"] = 0] = "Year";
	DatePart[DatePart["DayOfYear"] = 1] = "DayOfYear";
	DatePart[DatePart["Month"] = 2] = "Month";
	DatePart[DatePart["Day"] = 3] = "Day";
})(DatePart || (DatePart = {}));
var DatePart$1 = DatePart;
var token = /d{1,4}|M{1,4}|yy(?:yy)?|([HhmsTt])\1?|[LlSWN]|"[^"]*"|'[^']*'/g;
function pad(val, locale, len) {
	val = String(val);
	len = len || 2;
	while (val.length < len) val = "0" + val;
	return locale.localizeNum(val);
}
function format(date, mask, locale, hy, hm, hd, woy, dow) {
	mask = String(locale.masks[mask] || mask || locale.masks.default);
	var _ = "get";
	var d = hd;
	var D = date[_ + "Day"]();
	var m = hm;
	var y = hy;
	var H = date[_ + "Hours"]();
	var M = date[_ + "Minutes"]();
	var s = date[_ + "Seconds"]();
	var L = date[_ + "Milliseconds"]();
	var W = woy;
	var N = dow;
	var flags = {
		d: locale.localizeNum(d),
		dd: pad(d, locale),
		ddd: locale.dayNamesShort[D],
		dddd: locale.dayNames[D],
		M: locale.localizeNum(m),
		MM: pad(m, locale),
		MMM: locale.monthNamesShort[m - 1],
		MMMM: locale.monthNames[m - 1],
		yy: locale.localizeNum(String(y).slice(2)),
		yyyy: locale.localizeNum(y),
		h: locale.localizeNum(H % 12 || 12),
		hh: pad(H % 12 || 12, locale),
		H: locale.localizeNum(H),
		HH: pad(H, locale),
		m: locale.localizeNum(M),
		mm: pad(M, locale),
		s: locale.localizeNum(s),
		ss: pad(s, locale),
		l: pad(L, locale, 3),
		L: pad(Math.round(L / 10), locale),
		t: H < 12 ? locale.timeNames[0] : locale.timeNames[1],
		tt: H < 12 ? locale.timeNames[2] : locale.timeNames[3],
		T: H < 12 ? locale.timeNames[4] : locale.timeNames[5],
		TT: H < 12 ? locale.timeNames[6] : locale.timeNames[7],
		S: locale.localizeDayNum(d),
		W: locale.localizeNum(W),
		N: locale.localizeNum(N)
	};
	return locale.localizeCommas(mask.replace(token, function(match) {
		return flags[match];
	}));
}
var symbolMap = [
	"٠",
	"١",
	"٢",
	"٣",
	"٤",
	"٥",
	"٦",
	"٧",
	"٨",
	"٩"
];
var dayNumMap = [
	"الأول",
	"الثاني",
	"الثالث",
	"الرابع",
	"الخامس",
	"السادس",
	"السابع",
	"الثامن",
	"التاسع",
	"العاشر",
	"الحادي عشر"
];
var ar = {
	name: "ar",
	rtl: true,
	dayNamesShort: [
		"ح",
		"ن",
		"ث",
		"ر",
		"خ",
		"ج",
		"س"
	],
	dayNames: [
		"الأحد",
		"الإثنين",
		"الثلاثاء",
		"الأربعاء",
		"الخميس",
		"الجمعة",
		"السبت"
	],
	monthNamesShort: [
		"محرم",
		"صفر",
		"ربيع ١",
		"ربيع ٢",
		"جمادى ١",
		"جمادى ٢",
		"رجب",
		"شعبان",
		"رمضان",
		"شوال",
		"ذو القعدة",
		"ذو الحجة"
	],
	monthNames: [
		"محرم",
		"صفر",
		"ربيع الأول",
		"ربيع الثاني",
		"جمادى الأولى",
		"جمادى الآخرة",
		"رجب",
		"شعبان",
		"رمضان",
		"شوال",
		"ذو القعدة",
		"ذو الحجة"
	],
	timeNames: [
		"ص",
		"م",
		"ص",
		"م",
		"ص",
		"م",
		"ص",
		"م"
	],
	masks: {
		default: "ddd dd MMM yyyy HH:mm:ss",
		shortDate: "yy/M/d",
		mediumDate: "d MMM, yyyy",
		longDate: "d MMMM, yyyy",
		fullDate: "dddd, d MMMM, yyyy",
		shortTime: "h:mm TT",
		mediumTime: "h:mm:ss TT",
		longTime: "h:mm:ss.l TT"
	},
	localizeNum: function(num) {
		var s = String(num);
		var output = "";
		for (var i = 0; i < s.length; i++) output += symbolMap[s.charAt(i)];
		return output;
	},
	localizeDayNum: function(d) {
		var output = "";
		if (d === 11) output = "الحادي عشر";
		else if (d === 20) output = "العشرون";
		else if (d === 30) output = "الثلاثون";
		else output = dayNumMap[d - 1];
		var section = d / 10;
		if (section > 1.1 && section < 2) output = dayNumMap[(d - 1) % 10] + " عشر";
		else if (section > 2 && section < 3) output = dayNumMap[(d - 1) % 10] + " والعشرون";
		return output + " من";
	},
	localizeCommas: function(v) {
		return v.replace(/,/g, "،");
	}
};
var en = {
	name: "en",
	dayNamesShort: [
		"Sun",
		"Mon",
		"Tue",
		"Wed",
		"Thu",
		"Fri",
		"Sat"
	],
	dayNames: [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday"
	],
	monthNamesShort: [
		"Muh",
		"Ṣaf",
		"Rab-I",
		"Rab-II",
		"Jum-I",
		"Jum-II",
		"Raj",
		"Sha",
		"Ram",
		"Shw",
		"Dhū-Q",
		"Dhū-Ḥ"
	],
	monthNames: [
		"Muharram",
		"Ṣafar",
		"Rabīʿ al-Awwal",
		"Rabīʿ ath-Thānī",
		"Jumādá al-Ūlá",
		"Jumādá al-Ākhirah",
		"Rajab",
		"Sha‘bān",
		"Ramaḍān",
		"Shawwāl",
		"Dhū al-Qa‘dah",
		"Dhū al-Ḥijjah"
	],
	timeNames: [
		"a",
		"p",
		"am",
		"pm",
		"A",
		"P",
		"AM",
		"PM"
	],
	masks: {
		default: "ddd MMM dd yyyy HH:mm:ss",
		shortDate: "M/d/yy",
		mediumDate: "MMM d, yyyy",
		longDate: "MMMM d, yyyy",
		fullDate: "dddd, MMMM d, yyyy",
		shortTime: "h:mm TT",
		mediumTime: "h:mm:ss TT",
		longTime: "h:mm:ss.l TT"
	},
	localizeNum: function(num) {
		return String(num);
	},
	localizeDayNum: function(d) {
		return [
			"th",
			"st",
			"nd",
			"rd"
		][d % 10 > 3 ? 0 : (d % 100 - d % 10 !== 10) * d % 10];
	},
	localizeCommas: function(v) {
		return v;
	}
};
var UmAlQuraStatic = function() {
	function UmAlQuraStatic() {}
	/**
	* Coverts the given Hijri date to Gregorian.
	* @param hy The Hijri year
	* @param hm The Hijri month
	* @param hd The Hijri day
	*/
	UmAlQuraStatic.hijriToGregorian = function(hy, hm, hd) {
		this._checkYearRange(hy);
		this._checkMonthRange(hm);
		this._checkDayRange(hd);
		var nDays = hd - 1;
		var index = hy - this.minCalendarYear;
		var dt = this.hijriYearData[index].gregorianDate;
		var b = this.hijriYearData[index].hijriMonthsLengthFlags;
		for (var m = 1; m < hm; m++) {
			nDays = nDays + 29 + (b & 1);
			b >>= 1;
		}
		dt = this.addDays(dt, nDays);
		return {
			gy: dt.getFullYear(),
			gm: dt.getMonth(),
			gd: dt.getDate()
		};
	};
	/**
	* Coverts the given Gregorian date to Hijri year, month and day.
	* @param date The date to be converted
	*/
	UmAlQuraStatic.gregorianToHijri = function(date) {
		this._checkMillsRange(date.getTime());
		var index = Math.trunc((date.getTime() - this.minDate.getTime()) / this.millisPerDay / 355);
		do		;
while (date.getTime() > this.hijriYearData[++index].gregorianDate.getTime());
		if (date.getTime() !== this.hijriYearData[index].gregorianDate.getTime()) index--;
		var nDays = this._dayDiff(date, this.hijriYearData[index].gregorianDate);
		var yh1 = index + this.minCalendarYear;
		var mh1 = 1;
		var dh1 = 1;
		var b = this.hijriYearData[index].hijriMonthsLengthFlags;
		var daysPerThisMonth = 29 + (b & 1);
		while (nDays >= daysPerThisMonth) {
			nDays -= daysPerThisMonth;
			b >>= 1;
			daysPerThisMonth = 29 + (b & 1);
			mh1++;
		}
		dh1 += Math.trunc(nDays);
		return {
			hy: yh1,
			hm: mh1,
			hd: dh1
		};
	};
	/**
	* Adds the specified amount of Hijri years to the given Gregorian date.
	* @param date The date
	* @param hys The Hijri years to be added
	*/
	UmAlQuraStatic.addYears = function(date, hys) {
		return this.addMonths(date, hys * 12);
	};
	/**
	* Adds the specified amount of Hijri months to the given Gregorian date.
	* @param date The date
	* @param hms The Hijri months to be added
	*/
	UmAlQuraStatic.addMonths = function(date, hms) {
		var y = this._getDatePart(date, DatePart$1.Year);
		var m = this._getDatePart(date, DatePart$1.Month);
		var d = this._getDatePart(date, DatePart$1.Day);
		var i = m - 1 + hms;
		if (i >= 0) {
			m = i % 12 + 1;
			y += Math.trunc(i / 12);
		} else {
			m = 12 + (i + 1) % 12;
			y += Math.trunc((i - 11) / 12);
		}
		if (d > 29) {
			var days = this.getDaysInMonth(y, m);
			if (d > days) d = days;
		}
		var _a = this.hijriToGregorian(y, m, d), gy = _a.gy, gm = _a.gm, gd = _a.gd;
		return this._setTime(new Date(gy, gm, gd), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
	};
	/**
	* Adds the specified amount of weeks to the given Gregorian date.
	* @param date The date
	* @param wks The weeks to be added
	*/
	UmAlQuraStatic.addWeeks = function(date, wks) {
		return this.addDays(date, wks * 7);
	};
	/**
	* Adds the specified amount of days to the given Gregorian date.
	* @param date The date
	* @param days The days to be added
	*/
	UmAlQuraStatic.addDays = function(date, days) {
		var d = new Date(date.valueOf());
		d.setDate(d.getDate() + days);
		return d;
	};
	/**
	* Adds the specified amount of units to the given Gregorian date.
	* @param date The date
	* @param value The amount of `unit`s to add
	* @param unit The unit of time
	*/
	UmAlQuraStatic.addTime = function(date, value, unit) {
		var d = new Date(date.valueOf());
		switch (unit) {
			case "hour":
				d.setHours(d.getHours() + value);
				break;
			case "minute":
				d.setMinutes(d.getMinutes() + value);
				break;
			case "second":
				d.setSeconds(d.getSeconds() + value);
				break;
			case "millisecond":
				d.setMilliseconds(d.getMilliseconds() + value);
				break;
			default: throw new Error("Invalid value for `unit` param");
		}
		return d;
	};
	/**
	* Returns the Hijri day of year for the specified Gregorian date.
	* @param date The date
	*/
	UmAlQuraStatic.getDayOfYear = function(date) {
		return this._getDatePart(date, DatePart$1.DayOfYear);
	};
	/**
	* Returns the Hijri day of month for the specified Gregorian date.
	* @param date The date
	*/
	UmAlQuraStatic.getDayOfMonth = function(date) {
		return this._getDatePart(date, DatePart$1.Day);
	};
	/**
	* Returns the day of week for the specified Gregorian date.
	* @param date The date
	*/
	UmAlQuraStatic.getDayOfWeek = function(date) {
		return date.getDay();
	};
	/**
	* Returns the Hijri week of year for the specified Gregorian date.
	* @param date The date
	*/
	UmAlQuraStatic.getWeekOfYear = function(date) {
		var daysToDayOfWeek = this.startOf(date, "year").getDay() - date.getDay();
		var d = this.addDays(date, daysToDayOfWeek);
		return Math.ceil(this.getDayOfYear(d) / 7);
	};
	/**
	* Returns the number of days in the specified Hijri year.
	* @param hy The Hijri year
	*/
	UmAlQuraStatic.getDaysInYear = function(hy) {
		this._checkYearRange(hy);
		var days = 0;
		var b = this.hijriYearData[hy - this.minCalendarYear].hijriMonthsLengthFlags;
		for (var m = 1; m <= 12; m++) {
			days = days + 29 + (b & 1);
			b >>= 1;
		}
		if (days !== 354 && days !== 355) throw new Error("Days in year assert error. This is possibly a bug.");
		return days;
	};
	/**
	* Returns the number of days in the specified Hijri year and month.
	* @param hy The Hijri year
	* @param hm The Hijri month
	*/
	UmAlQuraStatic.getDaysInMonth = function(hy, hm) {
		this._checkYearRange(hy);
		this._checkMonthRange(hm);
		if ((this.hijriYearData[hy - this.minCalendarYear].hijriMonthsLengthFlags & 1 << hm - 1) === 0) return 29;
		else return 30;
	};
	/**
	* Returns the Hijri year corresponding to the given Gregorian date.
	* @param date The date
	*/
	UmAlQuraStatic.getYear = function(date) {
		return this._getDatePart(date, DatePart$1.Year);
	};
	/**
	* Returns the Hijri month corresponding to the given Gregorian date.
	* @param date The date
	*/
	UmAlQuraStatic.getMonth = function(date) {
		return this._getDatePart(date, DatePart$1.Month);
	};
	/**
	* Returns the Hijri month array for the given Gregorian date.
	* @param date The date
	*/
	UmAlQuraStatic.getMonthArray = function(date) {
		var weeks = [];
		var month = this.getMonth(date);
		var start = this.startOf(this.startOf(date, "month"), "week");
		var end = this.endOf(this.endOf(date, "month"), "week");
		var i = 0;
		while (start < end) {
			var w = Math.floor(i / 7);
			var day = new Date(start.valueOf());
			weeks[w] = weeks[w] || [];
			weeks[w].push(this.getMonth(day) === month ? day : null);
			start.setDate(start.getDate() + 1);
			i++;
		}
		return weeks;
	};
	/**
	* Returns the Gregorian date corresponding to the Hijri date starting at the specified unit of time.
	* @param date: The date
	* @param unit: The unit of time
	*/
	UmAlQuraStatic.startOf = function(date, unit) {
		var d = new Date(date);
		var _a = this.gregorianToHijri(d), hy = _a.hy, hm = _a.hm;
		switch (unit) {
			case "year": return this.toDate(hy, 1, 1, 0, 0, 0, 0);
			case "month": return this.toDate(hy, hm, 1, 0, 0, 0, 0);
			case "week":
				var dow = this.getDayOfWeek(d);
				d = this.addDays(d, -dow);
			case "day": d.setHours(0);
			case "hour": d.setMinutes(0);
			case "minute": d.setSeconds(0);
			case "second":
				d.setMilliseconds(0);
				break;
			default: throw new Error("Invalid value for `unit` param");
		}
		return d;
	};
	/**
	* Returns the Gregorian date corresponding to the Hijri date ending at the specified unit of time.
	* @param date: The date
	* @param unit: The unit of time
	*/
	UmAlQuraStatic.endOf = function(date, unit) {
		var d = new Date(date);
		var _a = this.gregorianToHijri(d), hy = _a.hy, hm = _a.hm;
		var daysInMonth;
		switch (unit) {
			case "year":
				daysInMonth = this.getDaysInMonth(hy, 12);
				return this.toDate(hy, 12, daysInMonth, 23, 59, 59, 999);
			case "month":
				daysInMonth = this.getDaysInMonth(hy, hm);
				return this.toDate(hy, hm, daysInMonth, 23, 59, 59, 999);
			case "week":
				var dow = this.getDayOfWeek(d);
				d = this.addDays(d, 6 - dow);
			case "day": d.setHours(23);
			case "hour": d.setMinutes(59);
			case "minute": d.setSeconds(59);
			case "second":
				d.setMilliseconds(999);
				break;
			default: throw new Error("Invalid value for `unit` param");
		}
		return d;
	};
	/**
	* Returns whether or not the given Hijri year is a leap year.
	* A Hijri leap year is where the number of days in that year is 355.
	* @param hy The Hijri year
	*/
	UmAlQuraStatic.isLeapYear = function(hy) {
		return this.getDaysInYear(hy) === 355;
	};
	/**
	* Converts the specified Hijri date time to a Gregorian Date instance.
	* @param hy The Hijri year
	* @param hm The Hijri month
	* @param hd The Hijri day
	* @param hour The Hour component
	* @param minute The Minute component
	* @param second The Second component
	* @param millisecond The Millisecond component
	*/
	UmAlQuraStatic.toDate = function(hy, hm, hd, hour, minute, second, millisecond) {
		if (hour === void 0) hour = 0;
		if (minute === void 0) minute = 0;
		if (second === void 0) second = 0;
		if (millisecond === void 0) millisecond = 0;
		var daysInMonth = this.getDaysInMonth(hy, hm);
		if (hd < 1 || hd > daysInMonth) throw new Error("Invalid value for day for the given year/month. Day must be between 1 and " + daysInMonth + ".");
		if (hour < 0 || hour >= 24 || minute < 0 || minute >= 60 || second < 0 || second >= 60 || millisecond < 0 || millisecond >= this.millisPerSecond) throw new Error("Invalid value for hour, minute, second or millisecond.");
		var _a = this.hijriToGregorian(hy, hm, hd), gy = _a.gy, gm = _a.gm, gd = _a.gd;
		return this._setTime(new Date(gy, gm, gd), hour, minute, second, millisecond);
	};
	/**
	* Formats the specified Gregorian Date instance in Hijri date.
	* @param date The date
	* @param mask The format mask
	* @param locale The locale to use. If omitted, uses the globally set locale or the default locale.
	*/
	UmAlQuraStatic.format = function(date, mask, locale) {
		var _a = this.gregorianToHijri(date), hy = _a.hy, hm = _a.hm, hd = _a.hd;
		return format(date, mask, locale ? this._loadLocale(locale) : this.locale, hy, hm, hd, this.getWeekOfYear(date), this.getDayOfWeek(date));
	};
	/**
	* Sets global locale to be used for formatting.
	* @param locale The locale
	*/
	UmAlQuraStatic.setLocale = function(locale) {
		this.locale = this._loadLocale(locale);
	};
	/**
	* Registers the specified locale.
	* @param locale The locale
	*/
	UmAlQuraStatic.registerLocale = function(locale) {
		if (!locale.name) throw new Error("The locale's 'name' property must not be empty.");
		if (this.locales[locale.name]) throw new Error("A locale with the same name '" + locale.name + "' is already registered.");
		this.locales[locale.name] = locale;
	};
	UmAlQuraStatic._loadLocale = function(locale) {
		if (this.locales[locale]) return this.locales[locale];
		console.warn("The requested locale '" + locale + "' could not be found. Using the default locale instead.");
		return en;
	};
	UmAlQuraStatic._getDatePart = function(date, part) {
		var _a = this.gregorianToHijri(date), hy = _a.hy, hm = _a.hm, hd = _a.hd;
		switch (part) {
			case DatePart$1.Year: return hy;
			case DatePart$1.Month: return hm;
			case DatePart$1.Day: return hd;
			case DatePart$1.DayOfYear: return Math.trunc(this._getAbsoluteDateUmAlQura(hy, hm, hd) - this._getAbsoluteDateUmAlQura(hy, 1, 1) + 1);
		}
	};
	UmAlQuraStatic._setTime = function(date, hour, minute, second, millisecond) {
		date.setHours(hour);
		date.setMinutes(minute);
		date.setSeconds(second);
		date.setMilliseconds(millisecond);
		return date;
	};
	UmAlQuraStatic._getAbsoluteDateUmAlQura = function(hy, hm, hd) {
		var _a = this.hijriToGregorian(hy, hm, hd), gy = _a.gy, gm = _a.gm, gd = _a.gd;
		return new Date(gy, gm, gd).getTime() / this.millisPerDay;
	};
	UmAlQuraStatic._checkYearRange = function(hy) {
		if (hy < this.minCalendarYear || hy > this.maxCalendarYear) throw new Error("Invalid value for year. Must be between " + this.minCalendarYear + " and " + this.maxCalendarYear + ".");
	};
	UmAlQuraStatic._checkMonthRange = function(hm) {
		if (hm < 1 || hm > 12) throw new Error("Invalid value for month. Must be between 1 and 12.");
	};
	UmAlQuraStatic._checkDayRange = function(day) {
		if (day < 1 || day > 30) throw new Error("Invalid value for day. Must be between 1 and 30.");
	};
	UmAlQuraStatic._checkMillsRange = function(millis) {
		if (millis < this.minDate.getTime() || millis > this.maxDate.getTime()) throw new Error("Invalid value for epoch. Must be between " + this.minDate.getTime() + " and " + this.maxDate.getTime() + ".");
	};
	UmAlQuraStatic._dayDiff = function(date, other) {
		return (date.getTime() - other.getTime()) / 864e5;
	};
	UmAlQuraStatic._initDateMapping = function() {
		var rawData = [
			746,
			1900,
			4,
			30,
			1769,
			1901,
			4,
			19,
			3794,
			1902,
			4,
			9,
			3748,
			1903,
			3,
			30,
			3402,
			1904,
			3,
			18,
			2710,
			1905,
			3,
			7,
			1334,
			1906,
			2,
			24,
			2741,
			1907,
			2,
			13,
			3498,
			1908,
			2,
			3,
			2980,
			1909,
			1,
			23,
			2889,
			1910,
			1,
			12,
			2707,
			1911,
			1,
			1,
			1323,
			1911,
			12,
			21,
			2647,
			1912,
			12,
			9,
			1206,
			1913,
			11,
			29,
			2741,
			1914,
			11,
			18,
			1450,
			1915,
			11,
			8,
			3413,
			1916,
			10,
			27,
			3370,
			1917,
			10,
			17,
			2646,
			1918,
			10,
			6,
			1198,
			1919,
			9,
			25,
			2397,
			1920,
			9,
			13,
			748,
			1921,
			9,
			3,
			1749,
			1922,
			8,
			23,
			1706,
			1923,
			8,
			13,
			1365,
			1924,
			8,
			1,
			1195,
			1925,
			7,
			21,
			2395,
			1926,
			7,
			10,
			698,
			1927,
			6,
			30,
			1397,
			1928,
			6,
			18,
			2994,
			1929,
			6,
			8,
			1892,
			1930,
			5,
			29,
			1865,
			1931,
			5,
			18,
			1621,
			1932,
			5,
			6,
			683,
			1933,
			4,
			25,
			1371,
			1934,
			4,
			14,
			2778,
			1935,
			4,
			4,
			1748,
			1936,
			3,
			24,
			3785,
			1937,
			3,
			13,
			3474,
			1938,
			3,
			3,
			3365,
			1939,
			2,
			20,
			2637,
			1940,
			2,
			9,
			685,
			1941,
			1,
			28,
			1389,
			1942,
			1,
			17,
			2922,
			1943,
			1,
			7,
			2898,
			1943,
			12,
			28,
			2725,
			1944,
			12,
			16,
			2635,
			1945,
			12,
			5,
			1175,
			1946,
			11,
			24,
			2359,
			1947,
			11,
			13,
			694,
			1948,
			11,
			2,
			1397,
			1949,
			10,
			22,
			3434,
			1950,
			10,
			12,
			3410,
			1951,
			10,
			2,
			2710,
			1952,
			9,
			20,
			2349,
			1953,
			9,
			9,
			605,
			1954,
			8,
			29,
			1245,
			1955,
			8,
			18,
			2778,
			1956,
			8,
			7,
			1492,
			1957,
			7,
			28,
			3497,
			1958,
			7,
			17,
			3410,
			1959,
			7,
			7,
			2730,
			1960,
			6,
			25,
			1238,
			1961,
			6,
			14,
			2486,
			1962,
			6,
			3,
			884,
			1963,
			5,
			24,
			1897,
			1964,
			5,
			12,
			1874,
			1965,
			5,
			2,
			1701,
			1966,
			4,
			21,
			1355,
			1967,
			4,
			10,
			2731,
			1968,
			3,
			29,
			1370,
			1969,
			3,
			19,
			2773,
			1970,
			3,
			8,
			3538,
			1971,
			2,
			26,
			3492,
			1972,
			2,
			16,
			3401,
			1973,
			2,
			4,
			2709,
			1974,
			1,
			24,
			1325,
			1975,
			1,
			13,
			2653,
			1976,
			1,
			2,
			1370,
			1976,
			12,
			22,
			2773,
			1977,
			12,
			11,
			1706,
			1978,
			12,
			1,
			1685,
			1979,
			11,
			20,
			1323,
			1980,
			11,
			8,
			2647,
			1981,
			10,
			28,
			1198,
			1982,
			10,
			18,
			2422,
			1983,
			10,
			7,
			1388,
			1984,
			9,
			26,
			2901,
			1985,
			9,
			15,
			2730,
			1986,
			9,
			5,
			2645,
			1987,
			8,
			25,
			1197,
			1988,
			8,
			13,
			2397,
			1989,
			8,
			2,
			730,
			1990,
			7,
			23,
			1497,
			1991,
			7,
			12,
			3506,
			1992,
			7,
			1,
			2980,
			1993,
			6,
			21,
			2890,
			1994,
			6,
			10,
			2645,
			1995,
			5,
			30,
			693,
			1996,
			5,
			18,
			1397,
			1997,
			5,
			7,
			2922,
			1998,
			4,
			27,
			3026,
			1999,
			4,
			17,
			3012,
			2e3,
			4,
			6,
			2953,
			2001,
			3,
			26,
			2709,
			2002,
			3,
			15,
			1325,
			2003,
			3,
			4,
			1453,
			2004,
			2,
			21,
			2922,
			2005,
			2,
			10,
			1748,
			2006,
			1,
			31,
			3529,
			2007,
			1,
			20,
			3474,
			2008,
			1,
			10,
			2726,
			2008,
			12,
			29,
			2390,
			2009,
			12,
			18,
			686,
			2010,
			12,
			7,
			1389,
			2011,
			11,
			26,
			874,
			2012,
			11,
			15,
			2901,
			2013,
			11,
			4,
			2730,
			2014,
			10,
			25,
			2381,
			2015,
			10,
			14,
			1181,
			2016,
			10,
			2,
			2397,
			2017,
			9,
			21,
			698,
			2018,
			9,
			11,
			1461,
			2019,
			8,
			31,
			1450,
			2020,
			8,
			20,
			3413,
			2021,
			8,
			9,
			2714,
			2022,
			7,
			30,
			2350,
			2023,
			7,
			19,
			622,
			2024,
			7,
			7,
			1373,
			2025,
			6,
			26,
			2778,
			2026,
			6,
			16,
			1748,
			2027,
			6,
			6,
			1701,
			2028,
			5,
			25,
			1355,
			2029,
			5,
			14,
			2711,
			2030,
			5,
			3,
			1358,
			2031,
			4,
			23,
			2734,
			2032,
			4,
			11,
			1452,
			2033,
			4,
			1,
			2985,
			2034,
			3,
			21,
			3474,
			2035,
			3,
			11,
			2853,
			2036,
			2,
			28,
			1611,
			2037,
			2,
			16,
			3243,
			2038,
			2,
			5,
			1370,
			2039,
			1,
			26,
			2901,
			2040,
			1,
			15,
			1746,
			2041,
			1,
			4,
			3749,
			2041,
			12,
			24,
			3658,
			2042,
			12,
			14,
			2709,
			2043,
			12,
			3,
			1325,
			2044,
			11,
			21,
			2733,
			2045,
			11,
			10,
			876,
			2046,
			10,
			31,
			1881,
			2047,
			10,
			20,
			1746,
			2048,
			10,
			9,
			1685,
			2049,
			9,
			28,
			1325,
			2050,
			9,
			17,
			2651,
			2051,
			9,
			6,
			1210,
			2052,
			8,
			26,
			2490,
			2053,
			8,
			15,
			948,
			2054,
			8,
			5,
			2921,
			2055,
			7,
			25,
			2898,
			2056,
			7,
			14,
			2726,
			2057,
			7,
			3,
			1206,
			2058,
			6,
			22,
			2413,
			2059,
			6,
			11,
			748,
			2060,
			5,
			31,
			1753,
			2061,
			5,
			20,
			3762,
			2062,
			5,
			10,
			3412,
			2063,
			4,
			30,
			3370,
			2064,
			4,
			18,
			2646,
			2065,
			4,
			7,
			1198,
			2066,
			3,
			27,
			2413,
			2067,
			3,
			16,
			3434,
			2068,
			3,
			5,
			2900,
			2069,
			2,
			23,
			2857,
			2070,
			2,
			12,
			2707,
			2071,
			2,
			1,
			1323,
			2072,
			1,
			21,
			2647,
			2073,
			1,
			9,
			1334,
			2073,
			12,
			30,
			2741,
			2074,
			12,
			19,
			1706,
			2075,
			12,
			9,
			3731,
			2076,
			11,
			27,
			0,
			2077,
			11,
			17
		];
		var mapping = [];
		for (var i = 0; i < rawData.length / 4; i++) mapping.push(new DateMapping(rawData[i * 4], rawData[i * 4 + 1], rawData[i * 4 + 2] - 1, rawData[i * 4 + 3]));
		return mapping;
	};
	UmAlQuraStatic.millisPerSecond = 1e3;
	UmAlQuraStatic.millisPerMinute = UmAlQuraStatic.millisPerSecond * 60;
	UmAlQuraStatic.millisPerHour = UmAlQuraStatic.millisPerMinute * 60;
	UmAlQuraStatic.millisPerDay = UmAlQuraStatic.millisPerHour * 24;
	UmAlQuraStatic.minDate = new Date(1900, 3, 30);
	UmAlQuraStatic.maxDate = new Date(2077, 10, 16, 23, 59, 59, 999);
	UmAlQuraStatic.hijriYearData = UmAlQuraStatic._initDateMapping();
	UmAlQuraStatic.locale = en;
	UmAlQuraStatic.locales = {};
	UmAlQuraStatic.minCalendarYear = 1318;
	UmAlQuraStatic.maxCalendarYear = 1500;
	return UmAlQuraStatic;
}();
UmAlQuraStatic.registerLocale(ar);
UmAlQuraStatic.registerLocale(en);
var UmAlQura = function() {
	function UmAlQura(dateOrHy, hm, hd, hour, minute, second, millisecond) {
		if (hour === void 0) hour = 0;
		if (minute === void 0) minute = 0;
		if (second === void 0) second = 0;
		if (millisecond === void 0) millisecond = 0;
		this._date = new Date(0, 0, 0);
		this._hy = 0;
		this._hm = 0;
		this._hd = 0;
		if (dateOrHy instanceof Date) this._setDate(dateOrHy);
		else if (dateOrHy !== void 0 && hm !== void 0 && hd !== void 0) {
			var _a = UmAlQuraStatic.hijriToGregorian(dateOrHy, hm, hd), gy = _a.gy, gm = _a.gm, gd = _a.gd;
			this._setDate(new Date(gy, gm, gd, hour, minute, second, millisecond));
		} else this._setDate(/* @__PURE__ */ new Date());
	}
	Object.defineProperty(UmAlQura.prototype, "date", {
		/**
		* Returns the `Date` object of this instance.
		*/
		get: function() {
			return new Date(this._date.valueOf());
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(UmAlQura.prototype, "hy", {
		/**
		* Returns the Hijri year of this instance.
		*/
		get: function() {
			return this._hy;
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(UmAlQura.prototype, "hm", {
		/**
		* Returns the Hijri month of this instance.
		*/
		get: function() {
			return this._hm;
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(UmAlQura.prototype, "hd", {
		/**
		* Returns the Hijri day of month of this instance.
		*/
		get: function() {
			return this._hd;
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(UmAlQura.prototype, "dayOfYear", {
		/**
		* Returns the Hijri day of year of this instance.
		*/
		get: function() {
			return UmAlQuraStatic.getDayOfYear(this.date);
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(UmAlQura.prototype, "dayOfWeek", {
		/**
		* Returns the day of week of this instance.
		*/
		get: function() {
			return UmAlQuraStatic.getDayOfWeek(this.date);
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(UmAlQura.prototype, "weekOfYear", {
		/**
		* Returns the Hijri week of year of this instance.
		*/
		get: function() {
			return UmAlQuraStatic.getWeekOfYear(this.date);
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(UmAlQura.prototype, "daysInYear", {
		/**
		* Returns the number of days in year of this instance.
		*/
		get: function() {
			return UmAlQuraStatic.getDaysInYear(this.hy);
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(UmAlQura.prototype, "daysInMonth", {
		/**
		* Returns the number of days in month of this instance.
		*/
		get: function() {
			return UmAlQuraStatic.getDaysInMonth(this.hy, this.hm);
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(UmAlQura.prototype, "isLeapYear", {
		/**
		* Returns whether or not the Hijri year of this instance is a leap year.
		*/
		get: function() {
			return UmAlQuraStatic.isLeapYear(this.hy);
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(UmAlQura.prototype, "monthArray", {
		/**
		* Returns the Hijri month array of this instance.
		*/
		get: function() {
			return UmAlQuraStatic.getMonthArray(this.date).map(function(w) {
				return w.map(function(d) {
					return d ? new UmAlQura(d) : null;
				});
			});
		},
		enumerable: true,
		configurable: true
	});
	/**
	* Adds the specified amount of `unit` to the current date and returns a new instance.
	* @param {number} value The amount of units to be added
	* @param {UnitOfTimeMs} unit The unit of time
	*/
	UmAlQura.prototype.add = function(value, unit) {
		switch (unit) {
			case "year": return new UmAlQura(UmAlQuraStatic.addYears(this.date, value));
			case "month": return new UmAlQura(UmAlQuraStatic.addMonths(this.date, value));
			case "week": return new UmAlQura(UmAlQuraStatic.addWeeks(this.date, value));
			case "day": return new UmAlQura(UmAlQuraStatic.addDays(this.date, value));
			case "hour":
			case "minute":
			case "second":
			case "millisecond": return new UmAlQura(UmAlQuraStatic.addTime(this.date, value, unit));
			default: throw new Error("Invalid value for `unit`");
		}
	};
	/**
	* Subtracts the specified amount of `unit` from the current date and returns a new instance.
	* @param {number} value The amount of units to be subtracted
	* @param {UnitOfTimeMs} unit The unit of time
	*/
	UmAlQura.prototype.subtract = function(value, unit) {
		return this.add(value * -1, unit);
	};
	/**
	* Returns a new instance having the Hijri date of this instance starting at the specified unit of time.
	* @param {UnitOfTime} unit The unit of time
	*/
	UmAlQura.prototype.startOf = function(unit) {
		return new UmAlQura(UmAlQuraStatic.startOf(this.date, unit));
	};
	/**
	* Returns a new instance having the Hijri date of this instance ending at the specified unit of time.
	* @param {UnitOfTime} unit The unit of time
	*/
	UmAlQura.prototype.endOf = function(unit) {
		return new UmAlQura(UmAlQuraStatic.endOf(this.date, unit));
	};
	/**
	* Checks if current date is before the specified date. The comparison is made based on milliseconds of both
	* times. This can be changed by specifying a value for the `unit` parameter.
	* @param {(UmAlQura | Date)} other The date to compare against
	* @param {UnitOfTimeMs} [unit='millisecond'] The unit of time
	*/
	UmAlQura.prototype.isBefore = function(other, unit) {
		if (unit === void 0) unit = "millisecond";
		var thisDate = this.date;
		var thatDate = other instanceof Date ? other : other.date;
		if (unit === "millisecond") return thisDate.valueOf() < thatDate.valueOf();
		else return this.endOf(unit).date.valueOf() < thatDate.valueOf();
	};
	/**
	* Checks if current date is after the specified date. The comparison is made based on milliseconds,
	* this can be changed by specifying a value for the `unit` parameter.
	* @param {(UmAlQura | Date)} other The date to compare against
	* @param {UnitOfTimeMs} [unit='millisecond'] The unit of time
	*/
	UmAlQura.prototype.isAfter = function(other, unit) {
		if (unit === void 0) unit = "millisecond";
		var thisDate = this.date;
		var thatDate = other instanceof Date ? other : other.date;
		if (unit === "millisecond") return thisDate.valueOf() > thatDate.valueOf();
		else return this.startOf(unit).date.valueOf() > thatDate.valueOf();
	};
	/**
	* Checks if current date is same as the specified date. The comparison is made based on milliseconds,
	* this can be changed by specifying a value for the `unit` parameter.
	* @param {(UmAlQura | Date)} other The date to compare against
	* @param {UnitOfTimeMs} [unit='millisecond'] The unit of time
	*/
	UmAlQura.prototype.isSame = function(other, unit) {
		if (unit === void 0) unit = "millisecond";
		var thisDate = this.date;
		var thatDate = other instanceof Date ? other : other.date;
		if (unit === "millisecond") return thisDate.valueOf() === thatDate.valueOf();
		else return this.startOf(unit).date.valueOf() === new UmAlQura(thatDate).startOf(unit).date.valueOf();
	};
	/**
	* Checks if current date is same as or before the specified date. The comparison is made based on milliseconds,
	* this can be changed by specifying a value for the `unit` parameter.
	* @param {(UmAlQura | Date)} other The date to compare against
	* @param {UnitOfTimeMs} [unit='millisecond'] The unit of time
	*/
	UmAlQura.prototype.isSameOrBefore = function(other, unit) {
		if (unit === void 0) unit = "millisecond";
		return this.isSame(other, unit) || this.isBefore(other, unit);
	};
	/**
	* Checks if current date is same as or after the specified date. The comparison is made based on milliseconds,
	* this can be changed by specifying a value for the `unit` parameter.
	* @param {(UmAlQura | Date)} other The date to compare against
	* @param {UnitOfTimeMs} [unit='millisecond'] The unit of time
	*/
	UmAlQura.prototype.isSameOrAfter = function(other, unit) {
		if (unit === void 0) unit = "millisecond";
		return this.isSame(other, unit) || this.isAfter(other, unit);
	};
	/**
	* Checks if current date is between the specified `from`/`to` dates. The comparison is made based on milliseconds,
	* this can be changed by specifying a value for the `unit` parameter. The comparison is exclusive of both ends by default,
	* this can be controller by `fromInclusive`/`toInclusive` parameters.
	* @param {(UmAlQura | Date)} from The lower bound date
	* @param {(UmAlQura | Date)} to The higher bound date
	* @param {boolean} [fromInclusive=false] Whether lower bound is inclusive, defaults to false.
	* @param {boolean} [toInclusive=false] Whether upper bound is inclusive, defaults to false.
	* @param {UnitOfTimeMs} [unit='millisecond'] The unit of time
	*/
	UmAlQura.prototype.isBetween = function(from, to, fromInclusive, toInclusive, unit) {
		if (fromInclusive === void 0) fromInclusive = false;
		if (toInclusive === void 0) toInclusive = false;
		if (unit === void 0) unit = "millisecond";
		return (fromInclusive ? this.isSameOrAfter(from, unit) : this.isAfter(from, unit)) && (toInclusive ? this.isSameOrBefore(to, unit) : this.isBefore(to, unit));
	};
	/**
	* Formats this instance in Hijri date.
	* @param {string} mask The mask
	* @param {string} locale The locale to use. If omitted, uses  the locale set via `locale` or the default locale.
	*/
	UmAlQura.prototype.format = function(mask, locale) {
		return UmAlQuraStatic.format(this.date, mask, locale || UmAlQuraStatic["locale"].name);
	};
	/**
	* Clones this instance and returns a new instance with the same values.
	*/
	UmAlQura.prototype.clone = function() {
		return new UmAlQura(this.date);
	};
	UmAlQura.prototype._setDate = function(date) {
		var _a = UmAlQuraStatic.gregorianToHijri(date), hy = _a.hy, hm = _a.hm, hd = _a.hd;
		this._date = new Date(date.valueOf());
		this._hy = hy;
		this._hm = hm;
		this._hd = hd;
	};
	return UmAlQura;
}();
function umalqura(dateOrHy, hm, hd, hour, minute, second, millisecond) {
	if (hour === void 0) hour = 0;
	if (minute === void 0) minute = 0;
	if (second === void 0) second = 0;
	if (millisecond === void 0) millisecond = 0;
	if (dateOrHy instanceof Date) return new UmAlQura(dateOrHy);
	else if (dateOrHy !== void 0 && hm !== void 0 && hd !== void 0) return new UmAlQura(dateOrHy, hm, hd, hour, minute, second, millisecond);
	else return new UmAlQura();
}
/**
* Returns the library version.
*/
umalqura.VERSION = "0.0.7";
/**
* Returns a class which exposes static Hijri related functions.
*/
umalqura.$ = UmAlQuraStatic;
/**
* Returns the minimum supported Hijri date.
*/
umalqura.min = umalqura(UmAlQuraStatic["minCalendarYear"], 1, 1);
/**
* Returns the maximum supported Hijri date.
*/
umalqura.max = umalqura(UmAlQuraStatic["maxCalendarYear"], 1, 1).endOf("year");
/**
* Gets or sets the global locale
* @param locale The locale to set. If omitted, returns the current locale
*/
umalqura.locale = function(locale) {
	return locale ? UmAlQuraStatic.setLocale(locale) : UmAlQuraStatic["locale"].name;
};
/**
* Returns whether the currently set locale is RTL or not.
*/
umalqura.rtl = function() {
	return !!UmAlQuraStatic["locale"].rtl;
};
/**
* Returns the times names using the currently set locale.
*/
umalqura.times = function() {
	return UmAlQuraStatic["locale"].timeNames.slice();
};
/**
* Returns the days names using the currently set locale.
*/
umalqura.days = function() {
	return UmAlQuraStatic["locale"].dayNames.slice();
};
/**
* Returns the days short names using the currently set locale.
*/
umalqura.daysShort = function() {
	return UmAlQuraStatic["locale"].dayNamesShort.slice();
};
/**
* Returns the months names using the currently set locale.
*/
umalqura.months = function() {
	return UmAlQuraStatic["locale"].monthNames.slice();
};
/**
* Returns the months short names using the currently set locale.
*/
umalqura.monthsShort = function() {
	return UmAlQuraStatic["locale"].monthNamesShort.slice();
};
/**
* Returns the localized number for the given number using the currently set locale.
*/
umalqura.localizeNum = function(num) {
	return UmAlQuraStatic["locale"].localizeNum(num);
};
/**
* Returns the localized day number for the given day number using the currently set locale.
*/
umalqura.localizeDayNum = function(d) {
	return UmAlQuraStatic["locale"].localizeDayNum(d);
};
//#endregion
export { umalqura as t };
