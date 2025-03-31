/**
 * API客户端配置工具
 * @description 配置全局API客户端设置，如基础URL、拦截器等
 */
import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { OpenAPI } from './generated/core/OpenAPI'

// 扩展AxiosRequestConfig以添加重试计数
interface RequestConfigWithRetry extends InternalAxiosRequestConfig {
  retryCount?: number
}

/**
 * API客户端配置选项
 */
export interface ApiClientOptions {
  /**
   * API服务器基础URL
   */
  baseUrl?: string

  /**
   * 是否自动添加授权头
   */
  withAuth?: boolean

  /**
   * 获取授权令牌的函数
   */
  getToken?: () => string | null | undefined

  /**
   * 请求超时时间（毫秒）
   */
  timeout?: number

  /**
   * 请求拦截器 - 在请求发送前修改请求配置
   */
  requestInterceptor?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>

  /**
   * 响应拦截器 - 在收到响应后处理响应
   */
  responseInterceptor?: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>

  /**
   * 错误拦截器 - 处理请求错误
   */
  errorInterceptor?: (error: AxiosError) => any | Promise<any>

  /**
   * 请求重试配置
   */
  retry?: {
    /**
     * 最大重试次数
     */
    maxRetries: number

    /**
     * 重试延迟时间（毫秒）
     */
    retryDelay: number

    /**
     * 应该重试的HTTP状态码
     */
    statusCodes: number[]
  }
}

/**
 * 初始化并配置API客户端
 */
export function setupApiClient(options: ApiClientOptions = {}): void {
  // 设置基础URL
  if (options.baseUrl) {
    // 更新axios配置
    axios.defaults.baseURL = options.baseUrl

    // 同步更新OpenAPI配置
    OpenAPI.BASE = options.baseUrl
  }

  // 设置认证相关配置
  if (options.withAuth) {
    OpenAPI.WITH_CREDENTIALS = true
    axios.defaults.withCredentials = true
  }

  // 设置请求超时
  if (options.timeout) {
    axios.defaults.timeout = options.timeout
  }

  // 配置请求拦截器
  axios.interceptors.request.use(config => {
    // 如果启用了授权并提供了令牌获取函数
    if (options.withAuth && options.getToken) {
      const token = options.getToken()
      if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`
      }
    }

    // 应用自定义请求拦截器
    if (options.requestInterceptor) {
      return options.requestInterceptor(config)
    }

    return config
  })

  // 配置响应拦截器
  axios.interceptors.response.use(
    response => {
      // 应用自定义响应拦截器
      if (options.responseInterceptor) {
        return options.responseInterceptor(response)
      }
      return response
    },
    async error => {
      // 实现请求重试逻辑
      const { config, response } = error as AxiosError

      if (config && options.retry && response) {
        // 将config转换为包含retryCount的类型
        const retryConfig = config as RequestConfigWithRetry

        // 获取当前重试次数
        retryConfig.retryCount = retryConfig.retryCount || 0

        // 检查是否应该重试 - 使用可选链确保安全访问
        const retryOptions = options.retry
        const shouldRetry = retryConfig.retryCount < retryOptions.maxRetries && retryOptions.statusCodes.includes(response.status)

        if (shouldRetry) {
          // 增加重试计数
          retryConfig.retryCount += 1

          // 延迟后重试
          await new Promise(resolve => setTimeout(resolve, retryOptions.retryDelay))

          // 重新发送请求
          return axios(retryConfig)
        }
      }

      // 应用自定义错误拦截器
      if (options.errorInterceptor) {
        return options.errorInterceptor(error)
      }

      return Promise.reject(error)
    }
  )
}

/**
 * 清除API客户端配置
 * 在测试或需要重置配置时使用
 */
export function clearApiClientSetup(): void {
  // 重置axios配置
  axios.defaults.baseURL = undefined
  axios.defaults.withCredentials = false
  axios.defaults.timeout = 0

  // 清除所有拦截器
  axios.interceptors.request.clear()
  axios.interceptors.response.clear()

  // 重置OpenAPI配置
  OpenAPI.BASE = ''
  OpenAPI.WITH_CREDENTIALS = false
}
