/**
 * API工具函数集
 * @description 提供API客户端的实用工具函数
 */
import { AxiosRequestConfig } from 'axios'
import { StatusGroups, isRetryable } from './status'
import { ApiError } from './core/ApiError'
import { CancelablePromise } from './core/CancelablePromise'

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
  maxRetries: 3,
  retryDelay: retryCount => Math.pow(2, retryCount) * 1000, // 指数退避：1秒，2秒，4秒
  statusCodes: StatusGroups.RETRYABLE_CODES, // 使用预定义的可重试状态码集合
}

/**
 * 创建带有重试逻辑的请求
 * @param requestFn 原始请求函数
 * @param retryConfig 重试配置
 */
export function withRetry<T>(
  requestFn: () => Promise<T>,
  retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<T> {
  const { maxRetries, retryDelay, statusCodes = DEFAULT_RETRY_CONFIG.statusCodes } = retryConfig

  return new Promise(async (resolve, reject) => {
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
          ((error instanceof ApiError &&
            (statusCodes ? statusCodes.includes(error.status) : isRetryable(error.status))) ||
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

    // 启动第一次请求
    try {
      await attemptRequest()
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * 超时配置选项
 */
export interface TimeoutOptions {
  /**
   * 超时时间（毫秒）
   */
  timeout: number

  /**
   * 超时错误消息
   */
  message?: string
}

/**
 * 创建带有超时保护的请求
 * @param requestFn 原始请求函数或可取消承诺
 * @param options 超时选项
 */
export function withTimeout<T>(
  requestFn: (() => Promise<T>) | CancelablePromise<T>,
  options: TimeoutOptions
): Promise<T> {
  const { timeout, message = '请求超时' } = options

  return new Promise((resolve, reject) => {
    // 创建超时计时器
    const timeoutId = setTimeout(() => {
      // 如果请求是可取消的，尝试取消
      if (typeof requestFn !== 'function' && typeof requestFn.cancel === 'function') {
        requestFn.cancel()
      }

      reject(new Error(message))
    }, timeout)

    // 执行请求
    const promise = typeof requestFn === 'function' ? requestFn() : requestFn

    promise
      .then(result => {
        clearTimeout(timeoutId)
        resolve(result)
      })
      .catch(error => {
        clearTimeout(timeoutId)
        reject(error)
      })
  })
}

/**
 * 处理API错误的标准方式
 * @param error 捕获到的错误
 * @param defaultMessage 默认错误消息
 */
export function handleApiError(error: unknown, defaultMessage = '请求失败'): string {
  if (error instanceof ApiError) {
    // 从API响应体中提取错误消息
    const errorMessage =
      error.body && typeof error.body === 'object' && 'message' in error.body
        ? error.body.message
        : error.message || error.statusText || defaultMessage

    return `${errorMessage} (${error.status})`
  } else if (error instanceof Error) {
    if (error.message?.includes('Network Error') || error.message?.includes('network')) {
      return '网络连接错误，请检查您的网络设置'
    }
    if (error.message?.includes('timeout')) {
      return '请求超时，请稍后重试'
    }
    return error.message || defaultMessage
  }

  return defaultMessage
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
export function withCache<T>(
  requestFn: (config?: AxiosRequestConfig) => Promise<T>,
  options: CacheOptions,
  requestConfig?: AxiosRequestConfig
): Promise<T> {
  const cacheKey = options.key || requestConfig?.url || 'default-key'
  const now = Date.now()

  // 检查缓存
  const cachedItem = cache.get(cacheKey)
  if (cachedItem && now - cachedItem.timestamp < options.ttl) {
    // 使用缓存数据
    return Promise.resolve(cachedItem.data)
  }

  // 发送请求
  return requestFn(requestConfig).then(result => {
    // 更新缓存
    cache.set(cacheKey, { timestamp: now, data: result })
    return result
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

/**
 * 分页请求选项
 */
export interface PaginationOptions<T> {
  /**
   * 获取特定页码的请求函数
   */
  fetchPage: (
    page: number,
    pageSize: number
  ) => Promise<{
    items: T[]
    total?: number
    hasMore?: boolean
  }>

  /**
   * 初始页码
   */
  initialPage?: number

  /**
   * 每页项目数
   */
  pageSize?: number
}

/**
 * 创建分页请求
 * 可用于实现"加载更多"功能
 */
export function createPaginator<T>(options: PaginationOptions<T>) {
  const { fetchPage, initialPage = 1, pageSize = 10 } = options

  let currentPage = initialPage
  let hasMore = true
  let isLoading = false
  let items: T[] = []
  let total = 0

  // 加载第一页
  const loadFirstPage = async (): Promise<T[]> => {
    currentPage = initialPage
    return loadNextPage(true)
  }

  // 加载下一页
  const loadNextPage = async (reset = false): Promise<T[]> => {
    if (isLoading || (!hasMore && !reset)) return items

    isLoading = true

    try {
      const result = await fetchPage(currentPage, pageSize)

      // 更新状态
      currentPage++
      hasMore = result.hasMore !== false

      if (typeof result.total === 'number') {
        total = result.total

        // 根据总数判断是否还有更多
        hasMore = (currentPage - 1) * pageSize < total
      }

      // 更新数据
      items = reset ? result.items : [...items, ...result.items]

      return items
    } finally {
      isLoading = false
    }
  }

  // 返回分页器对象
  return {
    loadFirstPage,
    loadNextPage,
    get currentPage() {
      return currentPage
    },
    get hasMore() {
      return hasMore
    },
    get isLoading() {
      return isLoading
    },
    get items() {
      return items
    },
    get total() {
      return total
    },
  }
}
