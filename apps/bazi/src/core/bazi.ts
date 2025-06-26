import dayjs from 'dayjs'
import { cloneDeep, uniqWith } from 'lodash-es'
import { lcm } from './utils/math'
import {
  NOUN,
  GAN_NAME,
  NAYIN_WUXING,
  ZHI_NAME,
  SOLAR_TERM,
  SINING_NAME,
  SOLAR_TERMS_RANGE,
  LIU_JIA_XUN_KONG,
  JIE_LU_KONG,
  SI_DA_KONG,
  WU_GUI_KONG,
  KE_HAI_KONG,
  PO_ZU_KONG,
  WU_XING_WANG_SHUAI,
} from './data'
import { tianGans } from './gan'
import { diZhis, QiEnum, qiOptions } from './zhi'
import { getSolarDate, getSolarTermsFormApi, getDaysInMonth, dateFormat, DAY_FORMAT, getLunarDate } from './date'
import { isYang, isYin } from './wuxing'
import { getShiShen } from './shishen'

enum ZhuIndex {
  NianZhu = 0,
  YueZhu,
  RiZhu,
  ShiZhu,
  TaiYuan,
  MingGong,
  ShenGong,
  TaiXi,
  BianXing,
  DaYun,
  LiuNian,
  LiuYue,
  LiuRi,
  LiuShi,
}
const ZhuIndexMap = {
  [ZhuIndex.NianZhu]: '年柱',
  [ZhuIndex.YueZhu]: '月柱',
  [ZhuIndex.RiZhu]: '日柱',
  [ZhuIndex.ShiZhu]: '时柱',
  [ZhuIndex.TaiYuan]: '胎元',
  [ZhuIndex.MingGong]: '命宫',
  [ZhuIndex.ShenGong]: '身宫',
  [ZhuIndex.TaiXi]: '胎息',
  [ZhuIndex.BianXing]: '变星',
  [ZhuIndex.DaYun]: '大运',
  [ZhuIndex.LiuNian]: '流年',
  [ZhuIndex.LiuYue]: '流月',
  [ZhuIndex.LiuRi]: '流日',
  [ZhuIndex.LiuShi]: '流时',
}

export enum MingZhu {
  male = '元男',
  female = '元女',
}

export enum ZhuRelationType {
  ganHe,
  ganChong,
  zhiSanhui,
  zhiSanHe,
  zhiBanHe,
  zhiHe,
  zhiHai,
  zhiChong,
  zhiPo,
  zhiXing,
  zhiAnHe,
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

