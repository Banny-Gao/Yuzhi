import React, { ReactNode } from 'react'

import { View } from '@tarojs/components'

import TabBar from '@/custom-tab-bar'
import Navbar from '@/custom-navbar'
import { isH5ShowTabBar } from '@/custom-tab-bar/constants'

import { ThemeSwitcher, Loading } from '@/components'
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

const PageWrapper: React.FC<PageWrapperProps> = ({ children, className = '', contentClassName = '', style, contentStyle }) => {
  const currentRouteKey = Object.keys(routes).find(key => router.path.includes(routes[key].path))
  const currentRoute = currentRouteKey ? routes[currentRouteKey] : null

  return (
    <View className={`${styles.page} ${className}`} style={style}>
      {/* NavBar */}
      {currentRoute?.meta?.title && (
        <Navbar title={currentRoute.meta.title} back={PAGE_STACK.length > 1} home={!isH5ShowTabBar(router.path) && PAGE_STACK.length === 1} />
      )}
      {/* Content */}
      <View className={`${styles.content} ${contentClassName}`} style={contentStyle}>
        {children}
      </View>

      <ThemeSwitcher />
      <Loading />

      {isH5ShowTabBar(router.path) && <TabBar />}
    </View>
  )
}

export default PageWrapper
