import { generateNamesProp, getRelation, equalName, getObjectByName } from './utils'
import {
  ZHI_NAME,
  DI_LI_NAME,
  SEASON_NAME,
  SHENG_XIAO_NAME,
  FINGER_POSITION,
  ZHI_HE,
  ZHI_SAN_HUI,
  ZHI_SAN_HE,
  ZHI_SAN_XING,
  SHENG_WANG,
  MU_WANG,
  SHENG_MU,
  ZHI_CHONG,
  ZHI_HAI,
  ZHI_PO,
  ZHI_XING,
  ZHI_AN_HE,
  SI_ZHENG_NAME,
  SI_YU_NAME,
  SI_KU_NAME,
  ZHI_OTHERS,
  ZHI_CANG_GAN,
} from './data'
import { getShiShen } from './shishen'
import { getZhiYinYang, getZhiWuXing, getWuXingByName, yinYangs, isYin, isYang, isTu, isShui } from './wuxing'
import { tianGans } from './gan'

export enum QiEnum {
  benQi,
  zhongQi,
  yuQi,
}
export const qiOptions = [
  { name: '本气', type: QiEnum.benQi },
  { name: '中气', type: QiEnum.zhongQi },
  { name: '余气', type: QiEnum.yuQi },
]

declare global {
  export type Zhi = IndexField<{
    name: ZhiName // 地支名称
    yinYang: YinYang // 阴阳
    wuXing: WuXing // 五行
    seasonName: SeasonName // 季节名称
    shengXiao: ShengXiaoName // 生肖名称
    fingerPosition: FingerPosition // 手指位置
    sanHui: ReturnType<typeof sanHui> // 三会
    sanHe: ReturnType<typeof sanHe> // 三合
    banHe: ReturnType<typeof zhiBanHe> // 半合
    // benQi: ReturnType<typeof getBenQi> // 本气
    // yuQi: ReturnType<typeof getYuQi> // 余气
    // zhongQi: ReturnType<typeof getZhongQi> // 中气
    cangGan: ReturnType<typeof getZhiCangGan> // 藏干
    he: ReturnType<typeof zhiHe> // 横合
    hai: ReturnType<typeof zhiHai> // 竖害
    chong: ReturnType<typeof zhiChong> // 冲
    po: ReturnType<typeof zhiPo> // 破
    xing: ReturnType<typeof zhiXing> // 刑
    sanXing: ReturnType<typeof zhiSanXing> // 三刑
    anHe: ReturnType<typeof zhiAnHe> // 暗合
    shiShen: ReturnType<typeof getShiShen> // 十神
    organ: (typeof ZHI_OTHERS)[number][1] // 器官
    hours: (typeof ZHI_OTHERS)[number][2] // 时辰
    detailSeason: (typeof ZHI_OTHERS)[number][3] // 季节细化
    position: (typeof ZHI_OTHERS)[number][4] // 方位
    jingLuo: (typeof ZHI_OTHERS)[number][5] // 经络
    shenTiFa: (typeof ZHI_OTHERS)[number][6] // 身体当令
  }>

  export type ZhiBanHeType = 'shengWang' | 'muWang' | 'shengMu'
  export type ZhiBanHe = TargetField<{
    name: ZhiName
    type: ZhiBanHeType
    hua: WuXingName
  }>

  export type QiName = GanName | null
  export type ZhiCangGan = [QiName, QiName, QiName]

  export type ZhiHe = TargetField<{
    name: ZhiName
    targetName: ZhiName
    hua: WuXingName | WuXingName[]
    desc: (typeof ZHI_HE)[number][3]
  }>

  export type ZhiHai = TargetField<{
    name: ZhiName
    targetName: ZhiName
    desc: (typeof ZHI_HAI)[number][2]
  }>

  export type ZhiChong = TargetField<{
    name: ZhiName
    targetName: ZhiName
  }>

  export type ZhiPo = TargetField<{
    name: ZhiName
    targetName: ZhiName
  }>

  export type ZhiXing = TargetField<{
    name: ZhiName
    targetName: ZhiName
    desc: (typeof ZHI_XING)[number][2]
  }>

  export type ZhiAnHe = TargetField<{
    name: ZhiName
    targetName: ZhiName
    desc: (typeof ZHI_AN_HE)[number][2]
  }>
}