  export type Yun = Zhu & {
    year: [number, number]
    age: [number, number]
  }
  export type DaYun = {
    qiYun: {
      age: string
      dateString: string
    }
    jiaoYun: string // todo
    yuns: Yun[]
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
  export type LiuShi = SolarDate &
    Zhu & {
      riZhu: Zhu
    }

  export type RiZhu = Zhu & { mingZhu: MingZhu }

  export type KongWang = {
    liuJiaXunKong: (typeof LIU_JIA_XUN_KONG)[number]
    jieluKong: (typeof JIE_LU_KONG)[number]
    siDaKong?: [(typeof SI_DA_KONG)[number][0] | (typeof SI_DA_KONG)[number][1], (typeof SI_DA_KONG)[number][2]]
    wuGuiKong: (typeof WU_GUI_KONG)[number]
    keHaiKong: (typeof KE_HAI_KONG)[number]
    poZuKong: (typeof PO_ZU_KONG)[number]
  }

  export type ZhuRelation = {
    type: ZhuRelationType
    desc: string
    names: (GanName | ZhiName)[]
    zhuIndex: ZhuIndex
    relationZhuIndex: ZhuIndex[]
    relationShiShen: ShiShenName[]
    hua?: WuXingName
    hui?: WuXingName
  }

  export type WxWangShuai = {
    name: WuXingName
    wangShuai: '旺' | '相' | '休' | '囚' | '死'
    value: number
  }

  export type TouGan = {
    name: GanName
    qiType: QiEnum
    zhuIndex: ZhuIndex
    targetZhuIndex: ZhuIndex
    desc: string
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
    liuYue?: LiuYue[]
    liuRi?: LiuRi[]
    liuShi?: LiuShi[]
    curDaYun?: Yun // 当前大运
    curLiuNian?: LiuNian // 当前流年
    curLiuYue?: LiuYue // 当前流月
    curLiuRi?: LiuRi // 当前流日
    curLiuShi?: LiuShi // 当前流时
    relations: ZhuRelation[] // 各柱干支关系
    wuXingWangShuai: WxWangShuai[]
    touGans?: TouGan[]
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
  SOLAR_TERM.map(term => term[0])
    .flat()
    .map((term, index) => [term, Math.floor(index / 2)])
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
const getSelfZhu = ({ gan, zhi }: Zhu, zhuIndex: ZhuIndex): Zhu => {
  const gans = tianGans[gan.he!.targetIndex]
  const zhis = diZhis[zhi.he!.targetIndex]

  return composeGanZhi(gans, zhis, zhuIndex)
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

  return composeGanZhi(tianGans[ganIndex], diZhis[zhiIndex], ZhuIndex.ShenGong)
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
const setCurrentYun = (bazi: Bazi, year: number) => {
  const yun = bazi.daYun.yuns.find(yun => year >= yun.year[0] && year < yun.year[1])

  bazi.curDaYun = yun
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
const setCurrentLiuNian = (bazi: Bazi, year: number) => {
  const liuNian = bazi.liuNian.find(liuNian => year === liuNian.year)!

  bazi.curLiuNian = liuNian
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
      zhuIndex: ZhuIndex.LiuYue,
      solarTermName: start.solarTermName,
      dateString: start.dateString,
      month: lunar!.month, // 农历月
    })
  }

  return liuYue.sort((a, b) => a.dateString.localeCompare(b.dateString))
}
const setCurrentLiuYue = async (bazi: Bazi, year: number, lunarMonth: number) => {
  if (!bazi.liuYue) {
    bazi.liuYue = await getLiuYue(year)
  }

  bazi.curLiuYue = bazi.liuYue.find(liuYue => lunarMonth === liuYue.month)!
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
      zhuIndex: ZhuIndex.LiuRi,
    })
  }

  return liuRi
}
const setCurrentLiuRi = async (bazi: Bazi, year: number, month: number, day: number, hour: number) => {
  if (!bazi.liuRi) {
    bazi.liuRi = await getLiuRi(year, month)
  }

  bazi.curLiuRi = bazi.liuRi.find(liuRi => (hour >= 23 ? day + 1 : day) === liuRi.day)!
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
        ...shiZhu,
        riZhu,
        zhuIndex: ZhuIndex.LiuShi,
      }
    })
  )
const setCurrentLiuShi = async (bazi: Bazi, year: number, month: number, day: number, hour: number) => {
  if (!bazi.liuShi) {
    bazi.liuShi = await getLiuShi(year, month, hour >= 23 ? day + 1 : day)
  }

  const curLiuShi = bazi.liuShi.find(liuShi => Math.ceil(hour / 2) === Math.ceil(liuShi.hour / 2) % 12)!
  bazi.curLiuShi = curLiuShi
}

/**处理各柱十神 */
const initShiShen = (riYuan: Gan, targetZhu: Zhu) => {
  if (targetZhu.zhuIndex !== ZhuIndex.RiZhu) targetZhu.gan.shiShen = getShiShen.call(targetZhu.gan, riYuan)
  targetZhu.zhi.cangGan = targetZhu.zhi.cangGan.map(
    cangGan =>
      cangGan && {
        ...cangGan,
        shiShen: getShiShen.call(cangGan, riYuan),
      }
  )
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
  // 初始化各柱六甲旬空关系
  getLiuJiaXunKong(targetZhu)
}

// 五行旺衰
const getWxWangShuai = (yueZhi: Zhi): WxWangShuai[] =>
  WU_XING_WANG_SHUAI.find(item => item[0] === yueZhi.name)!
    .slice(1)
    .map(([name, wangShuai, value]) => ({
      name,
      wangShuai,
      value,
    }))

