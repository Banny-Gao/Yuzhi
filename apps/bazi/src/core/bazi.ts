import dayjs from 'dayjs'
import { cloneDeep } from 'lodash-es'
import { lcm } from './utils/math'
import { GAN_NAME, NAYIN_WUXING, ZHI_NAME, SOLAR_TERM, SINING_NAME, SOLAR_TERMS_RANGE, LIU_JIA_XUN_KONG } from './data'
import { tianGans } from './gan'
import { diZhis } from './zhi'
import { getSolarDate, getSolarTermsFormApi, getDaysInMonth, dateFormat, DAY_FORMAT, getLunarDate } from './date'
import { isYang, isYin } from './wuxing'
import { getShiShen } from './shishen'

enum ZhuIndex {
  NianZhu = 0,
  YueZhu = 1,
  RiZhu = 2,
  ShiZhu = 3,
  TaiYuan = 4,
  TaiXi = 5,
  MingGong = 6,
  ShenGong = 7,
  DaYun = 8,
  LiuNian = 9,
  LiuYue = 10,
}

export enum MingZhu {
  male = '元男',
  female = '元女',
}

declare global {
  export type Zhu = IndexField<{
    index: number // 六十甲子索引
    zhuIndex: ZhuIndex // 柱索引
    name: GanZhiName
    gan: Gan
    zhi: Zhi
    naYin: NaYinName
    xingYun?: TwelvePlaceName
    ziZuo?: {
      xingYun: TwelvePlaceName
      shiShen: TargetShiShen
    }
    kongWang?: KongWang
  }>

  export type SiNing = {
    name: ZhiName
    lunarMonth: number
    yongShi: (typeof SINING_NAME)[number][1 | 2 | 3]
    nth: number
  }

  export type DaYun = {
    qiYun: {
      age: string
      dateString: string
    }
    jiaoYun: string
    yuns: (Zhu & {
      year: [number, number]
      age: [number, number]
    })[]
  }

  export type LiuNian = Zhu & {
    year: number
    age: number
  }

  export type LiuYue = Zhu & {
    solarTermName: string
    dateString: string
    month: number
  }

  export type LiuRi = Zhu & SolarDate
  export type LiuShi = SolarDate & {
    riZhu: Zhu
    shiZhu: Zhu
  }

  export type RiZhu = Zhu & { mingZhu: MingZhu }

  export type KongWang = {
    liuJiaXunKong: (typeof LIU_JIA_XUN_KONG)[number]
  }

  export type Bazi = {
    nianZhu: Zhu
    yueZhu: Zhu
    riZhu: RiZhu
    shiZhu: Zhu
    taiYuan: Zhu
    taiXi: Zhu
    bianXing: Zhu
    mingGong: Zhu
    shenGong: Zhu
    siNing: SiNing
    daYun: DaYun
    liuNian: LiuNian[]
    getLiuYue: (year: number) => Promise<LiuYue[]>
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
  index %= 60
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
    gan: cloneDeep(gan),
    zhi: cloneDeep(zhi),
    naYin,
  }
}

// 立春后算新的一年，修正年月数值取值
const getFixedYear = async (lunarDate: LunarDate): Promise<number> => {
  let fixedYear = lunarDate.year
  const [currentSolarTerm, nextSolarTerm] = lunarDate.currentSolarTerms!
  /** 立春在年前，年加一 */
  if (currentSolarTerm.name === '立春' && lunarDate.year < currentSolarTerm.date.year()) {
    fixedYear += 1
  }
  /** 立春在年后，年减一 */
  if (nextSolarTerm.name === '立春' && lunarDate.year > nextSolarTerm.date.year()) {
    fixedYear -= 1
  }

  return fixedYear
}

/** 获取年的天干 */
const getNianGan = async (lunarDate: LunarDate): Promise<Gan> => {
  const fixedYear = await getFixedYear(lunarDate)

  const index = (fixedYear - 4) % 10
  return tianGans[index]
}

