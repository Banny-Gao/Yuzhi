import { PropsWithChildren, useRef } from 'react'
import { useLaunch, useRouter, useError, useReady, nextTick } from '@tarojs/taro'

import { setupRequest } from '@/utils/request'
import { withRouteGuard } from '@/utils/router'
import { ThemeProvider } from '@/contexts/ThemeContext'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import { LoadingContainer } from './components'

import './app.less'

const App = ({ children }: PropsWithChildren<any>) => {
  const router = useRouter()
  const loadingRef = useRef<{ initialize: () => void }>(null)

  useLaunch(() => {
    setupRequest()
    withRouteGuard(router.path)
  })

  useError(error => {
    console.log(error)
  })

  useReady(() => {
    nextTick(() => {
      loadingRef.current?.initialize()
    })
  })

  return (
    <ThemeProvider useSeasonalThemeByDefault>
      {children}
      <ThemeSwitcher />
      <LoadingContainer ref={loadingRef} />
    </ThemeProvider>
  )
}

export default App
