import { useEffect, useState } from 'react'
import classNames from 'classnames'
import { CoverView, CoverImage } from '@tarojs/components'

import { tabBarList } from './constants'
import styles from './index.module.less'

import { router } from '@/utils/router'
import { IconFont, type IconNames } from '@/components'

const TabBar = () => {
  const [selected, setSelected] = useState(0)

  useEffect(() => {
    const currentIndex = tabBarList.findIndex(item => router.path.includes(item.pagePath))

    setSelected(currentIndex)
  }, [])

  return (
    <CoverView className={styles['tab-bar']}>
      {tabBarList.map((item, index) => {
        const iconPath = `/${selected === index ? item.selectedIconPath : item.iconPath}`
        return (
          <CoverView
            key={index}
            className={classNames(styles['tab-bar-item'], selected === index && styles.active)}
            onClick={() => router.switchTab({ url: item.pagePath })}
          >
            {process.env.TARO_ENV === 'h5' ? (
              <IconFont name={item.iconName as IconNames} />
            ) : (
              <CoverImage src={iconPath} />
            )}
            <CoverView>{item.text}</CoverView>
          </CoverView>
        )
      })}
    </CoverView>
  )
}

export default TabBar
