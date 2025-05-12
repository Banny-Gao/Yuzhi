import React, { useEffect, useState } from 'react'
import { View } from '@tarojs/components'

import { loadingManager } from './manager'
import { useTheme } from '@/contexts/ThemeContext'

import styles from './index.module.less'

interface LoadingProps {
  show?: boolean
  size?: number
}

// 请求计数器类，用于管理多个请求时的Loading状态

const Loading: React.FC<LoadingProps> = () => {
  const { themeType } = useTheme()
  const [shouldShow, setShouldShow] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const duration = 1000

  useEffect(() => {
    shouldShow
      ? !isVisible && setIsVisible(shouldShow)
      : isVisible &&
        setTimeout(() => {
          setIsVisible(false)
        }, duration)
  }, [shouldShow])

  // 使用LoadingManager控制组件状态
  useEffect(() => {
    loadingManager.registerCallback(async show => {
      setShouldShow(show)
      if (!show) await new Promise(resolve => setTimeout(resolve, duration))
    })

    return () => {
      loadingManager.unregisterCallback()
    }
  }, [])

  // 组装容器类名
  const containerClassName = [
    styles.container,
    shouldShow ? styles.fadeIn : styles.fadeOut,
    styles[themeType],
  ]
    .filter(Boolean)
    .join(' ')
  const length = 6
  const delay = 0.1

  return isVisible ? (
    <View className={containerClassName}>
      <View className={styles.loadingWrapper}>
        {Array.from({ length }).map((_, index) => {
          const size = (index + 1) * 0.68 * 18
          const padding = 50 - size / 2

          return (
            <View
              key={index}
              className={styles.object}
              style={{
                animationDelay: `${(index + 1) * delay}s`,
                left: `${padding}%`,
                top: `${padding}%`,
                width: `${size}%`,
                height: `${size}%`,
              }}
            />
          )
        })}
      </View>
    </View>
  ) : null
}

export default Loading
