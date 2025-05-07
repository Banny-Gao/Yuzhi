import { default as routes } from '@/generated.routes'
import { fixedRouteInclude } from '@/utils/router'

export const tabBarList = [
  {
    pagePath: routes.index.path,
    text: routes.index.meta.title,
    iconPath: 'assets/images/yinyang_gray.png',
    selectedIconPath: 'assets/images/yinyang.png',
    iconName: 'icon-bagua',
  },
  {
    pagePath: routes.archives.path,
    text: routes.archives.meta.title,
    iconPath: 'assets/images/archive_gray.png',
    selectedIconPath: 'assets/images/archive.png',
    iconName: 'icon-record',
  },
  {
    pagePath: routes.owner.path,
    text: routes.owner.meta.title,
    iconPath: 'assets/images/user_gray.png',
    selectedIconPath: 'assets/images/user.png',
    iconName: 'icon-wode',
  },
]

export const isH5ShowTabBar = (currentPath: string) =>
  fixedRouteInclude(
    tabBarList.map(item => item.pagePath),
    currentPath
  ) && process.env.TARO_ENV === 'h5'
