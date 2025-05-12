import { Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'

import { PageWrapper, Button } from '@/components'
import { router } from '@/utils/router'
import routes from '@/generated.routes'

import './index.module.less'

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
      <Text>排盘</Text>
      <Button onClick={() => router.navigateTo({ url: routes.notFound.path })}>To Not Found</Button>
      <Button onClick={() => router.navigateTo({ url: routes.forbidden.path })}>
        To Forbidden
      </Button>
    </PageWrapper>
  )
}

export default Index
