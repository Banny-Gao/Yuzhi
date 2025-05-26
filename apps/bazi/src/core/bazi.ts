import dayjs from 'dayjs'
import { lcm } from './utils/math'
import { GAN_NAME, NAYIN_WUXING, ZHI_NAME, SOLAR_TERM } from './data'
import { tianGans } from './gan'
import { diZhis } from './zhi'
import { getSolarDate } from './date'

enum ZhuIndex {
  NianZhu = 0,
  YueZhu = 1,
  RiZhu = 2,
  ShiZhu = 3,
  TaiYuan = 4,
  TaiXi = 5,
  MingGong = 6,
  ShenGong = 7,
}

declare global {
  export type Zhu = IndexField<{
    index: number // 六十甲子索引
    zhuIndex: ZhuIndex // 柱索引
    name: GanZhiName
    gan: Gan
    zhi: Zhi
    naYin: NaYinName
  }>

  export type Bazi = {
    nianZhu: Zhu
    yueZhu: Zhu
    riZhu: Zhu
    shiZhu: Zhu
    taiYuan: Zhu
    taiXi: Zhu
    bianXing: Zhu
    mingGong: Zhu
    shenGong: Zhu
  }
}

const getNaYinName = (name: GanZhiName): NaYinName => {
  let result
  for (const [item1, item2, nayin] of NAYIN_WUXING) {
    if ([item1, item2].includes(name)) {
      result = nayin
      break
    }
  }

  return result
}

/** 获取干支组合 */
export const getGanZhiByIndex = (index: number): Omit<Zhu, 'zhuIndex'> => {
  const gan = tianGans[index % 10]
  const zhi = diZhis[index % 12]
  const name = `${gan.name}${zhi.name}` as GanZhiName
  const naYin = getNaYinName(name)

  return {
    index,
    name,
    gan,
    zhi,
    naYin,
  }
}

/** 六十干支组合对象表 */
const generateSixtyJiaZi = (): Omit<Zhu, 'zhuIndex'>[] =>
  Array.from({ length: lcm(GAN_NAME.length, ZHI_NAME.length) }, (_, i) => getGanZhiByIndex(i))

/** 六十干支 */
export const SIXTY_JIAZI: Omit<Zhu, 'zhuIndex'>[] = generateSixtyJiaZi()

/** 根据干支名获取在六十干支中的索引 */
const getGanZhiIndexByName = (name: string): number => {
  const index = SIXTY_JIAZI.findIndex(jiazi => jiazi.name === name)
  return index
}

const composeGanZhi = (gan: Gan, zhi: Zhi, zhuIndex: ZhuIndex): Zhu => {
  const name = `${gan.name}${zhi.name}` as GanZhiName
  const index = getGanZhiIndexByName(name)
  const naYin = getNaYinName(name)
  return {
    index,
    zhuIndex,
    name,
    gan,
    zhi,
    naYin,
  }
}

// 立春后算新的一年，修正年月数值取值
const getFixedYearMonth = async (lunarDate: LunarDate): Promise<[number, number]> => {
  const [currentSolarTerm, nextSolarTerm] = await lunarDate.currentSolarTerms
  /** 上个节气为立春且在腊月，则年加一，月为1 */
  if (currentSolarTerm.name === '立春' && lunarDate.month === 12) {
    return [lunarDate.year + 1, 1]
  }
  /** 下个节气为立春且在正月，则年减一，月为12 */
  if (nextSolarTerm.name === '立春' && lunarDate.month === 1) {
    return [lunarDate.year - 1, 12]
  }

  return [lunarDate.year, lunarDate.month]
}

/** 获取年的天干 */
const getNianGan = async (lunarDate: LunarDate): Promise<Gan> => {
  const [fixedYear] = await getFixedYearMonth(lunarDate)

  const index = (fixedYear - 4) % 10
  return tianGans[index]
}

/**获取年的地支 */
const getNianZhi = async (lunarDate: LunarDate): Promise<Zhi> => {
  const [fixedYear] = await getFixedYearMonth(lunarDate)

  const index = (fixedYear - 4) % 12
  return diZhis[index]
}

/** 节气对应的月干偏移 */
const SOLAR_TERM_OFFSET: Record<string, number> = Object.fromEntries(
  SOLAR_TERM.map((term, index) => [term, Math.floor(index / 2)])
)

/** 获取某年某月某日节气的月干偏移 */
const getMonthGanOffset = async (lunarDate: LunarDate): Promise<number> => {
  const [currentSolarTerm] = await lunarDate.currentSolarTerms

  const solarTermOffset = SOLAR_TERM_OFFSET[currentSolarTerm!.name!]
  return solarTermOffset
}

/** 获取农历某月某天所在的月的天干 */
const getYueGan = async (lunarDate: LunarDate, yearGan: Gan): Promise<Gan> => {
  // 正月天干的序号
  const firstMonthGanIndex = yearGan.wuHudun.targetIndex
  // 月干偏移
  const monthOffset = await getMonthGanOffset(lunarDate)

  const index = (firstMonthGanIndex + monthOffset) % 10
  return tianGans[index]
}

/** 获取农历某月某天所在的月的地支 */
const getYueZhi = async (lunarDate: LunarDate): Promise<Zhi> => {
  // 月支直接由节气决定，正月为寅(索引2)
  const zhiIndex = ((await getMonthGanOffset(lunarDate)) + 2) % 12
  return diZhis[zhiIndex]
}

