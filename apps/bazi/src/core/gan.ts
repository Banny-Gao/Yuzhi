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
  GAN_OTHERS,
} from './data'
import { getGanWuXing, getGanYinYang } from './wuxing'
import { getShiShen } from './shishen'
declare global {
  export type Gan = IndexField<{
    name: GanName // 天干名称
    tianWen: TianWenName // 对应天文
    liuShen: LiuShenName // 对应六神
    yinYang: YinYang // 阴阳
    wuXing: WuXing // 五行
    wuHudun: TargetField<{ name: GanName }> // 五虎遁
    wuShuDun: TargetField<{ name: GanName }> // 五鼠遁
    /** 天干其他表象 */
    position: (typeof GAN_OTHERS)[number][1] // 方位
    detailSeason: (typeof GAN_OTHERS)[number][2] // 季节细化
    character: (typeof GAN_OTHERS)[number][3] // 性格特征
    nature: (typeof GAN_OTHERS)[number][4] // 自然现象
    organ: (typeof GAN_OTHERS)[number][5] // 器官脏腑
    he: ReturnType<typeof ganHe> // 天干合化
    chong: ReturnType<typeof ganChong> // 天干相冲
    twelvePlace: ReturnType<typeof getGanPlace> // 十二宫
    shiShen: ReturnType<typeof getShiShen> // 十神
    muYu: ZhiName // 沐浴
    zhangSheng: ZhiName // 长生
    guanDai: ZhiName // 冠带
    linGuan: ZhiName // 临官
    diWang: ZhiName // 帝旺
    mu: ZhiName // 墓
  }>

  export type GanHe = TargetField<{
    name: GanName
    desc: (typeof GAN_HE)[number][3]
    hua?: WuXingName
    feature: (typeof GAN_HE)[number][4]
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
  const transform = ([_, _name2, hua, desc, feature]: string[]): Required<Omit<GanHe, keyof TargetField>> =>
    ({
      desc,
      feature,
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
  const gan = {
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
    position: GAN_OTHERS.find(([ganName]) => ganName === name)?.[1],
    detailSeason: GAN_OTHERS.find(([ganName]) => ganName === name)?.[2],
    character: GAN_OTHERS.find(([ganName]) => ganName === name)?.[3],
    nature: GAN_OTHERS.find(([ganName]) => ganName === name)?.[4],
    organ: GAN_OTHERS.find(([ganName]) => ganName === name)?.[5],
  } as Gan

  gan.he = ganHe.call(gan)
  gan.chong = ganChong.call(gan)
  gan.shiShen = getShiShen.call(gan)
  gan.twelvePlace = getGanPlace.call(gan)
  gan.zhangSheng = gan.twelvePlace[0].dizhiName
  gan.muYu = gan.twelvePlace[1].dizhiName
  gan.guanDai = gan.twelvePlace[2].dizhiName
  gan.linGuan = gan.twelvePlace[3].dizhiName
  gan.diWang = gan.twelvePlace[4].dizhiName
  gan.mu = gan.twelvePlace[5].dizhiName

  return gan
})
