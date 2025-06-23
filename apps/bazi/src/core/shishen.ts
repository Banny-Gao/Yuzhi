import { SHI_SHEN_NAME, GAN_NAME, ZHI_NAME } from './data'
import { getGanWuXing, getZhiWuXing, getGanYinYang, getZhiYinYang } from './wuxing'

declare global {
  export type GanZhiShiShen = BasicField<{
    name: (typeof SHI_SHEN_NAME)[number][number]
  }>

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
