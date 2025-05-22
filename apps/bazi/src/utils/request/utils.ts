/**
 * API工具函数集
 * @description 提供API客户端的实用工具函数
 */
import { AxiosRequestConfig, AxiosError } from 'axios'

import { StatusGroups, isRetryable } from './status'

/**
 * 请求重试配置
 */
export interface RetryConfig {
  /**
   * 最大重试次数
   */
  maxRetries: number

  /**
   * 重试延迟时间（毫秒）
   * 如果提供函数，可以实现指数退避策略
   */
  retryDelay: number | ((retryCount: number) => number)

  /**
   * 应该重试的HTTP状态码
   * 默认为服务器错误和请求过多状态码
   */
  statusCodes?: number[]
}

/**
 * 默认的重试配置
 */
export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 2,
  retryDelay: retryCount => Math.pow(2, retryCount) * 1000, // 指数退避：1秒，2秒，4秒
  statusCodes: StatusGroups.RETRYABLE_CODES, // 使用预定义的可重试状态码集合
}

/**
 * 创建带有重试逻辑的请求
 * @param requestFn 原始请求函数
 * @param retryConfig 重试配置
 */
export const withRetry = async <T>(
  requestFn: () => Promise<T>,
  retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<T> => {
  const { maxRetries, retryDelay, statusCodes = DEFAULT_RETRY_CONFIG.statusCodes } = retryConfig

  return new Promise((resolve, reject) => {
    let attempts = 0

    const attemptRequest = async () => {
      try {
        const result = await requestFn()
        resolve(result)
      } catch (error) {
        attempts++

        // 判断是否需要重试
        const shouldRetry =
          attempts <= maxRetries &&
          ((error instanceof AxiosError &&
            (statusCodes ? statusCodes.includes(error.status!) : isRetryable(error.status!))) ||
            // 处理网络或连接错误
            (error instanceof Error &&
              (error.message?.includes('Network Error') ||
                error.message?.includes('network') ||
                error.message?.includes('timeout'))))

        if (shouldRetry) {
          // 计算延迟时间
          const delay = typeof retryDelay === 'function' ? retryDelay(attempts) : retryDelay

          console.log(`请求失败，将在 ${delay}ms 后重试（第 ${attempts} 次）...`)

          // 延迟后重试
          setTimeout(attemptRequest, delay)
        } else {
          // 超过重试次数或不可重试的错误，直接拒绝
          reject(error)
        }
      }
    }

    attemptRequest()
  })
}

/**
 * 缓存控制选项
 */
export interface CacheOptions {
  /**
   * 缓存键，默认为请求URL
   */
  key?: string

  /**
   * 缓存持续时间（毫秒）
   */
  ttl: number
}

// 简单内存缓存实现
const cache = new Map<string, { timestamp: number; data: any }>()

/**
 * 创建带有缓存的请求
 * @param requestFn 原始请求函数
 * @param options 缓存选项
 */
export const withCache = async <T>(
  requestFn: (config?: AxiosRequestConfig) => Promise<T>,
  options: CacheOptions,
  requestConfig?: AxiosRequestConfig
): Promise<T> => {
  const cacheKey = options.key || requestConfig?.url || 'default-key'
  const now = Date.now()

  // 检查缓存
  const cachedItem = cache.get(cacheKey)
  if (cachedItem && now - cachedItem.timestamp < options.ttl) {
    // 使用缓存数据
    return Promise.resolve(cachedItem.data)
  }

  // 发送请求
  return new Promise(async (resolve, reject) => {
    try {
      const result = await requestFn(requestConfig)
      if (result instanceof AxiosError || result instanceof Error) return reject(result)

      // 更新缓存
      cache.set(cacheKey, { timestamp: now, data: result })
      return resolve(result)
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * 清除特定键的缓存
 */
export function clearCache(key?: string): void {
  if (key) {
    cache.delete(key)
  } else {
    cache.clear()
  }
}
