import { useGlobalIconFont } from './components/iconfont/helper'

import { default as routes, pages } from './generated.routes'
import { tabBarList } from './custom-tab-bar/constants'

export default defineAppConfig({
  pages,
  entryPagePath: routes.index.path,
  style: 'v2',
  window: {
    navigationStyle: 'custom',
  },
  requiredPrivateInfos: ['getLocation'],
  permission: {
    'scope.userLocation': {
      desc: '你的位置信息将用于小程序位置接口的效果展示',
    },
  },
  tabBar: {
    custom: true,
    list: tabBarList.map(item => ({
      pagePath: item.pagePath,
      text: item.text,
      iconPath: item.iconPath,
      selectedIconPath: item.selectedIconPath,
    })),
    color: '#707070',
    selectedColor: '#2c2c2c',
    backgroundColor: '#ffffff',
    borderStyle: undefined,
  },
  usingComponents: {
    ...useGlobalIconFont(),
  },
})
