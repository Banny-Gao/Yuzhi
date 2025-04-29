import { getStorage, STORAGE_KEYS } from '@/utils/storage'

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

export const themeColors = {
  default: {
    primaryColor: '#333333',
    primaryColorRgb: '51, 51, 51',
    primaryDark: '#000000',
    primaryLight: '#666666',

    successColor: '#4c4c4c',
    warningColor: '#7c7c7c',
    errorColor: '#2c2c2c',
    infoColor: '#5c5c5c',

    textPrimary: '#101010',
    textSecondary: '#333333',
    textTertiary: '#666666',
    textDisabled: '#999999',

    bgPrimary: '#ffffff',
    bgSecondary: '#f5f5f5',
    bgTertiary: '#e5e5e5',
    bgTertiaryDark: '#d9d9d9',
    bgTertiaryDarkLight: '#f0f0f0',

    borderColor: '#bbbbbb',
    borderColorLight: '#dddddd',

    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    boxShadowLight: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  spring: {
    primaryColor: '#52c41a',
    primaryColorRgb: '82, 196, 26',
    primaryDark: '#389e0d',
    primaryLight: '#f6ffed',

    successColor: '#52c41a',
    warningColor: '#faad14',
    errorColor: '#ff4d4f',
    infoColor: '#13c2c2',

    textPrimary: '#262626',
    textSecondary: '#595959',
    textTertiary: '#8c8c8c',
    textDisabled: '#bfbfbf',

    bgPrimary: '#ffffff',
    bgSecondary: '#f6ffed',
    bgTertiary: '#d9f7be',
    bgTertiaryDark: '#b7eb8f',
    bgTertiaryDarkLight: '#f6ffed',

    borderColor: '#b7eb8f',
    borderColorLight: '#d9f7be',

    boxShadow: '0 2px 8px rgba(82, 196, 26, 0.15)',
    boxShadowLight: '0 2px 4px rgba(82, 196, 26, 0.1)',
  },
  summer: {
    primaryColor: '#4a90e2',
    primaryColorRgb: '74, 144, 226',
    primaryDark: '#357abd',
    primaryLight: '#f0f7ff',

    successColor: '#2ecc71',
    warningColor: '#f1c40f',
    errorColor: '#e74c3c',
    infoColor: '#4a90e2',

    textPrimary: '#2c3e50',
    textSecondary: '#34495e',
    textTertiary: '#7f8c8d',
    textDisabled: '#bdc3c7',

    bgPrimary: '#ffffff',
    bgSecondary: '#f5f9ff',
    bgTertiary: '#e8f2ff',
    bgTertiaryDark: '#d1e5ff',
    bgTertiaryDarkLight: '#f0f7ff',

    borderColor: '#d1e5ff',
    borderColorLight: '#e8f2ff',

    boxShadow: '0 2px 8px rgba(74, 144, 226, 0.15)',
    boxShadowLight: '0 2px 4px rgba(74, 144, 226, 0.1)',
  },
  autumn: {
    primaryColor: '#e67e22',
    primaryColorRgb: '230, 126, 34',
    primaryDark: '#d35400',
    primaryLight: '#fff5eb',

    successColor: '#2ecc71',
    warningColor: '#f1c40f',
    errorColor: '#e74c3c',
    infoColor: '#e67e22',

    textPrimary: '#2c3e50',
    textSecondary: '#34495e',
    textTertiary: '#7f8c8d',
    textDisabled: '#bdc3c7',

    bgPrimary: '#ffffff',
    bgSecondary: '#fff8f3',
    bgTertiary: '#ffe4d0',
    bgTertiaryDark: '#ffd4b8',
    bgTertiaryDarkLight: '#fff5eb',

    borderColor: '#ffd4b8',
    borderColorLight: '#ffe4d0',

    boxShadow: '0 2px 8px rgba(230, 126, 34, 0.15)',
    boxShadowLight: '0 2px 4px rgba(230, 126, 34, 0.1)',
  },
  winter: {
    primaryColor: '#3498db',
    primaryColorRgb: '52, 152, 219',
    primaryDark: '#2980b9',
    primaryLight: '#f0f9ff',

    successColor: '#2ecc71',
    warningColor: '#f1c40f',
    errorColor: '#e74c3c',
    infoColor: '#3498db',

    textPrimary: '#2c3e50',
    textSecondary: '#34495e',
    textTertiary: '#7f8c8d',
    textDisabled: '#bdc3c7',

    bgPrimary: '#ffffff',
    bgSecondary: '#f5f9fc',
    bgTertiary: '#e8f2f8',
    bgTertiaryDark: '#d1e5f2',
    bgTertiaryDarkLight: '#f0f9ff',

    borderColor: '#d1e5f2',
    borderColorLight: '#e8f2f8',

    boxShadow: '0 2px 8px rgba(52, 152, 219, 0.15)',
    boxShadowLight: '0 2px 4px rgba(52, 152, 219, 0.1)',
  },
  newYear: {
    primaryColor: '#e74c3c',
    primaryColorRgb: '231, 76, 60',
    primaryDark: '#c0392b',
    primaryLight: '#fff5f5',

    successColor: '#2ecc71',
    warningColor: '#f1c40f',
    errorColor: '#e74c3c',
    infoColor: '#e74c3c',

    textPrimary: '#2c3e50',
    textSecondary: '#34495e',
    textTertiary: '#7f8c8d',
    textDisabled: '#bdc3c7',

    bgPrimary: '#ffffff',
    bgSecondary: '#fff5f5',
    bgTertiary: '#ffe4e4',
    bgTertiaryDark: '#ffd1d1',
    bgTertiaryDarkLight: '#fff5f5',

    borderColor: '#ffd1d1',
    borderColorLight: '#ffe4e4',

    boxShadow: '0 2px 8px rgba(231, 76, 60, 0.15)',
    boxShadowLight: '0 2px 4px rgba(231, 76, 60, 0.1)',
  },
  dark: {
    primaryColor: '#7c3aed',
    primaryColorRgb: '124, 58, 237',
    primaryDark: '#6d28d9',
    primaryLight: '#1e1b4b',

    successColor: '#10b981',
    warningColor: '#f59e0b',
    errorColor: '#ef4444',
    infoColor: '#3b82f6',

    textPrimary: '#f8fafc',
    textSecondary: '#cbd5e1',
    textTertiary: '#94a3b8',
    textDisabled: '#64748b',

    bgPrimary: '#0f172a',
    bgSecondary: '#1e293b',
    bgTertiary: '#334155',
    bgTertiaryDark: '#475569',
    bgTertiaryDarkLight: '#1e293b',

    borderColor: '#334155',
    borderColorLight: '#1e293b',

    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    boxShadowLight: '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
  },
}

export const getThemeColor = () => {
  const themeType = getStorage<ThemeType>(STORAGE_KEYS.THEME) || getSeasonalTheme()

  return themeColors[themeType]
}

export const isDarkTheme = () => {
  const themeType = getStorage<ThemeType>(STORAGE_KEYS.THEME) || getSeasonalTheme()

  return themeType === 'dark'
}