/** 获取三个地支的关系 */
const reflectionOfThree = <T extends readonly (readonly string[])[]>(
  zhi: Zhi,
  names: T,
  transformDesc?: (desc: string) => Record<string, string>
) => {
  for (const item of names) {
    const [desc, ...targetNames] = [...item].reverse()
    if (targetNames.includes(zhi.name)) {
      return {
        targetNames: targetNames.filter(name => name !== zhi.name) as ZhiName[],
        ...transformDesc?.(desc),
      }
    }
  }
}

/* 地支三会 */
function sanHui(this: Zhi) {
  return reflectionOfThree(this, [...ZHI_SAN_HUI], hui => ({
    hui,
  }))
}

/* 地支三合 */
function sanHe(this: Zhi) {
  return reflectionOfThree(this, [...ZHI_SAN_HE], he => ({
    he,
  }))
}

const getGroups = (names: (readonly string[])[]): string[][] =>
  names.reduce<string[][]>((acc, cur) => {
    acc.push([...cur.slice(0, 2)])
    return acc
  }, [])
const getReflectedName = (item: string[], name: string): string => {
  const [name1, name2] = item
  return name1 === name ? name2 : name1
}
function zhiBanHe(this: Zhi, target?: Zhi | ZhiName): ZhiBanHe | ZhiBanHe[] | undefined {
  const groups = getGroups([...SHENG_WANG, ...MU_WANG, ...SHENG_MU])

  if (!target) {
    const targetNames = groups
      .filter(item => item.includes(this.name))
      .map(item => getReflectedName(item, this.name))
      .flat() as ZhiName[]
    return targetNames.map(name => zhiBanHe.call(this, name))
  }
  const isEqual = (a: readonly (readonly string[])[], b: ZhiName[]): boolean =>
    a.some(item => item.slice(0, 2).sort().toString() === b.sort().toString())

  const isShengwang = (names: ZhiName[]): boolean => isEqual(SHENG_WANG, names)
  const isMuwang = (names: ZhiName[]): boolean => isEqual(MU_WANG, names)
  const isShengmu = (names: ZhiName[]): boolean => isEqual(SHENG_MU, names)
  const getType = (names: ZhiName[]): ZhiBanHeType => {
    if (isShengwang(names)) return 'shengWang'
    if (isMuwang(names)) return 'muWang'
    if (isShengmu(names)) return 'shengMu'
    return 'shengWang'
  }

  const transform = ([name1, name2, hua]: string[]): Required<Omit<ZhiBanHe, keyof TargetField>> =>
    ({
      type: getType([name1, name2] as ZhiName[]),
      hua,
    }) as Required<Omit<ZhiBanHe, keyof TargetField>>

  return getRelation.call(this, {
    target,
    names: [...ZHI_NAME],
    relations: [...SHENG_WANG, ...MU_WANG, ...SHENG_MU].map(item => [...item]),
    transform,
  }) as ZhiBanHe
}

/** 判断是否属于四正 */
const isSiZheng = (name: Zhi['name']): boolean => SI_ZHENG_NAME.some(([n]) => n === name)
/** 判断是否属于四隅 */
const isSiYu = (name: Zhi['name']): boolean => SI_YU_NAME.some(([n]) => n === name)
/** 判断是否属于四库 */
const isSiku = (name: Zhi['name']): boolean => SI_KU_NAME.some(([n]) => n === name)
/** 获取八宅五行 */
const getBaZhaiWuXing = (name: Zhi['name']): WuXing[] | undefined => {
  const [_, wuxingName] = [...SI_KU_NAME, ...SI_ZHENG_NAME, ...SI_YU_NAME].find(([n]) => n === name) ?? []
  return wuxingName?.split('/').map(wuxing => getWuXingByName(wuxing as WuXingName) as WuXing)
}

/** 本气
 * 1. 相同五行属性
 * 2. 四旺为阴，四长生为阳，四墓阴阳与自身相同
 * */

