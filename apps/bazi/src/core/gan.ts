import { generateNamesProp, getRelation } from './utils'
import {
  GAN_NAME,
  GAN_TIAN_WEN,
  GAN_LIU_SHEN,
  GAN_HE,
  GAN_CHONG,
  TWELVE_PLACE_NAME,
  ZHI_NAME,
  SI_YU_NAME,
} from './data'
import { getGanWuXing, getGanYinYang } from './wuxing'
import { getShiShen } from './shishen'
declare global {
  export type Gan = IndexField<{
    name: GanName
    tianWen: TianWenName
    liuShen: LiuShenName
    yinYang: YinYang
    wuXing: WuXing
    wuHudun: TargetField<{ name: GanName }>
    wuShuDun: TargetField<{ name: GanName }>
    he: ReturnType<typeof ganHe>
    chong: ReturnType<typeof ganChong>
    twelvePlace: ReturnType<typeof getGanPlace>
    shiShen: ReturnType<typeof getShiShen>
  }>

  export type GanHe = TargetField<{
    name: GanName
    desc: (typeof GAN_HE)[number][3]
    hua?: WuXingName
  }>

  export type GanChong = TargetField<{
    name: GanName
  }>

  export type TwelvePlace = BasicField<{
    name: TwelvePlaceName
    dizhiName: ZhiName
  }>
}

/* 获取天干的合化 */
function ganHe(this: Gan, target?: Gan | GanName): GanHe | undefined {
  target ??= GAN_NAME[(this.index + 5) % 10]
  const transform = ([_, _name2, hua, desc]: string[]): Required<Omit<GanHe, keyof TargetField>> =>
    ({
      desc,
      hua,
    }) as Required<Omit<GanHe, keyof TargetField>>

  return getRelation.call(this, {
    target,
    names: [...GAN_NAME],
    relations: GAN_HE.map(item => [...item]),
    transform,
  }) as GanHe
}
/* 获取天干的相冲 */
function ganChong(this: Gan, target?: Gan | GanName): GanChong | undefined {
  const targetIndex = this.index < 5 ? this.index + 6 : (this.index + 4) % 10
  target ??= GAN_NAME[targetIndex]

  return getRelation.call(this, {
    target,
    names: [...GAN_NAME],
    relations: GAN_CHONG.map(item => [...item]),
  }) as GanChong
}

/** 五行寄生十二宫 */
/* 阳干顺行 */
const recyclePlace = (offset: number, array = [...ZHI_NAME]): ZhiName[] =>
  array.slice(offset).concat(array.slice(0, offset))
/* 阴干逆行 */
const oppsiteRecyclePlace = (offset: number): ZhiName[] => recyclePlace(4, recyclePlace(offset).reverse())
function getGanPlace(this: Gan): TwelvePlace[] {
  const { wuXing, yinYang } = this
  // 火土同宫
  const wuxingName = wuXing.name === '土' ? '火' : wuXing.name
  const siYuName = SI_YU_NAME.find(([_, name]) => name === wuxingName)?.[0]
  const offset = ZHI_NAME.indexOf(siYuName as ZhiName)
  const twelvePalace = yinYang.name === '阳' ? recyclePlace(offset) : oppsiteRecyclePlace(offset)

  return twelvePalace.map((dizhiName, index) => ({
    name: TWELVE_PLACE_NAME[index],
    dizhiName,
  }))
}
/** 获取十天干 */
export const tianGans = GAN_NAME.map((name, index) => {
  const tianGan = {
    ...generateNamesProp(
      {
        tianWen: GAN_TIAN_WEN,
      },
      index
    ),
    name,
    index,
    yinYang: getGanYinYang(index),
    wuXing: getGanWuXing(index),
    liuShen: GAN_LIU_SHEN.find(([ganName]) => ganName === name)?.[1],
    wuHudun: {
      targetName: GAN_NAME[((index + 1) % 5) * 2],
      targetIndex: ((index + 1) % 5) * 2,
    },
    wuShuDun: {
      targetName: GAN_NAME[(index % 5) * 2],
      targetIndex: (index % 5) * 2,
    },
  } as Gan

  tianGan.he = ganHe.call(tianGan)
  tianGan.chong = ganChong.call(tianGan)
  tianGan.shiShen = getShiShen.call(tianGan)
  tianGan.twelvePlace = getGanPlace.call(tianGan)

  return tianGan
})
