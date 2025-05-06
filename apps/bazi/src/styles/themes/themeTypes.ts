export const themeNames = {
  default: '默认',
  spring: '春季',
  summer: '夏季',
  autumn: '秋季',
  winter: '冬季',
  newYear: '新年',
  dark: '暗黑',
}

export const themeTypes = ['default', 'spring', 'summer', 'autumn', 'winter', 'newYear', 'dark'] as const
export type ThemeType = (typeof themeTypes)[number]

// 获取当前季节对应的主题
export function getSeasonalTheme(): ThemeType {
  const now = new Date()
  const month = now.getMonth() + 1 // 月份是从0开始的

  switch (month) {
    case 2:
      return 'newYear'
    case 3:
    case 4:
      return 'spring'
    case 5:
    case 6:
    case 7:
      return 'summer'
    case 8:
    case 9:
    case 10:
      return 'autumn'
    default:
      return 'winter'
  }
}
