import { useEffect, useState, useMemo } from 'react'
import classNames from 'classnames'
import { CoverView, CoverImage } from '@tarojs/components'

import { tabBarList } from './constants'
import styles from './index.module.less'

import { router, purifyRoute } from '@/utils/router'
import { IconFont, type IconNames } from '@/components'
import { emitter } from '@/utils/emitter'
import { getStorage, STORAGE_KEYS } from '@/utils/storage'
import { ThemeType } from '@/styles/themes/themeTypes'

const TabBar = () => {
  const [themeType, setThemeType] = useState<ThemeType>(getStorage(STORAGE_KEYS.THEME) || 'default')
  const [selected, setSelected] = useState(0)

  useEffect(() => {
    const currentIndex = tabBarList.findIndex(
      item => purifyRoute(router.path!) === purifyRoute(item.pagePath)
    )

    setSelected(currentIndex)
  }, [])

  useEffect(() => {
    const handleThemeChange = (theme: ThemeType) => {
      setThemeType(theme)
    }

    emitter.on('themeChange', handleThemeChange)
    return () => {
      emitter.off('themeChange', handleThemeChange)
    }
  }, [])

  const isDark = useMemo(() => themeType === 'dark', [themeType])

  return (
    <CoverView className={classNames(styles['tab-bar'], isDark && styles.dark)}>
      {tabBarList.map((item, index) => {
        const iconPath = `/${selected === index ? item.selectedIconPath : item.iconPath}`
        return (
          <CoverView
            key={index}
            className={classNames(styles['tab-bar-item'], selected === index && styles.active)}
            onClick={() => router.switchTab({ url: item.pagePath })}
          >
            {!isDark &&
              (process.env.TARO_ENV === 'h5' ? (
                <IconFont name={item.iconName as IconNames} />
              ) : (
                <CoverImage src={iconPath} />
              ))}
            <CoverView className={styles.text}>{item.text}</CoverView>
          </CoverView>
        )
      })}
    </CoverView>
  )
}

export default TabBar
