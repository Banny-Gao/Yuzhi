import { PropsWithChildren } from 'react'
import { useLaunch } from '@tarojs/taro'
import { setupRequest } from '@/utils/request'

import './app.less'

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log('App launched.')
    setupRequest()
  })

  // children 是将要会渲染的页面
  return children
}

export default App
