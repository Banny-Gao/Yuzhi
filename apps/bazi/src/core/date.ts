import dayjs from 'dayjs'
import Decimal from 'decimal.js'

import {
  LUNAR_INFO,
  MIN_LUNAR_YEAR,
  MAX_LUNAR_YEAR,
  SEASON_NAME,
  LUNAR_MONTH,
  LUNAR_MONTH_WITH_LEAP,
  LUNAR_DAY,
  SOLAR_TERM,
} from './data'
import { toChineseNum } from './utils/number-to-chinese'
import { solarTermsControllerGetSolarTerms } from '@/utils/request/openapi'

import type { SolarTerm } from '@/utils/request/openapi'

Decimal.set({ precision: 10, rounding: Decimal.ROUND_HALF_UP }) // 设置小数精度
const DEFAULT_LONGITUDE = 120

export const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss'
export const MONTH_FORMAT = 'YYYY-MM'
export const DAY_FORMAT = 'YYYY-MM-DD'
export const HOUR_FORMAT = 'YYYY-MM-DD HH'
export const TIME_FORMAT = 'HH:mm:ss'
export const dateFormat = (date: dayjs.Dayjs | Date | string, format: string = DATE_FORMAT) =>
  dayjs(date).format(format)

declare global {
  export type SolarTermWithDate = Partial<SolarTerm> & {
    date: dayjs.Dayjs
    solarTermName: string
    dateString: string
    introduction?: string // 节气简介
    yangSheng?: string // 节气养生建议
    solarDateString: string
    longitude: string // 黄经
    climate: string // 气候特点
    phenomenon: string // 物候现象
    activity: string // 农事活动
  }

  export type BaseDate<T = object> = T & {
    year: number
    month: number
    day: number
    hour: number
    minute: number
    second: number
  }

  export type SolarDate = BaseDate<{
    date: Date
    dateString: string
    solarDateString: string
    lunar?: LunarDate // 农历日期
  }>

  /** 农历日期接口 */
  export type LunarDate = BaseDate<{
    dateString: string
    solarDateString: string
    lunarMonth: LunarMonth
    lunarDay: LunarDay
    isLeap: boolean // 是否闰月
    lunarDateString: string // 农历日期文本
    monthIndex: number // 当月在本年索引
    dateIndex: number // 当天在本月索引
    currentSolarTerms?: [SolarTermWithDate, SolarTermWithDate] // 当前前后节气
    seasonName: SeasonName // 季节名称
  }>
}

/** 获取闰月月份 */
const getLeapMonth = (lunarInfo: number): number => lunarInfo & 0xf

/** 获取闰月天数 */
const getLeapDays = (lunarInfo: number): number => (getLeapMonth(lunarInfo) ? (lunarInfo & 0x10000 ? 30 : 29) : 0)

/** 计算农历年天数 */
const getLunarYearDays = (lunarInfo: number): number => {
  let total = 0
  let monthInfo = 0x8000
  for (let i = 0; i < 12; i++) {
    total += lunarInfo & monthInfo ? 30 : 29
    monthInfo = monthInfo >> 1
  }

  return total + getLeapDays(lunarInfo)
}

/** 获取农历某月的天数 */
const getLunarMonthDays = (lunarInfo: number, month: number): number => (lunarInfo & (0x10000 >> month) ? 30 : 29)

/** 计算时差方程修正值（分钟） */
const getEquationOfTime = (date: Date): number => {
  // 计算当年的第几天（1月1日为第1天）
  const dayOfYear =
    Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24)) + 1

  // 计算太阳角度（弧度），81是春分前的天数
  const B = new Decimal(dayOfYear - 81)
    .div(365)
    .times(2 * Math.PI)
    .toNumber()

  return new Decimal(9.87)
    .times(Math.sin(2 * B))
    .sub(new Decimal(7.53).times(Math.cos(B)))
    .sub(new Decimal(1.5).times(Math.sin(B)))
    .toNumber()
}

