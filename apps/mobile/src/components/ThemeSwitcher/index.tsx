/**
 * 主题切换器组件
 */
import { FC, useCallback, useEffect, useState } from 'react'
import { View, Button, Text } from '@tarojs/components'

import { useTheme } from '../../contexts/ThemeContext'
import { getAvailableThemes, ThemeType } from '../../styles/themes/themeTypes'
import './index.less'

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

const ThemeSwitcher: FC = () => {
  const { themeType, setThemeType } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  // Available themes
  const availableThemes = getAvailableThemes()

  // Handle theme change
  const handleThemeChange = useCallback(
    (theme: ThemeType) => {
      setThemeType(theme)
      setIsOpen(false)
    },
    [setThemeType]
  )

  // Toggle menu open state
  const toggleMenu = useCallback(e => {
    e.stopPropagation()
    setIsOpen(prev => !prev)
  }, [])

  // Close menu when clicking outside
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = () => {
      setIsOpen(false)
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen])

  return (
    <View className={`theme-switcher ${isOpen ? 'theme-switcher--open' : ''}`} onClick={e => e.stopPropagation()}>
      <Button className={`theme-switcher__fab ${themeType ? 'theme-switcher__fab--active' : ''}`} onClick={toggleMenu}>
        <Text className="theme-switcher__current-icon">{getThemeIcon(themeType)}</Text>
      </Button>

      <View className={`theme-switcher__menu ${isOpen ? 'theme-switcher__menu--open' : ''}`}>
        {availableThemes.map((theme, index) => (
          <View
            key={theme}
            className={`theme-switcher__item ${theme === themeType ? 'theme-switcher__item--active' : ''}`}
            onClick={() => handleThemeChange(theme)}
            style={{
              transitionDelay: `${index * 50}ms`,
            }}
          >
            <Text className="theme-switcher__icon">{getThemeIcon(theme)}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

export default ThemeSwitcher
