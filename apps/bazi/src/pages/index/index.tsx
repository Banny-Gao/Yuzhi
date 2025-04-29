import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'

import { PageWrapper } from '@/components'

import './index.less'

export const pageMeta = {
  title: '排盘',
  requiresAuth: true,
}

const Index = () => {
  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <PageWrapper>
      <Text>Hello world!</Text>
    </PageWrapper>
  )
}

export default Index
