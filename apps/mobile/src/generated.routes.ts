/**
 * 自动生成的路由配置
 * 请勿手动修改此文件，修改将在下次生成时被覆盖
 */

const routes = {
  index: {
    path: 'pages/index/index',
    meta: {},
  },
  login: {
    path: 'pages/login/index',
    meta: {
      title: '登录页面',
      requiresAuth: false,
    },
  },
  owner: {
    path: 'pages/owner/index',
    meta: {
      title: '个人中心',
      requiresAuth: true,
    },
  },
}

export default routes

export const pages = Object.keys(routes).map(key => routes[key].path)

export const authRequiredPages = Object.keys(routes)
  .filter(key => routes[key].meta.requiresAuth)
  .map(key => routes[key].path)