/**获取年的地支 */
const getNianZhi = async (lunarDate: LunarDate): Promise<Zhi> => {
  const fixedYear = await getFixedYear(lunarDate)

  const index = (fixedYear - 4) % 12
  return diZhis[index]
}

/** 节气对应的月干偏移 */
const SOLAR_TERM_OFFSET: Record<string, number> = Object.fromEntries(
  SOLAR_TERM.map((term, index) => [term, Math.floor(index / 2)])
)

/** 获取某年某月某日节气的月干偏移 */
const getMonthGanOffset = async (lunarDate: LunarDate): Promise<number> => {
  const [currentSolarTerm, nextSolarTerm] = lunarDate.currentSolarTerms!

  const termName = lunarDate.dateString === nextSolarTerm.dateString ? nextSolarTerm.name : currentSolarTerm.name

  const solarTermOffset = SOLAR_TERM_OFFSET[termName!]
  return solarTermOffset
}

/** 获取农历某月某天所在的月的天干 */
const getYueGan = async (lunarDate: LunarDate, nianGan: Gan): Promise<Gan> => {
  // 正月天干的序号
  const firstMonthGanIndex = nianGan.wuHudun.targetIndex
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
    ...cloneDeep(SIXTY_JIAZI[jiaziIndex]),
    zhuIndex: ZhuIndex.RiZhu,
  }
}

/** 获取时辰索引：23:00-00:59 为子时(0)，01:00-02:59 为丑时(1)，以此类推 */
const getShiZhiIndex = (hour: number): number => Math.floor(((hour + 1) % 24) / 2)
/** 根据地支反推时间，23:00-00:59 为子时(0)，01:00-02:59 为丑时(1)，以此类推 */
const getShiTimeByZhi = (zhi: Zhi): number => {
  // 子时特殊处理：子时(index=0)对应23:00-00:59，起始时间是23点
  if (zhi.index === 0) {
    return 23
  }
  // 其他时辰：丑时(1)->1点，寅时(2)->3点，卯时(3)->5点...
  // 公式：(index * 2 - 1) 对于index >= 1
  return zhi.index * 2 - 1
}

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
const getMingGong = (lunarDate: LunarDate, nianZhu: Zhu, shiZhi: Zhi): Zhu => {
  const monthOffset = 1 - lunarDate.month
  const maoOffset = (3 - shiZhi.index + 12) % 12

  const zhiIndex = monthOffset + maoOffset
  const firstMonthGanIndex = nianZhu.gan.wuHudun.targetIndex

  const ganIndex = (firstMonthGanIndex + zhiIndex + 10) % 10

  return composeGanZhi(tianGans[ganIndex], diZhis[zhiIndex], ZhuIndex.MingGong)
}

/*
身宫
 顺排月份定起点, 子起正月
 逆排时辰找酉位
 年上起月定天干
*/
const getShenGong = (lunarDate: LunarDate, nianZhu: Zhu, shiZhi: Zhi): Zhu => {
  const monthOffset = lunarDate.month - 1
  const youOffset = (shiZhi.index - 9 + 12) % 12

  const zhiIndex = (youOffset - monthOffset + 12) % 12
  const firstMonthGanIndex = nianZhu.gan.wuHudun.targetIndex

  const ganIndex = (firstMonthGanIndex + zhiIndex + 10) % 10

  return composeGanZhi(tianGans[ganIndex], diZhis[zhiIndex], ZhuIndex.MingGong)
}

/** 根据月支获取节令、气令和下一个节气节令 */
export const getMonthZhiSolarTerm = async (
  year: number,
  zhi: Zhi
): Promise<[SolarTermWithDate, SolarTermWithDate, SolarTermWithDate]> => {
  const [start, middle, end] = SOLAR_TERMS_RANGE[zhi.index]!
  const fixedYear = year + Math.floor(start / 24)
  const terms = await getSolarTermsFormApi(fixedYear)

  return [terms[start % 24], terms[middle % 24], terms[end % 24]]
}

