import { default as routes } from '@/generated.routes'

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
    iconName: 'icon-danganguanli',
  },
  {
    pagePath: routes.owner.path,
    text: routes.owner.meta.title,
    iconPath: 'images/user_gray.png',
    selectedIconPath: 'images/user.png',
    iconName: 'icon-wode',
  },
]
