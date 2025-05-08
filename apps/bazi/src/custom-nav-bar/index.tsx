import { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { AtIcon } from 'taro-ui'

import styles from './index.module.less'

import { getNavbarInfo } from '@/utils/util'
import routes from '@/generated.routes'

interface Props {
  title?: string
  back?: boolean
  home?: boolean
  onBack?: () => void
  onHome?: () => void
  renderLeft?: React.ReactNode
  renderRight?: React.ReactNode
  renderCenter?: React.ReactNode
}

interface NavBarState {
  statusBarHeight: number
  navBarHeight: number
  menuButtonHeight: number
  menuButtonTop: number
  menuButtonWidth: number
  windowWidth: number
}

const Navbar: React.FC<Props> = ({
  title = '',
  back = false,
  home = false,
  onBack,
  onHome,
  renderLeft,
  renderRight,
  renderCenter,
}) => {
  const [state, setState] = useState<NavBarState>({
    statusBarHeight: 0,
    navBarHeight: 0,
    menuButtonHeight: 0,
    menuButtonTop: 0,
    menuButtonWidth: 0,
    windowWidth: 0,
  })

  useEffect(() => {
    setState(getNavbarInfo())
  }, [])

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      Taro.navigateBack()
    }
  }

  const handleHome = () => {
    if (onHome) {
      onHome()
    } else {
      Taro.switchTab({
        url: routes.index.path,
      })
    }
  }

  const { statusBarHeight, navBarHeight, menuButtonWidth, windowWidth } = state

  // 计算胶囊按钮位置
  const rightDistance = windowWidth - menuButtonWidth - 10
  const leftWidth = windowWidth - menuButtonWidth - 10

  return (
    <View
      className={styles.navbar}
      style={{
        paddingTop: `${statusBarHeight}px`,
      }}
    >
      <View
        className={styles.navbar__inner}
        style={{
          height: `${navBarHeight - statusBarHeight}px`,
          paddingRight: `${leftWidth}px`,
        }}
      >
        <View className={styles.navbar__left}>
          {back && !home && (
            <View className={styles.navbar__button} onClick={handleBack}>
              <AtIcon prefixClass={styles.icon} value="chevron-left" size={12} />
            </View>
          )}
          {!back && home && (
            <View className={styles.navbar__button} onClick={handleHome}>
              <AtIcon value="home" size={12} />
            </View>
          )}
          {back && home && (
            <View className={styles.navbar__buttons}>
              <View className={styles.navbar__button} onClick={handleBack}>
                <AtIcon value="chevron-left" size={12} />
              </View>
              <View className={styles.navbar__button} onClick={handleHome}>
                <AtIcon value="home" size={12} />
              </View>
            </View>
          )}
          {!back && !home && renderLeft}
        </View>

        <View className={styles.navbar__center}>{title ? <Text>{title}</Text> : renderCenter}</View>

        <View className={styles.navbar__right} style={{ marginRight: `${rightDistance}px` }}>
          {renderRight}
        </View>
      </View>
    </View>
  )
}

export default Navbar
