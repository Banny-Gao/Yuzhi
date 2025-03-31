/**
 * 主题切换器组件
 */
import React from 'react'
import { View, Text } from '@tarojs/components'
import { useTheme } from '../../contexts/ThemeContext'
import { getAvailableThemes, ThemeType, themeNames } from '../../styles/themes/themeTypes'

import './index.less'

interface ThemeSwitcherProps {
  showName?: boolean
  iconOnly?: boolean
}

/**
 * 获取主题图标
 */
const getThemeIcon = (themeType: ThemeType): string => {
  switch (themeType) {
    case 'spring':
      return '🌱'
    case 'summer':
      return '☀️'
    case 'autumn':
      return '🍂'
    case 'winter':
      return '❄️'
    case 'newYear':
      return '🧨'
    case 'dark':
      return '🌙'
    default:
      return '🎨'
  }
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ showName = true, iconOnly = false }) => {
  const { themeType, setThemeType } = useTheme()
  const availableThemes = getAvailableThemes()

  // 处理主题切换
  const handleThemeChange = (newTheme: ThemeType) => {
    setThemeType(newTheme)
  }

  return (
    <View className="theme-switcher">
      {iconOnly ? (
        <View
          className="theme-switcher__icon"
          onClick={() => {
            const currentIndex = availableThemes.indexOf(themeType)
            const nextIndex = (currentIndex + 1) % availableThemes.length
            setThemeType(availableThemes[nextIndex])
          }}
        >
          {getThemeIcon(themeType)}
        </View>
      ) : (
        <View className="theme-switcher__list">
          {availableThemes.map(theme => (
            <View
              key={theme}
              className={`theme-switcher__item ${theme === themeType ? 'theme-switcher__item--active' : ''}`}
              style={{
                backgroundColor: theme === themeType ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                borderColor: theme === themeType ? 'var(--primary-color)' : 'var(--border-color-light)',
              }}
              onClick={() => handleThemeChange(theme)}
            >
              <Text className="theme-switcher__icon">{getThemeIcon(theme)}</Text>
              {showName && (
                <Text
                  className="theme-switcher__name"
                  style={{
                    fontWeight: theme === themeType ? 'bold' : 'normal',
                    color: 'var(--text-primary)',
                  }}
                >
                  {themeNames[theme]}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  )
}

export default ThemeSwitcher
