import { navigateTo, navigateBack, redirectTo, switchTab } from '@tarojs/taro'
import { AppError } from '@/utils/request/error'

import { default as routes, authRequiredPages, pages } from '@/generated.routes'
import { STORAGE_KEYS, getStorage, setStorage } from '@/utils/storage'
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

type RouterProps = 'path' | 'navigateTo' | 'redirectTo' | 'switchTab' | 'navigateBack'
export const PAGE_STACK: string[] = getStorage(STORAGE_KEYS.PAGES_STACK) || []

export const fixedRouteInclude = (rs: string[], route: string) => {
  /* route 一般以 / 开头
   *  rs 中不会以 / 开头，
   * 如 route 为  /pages/index/index， rs 为 ['pages/index/index', 'pages/login/index']， 怎认为 route 在 rs 中
   **/

  // 去掉 route 开头的斜杠以便与 rs 数组元素进行比较
  const normalizedRoute = route.startsWith('/') ? route.substring(1) : route
  // 去掉 normalizedRoute 后的参数
  const normalizedRouteWithoutParams = normalizedRoute.split('?')[0]

  return rs.some(r => r === normalizedRouteWithoutParams)
}

const checkAuthorized = (route: string) =>
  new Promise((resolve, reject) => {
    const token = getStorage(STORAGE_KEYS.TOKEN)

    if (!token && fixedRouteInclude(authRequiredPages, route)) {
      redirectTo({ url: `/${routes.login.path}` })
      PAGE_STACK.splice(0, PAGE_STACK.length, routes.login.path)

      return reject(new AppError('未登录'))
    }

    // 当前在登录页并且是已登录，跳转首页
    if (route === routes.login.path && token) {
      redirectTo({ url: `/${routes.index.path}` })
      PAGE_STACK.splice(0, PAGE_STACK.length, routes.index.path)

      return reject(new AppError('已登录'))
    }

    return resolve(true)
  })

const checkExisted = (route: string) =>
  new Promise((resolve, reject) => {
    if (!fixedRouteInclude(pages, route)) {
      redirectTo({ url: `/${routes.notFound.path}` })
      PAGE_STACK.push(routes.notFound.path)

      return reject(new AppError('页面不存在'))
    }

    return resolve(true)
  })

export const withRouteGuard = async (
  route: string,
  callback?: () => Promise<any>,
  type?: string
) => {
  try {
    await checkAuthorized(route)
    await checkExisted(route)

    switch (type) {
      case 'navigateTo':
        PAGE_STACK.push(route)
        break
      case 'redirectTo':
        PAGE_STACK.pop()
        PAGE_STACK.push(route)
        break
      case 'switchTab':
        PAGE_STACK.splice(0, PAGE_STACK.length, route)
        break
      case 'navigateBack':
        PAGE_STACK.pop()
        break
    }

    return callback?.()
  } finally {
    setStorage(STORAGE_KEYS.PAGES_STACK, PAGE_STACK)
  }
}

export const router = new Proxy(
  {
    path: '',
    navigateTo,
    redirectTo,
    switchTab,
    navigateBack,
  },
  {
    get(target, prop: RouterProps) {
      switch (prop) {
        case 'path':
          return PAGE_STACK[PAGE_STACK.length - 1]
        default:
          return async (option: NavigateToOption) => {
            await withRouteGuard(option.url, () => target[prop](option), prop)
          }
      }
    },
  }
)

// 导出常用的路由方法
export const goTo = {
  home: () => router.switchTab({ url: `/${routes.index.path}` }),
  login: () => router.redirectTo({ url: `/${routes.login.path}` }),
  notFound: () => router.redirectTo({ url: `/${routes.notFound.path}` }),
}
