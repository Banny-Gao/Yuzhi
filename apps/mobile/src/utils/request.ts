/**
 * API请求工具
 * @description 配置移动应用的API请求客户端
 */

import { setupApiClient, ApiClientOptions } from '@workspace/request'
import { getStorage, removeStorage, STORAGE_KEYS } from './storage'
import { loadingManager } from '@/components/Loading'

/**
 * 格式化API响应
 * 处理新旧两种格式的API响应
 */

/**
 * 获取授权令牌
 */
const getToken = (): string | null => {
  return getStorage<string>(STORAGE_KEYS.TOKEN)
}

/**
 * 初始化API客户端
 */
export function initApiClient(baseUrl: string): void {
  const apiOptions: ApiClientOptions = {
    baseUrl,
    timeout: 10000, // 10秒超时
    withAuth: true,
    getToken, // 使用获取令牌函数

    // 请求拦截器
    requestInterceptor: config => {
      // 显示加载提示
      loadingManager.show()

      // 在这里可以添加额外的请求头
      return config
    },

    // 响应拦截器
    responseInterceptor: response => {
      // 隐藏加载提示
      loadingManager.hide()

      // 格式化响应数据
      return response
    },

    // 错误拦截器
    errorInterceptor: error => {
      // 隐藏加载提示
      loadingManager.hide()

      // 处理常见错误
      if (!error.response) {
        console.error('网络连接失败:', error.message)
        // 可以在这里显示全局网络错误提示
      } else if (error.response.status === 401) {
        // 处理未授权错误，可能需要重新登录
        console.error('需要重新登录')
        removeStorage(STORAGE_KEYS.TOKEN) // 使用存储工具移除令牌
        // 可以在这里重定向到登录页面
      }

      return Promise.reject(error)
    },

    // 重试配置
    retry: {
      maxRetries: 2,
      retryDelay: 1000,
      statusCodes: [408, 500, 502, 503, 504],
    },
  }

  // 设置API客户端
  setupApiClient(apiOptions)
}

export const setupRequest = () => {
  // 获取API URL
  const apiUrl = process.env.TARO_APP_API_URL
  if (!apiUrl) {
    console.warn('TARO_APP_API_URL未设置，API请求可能无法正常工作')
  }

  console.log('环境:', process.env.NODE_ENV)
  console.log('API URL:', apiUrl)

  // 配置API客户端
  initApiClient(apiUrl || '')
}
