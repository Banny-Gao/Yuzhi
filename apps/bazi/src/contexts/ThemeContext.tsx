import React, { createContext, useContext, useState, useEffect } from 'react'
import Taro from '@tarojs/taro'

import { ThemeType, getSeasonalTheme } from '../styles/themes/themeTypes'

import { getStorage, setStorage, STORAGE_KEYS } from '@/utils/storage'
import { emitter } from '@/utils/emitter'

// 主题上下文接口
interface ThemeContextType {
  themeType: ThemeType
  setThemeType: (theme: ThemeType) => void
  toggleTheme: (themes: ThemeType[]) => void
}

// 创建主题上下文
const ThemeContext = createContext<ThemeContextType | null>(null)

// 主题提供者属性接口
interface ThemeProviderProps {
  children: React.ReactNode
  initialTheme?: ThemeType
  useSeasonalThemeByDefault?: boolean
}

/**
 * 主题提供者组件
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialTheme = 'default',
  useSeasonalThemeByDefault = true,
}) => {
  // 初始化主题类型状态
  const [themeType, setThemeType] = useState<ThemeType>(() => {
    // 尝试从存储中读取主题设置
    try {
      const savedTheme = getStorage<ThemeType>(STORAGE_KEYS.THEME)
      if (savedTheme) {
        return savedTheme
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

  // 更新主题
  useEffect(() => {
    try {
      // 保存主题设置
      setStorage(STORAGE_KEYS.THEME, themeType)

      // 根据环境设置主题
      if (process.env.TARO_ENV === 'h5') {
        // H5环境：设置CSS变量
        const root = document.documentElement
        if (root) {
          root.setAttribute('data-theme', themeType)
        }
      } else {
        // 小程序环境：设置页面根节点样式
        const query = Taro.createSelectorQuery()
        query
          .select('#app')
          .node()
          .exec(res => {
            if (res[0]?.node) {
              const appNode = res[0].node
              appNode.setAttribute('data-theme', themeType)
            }
          })
      }
    } catch (e) {
      console.error('保存主题设置失败', e)
    }
  }, [themeType])

  // 切换主题的函数
  const toggleTheme = (
    themes: ThemeType[] = ['default', 'spring', 'summer', 'autumn', 'winter', 'newYear', 'dark']
  ) => {
    setThemeType(currentTheme => {
      const currentIndex = themes.indexOf(currentTheme)
      const nextIndex = (currentIndex + 1) % themes.length
      return themes[nextIndex]
    })

    emitter.emit('themeChange', themeType)
  }

  const handleChangeTheme = (theme: ThemeType) => {
    setThemeType(theme)
    emitter.emit('themeChange', theme)
  }

  // 上下文值
  const contextValue: ThemeContextType = {
    themeType,
    setThemeType: handleChangeTheme,
    toggleTheme,
  }

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
}

// 导出主题上下文
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export default ThemeContext
