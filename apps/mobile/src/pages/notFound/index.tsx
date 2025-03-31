import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.less'

export const pageMeta = {
  title: 'notFound',
  requiresAuth: false,
  requiresPermission: ' general',
}

export default function NotFound() {
  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <View className="notFound">
      <Text>页面不存在</Text>
    </View>
  )
}
