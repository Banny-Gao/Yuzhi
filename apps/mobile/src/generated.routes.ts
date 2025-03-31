/**
 * 自动生成的路由配置
 * 请勿手动修改此文件，修改将在下次生成时被覆盖
 */

const routes = {
  "forbidden": {
    "path": "/pages/forbidden/index",
    "meta": {
      "title": "无权限中转页面",
      "requiresAuth": true
    }
  },
  "index": {
    "path": "/pages/index/index",
    "meta": {
      "title": "首页",
      "requiresAuth": true
    }
  },
  "login": {
    "path": "/pages/login/index",
    "meta": {
      "title": "登录页面",
      "requiresAuth": false
    }
  },
  "notFound": {
    "path": "/pages/notFound/index",
    "meta": {
      "title": "notFound",
      "requiresAuth": false,
      "requiresPermission": " general"
    }
  },
  "owner": {
    "path": "/pages/owner/index",
    "meta": {
      "title": "个人中心",
      "requiresAuth": true
    }
  },
  "toggleTheme": {
    "path": "/pages/toggleTheme/index",
    "meta": {
      "title": "主题切换",
      "requiresAuth": false,
      "requiresPermission": "more"
    }
  }
}

export default routes

export const pages = Object.keys(routes).map(key => routes[key].path)

export const authRequiredPages = Object.keys(routes)
  .filter(key => routes[key].meta.requiresAuth)
  .map(key => routes[key].path)

