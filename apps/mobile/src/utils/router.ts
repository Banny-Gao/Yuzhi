import { navigateTo, navigateBack, redirectTo, getStorageSync, switchTab } from '@tarojs/taro'
import { AppError } from '@/utils/error'

import { default as routes, authRequiredPages, pages } from '@/generated.routes'
import { STORAGE_KEYS } from '@/utils/storage'
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

type RouterMethod = 'navigateTo' | 'redirectTo' | 'switchTab' | 'navigateBack'

const checkAuthorized = (route: string) =>
  new Promise((resolve, reject) => {
    const token = getStorageSync(STORAGE_KEYS.TOKEN)

    if (!token && authRequiredPages.includes(route)) {
      redirectTo({ url: routes.login.path })
      return reject(new AppError('未登录'))
    }

    // 当前在登录页并且是已登录，跳转首页
    if (route === routes.login.path && token) {
      redirectTo({ url: routes.index.path })
    }

    resolve(true)
  })

const checkExisted = (route: string) =>
  new Promise((resolve, reject) => {
    if (!pages.includes(route)) {
      redirectTo({ url: routes.notFound.path })
      reject(new AppError('页面不存在'))
    }
    resolve(true)
  })

export const withRouteGuard = async (route: string, callback?: () => Promise<any>) => {
  await checkAuthorized(route)
  await checkExisted(route)
  return callback?.()
}

export const router = new Proxy(
  {
    navigateTo,
    redirectTo,
    switchTab,
    navigateBack,
  },
  {
    get(target, prop: RouterMethod) {
      if (prop === 'navigateBack') {
        return target[prop]
      }

      return async (option: NavigateToOption) => {
        return await withRouteGuard(option.url, () => target[prop](option))
      }
    },
  }
)

// 导出常用的路由方法
export const goTo = {
  home: () => router.redirectTo({ url: routes.index.path }),
  login: () => router.redirectTo({ url: routes.login.path }),
  notFound: () => router.redirectTo({ url: routes.notFound.path }),
  back: () => router.navigateBack(),
}
