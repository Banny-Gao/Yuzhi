import { default as routes } from '@/generated.routes'
import { fixedRouteInclude } from '@/utils/router'

export const tabBarList = [
  {
    pagePath: routes.index.path,
    text: routes.index.meta.title,
    iconPath: 'images/yinyang_gray.png',
    selectedIconPath: 'images/yinyang.png',
    iconName: 'icon-bagua',
  },
  {
    pagePath: routes.archives.path,
    text: routes.archives.meta.title,
    iconPath: 'images/archive_gray.png',
    selectedIconPath: 'images/archive.png',
    iconName: 'icon-record',
  },
  {
    pagePath: routes.owner.path,
    text: routes.owner.meta.title,
    iconPath: 'images/user_gray.png',
    selectedIconPath: 'images/user.png',
    iconName: 'icon-wode',
  },
]

export const isH5ShowTabBar = (currentPath: string) =>
  fixedRouteInclude(
    tabBarList.map(item => item.pagePath),
    currentPath
  ) && process.env.TARO_ENV === 'h5'
