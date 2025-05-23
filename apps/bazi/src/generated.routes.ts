/**
 * 自动生成的路由配置
 * 请勿手动修改此文件，修改将在下次生成时被覆盖
 */

export type Route = {
  path: string
  meta: {
    title?: string
    requiresAuth?: boolean
    requiresPermission?: string
    homeButton?: boolean
  }
}


const routes = {
  "archives": {
    "path": "pages/archives/index",
    "meta": {
      "title": "档案",
      "requiresAuth": true,
      "requiresPermission": " general"
    }
  },
  "forbidden": {
    "path": "pages/forbidden/index",
    "meta": {
      "title": "暂无权限",
      "requiresAuth": true
    }
  },
  "index": {
    "path": "pages/index/index",
    "meta": {
      "title": "排盘",
      "requiresAuth": true
    }
  },
  "login": {
    "path": "pages/login/index",
    "meta": {
      "requiresAuth": false
    }
  },
  "notFound": {
    "path": "pages/notFound/index",
    "meta": {
      "title": "页面不存在",
      "requiresAuth": false,
      "requiresPermission": "general"
    }
  },
  "owner": {
    "path": "pages/owner/index",
    "meta": {
      "title": "个人中心",
      "requiresAuth": true
    }
  }
}

export default routes

export const pages = Object.keys(routes).map(key => routes[key].path)

export const authRequiredPages = Object.keys(routes)
  .filter(key => routes[key].meta.requiresAuth)
  .map(key => routes[key].path)