const getComparations = (bazi: Bazi) => {
  const {
    nianZhu,
    yueZhu,
    riZhu,
    shiZhu,
    taiYuan,
    mingGong,
    shenGong,
    taiXi,
    bianXing,
    curDaYun,
    curLiuNian,
    curLiuYue,
    curLiuRi,
    curLiuShi,
  } = bazi

  const compareZhuList = [
    nianZhu,
    yueZhu,
    riZhu,
    shiZhu,
    taiYuan,
    mingGong,
    shenGong,
    taiXi,
    bianXing,
    curDaYun,
    curLiuNian,
    curLiuYue,
    curLiuRi,
    curLiuShi,
  ]
  const zhuList = [nianZhu, yueZhu, riZhu, shiZhu]

  return {
    compareZhuList,
    zhuList,
  }
}

// 藏干透干
const initTouGans = (bazi: Bazi) => {
  const { compareZhuList, zhuList } = getComparations(bazi)

  const touGans: TouGan[] = []

  for (const zhu of zhuList) {
    for (const target of compareZhuList) {
      if (zhu.zhuIndex === target!.zhuIndex) continue

      const {
        zhi: { cangGan },
        zhuIndex,
      } = zhu
      const { gan: targetGan, zhuIndex: targetZhuIndex } = target!
      const index = cangGan.findIndex(item => item?.name === targetGan.name)

      if (index !== -1) {
        const { type: qiType, name: qiName } = qiOptions[index]
        const desc = `${ZhuIndexMap[zhuIndex]}地支${qiName}透干${ZhuIndexMap[targetZhuIndex]}天干${targetGan.name}`
        const touGan = {
          name: targetGan.name,
          qiType,
          zhuIndex,
          targetZhuIndex,
          desc,
        }

        if (!cangGan[index].touGan) cangGan[index].touGan = []
        cangGan[index].touGan.push(targetZhuIndex)

        touGans.push(touGan)
      }
    }
  }

  bazi.touGans = touGans
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

  /** 日主胎息 取日柱干支所合 */
  const taiXi = getSelfZhu(riZhu, ZhuIndex.TaiXi)
  // 胎元
  const taiYuan = getTaiYuan(yueZhu)
  // 命宫
  const mingGong = getMingGong(lunar!, nianZhu, shiZhi)
  // 身宫
  const shenGong = getShenGong(lunar!, nianZhu, shiZhi)

  /** 起变法：时变, 变星
   * 取时柱干支所合
   */
  const bianXing = getSelfZhu(shiZhu, ZhuIndex.BianXing)

  // 人元司令分野
  const siNing = await getSining(lunar!, yueZhi)

  // 大运
  const daYun = await getDaYun({ nianGan, yueZhu, lunarDate: lunar!, gender, longitude })
  // 流年
  const liuNian = await getLiuNian(solarDate.year, nianZhu)

  const wuXingWangShuai = getWxWangShuai(yueZhi)

  const bazi = {
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
    relations: [],
    wuXingWangShuai,
  } as Bazi

  // 当前大运
  const currentSolarDate = await getSolarDate(new Date(), longitude)
  setCurrentYun(bazi, currentSolarDate.year)
  // 当前流年
  setCurrentLiuNian(bazi, currentSolarDate.year)
  // 当前流月
  await setCurrentLiuYue(bazi, currentSolarDate.year, currentSolarDate.lunar!.month)
  // 当前流日
  await setCurrentLiuRi(
    bazi,
    currentSolarDate.year,
    currentSolarDate.month,
    currentSolarDate.day,
    currentSolarDate.hour
  )
  // 当前流时
  await setCurrentLiuShi(
    bazi,
    currentSolarDate.year,
    currentSolarDate.month,
    currentSolarDate.day,
    currentSolarDate.hour
  )

  // 各柱十神、星运、自坐、六甲旬空
  ;[
    // 四柱十神
    nianZhu,
    yueZhu,
    riZhu,
    shiZhu,
    taiXi,
    // 三垣十神
    taiYuan,
    mingGong,
    shenGong,
    // 变星十神
    bianXing,
    // 大运十神
    ...daYun.yuns,
    // 流年十神
    ...liuNian,
    // 流月十神
    bazi.curLiuYue,
    // 流日十神
    bazi.curLiuRi,
    // 流时十神
    bazi.curLiuShi,
  ]
    .filter(Boolean)
    .forEach(zhu => initExtra(riZhu.gan, zhu!))

  /** 初始化日柱空亡关系 */
  // 截路空亡
  getJieLuKongWang(riZhu)
  // 四大空亡
  getSiDaKongWang(riZhu)
  // 五鬼空亡
  getWuGuiKongWang(riZhu)
  // 克害空亡
  getKeHaiKongWang(riZhu)
  // 破祖空亡
  getPoZuKongWang(riZhu)
  /**
   * todo
   * 1. 判断各柱是否犯空亡（六甲旬空），所犯空亡十神、是否真空亡、空亡互换
   * 2. 判断各柱是否犯截路空亡、四大空亡、五鬼空亡、克害空亡、破祖空亡
   * 3. 判断各柱是否犯五行空亡
   * 4. 盲派空亡判断，是否命空、神空、禄空、魂空、真空、三空相会
   */

  // 初始化透干
  initTouGans(bazi)
  // 初始化各柱关系
  initZhuRelation(bazi)

  return bazi
}

