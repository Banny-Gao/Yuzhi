/**
 * 主题类型定义
 */

// 主题类型
export type ThemeType = 'default' | 'spring' | 'summer' | 'autumn' | 'winter' | 'newYear' | 'dark'

// 主题的可读名称
export const themeNames = {
  default: '默认',
  spring: '春季',
  summer: '夏季',
  autumn: '秋季',
  winter: '冬季',
  newYear: '新年',
  dark: '暗黑',
}

// 获取所有可用主题
export function getAvailableThemes(): ThemeType[] {
  return ['default', 'spring', 'summer', 'autumn', 'winter', 'newYear', 'dark']
}

// 获取当前季节对应的主题
export function getSeasonalTheme(): ThemeType {
  const now = new Date()
  const month = now.getMonth() + 1 // 月份是从0开始的

  // 农历新年通常在1月底或2月，这里简化处理
  if (month === 1 || month === 2) {
    return 'newYear'
  }

  // 春季：3-5月
  if (month >= 3 && month <= 5) {
    return 'spring'
  }

  // 夏季：6-8月
  if (month >= 6 && month <= 8) {
    return 'summer'
  }

  // 秋季：9-11月
  if (month >= 9 && month <= 11) {
    return 'autumn'
  }

  // 冬季：12月、1-2月
  return 'winter'
}
