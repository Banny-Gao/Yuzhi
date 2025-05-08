import React, { useEffect, useState } from 'react'
import { View } from '@tarojs/components'

import styles from './index.module.less'

import { useTheme } from '@/contexts/ThemeContext'

interface LoadingProps {
  show?: boolean
  size?: number
}

// 请求计数器类，用于管理多个请求时的Loading状态
class LoadingManager {
  private static instance: LoadingManager
  private counter: number = 0
  private onChange: ((show: boolean) => void) | null = null

  private constructor() {}

  public static getInstance(): LoadingManager {
    if (!LoadingManager.instance) {
      LoadingManager.instance = new LoadingManager()
    }
    return LoadingManager.instance
  }

  // 注册状态变化回调
  public registerCallback(callback: (show: boolean) => void): void {
    this.onChange = callback
  }

  // 取消注册
  public unregisterCallback(): void {
    this.onChange = null
  }

  // 开始一个请求
  public async show(): Promise<void> {
    this.counter++
    if (this.counter === 1 && this.onChange) {
      await this.onChange(true)
    }
  }

  // 结束一个请求
  public async hide(): Promise<void> {
    if (this.counter > 0) {
      this.counter--
    }

    if (this.counter === 0 && this.onChange) {
      await this.onChange(false)
    }
  }

  // 强制重置状态，用于处理异常情况
  public async reset(): Promise<void> {
    this.counter = 0
    if (this.onChange) {
      await this.onChange(false)
    }
  }

  // 获取当前活跃请求数
  public getCount(): number {
    return this.counter
  }
}
// 导出Loading管理器单例
export const loadingManager = LoadingManager.getInstance()

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