const solarTermsCache: Record<number, SolarTermWithDate[]> = {}
const getExtraPropsByName = (name: SolarTermName) => {
  const [_, longitude, climate, phenomenon, activity] = SOLAR_TERM.find(term => term[0] === name)!
  return { longitude, climate, phenomenon, activity }
}
/** 获取节气数据 */
export const getSolarTermsFormApi = async (year: number): Promise<SolarTermWithDate[]> => {
  if (solarTermsCache[year]) return solarTermsCache[year]

  let solarTerms: SolarTermWithDate[] = []
  try {
    const res = await solarTermsControllerGetSolarTerms({
      query: {
        year,
      },
    })
    if (!res.data?.length) throw new Error('节气数据为空')
    // pub_date 为 10月23日形式， 通过正则提取月和日的数字， 返回 10 23
    const getMonthAndDay = (date: string) => {
      const match = date.match(/(\d+)月(\d+)日/)
      return `${match?.[1] || ''} ${match?.[2] || ''}`
    }

    solarTerms =
      (
        await Promise.all(
          res.data?.map(async item => {
            const date = dayjs(
              `${item.pub_year} ${getMonthAndDay(item.pub_date)} ${item.pub_time}`,
              'YYYY MM DD HH:mm:ss',
              'zh-cn'
            )
            const solarDate = await getSolarDate(date.toDate(), DEFAULT_LONGITUDE, false)
            return {
              ...item,
              introduction: item.des,
              yangSheng: item.heath,
              date,
              solarTermName: item.name,
              dateString: date.format(DATE_FORMAT),
              solarDateString: solarDate.solarDateString,
              ...getExtraPropsByName(item.name as SolarTermName),
            }
          })
        )
      ).sort((a, b) => a.date.diff(b.date)) ?? []
  } catch (error) {
    solarTerms = await getSolarTermsFromLocal(year)
  }

  solarTermsCache[year] = solarTerms

  return solarTerms
}
/* 本地获取节气 */
/** 将日期转换为儒略日 */
export const getJulianDay = (date: Date): number => {
  const y = date.getFullYear()
  const m = date.getMonth() + 1
  const d = date.getDate()
  const h = new Decimal(date.getHours())
    .plus(new Decimal(date.getMinutes()).div(60))
    .plus(new Decimal(date.getSeconds()).div(3600))

  let jd = 0
  let yy = y
  let mm = m

  if (m <= 2) {
    yy--
    mm += 12
  }

  const a = Math.floor(yy / 100)
  const b = 2 - a + Math.floor(a / 4)

  jd = Math.floor(365.25 * (yy + 4716)) + Math.floor(30.6001 * (mm + 1)) + d + b - 1524.5 + h.div(24).toNumber()
  return jd
}
/**
 * 计算指定儒略日的太阳黄经
 * 使用天文算法计算太阳在黄道上的位置
 * @param jd 儒略日
 */
