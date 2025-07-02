import { generateRelation, getObjectByName, generateNamesProp, equalName } from './utils'
import {
  WX_NAME,
  YIN_YANG_NAME,
  WX_SHU,
  WU_FANG_NAME,
  WU_ZANG_NAME,
  LIU_FU_NAME,
  WU_SE_NAME,
  WU_WEI_NAME,
  WU_ZHI_NAME,
  WU_CHANG_NAME,
  WX_LIUSHEN,
  WX_TIAN_GAN,
  WX_DI_ZHI,
} from './data'

type YinYangValue = -1 | 1

declare global {
  export type YinYang = BasicField<{
    name: YinYangName
    value: YinYangValue
    opposite: YinYangName
  }>

  export type WuXing = IndexField<{
    name: WuXingName
    sheng: ReturnType<typeof woSheng>
    shengWo: ReturnType<typeof shengWo>
    ke: ReturnType<typeof woKe>
    keWo: ReturnType<typeof keWo>
    wuShu: WuShu
    wuFang: WuFangName
    wuChang: WuChangName
    wuZang: WuZangName
    liuFu: WuFuName
    wuSe: WuSeName
    wuWei: WuWeiName
    wuZhi: WuZhiName
    liuShen: LiuShenName
    gan: GanName
    zhi: ZhiName
    seasonName: SeasonName
  }>
}

export const yinYangs = YIN_YANG_NAME.map<YinYang>((name, index) => ({
  name,
  value: index === 0 ? -1 : 1,
  opposite: index === 0 ? '阳' : '阴',
}))
/** 根据天干索引获取阴阳 */
export const getGanYinYang = (ganIndex: number): YinYang => yinYangs[(ganIndex + 1) % 2]
/** 获取地支的阴阳 */
export const getZhiYinYang = (zhiIndex: number): YinYang => yinYangs[(zhiIndex + 1) % 2]
/* 判断为阴 */
export const isYin = (yinYang: YinYang): boolean => equalName(yinYang, '阴')
/* 判断为阳 */
export const isYang = (yinYang: YinYang): boolean => equalName(yinYang, '阳')

/** 我生 */
export const woSheng = generateRelation<WuXing, WuXing>([...WX_NAME], function (this: WuXing, targetIndex: number) {
  return (this.index + 1) % 5 === targetIndex
})

/** 生我 */
export const shengWo = generateRelation<WuXing, WuXing>([...WX_NAME], function (this: WuXing, targetIndex: number) {
  return (this.index - 1 + 5) % 5 === targetIndex
})

/** 我克 */
export const woKe = generateRelation<WuXing, WuXing>([...WX_NAME], function (this: WuXing, targetIndex: number) {
  return (this.index - targetIndex + 5) % 5 === 3
})

/** 克我 */
export const keWo = generateRelation<WuXing, WuXing>([...WX_NAME], function (this: WuXing, targetIndex: number) {
  return (targetIndex - this.index + 5) % 5 === 3
})

/** 获取五行 */
export const getWuxings = (): WuXing[] =>
  WX_NAME.map((name, index) => {
    const wuxing = {
      ...generateNamesProp(
        {
          wuShu: WX_SHU,
          wuFang: WU_FANG_NAME,
          wuZang: WU_ZANG_NAME,
          liuFu: LIU_FU_NAME,
          wuZhi: WU_ZHI_NAME,
          wuWei: WU_WEI_NAME,
          wuSe: WU_SE_NAME,
          wuChang: WU_CHANG_NAME,
          liuShen: WX_LIUSHEN,
          gan: WX_TIAN_GAN,
          zhi: WX_DI_ZHI,
          seasonName: ['春', '夏', '四季末', '秋', '冬'],
        },
        index
      ),
      name,
      index,
    } as WuXing

    wuxing.sheng = woSheng.call(wuxing, WX_NAME[(index + 1) % 5])
    wuxing.shengWo = shengWo.call(wuxing, WX_NAME[(index - 1 + 5) % 5])
    wuxing.ke = woKe.call(wuxing, WX_NAME[(index - 3 + 5) % 5])
    wuxing.keWo = keWo.call(wuxing, WX_NAME[(index + 3) % 5])

    return wuxing
  })

/** 五行列表 */
export const wuXings = getWuxings()

/** 根据名称获取五行 */
export const getWuXingByName = (name: WuXingName): WuXing | undefined => getObjectByName(wuXings, name)
/** 根据天干索引获取五行 */
export const getGanWuXing = (ganIndex: number): WuXing => wuXings[Math.floor(ganIndex / 2) % 5]
/** 获取地支的五行 */
export const getZhiWuXing = (zhiIndex: number): WuXing => {
  // 子丑为冬寅为春，通过四季定五行
  const offsetIndex = (-2 + 12 + zhiIndex) % 12
  // 三个月为一季，季末为土， 寅卯辰 offsetIndex 0,1,2
  const isTu = offsetIndex % 3 === 2
  // 一年四季，春夏秋冬, 五行为木火土金水，夏季后为秋金
  let seasonIndex = Math.floor(offsetIndex / 3) % 4
  seasonIndex = seasonIndex >= 2 ? seasonIndex + 1 : seasonIndex

  const wuxingIndex = isTu ? 2 : seasonIndex

  return wuXings[wuxingIndex]
}
/* 判断五行是否为木 */
export const isMu = (wuXing: WuXing | WuXingName): boolean => equalName(wuXing, '木')
/* 判断五行是否为火 */
export const isHuo = (wuXing: WuXing | WuXingName): boolean => equalName(wuXing, '火')
/* 判断五行是否为土 */
export const isTu = (wuXing: WuXing | WuXingName): boolean => equalName(wuXing, '土')
/* 判断五行是否为金 */
export const isJin = (wuXing: WuXing | WuXingName): boolean => equalName(wuXing, '金')
/* 判断五行是否为水 */
export const isShui = (wuXing: WuXing | WuXingName): boolean => equalName(wuXing, '水')
