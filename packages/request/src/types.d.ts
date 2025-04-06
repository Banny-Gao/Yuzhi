/**
 * 简化的Taro类型声明
 * 用于在项目中导入Taro而不需要完整依赖
 */

// 声明Taro模块
declare module '@tarojs/taro' {
  interface RequestParams {
    /** 开发者服务器接口地址 */
    url: string
    /** 请求的参数 */
    data?: any
    /** 设置请求的 header，header 中不能设置 Referer。
     * content-type 默认为 application/json
     */
    header?: Record<string, string>
    /** 超时时间，单位为毫秒 */
    timeout?: number
    /** HTTP 请求方法 */
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'HEAD' | 'OPTIONS' | 'TRACE' | 'PATCH'
    /** 返回的数据格式 */
    dataType?: string
    /** 响应的数据类型 */
    responseType?: string
    /** 是否开启 http2 */
    enableHttp2?: boolean
    /** 是否开启 quic */
    enableQuic?: boolean
    /** 是否开启缓存 */
    enableCache?: boolean
    /** 是否开启 HttpDNS 服务 */
    enableHttpDNS?: boolean
    /** 开启 transfer-encoding chunked */
    enableChunked?: boolean
    /** 是否在 wifi 下使用移动网络发送请求 */
    forceCellularNetwork?: boolean
    /** 凭证模式 */
    credentials?: 'include' | 'same-origin' | 'omit'
  }

  interface RequestSuccessCallbackResult {
    /** 开发者服务器返回的数据 */
    data: any
    /** 开发者服务器返回的 HTTP 状态码 */
    statusCode: number
    /** 开发者服务器返回的 HTTP Response Header */
    header: Record<string, string>
    /** 调用结果 */
    errMsg: string
  }

  /**
   * 发起网络请求
   */
  function request(params: RequestParams): Promise<RequestSuccessCallbackResult>

  /**
   * 导航到指定页面
   */
  function navigateTo(params: { url: string }): Promise<any>

  /**
   * 重定向到指定页面
   */
  function redirectTo(params: { url: string }): Promise<any>

  /**
   * 切换到指定 tabBar 页面
   */
  function switchTab(params: { url: string }): Promise<any>
}

// 处理环境变量
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /** Taro运行环境 */
      TARO_ENV?: 'weapp' | 'h5' | 'rn' | 'swan' | 'alipay' | 'tt' | 'qq' | 'jd' | 'quickapp'
    }
  }
}
