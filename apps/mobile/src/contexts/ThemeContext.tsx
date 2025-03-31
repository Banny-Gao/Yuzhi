/**
 * 主题上下文
 */
import React, { createContext, useContext, useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { ThemeType, getSeasonalTheme } from '../styles/themes/themeTypes'
import '../styles/themes/index.css'

// 主题上下文接口
interface ThemeContextType {
  themeType: ThemeType
  setThemeType: (theme: ThemeType) => void
  toggleTheme: (themes: ThemeType[]) => void
}

// 本地存储的主题类型键名
const STORAGE_THEME_KEY = 'APP_THEME_TYPE'

// 创建主题上下文
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// 主题提供者的属性
interface ThemeProviderProps {
  children: React.ReactNode
  initialTheme?: ThemeType
  useSeasonalThemeByDefault?: boolean
}

/**
 * 主题提供者组件
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, initialTheme = 'default', useSeasonalThemeByDefault = true }) => {
  // 初始化主题类型状态
  const [themeType, setThemeType] = useState<ThemeType>(() => {
    // 尝试从存储中读取主题设置
    try {
      const savedTheme = Taro.getStorageSync(STORAGE_THEME_KEY)
      if (savedTheme) {
        return savedTheme as ThemeType
      }

      // 如果设置了使用季节性主题且没有保存的主题
      if (useSeasonalThemeByDefault) {
        return getSeasonalTheme()
      }
    } catch (e) {
      console.error('读取主题设置失败', e)
    }

    // 默认使用初始主题
    return initialTheme
  })

  // 更新DOM上的data-theme属性
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeType)

    try {
      Taro.setStorageSync(STORAGE_THEME_KEY, themeType)
    } catch (e) {
      console.error('保存主题设置失败', e)
    }
  }, [themeType])

  // 切换主题的函数
  const toggleTheme = (themes: ThemeType[] = ['default', 'spring', 'summer', 'autumn', 'winter', 'newYear']) => {
    setThemeType(currentTheme => {
      const currentIndex = themes.indexOf(currentTheme)
      const nextIndex = (currentIndex + 1) % themes.length
      return themes[nextIndex]
    })
  }

  // 上下文值
  const contextValue: ThemeContextType = {
    themeType,
    setThemeType,
    toggleTheme,
  }

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
}

/**
 * 使用主题的钩子
 * @returns 主题上下文
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme 必须在 ThemeProvider 内部使用')
  }

  return context
}

export default ThemeContext
