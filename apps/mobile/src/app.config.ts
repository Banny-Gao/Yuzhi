import { default as routes, pages } from './generated.routes'

export default defineAppConfig({
  pages,
  entryPagePath: routes.index.path,
  window: {
    navigationStyle: 'custom',
  },
  requiredPrivateInfos: ['getLocation'],
  permission: {
    'scope.userLocation': {
      desc: '你的位置信息将用于小程序位置接口的效果展示',
    },
  },
})
