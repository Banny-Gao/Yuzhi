import React, { ReactNode, useEffect, useState } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'

import { View } from '@tarojs/components'
import routes from '@/generated.routes'

import { ThemeSwitcher, Loading } from '@/components'

import styles from './index.module.less'

interface PageWrapperProps {
  children: ReactNode | ReactNode[]
  className?: string
  contentClassName?: string
  style?: React.CSSProperties
  contentStyle?: React.CSSProperties
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children, className = '', contentClassName = '', style, contentStyle }) => {
  const [showBack, setShowBack] = useState(false)
  const [pageTitle, setPageTitle] = useState('')

  useEffect(() => {
    const instance = getCurrentInstance()
    const currentPath = instance.router?.path || ''

    // 设置页面标题
    const routeKey = Object.keys(routes).find(key => routes[key].path === currentPath)
    if (routeKey) {
      setPageTitle(routes[routeKey].meta.title)
    }

    // 判断是否显示返回按钮
    const pages = Taro.getCurrentPages()
    setShowBack(pages.length > 1)
  }, [])

  return (
    <View className={`${styles.page} ${className}`} style={style}>
      {/* NavBar */}

      {/* Content */}
      <View className={`${styles.content} ${contentClassName}`} style={contentStyle}>
        {children}
      </View>

      <ThemeSwitcher />
      <Loading />
    </View>
  )
}

export default PageWrapper
