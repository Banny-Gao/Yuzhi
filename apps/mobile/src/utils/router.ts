import { navigateTo, navigateBack, redirectTo, getStorageSync } from '@tarojs/taro'
import { AppError } from '@/utils/error'

import { default as routes, authRequiredPages, pages } from '@/generated.routes'

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

const checkAuthorized = (route: string) =>
  new Promise((resolve, reject) => {
    const token = getStorageSync('token')

    if (!token && authRequiredPages.includes(route)) {
      navigateTo({ url: routes.login.path })

      return reject(new AppError('未登录'))
    }

    resolve(true)
  })

const checkExisted = (route: string) =>
  new Promise((resolve, reject) => {
    if (!pages.includes(route)) {
      navigateTo({ url: routes.notFound.path })
      reject(new AppError('页面不存在'))
    }

    resolve(true)
  })

export const withRouteGuard = async (route: string, callback?: () => Promise<void>) => {
  await checkAuthorized(route)
  await checkExisted(route)

  return callback?.()
}

export const router = new Proxy(
  {
    navigateTo,
    navigateBack,
    redirectTo,
  },
  {
    get(target, prop) {
      return async (option: NavigateToOption) => {
        return await withRouteGuard(option.url, () => target[prop](option))
      }
    },
  }
)
