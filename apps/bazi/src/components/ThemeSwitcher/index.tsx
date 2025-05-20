/**
 * 主题切换器组件
 */
import { FC, useCallback, useEffect, useState } from 'react'
import { View, Button, Text } from '@tarojs/components'
import { pxTransform } from '@tarojs/taro'

import styles from './index.module.scss'

import { useTheme } from '@/contexts/ThemeContext'
import { themeTypes, ThemeType } from '@/styles/themes/themeTypes'
import { getNavbarInfo } from '@/utils/util'

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
  const { navBarHeight } = getNavbarInfo()

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

  // Generate class names using CSS Modules
  const switcherClass = [styles.switcher, isOpen && styles.open].filter(Boolean).join(' ')

  const fabClass = [styles.fab, themeType && styles.fabActive].filter(Boolean).join(' ')

  const menuClass = [styles.menu, isOpen && styles.menuOpen].filter(Boolean).join(' ')

  return (
    <View
      className={switcherClass}
      onClick={e => e.stopPropagation()}
      style={{ top: pxTransform(navBarHeight * 2) }}
    >
      <Button className={fabClass} onClick={toggleMenu}>
        <Text className={styles.currentIcon}>{getThemeIcon(themeType)}</Text>
      </Button>

      <View className={menuClass}>
        {themeTypes.map((theme, index) => {
          const itemClass = [styles.item, theme === themeType && styles.itemActive]
            .filter(Boolean)
            .join(' ')

          const iconClass = [styles.icon, theme === themeType && styles.activeIcon]
            .filter(Boolean)
            .join(' ')

          return (
            <View
              key={theme}
              className={itemClass}
              onClick={() => handleThemeChange(theme)}
              style={{
                transitionDelay: `${index * 50}ms`,
              }}
            >
              <Text className={iconClass}>{getThemeIcon(theme)}</Text>
            </View>
          )
        })}
      </View>
    </View>
  )
}

export default ThemeSwitcher
