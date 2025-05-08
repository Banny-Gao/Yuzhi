import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.less'

export const pageMeta = {
  title: '档案',
  requiresAuth: true,
  requiresPermission: ' general',
}

export default function Archives() {
  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <View className="archives">
      <Text>Hello world!</Text>
    </View>
  )
}
