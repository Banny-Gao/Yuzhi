/**
 * API客户端配置工具
 * @description 配置全局API客户端设置，如基础URL、拦截器等
 */
import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { OpenAPI } from './generated'
import type { ApiRequestOptions } from './generated/core/ApiRequestOptions'

/**
 * API客户端配置选项
 */
export interface ApiClientOptions {
  /**
   * API服务器基础URL
   */
  baseUrl?: string

  /**
   * 请求拦截器
   */
  requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>

  /**
   * 响应拦截器
   */
  responseInterceptor?: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>

  /**
   * 错误拦截器
   */
  errorInterceptor?: (error: AxiosError) => Promise<never>

  /**
   * 是否自动添加授权头
   */
  withAuth?: boolean

  /**
   * 获取授权令牌的函数
   */
  getToken?: () => string | null | undefined
}

/**
 * 初始化并配置API客户端
 */
export function setupApiClient(options: ApiClientOptions = {}): void {
  // 设置基础URL
  if (options.baseUrl) {
    OpenAPI.BASE = options.baseUrl
  }

  // 配置全局请求拦截器
  if (options.requestInterceptor) {
    OpenAPI.WITH_CREDENTIALS = true
    const originalRequest = OpenAPI.REQUEST

    // @ts-ignore - 类型不匹配但实际可用
    OpenAPI.REQUEST = async (config: ApiRequestOptions) => {
      // 应用自定义请求拦截器
      if (options.requestInterceptor) {
        // @ts-ignore - 类型不匹配但实际可用
        const modifiedConfig = await options.requestInterceptor(config as any)

        // 如果启用了授权并提供了令牌获取函数
        if (options.withAuth && options.getToken) {
          const token = options.getToken()
          if (token) {
            modifiedConfig.headers = modifiedConfig.headers || {}
            modifiedConfig.headers['Authorization'] = `Bearer ${token}`
          }
        }

        // @ts-ignore - 类型不匹配但实际可用
        return originalRequest ? originalRequest(modifiedConfig as any) : modifiedConfig
      }

      // @ts-ignore - 类型不匹配但实际可用
      return originalRequest ? originalRequest(config) : config
    }
  }

  // 配置全局响应拦截器
  if (options.responseInterceptor) {
    const originalResponse = OpenAPI.RESPONSE

    // @ts-ignore - 类型不匹配但实际可用
    OpenAPI.RESPONSE = async (response: Response, options: ApiRequestOptions) => {
      // 先应用原始响应处理
      // @ts-ignore - 类型不匹配但实际可用
      const handledResponse = originalResponse ? await originalResponse(response, options) : response
      // 然后应用自定义响应拦截器
      // @ts-ignore - 类型不匹配但实际可用
      return options.responseInterceptor ? options.responseInterceptor(handledResponse) : handledResponse
    }
  }

  // 配置错误拦截器
  if (options.errorInterceptor) {
    // @ts-ignore - 类型不匹配但实际可用
    OpenAPI.ERROR = options.errorInterceptor
  }
}