export const getBenQi = (zhi: Zhi): QiName => {
  const { wuXing, yinYang } = zhi
  const isSiWang = isSiZheng(zhi.name)
  const isSiChangSheng = isSiYu(zhi.name)

  const targetYinYang = isSiWang ? yinYangs[0] : isSiChangSheng ? yinYangs[1] : yinYang

  const benQi = tianGans.find(gan => equalName(gan.wuXing, wuXing) && equalName(gan.yinYang, targetYinYang))

  return benQi?.name as QiName
}
/**
 * 余气
 * 1. 四旺与水无余气
 * 2. 上支为四旺，余气为上支本气
 */
export const getYuQi = (zhi: Zhi): QiName => {
  const { wuXing, index } = zhi
  const isSiWang = isSiZheng(zhi.name)

  // 四旺与水无余气
  if (isSiWang || isShui(wuXing)) {
    return null
  }
  const prevIndex = index - 1
  const prevZhiName = ZHI_NAME[prevIndex]
  const prevWuxing = getZhiWuXing(prevIndex)
  const prevYinYang = getZhiYinYang(prevIndex)

  // 上支为四旺，余气为上支本气, 本支肯定是四墓
  if (isSiZheng(prevZhiName))
    return getBenQi({
      name: prevZhiName,
      wuXing: prevWuxing,
      yinYang: prevYinYang,
    } as Zhi)

  // 上支为四墓，余气皆为土，阴阳与本气取法相同，长生为阳
  if (isSiku(prevZhiName)) return tianGans.find(gan => isTu(gan.wuXing) && isYang(gan.yinYang))?.name as QiName

  return null
}
/**
 * 中气
 * 1. 本支为四墓, 五行为墓库，取阴
 * 2. 本支四长生，中气五行为我生，取阳
 */
export const getZhongQi = (zhi: Zhi): QiName => {
  const { wuXing } = zhi
  // 本支为四墓, 五行为墓库，取阴
  if (isSiku(zhi.name)) {
    const [targetWuxing] = getBaZhaiWuXing(zhi.name) ?? []
    return tianGans.find(gan => equalName(gan.wuXing, targetWuxing) && isYin(gan.yinYang))?.name as QiName
  }

  // 本支四长生，中气五行为我生，取阳
  const isSiChangSheng = isSiYu(zhi.name)
  if (isSiChangSheng) {
    // 巳火为阴火,土皆为墓库，生土不合适，火土同宫，所以这里看做土生金
    const targetName = equalName(zhi, '巳') ? '金' : wuXing.sheng.targetName
    return tianGans.find(gan => equalName(gan.wuXing, targetName as WuXingName) && isYang(gan.yinYang))?.name as QiName
  }

  // 本支为四旺，无中气, 但火土同宫, 均为帝旺，火生土助土，所以土为午的中气, 同本气取阴阳，四旺为阴
  if (equalName(zhi, '午')) return tianGans.find(gan => isTu(gan.wuXing) && isYin(gan.yinYang))?.name as QiName

  return null
}

function getZhiCangGan(this: Zhi): ((Gan & { touGan?: any }) | null)[] {
  return ZHI_CANG_GAN.find(item => item[0] === this.name)!
    .slice(1)
    .map(name => (name ? (getObjectByName(tianGans, name) as Gan) : null))
  // return [getBenQi(this), getZhongQi(this), getYuQi(this)].map(name =>
  //   name ? (getObjectByName(tianGans, name) as Gan) : null
  // )
}

/** 掌诀获取索引， 横合 */
const getZhiHeTargetIndexByFingerPosition = ([x, y]: FingerPosition): number =>
  FINGER_POSITION.findIndex(([tx, ty]) => tx === -x && ty === y)
/** 三合中看六合 */
const getZhiHeTargetName = (zhi: Zhi): ZhiName => {
  /**
   * 六合可从三合局看
   * 我为阳，合者局生助我局，我为阴，我生助合者局
   * 长生自合，墓旺相合，均衡
   */
  const { name, yinYang } = zhi
  const { he } = sanHe.call(zhi)
  const sanHeWuXing = getWuXingByName(he)
  const hua = isYang(yinYang) ? sanHeWuXing?.shengWo : sanHeWuXing?.sheng
  const targetSanhe = [...ZHI_SAN_HE].find(item => item[3] === hua?.targetName)
  const i = isSiYu(name) ? 0 : isSiZheng(name) ? 2 : 1

  return targetSanhe?.[i] as ZhiName
}

