import { PropsWithChildren } from 'react'
import { useLaunch, useRouter } from '@tarojs/taro'

import { setupRequest } from '@/utils/request/request'
import { withRouteGuard, router } from '@/utils/router'
import { ThemeProvider } from '@/contexts/ThemeContext'

import 'taro-ui/dist/style/index.scss'
import './app.scss'

const App = ({ children }: PropsWithChildren<any>) => {
  const taroRouter = useRouter()

  useLaunch(async () => {
    setupRequest()
    withRouteGuard(router.path ?? taroRouter.path)
  })

  return <ThemeProvider useSeasonalThemeByDefault>{children}</ThemeProvider>
}

export default App