export type PureGanZhi = {
  gan: Gan
  zhi: Zhi
}

const getSining = async (lunarDate: LunarDate, yueZhi: Zhi): Promise<SiNing> => {
  const [start] = await getMonthZhiSolarTerm(lunarDate.year, yueZhi)
  const now = dayjs(lunarDate.solarDateString).startOf('day')
  const term = dayjs(start.solarDateString).startOf('day')
  // 从节气看
  const diff = now.diff(term, 'day')
  const [_, ...rest] = SINING_NAME[yueZhi.index]

  let i = 0,
    sum = 0
  while (i < rest.length) {
    sum += rest[i][1]
    if (sum >= diff) {
      break
    }
    i++
  }

  return {
    name: yueZhi.name,
    lunarMonth: lunarDate.month,
    yongShi: rest[i],
    nth: diff,
  }
}

export const getDaYun = async ({
  nianGan,
  yueZhu,
  lunarDate,
  gender,
  longitude,
}: {
  nianGan: Gan
  yueZhu: Zhu
  lunarDate: LunarDate
  gender: 'male' | 'female'
  longitude?: number
}): Promise<DaYun> => {
  /* 大运起始，阳男阴女顺排，阴男阳女逆排
   * 大运起始年龄 = 出生年份的干支纳音五行与月柱天干纳音五行的生克关系决定的
   * 阳年生男，阴年生女顺排；阴年生男，阳年生女逆排
   * 大运干支 = 月柱干支
   * 大运年龄 = 月柱干支纳音五行与大运干支纳音五行的生克关系决定的
   * 大运干支 = 月柱干支
   */

  const isShun = (isYang(nianGan.yinYang) && gender === 'male') || (isYin(nianGan.yinYang) && gender === 'female')
  const [start, _, end] = await getMonthZhiSolarTerm(lunarDate.year, yueZhu.zhi)

  // 小时差
  const diff = isShun
    ? dayjs(end.solarDateString).diff(dayjs(lunarDate.solarDateString), 'hour')
    : dayjs(lunarDate.solarDateString).diff(dayjs(start.solarDateString), 'hour')

  // 三天计一岁，一天计四个月, 6 小时计 1 个月, 一小时计 5 天
  const age = Math.floor(diff / 72)
  const month = Math.floor((diff % 72) / 6)
  const day = Math.floor((diff % 24) / 6) * 5

  // 大运 120 年， 10 年一运
  const yunStart = dayjs(lunarDate.dateString).add(age, 'year').add(month, 'month').add(day, 'day')
  // 交运年干节气
  const { lunar: jiaoYunLunar } = await getSolarDate(yunStart.toDate(), longitude)
  const jiaoYunNianGan = await getNianGan(jiaoYunLunar!)
  const jiaoYunYueZhi = await getYueZhi(jiaoYunLunar!)
  const [jiaoYunTerm] = await getMonthZhiSolarTerm(jiaoYunLunar!.year, jiaoYunYueZhi)

  const startTermDiff = yunStart.diff(dayjs(jiaoYunTerm.dateString), 'day')
  const jiaoYun = `逢${jiaoYunNianGan.name}年,${jiaoYunTerm.name}后${Math.floor(startTermDiff)}天交大运`

  const yuns: DaYun['yuns'] = []
  let yunAge = age,
    yunYear = yunStart.year()

  for (let i = 1; i <= 12; i++) {
    const index = isShun ? yueZhu.index + i : yueZhu.index - i
    const zhu = SIXTY_JIAZI[(index + 60) % 60]

    yuns.push({
      ...cloneDeep(zhu),
      zhuIndex: ZhuIndex.DaYun,
      year: [yunYear, yunYear + 10],
      age: [yunAge, yunAge + 10],
    })

    yunAge += 10
    yunYear += 10
  }

  return {
    qiYun: {
      age: `${age}岁${month}个月${day}天`,
      dateString: dateFormat(yunStart, DAY_FORMAT),
    },
    yuns,
    jiaoYun,
  }
}

