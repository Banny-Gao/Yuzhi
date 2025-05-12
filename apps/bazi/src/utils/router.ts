import { navigateTo, navigateBack, redirectTo, switchTab } from '@tarojs/taro'

import { STORAGE_KEYS, getStorage, setStorage } from './storage'
import { emitter } from './emitter'
import { default as routes, authRequiredPages, pages } from '@/generated.routes'
import { isTabBarPath } from '@/custom-tab-bar/constants'

interface EventChannel {
  emit(eventName: string, ...args: any): void
  on(eventName: string, fn: TaroGeneral.EventCallback): void
  once(eventName: string, fn: TaroGeneral.EventCallback): void
  off(eventName: string, fn: TaroGeneral.EventCallback): void
}

type NavigateToOption = {
  url?: string
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

export const purifyRoute = (route: string) => {
  // 去掉 route 开头的斜杠以便与 rs 数组元素进行比较
  const normalizedRoute = route.startsWith('/') ? route.substring(1) : route
  // 去掉 normalizedRoute 后的参数
  const normalizedRouteWithoutParams = normalizedRoute.split('?')[0]
  return normalizedRouteWithoutParams
}

export const fixedRouteInclude = (rs: string[], route?: string) =>
  route && rs.some(r => purifyRoute(r) === purifyRoute(route))

const checkAuthorized = (route?: string) => {
  const token = getStorage(STORAGE_KEYS.TOKEN)

  if (!token && fixedRouteInclude(authRequiredPages, route)) {
    PAGE_STACK.splice(0, PAGE_STACK.length, `/${routes.login.path}`)

    return
  }

  // 当前在登录页并且是已登录，跳转首页
  if (token && fixedRouteInclude([routes.login.path], route)) {
    PAGE_STACK.splice(0, PAGE_STACK.length, `/${routes.index.path}`)

    return
  }
}

const checkExisted = (route?: string) =>
  route && !fixedRouteInclude(pages, route) && PAGE_STACK.push(`/${routes.notFound.path}`)

export const withRouteGuard = async (route?: string, type?: string, option?: NavigateToOption) => {
  try {
    checkAuthorized(route)
    checkExisted(route)

    switch (type) {
      case 'navigateTo':
        route && PAGE_STACK.push(route)
        break
      case 'redirectTo':
        route && PAGE_STACK.pop()
        route && PAGE_STACK.push(route)
        break
      case 'switchTab':
        route && PAGE_STACK.splice(0, PAGE_STACK.length, route)
        break
      case 'navigateBack':
        PAGE_STACK.pop()
        break
    }

    emitter.emit('routeChange', type, route)

    const currentRoute = PAGE_STACK[PAGE_STACK.length - 1]

    if (isTabBarPath(currentRoute)) {
      switchTab({ ...option, url: currentRoute })
      return
    }

    redirectTo({ ...option, url: currentRoute })
  } finally {
    setStorage(STORAGE_KEYS.PAGES_STACK, PAGE_STACK)
  }
}

export const router = new Proxy<{
  path?: string
  navigateTo: (option: NavigateToOption) => Promise<any>
  redirectTo: (option: NavigateToOption) => Promise<any>
  switchTab: (option: NavigateToOption) => Promise<any>
  navigateBack: (option?: NavigateToOption) => Promise<any>
}>(
  {
    path: void 0,
    navigateTo,
    redirectTo,
    switchTab,
    navigateBack,
  },
  {
    get(_, prop: RouterProps) {
      switch (prop) {
        case 'path':
          return PAGE_STACK[PAGE_STACK.length - 1]
        default:
          return async (option?: NavigateToOption) => {
            const fixedUrl =
              option?.url && !option.url.startsWith('/') ? `/${option?.url}` : option?.url

            await withRouteGuard(fixedUrl, prop, {
              ...option,
              url: fixedUrl,
            })
          }
      }
    },
  }
)

// 导出常用的路由方法
export const goTo = {
  home: () => router.switchTab({ url: routes.index.path }),
  login: () => router.redirectTo({ url: routes.login.path }),
  notFound: () => router.redirectTo({ url: routes.notFound.path }),
}