export function getSolarLongitude(jd: number): number {
  // 计算T是从J2000.0起的儒略世纪数
  const T = (jd - 2451545.0) / 36525
  const T2 = T * T
  const T3 = T2 * T

  // 太阳平黄经
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2
  // 太阳平近点角
  const M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T3

  // 太阳中心差
  const C =
    (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin((M * Math.PI) / 180) +
    (0.019993 - 0.000101 * T) * Math.sin((2 * M * Math.PI) / 180) +
    0.00029 * Math.sin((3 * M * Math.PI) / 180)

  // 真黄经
  let theta = L0 + C

  // 把角度限制在0-360度之间
  theta = theta % 360
  if (theta < 0) {
    theta += 360
  }

  return theta
}
/** 查找指定黄经度数对应的儒略日 */
export const findSolarTermJD = (targetLongitude: number, startJD: number, endJD: number): number => {
  const precision = 0.0001
  let low = new Decimal(startJD)
  let high = new Decimal(endJD)
  let safetyCounter = 0 // 防止无限循环

  while (high.minus(low).gt(precision) && safetyCounter++ < 50) {
    const mid = low.plus(high).div(2)
    const longitude = getSolarLongitude(mid.toNumber())

    const currentDiff = new Decimal(longitude).minus(targetLongitude).mod(360)
    if (currentDiff.abs().lte(precision)) {
      return mid.toNumber()
    }

    // 修正方向判断逻辑
    const adjustedDiff = currentDiff.add(360).mod(360)
    adjustedDiff.lt(180) ? (high = mid) : (low = mid)
  }

  return low.plus(high).div(2).toNumber()
}
/** 儒略日转公历日期 */
export const fromJulianDay = (jd: number): Date => {
  const z = Math.floor(jd + 0.5)
  const a = Math.floor((z - 1867216.25) / 36524.25)
  const b = z + 1 + a - Math.floor(a / 4)
  const c = b + 1524
  const d = Math.floor((c - 122.1) / 365.25)
  const e = Math.floor(365.25 * d)
  const f = Math.floor((c - e) / 30.6001)

  const day = c - e - Math.floor(30.6001 * f)
  const month = f - 1 - 12 * Math.floor(f / 14)
  const year = d - 4715 - Math.floor((7 + month) / 10)

  const fraction = jd + 0.5 - z
  const hour = Math.floor(fraction * 24)
  const minute = Math.floor((fraction * 24 - hour) * 60)
  const second = Math.floor(((fraction * 24 - hour) * 60 - minute) * 60)

  // 创建UTC时间对象
  const utcDate = new Date(year, month - 1, day, hour, minute, second)
  // 转换为中国标准时间（UTC+8）
  return new Date(utcDate.getTime() + 8 * 60 * 60 * 1000)
}
const getSolarTermsFromLocal = async (year: number): Promise<SolarTermWithDate[]> => {
  // 优先从缓存读取
  try {
    const cached = solarTermsCache[year]
    if (cached) return cached
  } catch (err) {
    console.error('本地存储读取失败', err)
  }

  // 缓存未命中则计算
  const solarTerms: SolarTermWithDate[] = []

  // 节气估算月份表 (立春到大寒对应的公历月份)
  const ESTIMATE_MONTHS = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 0, 0]
  // 节气估算日期表 (每个节气的大致公历日期)
  const ESTIMATE_DAYS = [4, 19, 5, 20, 5, 20, 5, 21, 6, 21, 6, 22, 7, 22, 7, 23, 8, 23, 8, 23, 7, 22, 7, 5]

  for (let i = 0; i < 24; i++) {
    // 根据节气索引获取估算月份和日期
    const estimateMonth = ESTIMATE_MONTHS[i]
    const estimateDay = ESTIMATE_DAYS[i]

    // 处理跨年 (小寒、大寒属于下一年的节气)
    const actualYear = i >= 22 ? year + 1 : year

    // 创建估算日期
    const approxDate = new Date(actualYear, estimateMonth, estimateDay)
    const jd = getJulianDay(approxDate)

    // 计算精确的黄经位置 (立春开始每个节气间隔15度)
    const targetLongitude = (315 + i * 15) % 360

    // 查找精确的节气时间 (扩大搜索范围到前后30天)
    const termJD = findSolarTermJD(targetLongitude, jd - 30, jd + 30)
    const termDate = fromJulianDay(termJD)

    // 确保节气属于目标年份
    if (termDate.getFullYear() === year || (i >= 22 && termDate.getFullYear() === year + 1)) {
      const solarDate = await getSolarDate(termDate, DEFAULT_LONGITUDE, false)
      const dTermDate = dayjs(termDate)
      const name = SOLAR_TERM[i][0]
      const solarTerm: SolarTermWithDate = {
        solarTermName: name,
        date: dTermDate,
        dateString: dTermDate.format(DATE_FORMAT),
        solarDateString: solarDate.solarDateString,
        ...getExtraPropsByName(name),
      }
      solarTerms.push(solarTerm)
    }
  }

  // 按时间排序
  const sortedSolarTerms = solarTerms.sort((a, b) => a.date.diff(b.date))

  return sortedSolarTerms
}