/** 获取农历某月某天所在的日的干支 */
const getRiGanZhi = (solarDate: SolarDate): Zhu => {
  // 1900年1月1日的干支是"甲戌"，即第10个干支
  const BASE_JIAZI_INDEX = 10

  // 使用北京时间进行计算
  const date = new Date(
    solarDate.year,
    solarDate.month - 1, // 月份 index 从0开始
    solarDate.day,
    12, // 使用正午12点来避免跨日问题
    0,
    0
  )
  // 转换为北京时间的时间戳
  const timestamp = date.getTime()

  // 计算与1900年1月1日的天数差
  const baseDate = new Date(1900, 0, 1, 12, 0, 0)
  const baseDateTimestamp = baseDate.getTime()

  let offset = Math.floor((timestamp - baseDateTimestamp) / (24 * 60 * 60 * 1000))

  // 早晚子时，大于 23点，算作第二天
  if (solarDate.hour >= 23) {
    offset += 1
  }

  // 计算干支索引
  const jiaziIndex = (offset + BASE_JIAZI_INDEX) % 60

  return {
    ...SIXTY_JIAZI[jiaziIndex],
    zhuIndex: ZhuIndex.RiZhu,
  }
}

/** 获取时辰索引：23:00-00:59 为子时(0)，01:00-02:59 为丑时(1)，以此类推 */
export const getShiZhiIndex = (hour: number): number => Math.floor(((hour + 1) % 24) / 2)

/** 获取农历某月某天某时的天干：日上起时，五鼠遁 */
const getShiGan = (solarDate: SolarDate, dayGan: Gan): Gan => {
  const hourIndex = getShiZhiIndex(solarDate.hour)
  return tianGans[(dayGan.wuShuDun.targetIndex + hourIndex) % 10]
}

/** 获取农历某月某天某时的地支 */
const getShiZhi = (solarDate: SolarDate): Zhi => {
  return diZhis[getShiZhiIndex(solarDate.hour)]
}

/**
 * 日主胎元，从月柱
 * 干进一位
 * 支进三位
 */
const getTaiYuan = ({ gan, zhi }: Zhu): Zhu => {
  const taiGan = tianGans[(gan.index + 1) % 10]
  const taiZhi = diZhis[(zhi.index + 3) % 12]

  return composeGanZhi(taiGan, taiZhi, ZhuIndex.TaiYuan)
}

/* 干支合柱 */
const getZhuHe = ({ gan, zhi }: Zhu): Zhu => {
  const gans = tianGans[gan.he!.targetIndex]
  const zhis = diZhis[zhi.he!.targetIndex]

  return composeGanZhi(gans, zhis, ZhuIndex.TaiXi)
}

/** 命宫:起通
 * 逆排月份定起点, 子起正月
 * 顺排时辰找卯位
 * 年上起月定天干
 */
const getMingGong = (lunarDate: LunarDate, yueZhu: Zhu, shiZhi: Zhi): Zhu => {
  const monthOffset = (1 - lunarDate.month + 12) % 12
  const offset = 3 - monthOffset + shiZhi.index

  const zhiIndex = (offset + 12) % 12
  const firstMonthGanIndex = yueZhu.gan.wuHudun.targetIndex

  const ganIndex = (firstMonthGanIndex + offset + 10) % 10

  return composeGanZhi(tianGans[ganIndex], diZhis[zhiIndex], ZhuIndex.MingGong)
}

/*
身宫
 逆排月份定起点, 子起正月
 逆排时辰找酉位
 年上起月定天干
*/
const getShenGong = (lunarDate: LunarDate, yueZhu: Zhu, shiZhi: Zhi): Zhu => {
  const monthOffset = (1 - lunarDate.month + 12) % 12
  const offset = 9 - monthOffset - shiZhi.index
  const zhiIndex = (offset + 12) % 12
  const firstMonthGanIndex = yueZhu.gan.wuHudun.targetIndex
  const ganIndex = (firstMonthGanIndex + offset + 10) % 10

  return composeGanZhi(tianGans[ganIndex], diZhis[zhiIndex], ZhuIndex.ShenGong)
}

export type GetBaziParams = {
  date: Date
  longitude?: number
  gender: 'male' | 'female'
}
export const getBazi = async ({ date, longitude, gender }: GetBaziParams): Promise<Bazi> => {
  const solarDate = await getSolarDate(date, longitude)
  console.log('真太阳时：', solarDate.dateString)

  const { lunar } = solarDate
  console.log('农历日生日：', lunar?.lunarDateString)

  // 年柱
  const nianGan = await getNianGan(lunar!)
  const nianZhi = await getNianZhi(lunar!)
  const nianZhu = composeGanZhi(nianGan, nianZhi, ZhuIndex.NianZhu)

  // 月柱
  const yueGan = await getYueGan(lunar!, nianGan)
  const yueZhi = await getYueZhi(lunar!)
  const yueZhu = composeGanZhi(yueGan, yueZhi, ZhuIndex.YueZhu)

  // 日柱
  const riZhu = getRiGanZhi(solarDate)

  // 时柱
  const shiGan = await getShiGan(solarDate, riZhu.gan)
  const shiZhi = await getShiZhi(solarDate)
  const shiZhu = composeGanZhi(shiGan, shiZhi, ZhuIndex.ShiZhu)

  // 胎元
  const taiYuan = getTaiYuan(yueZhu)

  /**
   * 日主胎息
   * 取日柱干支所合
   */
  const taiXi = getZhuHe(riZhu)

  /** 起变法：时变, 变星
   * 取时柱干支所合
   */
  const bianXing = getZhuHe(shiZhu)

  // 命宫
  const mingGong = getMingGong(lunar!, yueZhu, shiZhi)

  // 身宫
  const shenGong = getShenGong(lunar!, yueZhu, shiZhi)

  const bazi: Bazi = {
    nianZhu,
    yueZhu,
    riZhu,
    shiZhu,
    taiYuan,
    taiXi,
    bianXing,
    mingGong,
    shenGong,
  }

  return bazi
}
