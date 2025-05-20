import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'

import { PageWrapper } from '@/components'
import { goTo } from '@/utils/router'

import styles from './index.module.scss'

export const pageMeta = {
  title: '页面不存在',
  requiresAuth: false,
  requiresPermission: 'general',
}

export default function NotFound() {
  useLoad(() => {
    console.log('Page loaded.')
  })

  const handleBackToHome = () => {
    goTo.home()
  }

  return (
    <PageWrapper>
      <View className={styles.notFoundContainer}>
        <View className={styles.iconContainer}>
          <Text className={styles.errorCode}>404</Text>
        </View>

        <Text className={styles.title}>页面不存在</Text>
        <Text className={styles.description}>很抱歉，您访问的页面不存在或已被删除</Text>

        <View className={styles.actionContainer}>
          <View className={styles.backButton} onClick={handleBackToHome}>
            返回首页
          </View>
        </View>
      </View>
    </PageWrapper>
  )
}