/** 六甲旬空 */
const getLiuJiaXunKong = (zhu: Zhu) => {
  const liuJia = SIXTY_JIAZI[Math.floor(zhu.index / 10) * 10]

  if (!zhu.kongWang) zhu.kongWang = {} as KongWang
  zhu.kongWang.liuJiaXunKong = LIU_JIA_XUN_KONG.find(([lj]) => lj === liuJia.name)!
}

/**
 * 甲子、甲午旬：五行缺水。
 * 甲寅、甲申旬：五行缺金。
 * 其他柱含缺即犯空
 */
const getSiDaKongWang = (riZhu: Zhu) => {
  const liuJia = SIXTY_JIAZI[Math.floor(riZhu.index / 10) * 10]

  if (!riZhu.kongWang) riZhu.kongWang = {} as KongWang
  riZhu.kongWang.siDaKong = SI_DA_KONG.find(k => k.includes(liuJia.name as never))?.map(k => [liuJia.name, k[2]]) as any
}

/**
 * 截路空亡
 * 日柱天干所克之物（财星）被时柱地支所 “截”
 * 若胎元中亦见此煞，凶势叠加，困苦更甚
 */
const getJieLuKongWang = (riZhu: Zhu) => {
  if (!riZhu.kongWang) riZhu.kongWang = {} as KongWang
  riZhu.kongWang.jieluKong = JIE_LU_KONG.find(([jl]) => jl.includes(riZhu.gan.name))!
}

/**
 * 五鬼空亡
 * 甲己日见巳午，乙庚日见寅卯，丙辛日见子丑，丁壬日见戌亥，戊癸日见申酉
 */
const getWuGuiKongWang = (riZhu: Zhu) => {
  if (!riZhu.kongWang) riZhu.kongWang = {} as KongWang
  riZhu.kongWang.wuGuiKong = WU_GUI_KONG.find(([wg]) => wg.includes(riZhu.gan.name))!
}

/**
 * 克害空亡
 * 甲乙日见午，丙丁日见申，戊己日见巳，庚辛日见寅，壬癸日见酉丑
 */
const getKeHaiKongWang = (riZhu: Zhu) => {
  if (!riZhu.kongWang) riZhu.kongWang = {} as KongWang
  riZhu.kongWang.keHaiKong = KE_HAI_KONG.find(([kh]) => kh.includes(riZhu.gan.name))!
}

/**
 * 破祖空亡
 * 甲乙丙丁日见午，戊己日见戌，庚辛日见子，壬癸日见寅
 */
const getPoZuKongWang = (riZhu: Zhu) => {
  if (!riZhu.kongWang) riZhu.kongWang = {} as KongWang
  riZhu.kongWang.poZuKong = PO_ZU_KONG.find(([pz]) => pz.includes(riZhu.gan.name))!
}

const sortGanZhiNames = (names: (GanName | ZhiName)[]): (GanName | ZhiName)[] =>
  names.sort((a, b) => {
    const aIndex = [...GAN_NAME, ...ZHI_NAME].indexOf(a)
    const bIndex = [...GAN_NAME, ...ZHI_NAME].indexOf(b)

    return aIndex - bIndex
  })

