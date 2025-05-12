import { Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'

import { PageWrapper } from '@/components'

import './index.less'

export const pageMeta = {
  title: '个人中心',
  requiresAuth: true,
}

export default function Owner() {
  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <PageWrapper>
      <Text>个人中心</Text>
    </PageWrapper>
  )
}
