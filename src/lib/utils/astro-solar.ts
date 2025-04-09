// 定数
type RAD = number;
type DEG = number;
type JD = number;
type JC = number;
type AT = Date | number;
type deltaAt = number;

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

const sin = (deg: DEG) => Math.sin(deg * DEG_TO_RAD);
const cos = (deg: DEG) => Math.cos(deg * DEG_TO_RAD);
const modulo = (a: number, b: number) => ((+a % (b = +b)) + b) % b;

// 15日
const DAY15 = 15 * 86400000;

// 天文単位 (km)
const AU = 149597870.7;

// JD(ET) ユリウス日の基準 ET = Unixエポック '1970/1/1 00:00:00 UTC'
const jdEpoch = 2440587.5;
// JD(TT) ユリウス日の基準 TT = J2000.0 '2000/1/1 12:00:00 TT'
const J2000_0 = 2451545.0;

const AddLeapSeconds = [
	'1972-07',
	'1973-01',
	'1974-01',
	'1975-01',
	'1976-01',
	'1977-01',
	'1978-01',
	'1979-01',
	'1980-01',
	'1981-07',
	'1982-07',
	'1983-07',
	'1985-07',
	'1988-01',
	'1990-01',
	'1991-01',
	'1992-07',
	'1993-07',
	'1994-07',
	'1996-01',
	'1997-07',
	'1999-01',
	'2006-01',
	'2009-01',
	'2012-07',
	'2015-07',
	'2017-01'
	// 完全なリストは [IANAのleap-seconds.list](https://data.iana.org/time-zones/data/leap-seconds.list) を参照
].map((date) => new Date(`${date}-1 00:00:00 UTC`).getTime());

const DelLeapSeconds = AddLeapSeconds.map<JD>((at) => JD(at));

// TAIからUTCへの調整秒数を取得(msec)
function getLeap(msec: AT): deltaAt {
	return 1000 * AddLeapSeconds.findIndex((leapAt) => leapAt <= (msec as number));
}

function getLeapByJD(jd: JD): deltaAt {
	return 1000 * DelLeapSeconds.findIndex((leapJD) => leapJD <= jd);
}

// JD(TT) = JD(ET) + (32.184 + ΔT) / 86400
function JD(msec: AT): JD {
	const LEAP = getLeap(msec);
	// 暦表時(ET)と原子時(TAI)の基準をそろえる際、ET と TAI の差がちょうど 32.184秒だった。
	const ttMsec = 32184 + LEAP + ((msec as number) - 0);
	// TTに基づくユリウス日を計算
	return jdEpoch + ttMsec / 86400000; // 1日は86,400.000秒
}

export function byJD(jd: JD): Date {
	const LEAP = getLeapByJD(jd);
	const ttMsec = (jd - jdEpoch) * 86400000;
	const msec = ttMsec - 32184 - LEAP;
	return new Date(msec);
}

// JC(TT) = (JD(TT) - 2451545.0) / 36525
function JC(msec: AT): JC {
	const jd = JD(msec);
	// ユリウス世紀を計算（J2000.0を基準、JD 2451545.0）
	return (jd - J2000_0) / 36525;
}

export function byJC(jc: JC): Date {
	const jdTT = J2000_0 + jc * 36525;
	return byJD(jdTT);
}

// 二分法探索
export function searchForFunc(
	func: (v: number) => DEG,
	start: number,
	target: DEG,
	RANGE: number,
	DEG: DEG,
	TOLERANCE: number
): AT {
	let low = start - RANGE;
	let high = start + RANGE;

	while (high - low > TOLERANCE) {
		const mid = (low + high) * 0.5;
		if (DEG > modulo(func(mid) - target + DEG, DEG) * 2) {
			high = mid;
		} else {
			low = mid;
		}
	}
	return (low + high) >> 1;
}

// 太陽の視黄経
export function calculateSolarLongitude(msec: AT): DEG {
	const T = JC(msec);
	const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
	//  const e = 0.016708634 - 0.000042037 * T - 0.0000001267 * T * T;
	const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
	const C =
		(1.914602 - 0.004817 * T - 0.000014 * T * T) * sin(M) +
		(0.019993 - 0.000101 * T) * sin(2 * M) +
		0.000289 * sin(3 * M);
	return modulo(L0 + C, 360);
}

// 太陽の見かけの大きさ（ラジアン）
export function calculateSolarApparentSize(msec: AT): RAD {
	const T = JC(msec);
	const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
	const e = 0.016708634 - 0.000042037 * T - 0.0000001267 * T * T;
	const R = (1.000001018 * (1 - e * e)) / (1 + e * cos(M));
	return (959.63 / R / 3600) * DEG_TO_RAD;
}

// 太陽の視黄経が特定の値になる時刻
export function findTimeForSolarLongitude(targetLongitude: DEG, msec: AT) {
	return searchForFunc(calculateSolarLongitude, (msec as number) - 0, targetLongitude, DAY15, 360, 1000);
}

// 黄道傾斜角
export function calculateObliquity(msec: AT): number {
	const T = JC(msec);
	return 23.439291 - 0.0130042 * T - 0.00000016 * T * T + 0.000000504 * T * T * T;
}