/** 获取某月某天前后的节气 */
const getPrevAndNextSolarTerm = async (date: Date): Promise<[SolarTermWithDate, SolarTermWithDate]> => {
  const year = date.getFullYear()
  // 获取前年、当年、后年的节气（处理跨年边界情况）
  const [prevYearTerms, currentYearTerms, nextYearTerms] = await Promise.all([
    getSolarTermsFormApi(year - 1),
    getSolarTermsFormApi(year),
    getSolarTermsFormApi(year + 1),
  ])

  // 合并并排序所有相关节气（保留三年数据确保覆盖所有情况）
  const allTerms = [...prevYearTerms, ...currentYearTerms, ...nextYearTerms].sort((a, b) => a.date.diff(b.date))

  const targetTime = date.getTime()
  let prevTerm = allTerms[0]
  let nextTerm = allTerms[allTerms.length - 1]

  // 优化查找逻辑：从后往前找第一个小于目标时间的节气
  for (let i = allTerms.length - 1; i >= 0; i--) {
    const termTime = allTerms[i].date.valueOf()

    if (termTime <= targetTime) {
      prevTerm = allTerms[i]
      nextTerm = allTerms[i + 1] || allTerms[0] // 处理最后节气的情况
      break
    }
  }

  // 特殊处理年初情况（可能属于前一年的节气）
  if (date.getMonth() < 2) {
    // 1-3月需要检查前一年
    const firstTermOfYear = currentYearTerms[0]
    if (targetTime < firstTermOfYear.date.valueOf()) {
      prevTerm = prevYearTerms[prevYearTerms.length - 1]
      nextTerm = firstTermOfYear
    }
  }

  return [prevTerm, nextTerm]
}

/** 计算真太阳时 */
export const getSolarDate = async (
  date: Date,
  longitude: number = DEFAULT_LONGITUDE,
  initLunar: boolean = true,
  initSolarTerms: boolean = true
): Promise<SolarDate> => {
  // 计算修正秒数
  const standardMeridian = DEFAULT_LONGITUDE
  const totalSeconds = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds()
  let correctedSeconds =
    totalSeconds +
    (longitude - standardMeridian) * 240 + // 4 * 60 = 240
    getEquationOfTime(date) * 60

  // 处理日期计算
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()

  // 处理跨日
  if (correctedSeconds < 0) {
    correctedSeconds += 86400 // 24 * 3600
    day--
    if (day === 0) {
      month--
      if (month === 0) {
        month = 12
        year--
      }
      day = new Date(year, month, 0).getDate()
    }
  } else if (correctedSeconds >= 86400) {
    correctedSeconds -= 86400
    day++
    if (day > new Date(year, month, 0).getDate()) {
      day = 1
      month++
      if (month > 12) {
        month = 1
        year++
      }
    }
  }

  // 计算时分秒
  const hour = Math.floor(correctedSeconds / 3600)
  const remainingSeconds = correctedSeconds % 3600
  const minute = Math.floor(remainingSeconds / 60)
  const second = Math.round(remainingSeconds % 60) // 使用 round 处理小数

  const newDate = new Date(year, month - 1, day, hour, minute, second)

  const solarDate: SolarDate = {
    year,
    month,
    day,
    hour,
    minute,
    second: second,
    date: newDate,
    dateString: dateFormat(date),
    solarDateString: dateFormat(newDate),
  }

  if (initLunar) {
    solarDate.lunar = await getLunarDate(solarDate, initSolarTerms)
  }

  return solarDate
}

