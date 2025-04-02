import { PropsWithChildren, useEffect } from 'react'
import { useLaunch, useRouter, useError, getCurrentInstance } from '@tarojs/taro'

import { setupRequest } from '@/utils/request'
import { withRouteGuard } from '@/utils/router'
import { ThemeProvider } from '@/contexts/ThemeContext'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import { PageWrapper } from '@/components'

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

  return (
    <ThemeProvider useSeasonalThemeByDefault>
      <PageWrapper>{children}</PageWrapper>
      <ThemeSwitcher />
    </ThemeProvider>
  )
}

export default App
