import { TIAN_GAN_NAME, DI_ZHI_NAME, GAN_TIAN_WEN, GAN_LIU_SHEN, GAN_HE, GAN_CHONG, TWELVE_PLACE_NAME } from './data'
import { yinYangs, wuxings, getWuXingByName } from './wuxing'

declare global {
  export type TianGan = IndexField<{
    name: TianGanName
    yinYang: YinYangName
    wuxing: WuXingName
    tianWen: TianWenName
    liuShen: LiuShenName
  }>
}

// export const gans = TIAN_GAN_NAME.map