/** 将真太阳时转换为农历日期 */
export const getLunarDate = async (solarDate: SolarDate, initSolarTerms: boolean = true): Promise<LunarDate> => {
  // 使用UTC时间避免时区问题，基准日期设为1900年1月31日UTC
  const baseDate = new Date(Date.UTC(MIN_LUNAR_YEAR, 0, 31))
  const solarDateUTC = new Date(
    Date.UTC(
      solarDate.date.getFullYear(),
      solarDate.date.getMonth(),
      solarDate.date.getDate(),
      solarDate.date.getHours(),
      solarDate.date.getMinutes(),
      solarDate.date.getSeconds()
    )
  )

  const offsetDays = Math.floor((solarDateUTC.getTime() - baseDate.getTime()) / 86400000)

  let lunarYear = MIN_LUNAR_YEAR
  let daysRemaining = offsetDays
  let isLeap = false

  // 计算农历年
  while (lunarYear < MAX_LUNAR_YEAR && daysRemaining > 0) {
    const yearInfo = LUNAR_INFO[lunarYear - MIN_LUNAR_YEAR]
    const yearDays = getLunarYearDays(yearInfo)

    if (daysRemaining < yearDays) break

    daysRemaining -= yearDays
    lunarYear++
  }

  // 计算农历月
  const yearInfo = LUNAR_INFO[lunarYear - MIN_LUNAR_YEAR]
  const leapMonth = getLeapMonth(yearInfo)
  let lunarMonth = 0
  let monthDays = 0
  let leapProcessed = false

  for (let m = 1; m <= 12; m++) {
    // 先处理正常月份
    monthDays = getLunarMonthDays(yearInfo, m)
    if (daysRemaining < monthDays) {
      lunarMonth = m
      break
    }
    daysRemaining -= monthDays

    // 处理闰月（在正常月份之后）
    if (leapMonth === m && !leapProcessed) {
      const leapDays = getLeapDays(yearInfo)
      if (daysRemaining < leapDays) {
        lunarMonth = m
        isLeap = true
        leapProcessed = true
        break
      }
      daysRemaining -= leapDays
      leapProcessed = true
    }
  }

  // 计算农历日
  const lunarDay = daysRemaining + 1

  // 处理月份显示（移除错误的月份修正）
  let monthText: LunarMonth = LUNAR_MONTH[lunarMonth - 1]
  if (isLeap) {
    monthText = LUNAR_MONTH_WITH_LEAP[lunarMonth - 1]
  }
  const lunarYearText = toChineseNum(lunarYear)

  let currentSolarTerms
  if (initSolarTerms) {
    currentSolarTerms = await getPrevAndNextSolarTerm(solarDate.date)
  }
  const seasonName = SEASON_NAME[Math.floor(lunarMonth / 3)]

  return {
    dateString: solarDate.dateString,
    solarDateString: solarDate.solarDateString,
    year: lunarYear,
    month: lunarMonth,
    lunarMonth: monthText,
    day: lunarDay,
    lunarDay: LUNAR_DAY[lunarDay - 1],
    hour: solarDate.hour,
    minute: solarDate.minute,
    second: solarDate.second,
    isLeap,
    lunarDateString: `${lunarYearText}年 ${monthText}月 ${LUNAR_DAY[lunarDay - 1]}`,
    monthIndex: lunarMonth - 1,
    dateIndex: lunarDay - 1,
    currentSolarTerms,
    seasonName,
  }
}

