import axios, { AxiosError, AxiosRequestConfig } from 'axios'

import { getStorage, removeStorage, STORAGE_KEYS } from '../storage'
import { client } from '../openapi/client.gen'

import { loadingManager } from '@/components'

/**
 * 格式化API响应
 * 处理新旧两种格式的API响应
 */

/**
 * 初始化API客户端
 */
export function initApiClient(baseURL: string): void {
  client.setConfig({
    baseURL,
    timeout: 10000, // 10秒超时
    withCredentials: true,
  })

  client.instance.interceptors.request.use(config => {
    config.headers.set('Authorization', `Bearer ${getStorage<string>(STORAGE_KEYS.TOKEN)}`)

    // 显示加载提示
    loadingManager.show()

    return config
  })

  client.instance.interceptors.response.use(
    response => {
      // 隐藏加载提示
      loadingManager.hide()

      return response
    },
    async error => {
      const retryConfig = {
        retryCount: 0,
        maxRetries: 2,
        retryDelay: 1000,
        statusCodes: [408, 500, 502, 503, 504],
      }
      // 实现请求重试逻辑
      const { config, response } = error as AxiosError

      if (config && response) {
        // 获取当前重试次数
        retryConfig.retryCount = retryConfig.retryCount || 0

        // 检查是否应该重试 - 使用可选链确保安全访问
        const shouldRetry =
          retryConfig.retryCount < retryConfig.maxRetries &&
          retryConfig.statusCodes.includes(response.status)

        if (shouldRetry) {
          // 增加重试计数
          retryConfig.retryCount += 1

          // 延迟后重试
          await new Promise(resolve => setTimeout(resolve, retryConfig.retryDelay))

          // 重新发送请求
          return axios(retryConfig as AxiosRequestConfig)
        }
      }

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
    }
  )
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
