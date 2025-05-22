import { SHI_SHEN_NAME, GAN_NAME, ZHI_NAME } from './data'
import { getGanWuXing, getZhiWuXing, getGanYinYang, getZhiYinYang } from './wuxing'

declare global {
  type GetShiShenType<M extends number, N extends number> = (typeof SHI_SHEN_NAME)[M][N]

  /* 比肩 */
  export type Bijian = BasicField<{
    name: GetShiShenType<0, 0>
  }>
  /* 劫财 */
  export type Jiecai = BasicField<{
    name: GetShiShenType<0, 1>
  }>
  /* 偏印 */
  export type PianYin = BasicField<{
    name: GetShiShenType<1, 0>
  }>
  /* 正印 */
  export type ZhengYin = BasicField<{
    name: GetShiShenType<1, 1>
  }>
  /* 食神 */
  export type Shishen = BasicField<{
    name: GetShiShenType<2, 0>
  }>
  /* 伤官 */
  export type Shangguan = BasicField<{
    name: GetShiShenType<2, 1>
  }>
  /* 七杀 */
  export type Qisha = BasicField<{
    name: GetShiShenType<3, 0>
  }>
  /* 正官 */
  export type Zhengguan = BasicField<{
    name: GetShiShenType<3, 1>
  }>
  /* 偏财 */
  export type Piancai = BasicField<{
    name: GetShiShenType<4, 0>
  }>
  /* 正财 */
  export type Zhengcai = BasicField<{
    name: GetShiShenType<4, 1>
  }>

  export type GanZhiShiShen =
    | Bijian
    | Jiecai
    | PianYin
    | ZhengYin
    | Shishen
    | Shangguan
    | Qisha
    | Zhengguan
    | Piancai
    | Zhengcai

  export type TargetShiShen = TargetField<{
    name: GanName | ZhiName
    forTarget?: GanZhiShiShen
    forMe?: GanZhiShiShen
  }>
}

/** 获取干支十神 */
export function getShiShen(
  this: Gan | Zhi,
  target?: Gan | Zhi | GanName | ZhiName
): TargetShiShen | TargetShiShen[] | undefined {
  if (!target) return [...GAN_NAME, ...ZHI_NAME].map(item => getShiShen.call(this, item)) as TargetShiShen[]

  const targetName = typeof target === 'string' ? target : target.name
  const isGan = GAN_NAME.includes(targetName as GanName)
  const targetIndex = isGan ? GAN_NAME.indexOf(targetName as GanName) : ZHI_NAME.indexOf(targetName as ZhiName)
  const targetWuxing = isGan ? getGanWuXing(targetIndex) : getZhiWuXing(targetIndex)
  const targetYinYang = isGan ? getGanYinYang(targetIndex) : getZhiYinYang(targetIndex)

  const {
    wuXing,
    wuXing: { name: meWuxingName },
  } = this
  const { name: targetWuxingName } = targetWuxing
  const { name: targetYinYangName } = targetYinYang

  const forMeIndex = [
    meWuxingName === targetWuxingName,
    wuXing.shengWo.targetName === targetWuxingName,
    wuXing.sheng.targetName === targetWuxingName,
    wuXing.keWo.targetName === targetWuxingName,
    wuXing.ke.targetName === targetWuxingName,
  ].findIndex(Boolean)

  const forTargetIndex = [
    targetWuxingName === meWuxingName,
    targetWuxing.shengWo.targetName === meWuxingName,
    targetWuxing.sheng.targetName === meWuxingName,
    targetWuxing.keWo.targetName === meWuxingName,
    targetWuxing.ke.targetName === meWuxingName,
  ].findIndex(Boolean)

  const i = this.yinYang.name === targetYinYangName ? 0 : 1

  return {
    targetName,
    targetIndex,
    forTarget: {
      name: SHI_SHEN_NAME[forTargetIndex][i],
    },
    forMe: {
      name: SHI_SHEN_NAME[forMeIndex][i],
    },
  }
}