// 太陽の赤道座標
export function calculateSolarEquatorial(msec: AT): { ra: RAD; dec: RAD } {
	const lambda = calculateSolarLongitude(msec);
	const epsilon = calculateObliquity(msec);
	const ra = Math.atan2(cos(epsilon) * sin(lambda), cos(lambda));
	const dec = Math.asin(sin(epsilon) * sin(lambda));
	return { ra, dec };
}

// 日の出・日の入り
export function calculateSunriseSunset(
	msec: AT,
	latitude: number,
	longitude: number,
	elevation: number
): { sunrise: Date; transit: Date; sunset: Date } {
	const jd = JD(msec);
	const { ra, dec } = calculateSolarEquatorial(msec);
	const apparentSize = calculateSolarApparentSize(msec);
	// 大気差と標高補正
	const h0Deg = -0.5667 - apparentSize * RAD_TO_DEG * 0.5 - 0.008333 * Math.sqrt(elevation);
	const cosH = (sin(h0Deg) - sin(latitude) * Math.sin(dec)) / (cos(latitude) * Math.cos(dec));
	if (cosH < -1 || cosH > 1) {
		const dnan = new Date(NaN);
		return { sunrise: dnan, transit: dnan, sunset: dnan };
	}
	const H = Math.acos(cosH) * RAD_TO_DEG;
	const st = (280.46061837 + 360.98564736629 * (jd - J2000_0) + longitude) % 360;
	const transit = jd - ((st - ra * RAD_TO_DEG + 360) % 360) / 360;
	const sunrise = transit - H / 360;
	const sunset = transit + H / 360;
	return { sunrise: byJD(sunrise), transit: byJD(transit), sunset: byJD(sunset) };
}

// 月の位置
export function calculateLunarPosition(msec: AT): { longitude: RAD; latitude: RAD; distance: number } {
	const T = JC(msec);
	const L = 218.3164591 + 481267.88134236 * T - 0.0013268 * T * T;
	const Mm = 134.9634114 + 477198.8676313 * T + 0.008997 * T * T;
	const D = 297.8502042 + 445267.1115168 * T - 0.00163 * T * T;
	const F = 93.2720993 + 483202.0175273 * T - 0.0034029 * T * T;
	const longitude = L + 6.28875 * sin(Mm) + 1.274018 * sin(2 * D - Mm) + 0.658309 * sin(2 * D);
	const latitude = 5.128189 * sin(F);
	const distance = (385000.56 - 20905.355 * cos(Mm) - 3690.526 * cos(2 * D - Mm)) / AU;
	return {
		longitude: modulo(longitude * DEG_TO_RAD, 360 * DEG_TO_RAD),
		latitude: latitude * DEG_TO_RAD,
		distance
	};
}

// 月の見かけの大きさ
export function calculateLunarApparentSize(msec: AT): RAD {
	const { distance } = calculateLunarPosition(msec);
	return (1873.7 / distance / 3600) * DEG_TO_RAD;
}

// 月の位相角
export function calculateLunarPhaseAngle(msec: AT): DEG {
	const solarLon = calculateSolarLongitude(msec);
	const lunarLon = calculateLunarPosition(msec).longitude;
	return modulo(lunarLon - solarLon, 360);
}

// 位相角が特定の値になる時刻
export function findTimeForLunarPhase(targetPhase: DEG, msec: AT) {
	return searchForFunc(calculateLunarPhaseAngle, (msec as number) - 0, targetPhase, DAY15, 360, 1000);
}

// 月の赤道座標
export function calculateLunarEquatorial(msec: AT): { ra: RAD; dec: RAD } {
	const { longitude: lambda, latitude: beta } = calculateLunarPosition(msec);
	const epsilon = calculateObliquity(msec);
	const ra = Math.atan2(
		cos(epsilon) * sin(lambda) - Math.tan(beta * DEG_TO_RAD) * sin(epsilon),
		cos(lambda)
	);
	const dec = Math.asin(
		sin(beta * DEG_TO_RAD) * cos(epsilon) + cos(beta * DEG_TO_RAD) * sin(epsilon) * sin(lambda)
	);
	return { ra, dec };
}

// 月の出・月の入り
export function calculateMoonriseMoonset(
	msec: AT,
	latitude: number,
	longitude: number,
	elevation: number
): { moonrise: Date; transit: Date; moonset: Date } {
	const jd = JD(msec);
	const { ra, dec } = calculateLunarEquatorial(msec);
	const apparentSize = calculateLunarApparentSize(msec);
	// 大気差と標高補正
	const parallaxDeg = 0.95; // 簡易的な月の視差（実際には動的に計算可能）
	const h0Deg =
		-0.5667 - apparentSize * RAD_TO_DEG * 0.5 - 0.008333 * Math.sqrt(elevation) - parallaxDeg;
	const cosH = (sin(h0Deg) - sin(latitude) * Math.sin(dec)) / (cos(latitude) * Math.cos(dec));
	if (cosH < -1 || cosH > 1) {
		const dnan = new Date(NaN);
		return { moonrise: dnan, transit: dnan, moonset: dnan };
	}
	const st = (280.46061837 + 360.98564736629 * (jd - J2000_0) + longitude) % 360;
	const transit = jd - modulo(st - ra * RAD_TO_DEG, 360) / 360;

	const H = Math.acos(cosH) * RAD_TO_DEG;
	const moonrise = transit - H / 360;
	const moonset = transit + H / 360;
	return { moonrise: byJD(moonrise), transit: byJD(transit), moonset: byJD(moonset) };
}
