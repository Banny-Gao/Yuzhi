import { PropsWithChildren } from 'react'
import { useLaunch, useRouter, useError } from '@tarojs/taro'

import { setupRequest } from '@/utils/request'
import { withRouteGuard } from '@/utils/router'
import { ThemeProvider } from '@/contexts/ThemeContext'

import './app.less'

const App = ({ children }: PropsWithChildren<any>) => {
  const router = useRouter()

  useLaunch(() => {
    setupRequest()
    withRouteGuard(router.path)
  })

  useError(error => {
    console.log(error)
  })

  return <ThemeProvider useSeasonalThemeByDefault>{children}</ThemeProvider>
}

export default App