const getLiuNian = async (year: number, nianZhu: Zhu): Promise<LiuNian[]> => {
  // 0 - 120 岁
  const liuNian: LiuNian[] = []
  for (let i = 0; i < 120; i++) {
    const index = (nianZhu.index + i) % 60
    liuNian.push({
      ...cloneDeep(SIXTY_JIAZI[index]),
      zhuIndex: ZhuIndex.LiuNian,
      year: year + i,
      age: i,
    })
  }

  return liuNian
}

/** 根据年获取十二流月 */
export const getLiuYue = async (year: number): Promise<LiuYue[]> => {
  const liuYue: LiuYue[] = []

  for (const zhi of diZhis) {
    const [start] = await getMonthZhiSolarTerm(year, zhi)

    const { lunar } = await getSolarDate(new Date(start.dateString))
    const nianGan = await getNianGan(lunar!)

    const yueGan = await getYueGan(lunar!, nianGan)
    const yueZhi = await getYueZhi(lunar!)
    const yueZhu = composeGanZhi(yueGan, yueZhi, ZhuIndex.LiuYue)

    liuYue.push({
      ...yueZhu,
      solarTermName: start.solarTermName,
      dateString: start.dateString,
      month: lunar!.month,
    })
  }

  return liuYue.sort((a, b) => a.dateString.localeCompare(b.dateString))
}
/** 根据年月获取流日 */
export const getLiuRi = async (year: number, month: number | LiuYue): Promise<LiuRi[]> => {
  const liuRi: LiuRi[] = []

  const days = await getDaysInMonth(year, typeof month === 'number' ? month : month.month)

  for (const day of days) {
    const riZhu = getRiGanZhi(day)
    liuRi.push({
      ...day,
      ...riZhu,
    })
  }

  return liuRi
}
/** 根据年月日获取十二流时 */
export const getLiuShi = async (year: number, month: number, day: number): Promise<LiuShi[]> =>
  Promise.all(
    diZhis.map(async zhi => {
      const time = getShiTimeByZhi(zhi)
      // 若是子时，则需要减去 1 天
      const d = new Date(year, month - 1, day, time, 0, 0)
      if (zhi.index === 0) {
        d.setDate(d.getDate() - 1)
      }

      const solarDate: SolarDate = {
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        day: d.getDate(),
        hour: d.getHours(),
        minute: d.getMinutes(),
        second: d.getSeconds(),
        date: d,
        dateString: dateFormat(d),
        solarDateString: dateFormat(d),
      }

      solarDate.lunar = await getLunarDate(solarDate)

      const riZhu = getRiGanZhi(solarDate)

      const shiGan = await getShiGan(solarDate, riZhu.gan)
      const shiZhi = await getShiZhi(solarDate)
      const shiZhu = composeGanZhi(shiGan, shiZhi, ZhuIndex.ShiZhu)

      return {
        ...solarDate,
        riZhu,
        shiZhu,
      }
    })
  )

/** 六甲旬空 */
const getLiuJiaXunKong = (zhu: Zhu) => {
  const liuJia = SIXTY_JIAZI[Math.floor(zhu.index / 10) * 10]

  if (!zhu.kongWang) zhu.kongWang = {} as KongWang
  zhu.kongWang.liuJiaXunKong = LIU_JIA_XUN_KONG.find(([lj]) => lj === liuJia.name)!
}

/**处理各柱十神 */
const initShiShen = (riYuan: Gan, targetZhu: Zhu) => {
  if (targetZhu.zhuIndex !== ZhuIndex.RiZhu) targetZhu.gan.shiShen = getShiShen.call(targetZhu.gan, riYuan)
  targetZhu.zhi.cangGan = targetZhu.zhi.cangGan.map(cangGan => cangGan && getShiShen.call(cangGan, riYuan))
}

