import React, { ReactNode, Suspense, lazy, Fragment } from 'react'
import { View } from '@tarojs/components'
import classNames from 'classnames'

import Navbar from '@/custom-navbar'
import { isH5ShowTabBar } from '@/custom-tab-bar/constants'

import { ThemeSwitcher, Loading } from '@/components'
import { useTheme } from '@/contexts/ThemeContext'

import { PAGE_STACK, router } from '@/utils/router'

import routes from '@/generated.routes'

import styles from './index.module.less'
interface PageWrapperProps {
  children: ReactNode | ReactNode[]
  className?: string
  contentClassName?: string
  style?: React.CSSProperties
  contentStyle?: React.CSSProperties
}

const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  className = '',
  contentClassName = '',
  style,
  contentStyle,
}) => {
  const currentRouteKey = Object.keys(routes).find(key => router.path?.includes(routes[key].path))
  const currentRoute = currentRouteKey ? routes[currentRouteKey] : null
  const { themeType } = useTheme()

  const DynamicTabBar = isH5ShowTabBar(router.path)
    ? lazy(() => import('@/custom-tab-bar'))
    : Fragment

  return (
    <View className={classNames(styles.page, className, `theme-${themeType}`)} style={style}>
      <Navbar
        title={currentRoute?.meta.title}
        back={PAGE_STACK.length > 1}
        home={!isH5ShowTabBar(router.path) && currentRoute.meta.home}
      />

      <View className={`${styles.content} ${contentClassName}`} style={contentStyle}>
        {children}
      </View>

      <ThemeSwitcher />
      <Loading />

      <Suspense fallback={null}>{<DynamicTabBar />}</Suspense>
    </View>
  )
}

export default PageWrapper
