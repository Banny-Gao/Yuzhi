import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.less'

export const pageMeta = {
  title: '无权限中转页面',
  requiresAuth: true,
}

export default function Forbidden() {
  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <View className="forbidden">
      <Text>Hello world!</Text>
    </View>
  )
}
