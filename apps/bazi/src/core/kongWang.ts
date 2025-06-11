declare global {
  export type KongWang = {
    name: string
    date: string
    time: string
    lunarMonth: number
    lunarDay: number
    lunarHour: number
  }
}

export const getKongWang = (bazi: Bazi) => {}
