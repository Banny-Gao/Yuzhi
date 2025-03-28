/**
 * API客户端配置工具
 * @description 配置全局API客户端设置，如基础URL、拦截器等
 */
import axios from 'axios'

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
   * 请求拦截器 - 在请求发送前修改请求配置
   */
  requestInterceptor?: (config: any) => any | Promise<any>

  /**
   * 响应拦截器 - 在收到响应后处理响应
   */
  responseInterceptor?: (response: any) => any | Promise<any>

  /**
   * 错误拦截器 - 处理请求错误
   */
  errorInterceptor?: (error: any) => any | Promise<any>
}

/**
 * 初始化并配置API客户端
 */
export function setupApiClient(options: ApiClientOptions = {}): void {
  // 设置基础URL
  if (options.baseUrl) {
    axios.defaults.baseURL = options.baseUrl
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
    error => {
      // 应用自定义错误拦截器
      if (options.errorInterceptor) {
        return options.errorInterceptor(error)
      }
      return Promise.reject(error)
    }
  )
}
