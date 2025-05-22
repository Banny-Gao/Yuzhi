import { ZHI_NAME } from './data'

declare global {
  export type Zhi = IndexField<{
    name: ZhiName
    yinYang: YinYang
    wuXing: WuXing
    season: SeasonName
    // animal: AnimalName
    // fingerPosition: FingerPosition
  }>
}
