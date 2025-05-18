import dayjs from 'dayjs'
import Decimal from 'decimal.js'

import { LUNAR_INFO, MIN_LUNAR_YEAR, MAX_LUNAR_YEAR } from './data/lunar-years'
import { toChineseNum } from './utils/number-to-chinese'
import { solarTermsControllerGetSolarTerms } from '@/utils/request/openapi'

import type { NameConst } from './types'
import type { SolarTerm } from '@/utils/request/openapi'

Decimal.set({ precision: 10, rounding: Decimal.ROUND_HALF_UP }) // 设置小数精度

/** 四季 */
export type SeasonName = NameConst<typeof SEASON_NAME>
export const SEASON_NAME = ['春', '夏', '秋', '冬'] as const

/** 农历月份 */
export type LunarMonth = NameConst<typeof LUNAR_MONTH>
export const LUNAR_MONTH = [
  '正',
  '二',
  '三',
  '四',
  '五',
  '六',
  '七',
  '八',
  '九',
  '十',
  '冬',
  '腊',
] as const

/** 农历日期 */
export type LunarDay = NameConst<typeof LUNAR_DAY>
export const LUNAR_DAY = [
  '初一',
  '初二',
  '初三',
  '初四',
  '初五',
  '初六',
  '初七',
  '初八',
  '初九',
  '初十',
  '十一',
  '十二',
  '十三',
  '十四',
  '十五',
  '十六',
  '十七',
  '十八',
  '十九',
  '二十',
  '廿一',
  '廿二',
  '廿三',
  '廿四',
  '廿五',
  '廿六',
  '廿七',
  '廿八',
  '廿九',
  '三十',
] as const

/** 获取闰月月份 */
export const getLeapMonth = (lunarInfo: number): number => lunarInfo & 0xf

/** 获取闰月天数 */
export const getLeapDays = (lunarInfo: number): number =>
  getLeapMonth(lunarInfo) ? (lunarInfo & 0x10000 ? 30 : 29) : 0

/** 计算农历年天数 */
export const getLunarYearDays = (lunarInfo: number): number => {
  let total = 0
  let monthInfo = 0x8000
  for (let i = 0; i < 12; i++) {
    total += lunarInfo & monthInfo ? 30 : 29
    monthInfo = monthInfo >> 1
  }

  return total + getLeapDays(lunarInfo)
}

/** 获取农历某月的天数 */
export const getLunarMonthDays = (lunarInfo: number, month: number): number =>
  lunarInfo & (0x10000 >> month) ? 30 : 29

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
  format: (pattern?: string) => string
  lunarDate?: LunarDate // 农历日期
}>

/** 农历日期接口 */
export type LunarDate = BaseDate<{
  isLeap: boolean // 是否闰月
  solarDate: SolarDate // 真太阳时日期
  text: string // 农历日期文本
  monthIndex: number // 当月在本年索引
  dateIndex: number // 当天在本月索引
  solarTerms: SolarTerm[] // 节气
  currentSolarTerms: [SolarTerm, SolarTerm] // 当前前后节气
}>

/** 计算时差方程修正值（分钟） */
export const getEquationOfTime = (date: Date): number => {
  // 计算当年的第几天（1月1日为第0天）
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  )

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

