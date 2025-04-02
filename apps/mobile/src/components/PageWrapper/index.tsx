import React, { ReactNode, useEffect, useState } from 'react'
import Taro, { getCurrentInstance, useRouter, navigateBack, navigateTo } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import styles from './index.module.less'
import routes from '@/generated.routes'

interface PageWrapperProps {
  children: ReactNode
  className?: string
  contentClassName?: string
  style?: React.CSSProperties
  contentStyle?: React.CSSProperties
}

// TabBar配置
const tabbarList = [
  {
    pagePath: '/pages/index/index',
    text: '排盘',
    iconPath: '/assets/icons/home.png',
    selectedIconPath: '/assets/icons/home-active.png',
  },
  {
    pagePath: '/pages/archives/index',
    text: '档案',
    iconPath: '/assets/icons/archives.png',
    selectedIconPath: '/assets/icons/archives-active.png',
  },
  {
    pagePath: '/pages/owner/index',
    text: '我的',
    iconPath: '/assets/icons/user.png',
    selectedIconPath: '/assets/icons/user-active.png',
  },
]

const PageWrapper: React.FC<PageWrapperProps> = ({ children, className = '', contentClassName = '', style, contentStyle }) => {
  const router = useRouter()
  const [showBack, setShowBack] = useState(false)
  const [pageTitle, setPageTitle] = useState('')
  const [isTabBar, setIsTabBar] = useState(false)

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

    // 判断是否在tabbar中
    setIsTabBar(tabbarList.some(tab => tab.pagePath === currentPath))
  }, [])

  const handleBack = () => {
    navigateBack()
  }

  return (
    <View className={`${styles.page} ${className}`} style={style}>
      {/* NavBar */}
      <View className={styles.navbar}>
        {showBack && (
          <View className={styles.backButton} onClick={handleBack}>
            <Text className={styles.backIcon}>←</Text>
          </View>
        )}
        <Text className={styles.title}>{pageTitle}</Text>
      </View>

      {/* Content */}
      <View className={`${styles.content} ${contentClassName}`} style={contentStyle}>
        {children}
      </View>

      {/* TabBar */}
      {isTabBar && (
        <View className={styles.tabbar}>
          {tabbarList.map(tab => (
            <View
              key={tab.pagePath}
              className={`${styles.tabbarItem} ${router.path === tab.pagePath ? styles.active : ''}`}
              onClick={() => navigateTo({ url: tab.pagePath })}
            >
              <Image className={styles.tabbarIcon} src={router.path === tab.pagePath ? tab.selectedIconPath : tab.iconPath} />
              <Text className={styles.tabbarText}>{tab.text}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}

export default PageWrapper
