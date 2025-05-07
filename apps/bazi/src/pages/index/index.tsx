import { View, Text, Image } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'

import { PageWrapper } from '@/components'
import userImg from '@/assets/images/user.png'

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
      <Image src={userImg} />
    </PageWrapper>
  )
}

export default Index
