import {
  SEASON_NAME,
  LUNAR_MONTH,
  LUNAR_MONTH_WITH_LEAP,
  LUNAR_DAY,
  YIN_YANG_NAME,
  WX_NAME,
  WX_SHU,
  WU_FANG_NAME,
  WU_CHANG_NAME,
  WU_ZANG_NAME,
  LIU_FU_NAME,
  WU_SE_NAME,
  WU_WEI_NAME,
  WU_ZHI_NAME,
  WX_LIUSHEN,
  LIU_SHEN_NAME,
  GAN_NAME,
  ZHI_NAME,
  GAN_TIAN_WEN,
  TWELVE_PLACE_NAME,
  SHI_SHEN_NAME,
  SOLAR_TERM,
  SHENG_XIAO_NAME,
  DI_LI_NAME,
  SI_KU_NAME,
  FINGER_POSITION,
  SI_ZHENG_NAME,
  SI_YU_NAME,
  NAYIN_WUXING,
} from './constants'

declare global {
  /** 将字符串数组转换为联合类型 */
  export type NameConst<T extends readonly any[]> = T[number]

  /** 季节名称 */
  export type SeasonName = NameConst<typeof SEASON_NAME> | '四季末'
  /** 农历月份 */
  export type LunarMonth = NameConst<typeof LUNAR_MONTH> | NameConst<typeof LUNAR_MONTH_WITH_LEAP>
  /** 农历日 */
  export type LunarDay = NameConst<typeof LUNAR_DAY>
  /** 节气名称 */
  export type SolarTermName = (typeof SOLAR_TERM)[number][0]

  // 阴阳
  export type YinYangName = NameConst<typeof YIN_YANG_NAME>

  // 五行
  export type WuXingName = NameConst<typeof WX_NAME>
  /** 五行数字 */
  export type WuShu = (typeof WX_SHU)[number]
  /** 五行方位 */
  export type WuFangName = NameConst<typeof WU_FANG_NAME>
  // 五常
  export type WuChangName = NameConst<typeof WU_CHANG_NAME>
  // 五脏
  export type WuZangName = NameConst<typeof WU_ZANG_NAME>
  // 六腑
  export type WuFuName = NameConst<typeof LIU_FU_NAME>
  // 五色
  export type WuSeName = NameConst<typeof WU_SE_NAME>
  // 五味
  export type WuWeiName = NameConst<typeof WU_WEI_NAME>
  // 五志
  export type WuZhiName = NameConst<typeof WU_ZHI_NAME>
  // 六神
  export type LiuShenName = NameConst<typeof LIU_SHEN_NAME> | NameConst<typeof WX_LIUSHEN>
  // 天干
  export type GanName = NameConst<typeof GAN_NAME>
  // 地支
  export type ZhiName = NameConst<typeof ZHI_NAME>
  // 天文
  export type TianWenName = NameConst<typeof GAN_TIAN_WEN>
  // 五行寄生十二宫
  export type TwelvePlaceName = NameConst<typeof TWELVE_PLACE_NAME>
  // 十神
  export type ShiShenName = (typeof SHI_SHEN_NAME)[number][number]
  // 生肖
  export type ShengXiaoName = NameConst<typeof SHENG_XIAO_NAME>
  // 地理
  export type DiLiName = NameConst<typeof DI_LI_NAME>
  // 四正
  export type SiZhengName = (typeof SI_ZHENG_NAME)[number][0]
  // 四隅
  export type SiYuName = (typeof SI_YU_NAME)[number][0]
  // 四库
  export type SiKuName = (typeof SI_KU_NAME)[number][0]
  // 掌诀坐标
  export type FingerPosition = (typeof FINGER_POSITION)[number]
  // 干支名称
  export type GanZhiName = (typeof NAYIN_WUXING)[number][0 | 1]
  // 纳音五行
  export type NaYinName = (typeof NAYIN_WUXING)[number][2]
}