const initDoubleRelation =
  (
    zhuIndex: ZhuIndex,
    otherZhuIndex: ZhuIndex,
    zhiShiShen: TargetShiShen,
    ganShiShen: TargetShiShen,
    prefixDesc: string
  ) =>
  (type: ZhuRelationType, names: (GanName | ZhiName)[], descField: string, from: string): ZhuRelation => ({
    type,
    names: sortGanZhiNames(names),
    desc: [prefixDesc, from, ...names, descField].join(''),
    zhuIndex,
    relationZhuIndex: [otherZhuIndex],
    relationShiShen: [zhiShiShen.forMe?.name!, ganShiShen.forMe?.name!].filter(Boolean) as ShiShenName[],
  })

const getZhuDoubleRelation = (zhu: Zhu, other: Zhu): ZhuRelation[] => {
  if (!zhu || !other) return []
  const { gan, zhi, zhuIndex } = zhu
  const { gan: otherGan, zhi: otherZhi, zhuIndex: otherZhuIndex } = other
  const relations: ZhuRelation[] = []
  const initRelation = initDoubleRelation(
    zhuIndex,
    otherZhuIndex,
    zhi.shiShen as TargetShiShen,
    gan.shiShen as TargetShiShen,
    [ZhuIndexMap[zhuIndex], ZhuIndexMap[otherZhuIndex]].join('与')
  )

  // 天干合
  if (gan.he?.targetName === otherGan.name) {
    relations.push(initRelation(ZhuRelationType.ganHe, [gan.name, otherGan.name], NOUN.he, '天干：'))
  }
  // 天干冲
  if (gan.chong?.targetName === otherGan.name) {
    relations.push(initRelation(ZhuRelationType.ganChong, [gan.name, otherGan.name], NOUN.chong, '天干：'))
  }
  // 地支半合
  const banHe = (zhi.banHe as ZhiBanHe[])?.find(bh => bh.targetName === otherZhi.name)
  if (banHe) {
    relations.push(initRelation(ZhuRelationType.zhiBanHe, [zhi.name, otherZhi.name], NOUN[banHe.type], '地支：'))
  }
  // 地支六合
  if (zhi.he?.targetName === otherZhi.name) {
    relations.push(initRelation(ZhuRelationType.zhiHe, [zhi.name, otherZhi.name], NOUN.he, '地支：'))
  }
  // 地支六冲
  if (zhi.chong?.targetName === otherZhi.name) {
    relations.push(initRelation(ZhuRelationType.zhiChong, [zhi.name, otherZhi.name], NOUN.chong, '地支：'))
  }
  // 地支六害
  if (zhi.hai?.targetName === otherZhi.name) {
    relations.push(initRelation(ZhuRelationType.zhiHai, [zhi.name, otherZhi.name], NOUN.hai, '地支：'))
  }
  // 地支六破
  if (zhi.po?.targetName === otherZhi.name) {
    relations.push(initRelation(ZhuRelationType.zhiPo, [zhi.name, otherZhi.name], NOUN.po, '地支：'))
  }
  // 地支相刑
  if (zhi.xing?.targetName === otherZhi.name) {
    relations.push(initRelation(ZhuRelationType.zhiXing, [zhi.name, otherZhi.name], NOUN.xing, '地支：'))
  }
  // 地支暗合
  if ((zhi.anHe as ZhiAnHe[])?.some(ah => ah.targetName === otherZhi.name)) {
    relations.push(initRelation(ZhuRelationType.zhiAnHe, [zhi.name, otherZhi.name], NOUN.anHe, '地支：'))
  }

  return relations
}

/** 初始化各柱关系 */
export const initZhuRelation = (bazi: Bazi) => {
  const { compareZhuList, zhuList } = getComparations(bazi)

  // 处理两两关系， 天干地支、合害刑冲克
  const relations: ZhuRelation[] = []

  for (const zhu of zhuList) {
    for (const other of compareZhuList) {
      // 排除自身
      if (zhu?.zhuIndex === other?.zhuIndex) continue
      relations.push(...getZhuDoubleRelation(zhu!, other!)) // 天干地支、合害刑冲克
    }
  }

  bazi.relations = uniqWith(
    relations,
    (a, b) =>
      a.zhuIndex === b.zhuIndex &&
      a.relationZhuIndex.toString() === b.relationZhuIndex.toString() &&
      a.names.toString() === b.names.toString()
  )
}
