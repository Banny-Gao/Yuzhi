import { getStorageSync, navigateTo } from '@tarojs/taro'
import { setupApiClient } from '@workspace/request'

import routes from '@/generated.routes'

export const setupRequest = () => {
  const apiUrl = process.env.API_URL
  if (!apiUrl) {
    throw new Error('API_URL is not set')
  }

  setupApiClient({
    // 基础配置
    baseUrl: 'https://api.example.com',
    withAuth: true,
    getToken: () => getStorageSync('token'),

    // 请求拦截器 - 在请求发送前修改请求
    requestInterceptor: config => {
      // 添加自定义头部
      config.headers = config.headers || {}
      config.headers['X-App-Version'] = '1.0.0'
      config.headers['X-Platform'] = 'web'

      // 在开发环境添加调试信息
      if (process.env.NODE_ENV === 'development') {
        config.params = { ...config.params, _debug: true }
      }

      return config
    },

    // 响应拦截器 - 在收到响应后处理
    responseInterceptor: response => {
      // 自定义响应处理
      if (response.headers['x-deprecation-notice']) {
        console.warn('API 即将弃用:', response.headers['x-deprecation-notice'])
      }

      return response
    },

    // 错误拦截器 - 统一处理错误
    errorInterceptor: async error => {
      if (error.response) {
        // 处理特定错误码
        const status = error.response.status

        if (status === 401) {
          // 未授权 - 重定向到登录页
          getStorageSync('token')
          navigateTo({
            url: routes.login.path,
          })
        } else if (status === 403) {
          // 禁止访问 - 显示无权限页面
          window.location.href = '/forbidden'
        } else if (status === 429) {
          // 请求过多 - 实现重试逻辑
          console.warn('请求频率过高，将在 1 秒后重试')
          await new Promise(resolve => setTimeout(resolve, 1000))
          // 这里可以实现重试逻辑
        }
      } else if (error.request) {
        // 网络错误 - 显示网络错误提示
        console.error('网络错误，请检查您的连接')
      }

      // 继续抛出错误，供调用处处理
      return Promise.reject(error)
    },
  })
}