/** 处理各柱星运 十二长生状态 */
const initXingYun = (riYuan: Gan, targetZhu: Zhu, key = 'xingYun') => {
  const { name } = riYuan.twelvePlace.find(item => item.dizhiName === targetZhu.zhi.name)!
  targetZhu[key] = name
}

/** 处理各柱自坐十神 */
const initZiZuo = (targetZhu: Zhu) => {
  const { name } = targetZhu.gan.twelvePlace.find(item => item.dizhiName === targetZhu.zhi.name)!
  targetZhu.ziZuo = {
    xingYun: name,
    shiShen: getShiShen.call(targetZhu.gan, targetZhu.zhi.name),
  }
}

const initExtra = (riYuan: Gan, targetZhu: Zhu) => {
  initXingYun(riYuan, targetZhu)
  initShiShen(riYuan, targetZhu)
  initZiZuo(targetZhu)
  getLiuJiaXunKong(targetZhu)
}

export type GetBaziParams = {
  date: Date
  longitude?: number
  gender: 'male' | 'female'
}
export const getBazi = async ({ date, longitude, gender }: GetBaziParams): Promise<Bazi> => {
  const solarDate = await getSolarDate(date, longitude)
  const { lunar } = solarDate

  // 年柱
  const nianGan = await getNianGan(lunar!)
  const nianZhi = await getNianZhi(lunar!)
  const nianZhu = composeGanZhi(nianGan, nianZhi, ZhuIndex.NianZhu)
  // 月柱
  const yueGan = await getYueGan(lunar!, nianGan)
  const yueZhi = await getYueZhi(lunar!)
  const yueZhu = composeGanZhi(yueGan, yueZhi, ZhuIndex.YueZhu)
  // 日柱
  const riZhu: RiZhu = {
    ...getRiGanZhi(solarDate),
    mingZhu: gender === 'male' ? MingZhu.male : MingZhu.female,
  }
  // 时柱
  const shiGan = await getShiGan(solarDate, riZhu.gan)
  const shiZhi = await getShiZhi(solarDate)
  const shiZhu = composeGanZhi(shiGan, shiZhi, ZhuIndex.ShiZhu)
  // 四柱十神
  ;[nianZhu, yueZhu, riZhu, shiZhu].forEach(zhu => initExtra(riZhu.gan, zhu))

  /**
   * 日主胎息
   * 取日柱干支所合
   */
  const taiXi = getZhuHe(riZhu)
  // 胎息十神
  initExtra(riZhu.gan, taiXi)
  // 胎元
  const taiYuan = getTaiYuan(yueZhu)
  // 命宫
  const mingGong = getMingGong(lunar!, nianZhu, shiZhi)
  // 身宫
  const shenGong = getShenGong(lunar!, nianZhu, shiZhi)
  // 三垣十神
  ;[taiYuan, mingGong, shenGong].forEach(zhu => initExtra(riZhu.gan, zhu))

  /** 起变法：时变, 变星
   * 取时柱干支所合
   */
  const bianXing = getZhuHe(shiZhu)
  // 变星十神
  initExtra(riZhu.gan, bianXing)
  // 人元司令分野
  const siNing = await getSining(lunar!, yueZhi)

  // 大运
  const daYun = await getDaYun({ nianGan, yueZhu, lunarDate: lunar!, gender, longitude })
  // 大运十神
  daYun.yuns.forEach(yun => initExtra(riZhu.gan, yun))

  // 流年
  const liuNian = await getLiuNian(solarDate.year, nianZhu)
  // 流年十神
  liuNian.forEach(nian => initExtra(riZhu.gan, nian))

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
    siNing,
    daYun,
    liuNian,
    getLiuYue,
  }

  return bazi
}
