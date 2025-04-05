import { default as routes } from '@/generated.routes'

export const tabBarList = [
  {
    pagePath: routes.index.path,
    text: routes.index.meta.title,
    // iconPath: 'assets/icons/bagua.svg',
    iconName: 'icon-bagua',
  },
  {
    pagePath: routes.archives.path,
    text: routes.archives.meta.title,
    // iconPath: 'assets/icons/archives.svg',
    iconName: 'icon-danganguanli',
  },
  {
    pagePath: routes.owner.path,
    text: routes.owner.meta.title,
    // iconPath: 'assets/icons/user.svg',
    iconName: 'icon-wode',
  },
]
