import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.less'

export const pageMeta = {
  title: '个人中心',
  requiresAuth: true,
};


export default function Owner () {
  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <View className='owner'>
      <Text>Hello world!</Text>
    </View>
  )
}
