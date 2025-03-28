import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.less'

export const pageMeta = {
  title: '登录页面',
  requiresAuth: false,
};


export default function Login () {
  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <View className='login'>
      <Text>Hello world!</Text>
    </View>
  )
}