function zhiHe(this: Zhi, target?: Zhi | ZhiName, from?: 'finger' | 'sanHe'): ZhiHe | undefined {
  if (from === 'finger') {
    const targetIndex = getZhiHeTargetIndexByFingerPosition(this.fingerPosition)
    target ??= ZHI_NAME[targetIndex]
  } else {
    const targetName = getZhiHeTargetName(this)
    target ??= targetName
  }

  const transform = ([_, _name2, huas, desc]: (typeof ZHI_HE)[number]) => {
    const [hua, huaTwo] = huas.split('/') as [WuXingName, WuXingName]
    return {
      desc,
      hua: huaTwo ? [hua, huaTwo] : hua,
    }
  }

  return getRelation.call(this, {
    target,
    names: [...ZHI_NAME],
    relations: ZHI_HE.map(item => [...item]),
    transform,
  })
}

/** 竖害 */
const getZhiHaiTargetIndexByFingerPosition = ([x, y]: FingerPosition): number =>
  FINGER_POSITION.findIndex(([tx, ty]) => tx === x && ty === 3 - y)
/** 三合中看六害 */
const getZhiHaiTargetName = (zhi: Zhi): ZhiName => {
  /**
   * 六害从三合局看
   * 我为阳，害我者我生，我生为土看我克
   * 我为阴，害我者生我，生我为土看克我
   * 长生自害，墓旺相害，均衡
   */
  const { name, yinYang } = zhi
  const { he } = sanHe.call(zhi)
  const sanHeWuXing = getWuXingByName(he)

  const hua = isYang(yinYang)
    ? sanHeWuXing?.sheng.targetName !== '土'
      ? sanHeWuXing?.sheng
      : sanHeWuXing?.ke
    : sanHeWuXing?.shengWo.targetName !== '土'
      ? sanHeWuXing?.shengWo
      : sanHeWuXing?.keWo

  const targetSanhe = [...ZHI_SAN_HE].find(item => item[3] === hua?.targetName)
  const i = isSiYu(name) ? 0 : isSiZheng(name) ? 2 : 1

  return targetSanhe?.[i] as ZhiName
}

function zhiHai(this: Zhi, target?: Zhi | ZhiName, from?: 'finger' | 'sanHe'): ZhiHai | undefined {
  if (from === 'finger') {
    const targetIndex = getZhiHaiTargetIndexByFingerPosition(this.fingerPosition)
    target ??= ZHI_NAME[targetIndex]
  } else {
    target ??= getZhiHaiTargetName(this)
  }

  const transform = ([_, _name2, desc]: (typeof ZHI_HAI)[number]) => ({
    desc,
  })

  return getRelation.call(this, {
    target,
    names: [...ZHI_NAME],
    relations: ZHI_HAI.map(item => [...item]),
    transform,
  })
}

export const getZhiPoTargetName = (zhi: Zhi): ZhiName => {
  /**
   * 六破从三合局看
   * 我为阳，破我者生我。我为阴，破我者我生
   * 与我同方
   */
  const { name, yinYang } = zhi
  const { he } = sanHe.call(zhi)
  const sanHeWuXing = getWuXingByName(he)
  const hua = isYang(yinYang) ? sanHeWuXing?.shengWo : sanHeWuXing?.sheng

  const targetSanhe = [...ZHI_SAN_HE].find(item => item[3] === hua?.targetName)
  const i = isSiYu(name) ? 0 : isSiZheng(name) ? 1 : 2

  return targetSanhe?.[i] as ZhiName
}

function zhiPo(this: Zhi, target?: Zhi | ZhiName): ZhiPo | undefined {
  target ??= getZhiPoTargetName(this)

  return getRelation.call(this, {
    target,
    names: [...ZHI_NAME],
    relations: ZHI_PO.map(item => [...item]),
  })
}

function zhiChong(this: Zhi, target?: Zhi | ZhiName): ZhiChong | undefined {
  target ??= ZHI_NAME[(this.index + 6) % 12]
  return getRelation.call(this, {
    target,
    names: [...ZHI_NAME],
    relations: ZHI_CHONG.map(item => [...item]),
  })
}

