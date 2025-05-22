import React, { ReactNode, Suspense, lazy, Fragment, useState, useEffect, useCallback } from 'react'
import { View } from '@tarojs/components'
import classNames from 'classnames'

import styles from './index.module.scss'

import Navbar from '@/custom-nav-bar'
import { isH5ShowTabBar } from '@/custom-tab-bar/constants'
import { ThemeSwitcher, Loading } from '@/components'
import { useTheme } from '@/contexts/ThemeContext'
import { PAGE_STACK, router } from '@/utils/router'
import { emitter } from '@/utils/emitter'
import routes, { type Route } from '@/generated.routes'

interface PageWrapperProps {
  children: ReactNode | ReactNode[]
  className?: string
  contentClassName?: string
  style?: React.CSSProperties
  contentStyle?: React.CSSProperties
  showNavbar?: boolean
  showTabBar?: boolean
  showThemeSwitcher?: boolean
}

const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  className = '',
  contentClassName = '',
  style,
  contentStyle,
  showNavbar = true,
  showTabBar = true,
  showThemeSwitcher = true,
}) => {
  const [currentRoute, setCurrentRoute] = useState<Route | null>(null)

  const onRouteChange = useCallback(() => {
    const currentRouteKey = Object.keys(routes).find(key => router.path?.includes(routes[key].path))
    const routeObj = currentRouteKey ? routes[currentRouteKey] : null

    setCurrentRoute(routeObj)
  }, [])

  useEffect(() => {
    // 初始化时执行一次
    onRouteChange()

    // 注册路由变化监听
    emitter.on('routeChange', onRouteChange)

    // 清理函数
    return () => {
      emitter.off('routeChange', onRouteChange)
    }
  }, [])

  const { themeType } = useTheme()

  const DynamicTabBar = isH5ShowTabBar(router.path) ? lazy(() => import('@/custom-tab-bar')) : Fragment

  return (
    <View className={classNames(styles.page, className, `theme-${themeType}`)} style={style}>
      {showNavbar && (
        <Navbar
          title={currentRoute?.meta.title}
          back={PAGE_STACK.length > 1}
          home={!isH5ShowTabBar(router.path) && currentRoute?.meta.homeButton}
        />
      )}

      <View className={`${styles.content} ${contentClassName}`} style={contentStyle}>
        {children}
      </View>

      {showThemeSwitcher && <ThemeSwitcher />}
      <Loading />

      {showTabBar && (
        <Suspense fallback={null}>
          <DynamicTabBar />
        </Suspense>
      )}
    </View>
  )
}

export default PageWrapper
