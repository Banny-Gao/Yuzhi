import { SEASON_NAME, LUNAR_MONTH, LUNAR_MONTH_WITH_LEAP, LUNAR_DAY } from './nouns'

/** 将字符串数组转换为联合类型 */
export type NameConst<T extends readonly string[]> = T[number]

export type SeasonName = NameConst<typeof SEASON_NAME>

export type LunarMonth = NameConst<typeof LUNAR_MONTH> | NameConst<typeof LUNAR_MONTH_WITH_LEAP>

export type LunarDay = NameConst<typeof LUNAR_DAY>
