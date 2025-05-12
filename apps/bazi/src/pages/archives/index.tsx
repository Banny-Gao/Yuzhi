import { Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'

import { PageWrapper } from '@/components'

import './index.less'

export const pageMeta = {
  title: '档案',
  requiresAuth: true,
  requiresPermission: ' general',
}

export default function Archives() {
  useLoad(() => {
    console.log('档案')
  })

  return (
    <PageWrapper>
      <Text>档案</Text>
    </PageWrapper>
  )
}