/** 计算真太阳时 */
export const getSolarDate = async (date: Date, longitude: number = 120): Promise<SolarDate> => {
  // 计算修正秒数
  const standardMeridian = 120
  const totalSeconds = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds()
  let correctedSeconds =
    totalSeconds +
    (longitude - standardMeridian) * 240 + // 4 * 60 = 240
    getEquationOfTime(date) * 60

  // 处理日期计算
  let years = date.getFullYear()
  let months = date.getMonth() + 1
  let days = date.getDate()

  // 处理跨日
  if (correctedSeconds < 0) {
    correctedSeconds += 86400 // 24 * 3600
    days--
    if (days === 0) {
      months--
      if (months === 0) {
        months = 12
        years--
      }
      days = new Date(years, months, 0).getDate()
    }
  } else if (correctedSeconds >= 86400) {
    correctedSeconds -= 86400
    days++
    if (days > new Date(years, months, 0).getDate()) {
      days = 1
      months++
      if (months > 12) {
        months = 1
        years++
      }
    }
  }

  // 计算时分秒
  const hours = Math.floor(correctedSeconds / 3600)
  const remainingSeconds = correctedSeconds % 3600
  const minutes = Math.floor(remainingSeconds / 60)
  const seconds = Math.round(remainingSeconds % 60) // 使用 round 处理小数

  const newDate = new Date(years, months - 1, days, hours, minutes, seconds)
  const format = (pattern?: string): string => dayjs(newDate).format(pattern || 'YYYY-MM-DD HH:mm')
  const solarDate: SolarDate = {
    year: years,
    month: months,
    day: days,
    hour: hours,
    minute: minutes,
    second: seconds,
    date: newDate,
    format,
  }

  solarDate.lunarDate = await solarToLunar(solarDate)

  return solarDate
}

const getSolarTermsFormApi = async (year: number): Promise<SolarTerm[]> => {
  try {
    const res = await solarTermsControllerGetSolarTerms({
      query: {
        year,
      },
    })
    return res.data ?? []
  } catch (error) {
    console.error(error)
    return []
  }
}

/** 获取某月某天前后的节气 */
export const getPrevAndNextSolarTerm = async (date: Date): Promise<[SolarTerm, SolarTerm]> => {
  const year = date.getFullYear()
  // 获取前年、当年、后年的节气（处理跨年边界情况）
  const [prevYearTerms, currentYearTerms, nextYearTerms] = await Promise.all([
    getSolarTermsFormApi(year - 1),
    getSolarTermsFormApi(year),
    getSolarTermsFormApi(year + 1),
  ])

  // 合并并排序所有相关节气（保留三年数据确保覆盖所有情况）
  const allTerms = [...prevYearTerms, ...currentYearTerms, ...nextYearTerms].sort(
    (a, b) => Number(a.pub_time) - Number(b.pub_time)
  )

  const targetTime = date.getTime()
  let prevTerm = allTerms[0]
  let nextTerm = allTerms[allTerms.length - 1]

  // 优化查找逻辑：从后往前找第一个小于目标时间的节气
  for (let i = allTerms.length - 1; i >= 0; i--) {
    const termTime = Number(allTerms[i].pub_time)

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
    if (targetTime < Number(firstTermOfYear.pub_time)) {
      prevTerm = prevYearTerms[prevYearTerms.length - 1]
      nextTerm = firstTermOfYear
    }
  }

  return [prevTerm, nextTerm]
}

/** 将真太阳时转换为农历日期 */
export const solarToLunar = async (solarDate: SolarDate): Promise<LunarDate> => {
  const baseDate = new Date(MIN_LUNAR_YEAR, 0, 31)
  const offsetDays = Math.floor((solarDate.date.getTime() - baseDate.getTime()) / 86400000)

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
  let monthText: string = LUNAR_MONTH[lunarMonth - 1]
  if (isLeap) {
    monthText = `闰${monthText}`
  }
  const lunarYearText = toChineseNum(lunarYear)

  const solarTerms = await getSolarTermsFormApi(lunarYear)

  const currentSolarTerms = await getPrevAndNextSolarTerm(solarDate.date)

  return {
    year: lunarYear,
    month: lunarMonth,
    day: lunarDay,
    hour: solarDate.hour,
    minute: solarDate.minute,
    second: solarDate.second,
    isLeap,
    solarDate,
    text: `${lunarYearText}年 ${monthText}月 ${LUNAR_DAY[lunarDay - 1]}`,
    monthIndex: lunarMonth - 1,
    dateIndex: lunarDay - 1,
    solarTerms,
    currentSolarTerms,
  }
}
