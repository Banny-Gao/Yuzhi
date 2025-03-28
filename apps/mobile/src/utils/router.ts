import { navigateTo, navigateBack, redirectTo, getStorageSync } from '@tarojs/taro'

import { default as routes, authRequiredPages } from '@/generated.routes'

interface EventChannel {
  emit(eventName: string, ...args: any): void
  on(eventName: string, fn: TaroGeneral.EventCallback): void
  once(eventName: string, fn: TaroGeneral.EventCallback): void
  off(eventName: string, fn: TaroGeneral.EventCallback): void
}

type NavigateToOption = {
  url: string
  events?: TaroGeneral.IAnyObject
  routeType?: string
  routeConfig?: TaroGeneral.IAnyObject
  routeOptions?: TaroGeneral.IAnyObject
  complete?: (res: TaroGeneral.CallbackResult) => void
  fail?: (res: TaroGeneral.CallbackResult) => void
  success?: (res: TaroGeneral.CallbackResult & { eventChannel: EventChannel }) => void
}

const detectAuth = (option: NavigateToOption) => {
  const token = getStorageSync('token')
  if (!token && authRequiredPages.includes(option.url)) {
    navigateTo({ url: routes.login.path })

    throw new Error('请先登录')
  }
}

export const router = new Proxy(
  {
    navigateTo,
    navigateBack,
    redirectTo,
  },
  {
    get(target, prop) {
      return (option: NavigateToOption) => {
        detectAuth(option)
        return target[prop](option)
      }
    },
  }
)
