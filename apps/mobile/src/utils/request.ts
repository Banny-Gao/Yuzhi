import { getStorageSync, setStorageSync, removeStorageSync, navigateTo } from '@tarojs/taro'
import { setupApiClient, ResponseStatus } from '@workspace/request'

import routes from '@/generated.routes'

export const setupRequest = () => {
  // 获取API URL
  const apiUrl = process.env.TARO_APP_API_URL
  if (!apiUrl) {
    console.warn('TARO_APP_API_URL未设置，API请求可能无法正常工作')
  }

  console.log('环境:', process.env.NODE_ENV)
  console.log('API URL:', apiUrl)

  // 配置API客户端
  setupApiClient({
    // 基础配置
    baseUrl: apiUrl,
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
      // 检查是否有新的令牌在响应中
      const newToken = response.headers['x-auth-token']
      if (newToken) setStorageSync('token', newToken)

      // 处理弃用通知
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

        switch (status) {
          case ResponseStatus.UNAUTHORIZED:
            // 未授权 - 清除可能无效的令牌并重定向到登录页
            removeStorageSync('token')
            navigateTo({
              url: routes.login.path,
            })
            break
          case ResponseStatus.FORBIDDEN:
            // 禁止访问 - 显示无权限页面
            navigateTo({
              url: routes.forbidden.path,
            })
            break
          case ResponseStatus.TOO_MANY_REQUESTS:
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
