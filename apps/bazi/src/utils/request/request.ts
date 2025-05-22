import axios from 'axios'
import xhrAdapter from 'axios/unsafe/adapters/xhr'
import { showToast } from '@tarojs/taro'

import { getStorage, removeStorage, STORAGE_KEYS } from '../storage'
import { goTo } from '../router'

import { client } from './openapi/client.gen'
import { AppError, showError } from './error'
import { withRetry } from './utils'

import { loadingManager } from '@/components'
/**
 * 格式化API响应
 * 处理新旧两种格式的API响应
 */

const CancelToken = axios.CancelToken
const source = CancelToken.source()
export const cancelRequest = (message?: string) => source.cancel(message)

// 修改适配器增强器，确保错误正确处理
const adapterEnhancer = adapter => async config => await withRetry(async () => await adapter(config))

export function initApiClient(baseURL: string): void {
  client.setConfig({
    baseURL,
    timeout: 10000, // 10秒超时
    withCredentials: true,
    adapter: adapterEnhancer(xhrAdapter),
    cancelToken: source.token,
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

      if (response.data?.code !== 200) {
        showToast({
          title: response.data.message,
          icon: 'none',
          duration: 2000,
        })

        throw new AppError(response.data.message)
      }

      return response.data
    },
    async error => {
      // 隐藏加载提示
      await loadingManager.hide()

      showError(error)

      // 处理常见错误
      switch (error.response?.status) {
        case 401:
          // 处理未授权错误，可能需要重新登录
          console.error('需要重新登录')
          removeStorage(STORAGE_KEYS.TOKEN) // 使用存储工具移除令牌
          // 可以在这里重定向到登录页面
          goTo.login()
          break
        default:
          break
      }

      throw new AppError(error)
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
