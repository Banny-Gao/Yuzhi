import { generateRelation, getObjectByName, generateNamesProp } from './utils'
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
    tianGan: TianGanName
    diZhi: DiZhiName
  }>
}

export const yinYangs = YIN_YANG_NAME.map<YinYang>((name, index) => ({
  name,
  value: index === 0 ? -1 : 1,
  opposite: index === 0 ? '阳' : '阴',
}))

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
          liuShen: ['青龙', '朱雀', ['勾陈', '腾蛇'], '白虎', '玄武'],
          tianGan: [
            ['甲', '乙'],
            ['丙', '丁'],
            ['戊', '己'],
            ['庚', '辛'],
            ['壬', '癸'],
          ],
          diZhi: [
            ['寅', '卯'],
            ['巳', '午'],
            ['辰', '戌', '丑', '未'],
            ['申', '酉'],
            ['亥', '子'],
          ],
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
export const wuxings = getWuxings()

/** 根据名称获取五行 */
export const getWuXingByName = (name: WuXingName): WuXing | undefined => getObjectByName(wuxings, name)