const getZhiXingTargetName = (zhi: Zhi): ZhiName => {
  /** 三合、三会论三刑
   * 火金看同我，水看我生，木看生我
   */
  const { name } = zhi
  const { he } = sanHe.call(zhi)
  const sanHeWuXing = getWuXingByName(he)
  let huaName: string | undefined
  switch (sanHeWuXing?.name) {
    case '水':
      huaName = sanHeWuXing?.sheng.targetName
      break
    case '木':
      huaName = sanHeWuXing?.shengWo.targetName
      break
    default:
      huaName = sanHeWuXing?.name
      break
  }

  const targetSanhe = [...ZHI_SAN_HUI].find(item => item[3] === huaName)
  const i = isSiYu(name) ? 0 : isSiZheng(name) ? 1 : 2

  return targetSanhe?.[i] as ZhiName
}

function zhiXing(this: Zhi, target?: Zhi | ZhiName): ZhiXing | undefined {
  target ??= getZhiXingTargetName(this)
  const transform = ([_, _name2, desc]: (typeof ZHI_XING)[number]) => ({
    desc,
  })

  return getRelation.call(this, {
    target,
    names: [...ZHI_NAME],
    relations: ZHI_XING.map(item => [...item]),
    transform,
  })
}

/* 地支三合 */
function zhiSanXing(this: Zhi) {
  return reflectionOfThree(this, [...ZHI_SAN_XING], desc => ({
    desc,
  }))
}

function zhiAnHe(this: Zhi, target?: Zhi | ZhiName): ZhiAnHe | ZhiAnHe[] | undefined {
  if (!target) {
    const groups = getGroups([...ZHI_AN_HE])

    const targetNames = groups
      .filter(item => item.includes(this.name))
      .map(item => getReflectedName(item, this.name))
      .flat() as ZhiName[]
    target = targetNames[0]
    if (!target) return void 0

    return targetNames.map(name => zhiAnHe.call(this, name)) as ZhiAnHe[]
  }

  const transform = ([_, _name2, desc]: (typeof ZHI_AN_HE)[number]) => ({
    desc,
  })

  return getRelation.call(this, {
    target,
    names: [...ZHI_NAME],
    relations: ZHI_AN_HE.map(item => [...item]),
    transform,
  }) as ZhiAnHe
}

export const diZhis = ZHI_NAME.map((name, index) => {
  const diZhi = {
    ...generateNamesProp(
      {
        dili: DI_LI_NAME,
        shengXiao: SHENG_XIAO_NAME,
        fingerPosition: FINGER_POSITION,
      },
      index
    ),
    name,
    index,
    seasonName: SEASON_NAME[Math.floor(((index - 2 + 12) % 12) / 3)],
    yinYang: getZhiYinYang(index),
    wuXing: getZhiWuXing(index),
    organ: ZHI_OTHERS.find(([zhiName]) => zhiName === name)?.[1],
    hours: ZHI_OTHERS.find(([zhiName]) => zhiName === name)?.[2],
    detailSeason: ZHI_OTHERS.find(([zhiName]) => zhiName === name)?.[3],
    position: ZHI_OTHERS.find(([zhiName]) => zhiName === name)?.[4],
    jingLuo: ZHI_OTHERS.find(([zhiName]) => zhiName === name)?.[5],
    shenTiFa: ZHI_OTHERS.find(([zhiName]) => zhiName === name)?.[6],
  } as Zhi

  diZhi.sanHui = sanHui.call(diZhi)
  diZhi.sanHe = sanHe.call(diZhi)
  diZhi.banHe = zhiBanHe.call(diZhi)
  // diZhi.benQi = getBenQi(diZhi)
  // diZhi.yuQi = getYuQi(diZhi)
  // diZhi.zhongQi = getZhongQi(diZhi)
  diZhi.cangGan = getZhiCangGan.call(diZhi)
  diZhi.he = zhiHe.call(diZhi)
  diZhi.hai = zhiHai.call(diZhi)
  diZhi.chong = zhiChong.call(diZhi)
  diZhi.po = zhiPo.call(diZhi)
  diZhi.xing = zhiXing.call(diZhi)
  diZhi.sanXing = zhiSanXing.call(diZhi)
  diZhi.anHe = zhiAnHe.call(diZhi)
  diZhi.shiShen = getShiShen.call(diZhi)

  return diZhi
})
