export type SolarTerm = {
  id: string // 主键ID
  year: number // 年份
  name: string // 节气名称
  date: string // 节气日期（公历）
  lunarDate: string // 农历日期
  intro: string // 节气介绍
  createdAt: Date // 创建时间
  updatedAt: Date // 更新时间
}
