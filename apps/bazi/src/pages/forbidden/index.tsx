import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'

import { PageWrapper } from '@/components'
import { goTo } from '@/utils/router'

import styles from './index.module.scss'

export const pageMeta = {
  title: '暂无权限',
  requiresAuth: true,
}

export default function Forbidden() {
  useLoad(() => {
    console.log('Page loaded.')
  })

  const handleBackToHome = () => {
    goTo.home()
  }

  return (
    <PageWrapper>
      <View className={styles.forbiddenContainer}>
        <View className={styles.iconContainer}>
          <Text className={styles.errorCode}>403</Text>
        </View>

        <Text className={styles.title}>暂无权限</Text>
        <Text className={styles.description}>很抱歉，您暂无权限访问此页面</Text>

        <View className={styles.actionContainer}>
          <View className={styles.backButton} onClick={handleBackToHome}>
            返回首页
          </View>
        </View>
      </View>
    </PageWrapper>
  )
}
