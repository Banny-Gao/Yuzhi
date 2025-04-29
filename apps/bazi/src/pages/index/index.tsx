import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'

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
    <View className="index">
      <Text>Hello world!</Text>
    </View>
  )
}

export default Index