/** 农历日期转公历日期 */
export const lunarToDate = (lunarDate: LunarDate): Date => {
  let daysOffset = 0

  // 累加从MIN_LUNAR_YEAR到目标农历年的所有天数
  for (let y = MIN_LUNAR_YEAR; y < lunarDate.year; y++) {
    const yearInfo = LUNAR_INFO[y - MIN_LUNAR_YEAR]
    daysOffset += getLunarYearDays(yearInfo)
  }

  const targetYearInfo = LUNAR_INFO[lunarDate.year - MIN_LUNAR_YEAR]
  const leapMonth = getLeapMonth(targetYearInfo)

  // 累加目标农历年中已过完整月份的天数
  let leapProcessed = false

  for (let m = 1; m < lunarDate.month; m++) {
    // 先处理正常月份
    daysOffset += getLunarMonthDays(targetYearInfo, m)

    // 处理闰月（在正常月份之后）
    if (leapMonth === m && !leapProcessed) {
      daysOffset += getLeapDays(targetYearInfo)
      leapProcessed = true
    }
  }

  // 如果目标月份本身是闰月，需要先添加对应正常月份的天数
  if (lunarDate.isLeap && leapMonth === lunarDate.month) {
    daysOffset += getLunarMonthDays(targetYearInfo, lunarDate.month)
  }

  // 添加目标月份内的天数（从0开始计算偏移）
  daysOffset += lunarDate.day - 1

  // 基准日期必须与getLunarDate中保持完全一致，使用UTC时间
  const baseDate = new Date(Date.UTC(MIN_LUNAR_YEAR, 0, 31))

  // 重建真太阳时日期
  const solarTimeStamp = baseDate.getTime() + daysOffset * 86400000
  const solarBaseDateUTC = new Date(solarTimeStamp)

  // 创建真太阳时日期，从UTC转换为本地时间
  const solarTimeDate = new Date(
    solarBaseDateUTC.getUTCFullYear(),
    solarBaseDateUTC.getUTCMonth(),
    solarBaseDateUTC.getUTCDate(),
    lunarDate.hour,
    lunarDate.minute,
    lunarDate.second
  )

  // 直接返回真太阳时，不进行逆向修正
  // 因为农历数据本身就是基于真太阳时计算的
  return solarTimeDate
}

/** 农历日期转换为原始标准时间（如果需要逆向转换为输入时间） */
export const lunarToStandardTime = (lunarDate: LunarDate, longitude: number = DEFAULT_LONGITUDE): Date => {
  // 先获取真太阳时
  const solarTimeDate = lunarToDate(lunarDate)

  // 进行逆向真太阳时修正，从真太阳时转回原始标准时间
  const standardMeridian = DEFAULT_LONGITUDE
  const solarTimeSeconds = lunarDate.hour * 3600 + lunarDate.minute * 60 + lunarDate.second

  // 计算当时的真太阳时修正量
  const longitudeCorrection = (longitude - standardMeridian) * 240
  const timeEquationCorrection = getEquationOfTime(solarTimeDate) * 60

  // 逆向修正：真太阳时 - 修正量 = 原始标准时间
  let originalSeconds = solarTimeSeconds - longitudeCorrection - timeEquationCorrection

  // 处理跨日情况，从真太阳时的日期开始
  let year = solarTimeDate.getFullYear()
  let month = solarTimeDate.getMonth() + 1
  let day = solarTimeDate.getDate()

  if (originalSeconds < 0) {
    originalSeconds += 86400
    day--
    if (day === 0) {
      month--
      if (month === 0) {
        month = 12
        year--
      }
      day = new Date(year, month, 0).getDate()
    }
  } else if (originalSeconds >= 86400) {
    originalSeconds -= 86400
    day++
    if (day > new Date(year, month, 0).getDate()) {
      day = 1
      month++
      if (month > 12) {
        month = 1
        year++
      }
    }
  }

  // 计算原始时分秒
  const hour = Math.floor(originalSeconds / 3600)
  const minute = Math.floor((originalSeconds % 3600) / 60)
  const second = Math.round(originalSeconds % 60)

  return new Date(year, month - 1, day, hour, minute, second)
}

/** 获取某年某月所有的日期，默认取东经120度中午12点 */
export const getDaysInMonth = async (year: number, month: number): Promise<SolarDate[]> => {
  // 获取该月的天数
  const daysInMonth = new Date(year, month, 0).getDate()

  // 创建所有日期的Promise数组
  const datePromises: Promise<SolarDate>[] = []

  for (let day = 1; day <= daysInMonth; day++) {
    // 创建该天的日期对象（使用中午12点避免时区问题）
    const date = new Date(year, month - 1, day, 12, 0, 0)

    // 添加转换Promise到数组
    datePromises.push(getSolarDate(date, DEFAULT_LONGITUDE, true, false))
  }

  // 并行处理所有日期转换
  const solarDates = await Promise.all(datePromises)

  return solarDates
}
