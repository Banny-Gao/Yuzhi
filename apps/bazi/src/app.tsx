import { PropsWithChildren } from 'react'
import { useLaunch, useRouter } from '@tarojs/taro'

import { setupRequest } from '@/utils/request/request'
import { withRouteGuard } from '@/utils/router'
import { ThemeProvider } from '@/contexts/ThemeContext'

import './app.less'
import 'taro-ui/dist/style/index.scss'

const App = ({ children }: PropsWithChildren<any>) => {
  const router = useRouter()

  useLaunch(() => {
    setupRequest()
    withRouteGuard(router.path)
  })

  return <ThemeProvider useSeasonalThemeByDefault>{children}</ThemeProvider>
}

export default App
