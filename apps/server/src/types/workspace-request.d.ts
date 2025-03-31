/**
 * @workspace/request 包的类型声明
 */

declare module '@workspace/request' {
  /**
   * 标准HTTP响应状态码
   */
  export const ResponseStatus: {
    // 2xx - 成功
    SUCCESS: number // 200
    CREATED: number // 201
    ACCEPTED: number // 202
    NO_CONTENT: number // 204

    // 3xx - 重定向
    MOVED_PERMANENTLY: number // 301
    FOUND: number // 302
    SEE_OTHER: number // 303
    NOT_MODIFIED: number // 304

    // 4xx - 客户端错误
    BAD_REQUEST: number // 400
    UNAUTHORIZED: number // 401
    PAYMENT_REQUIRED: number // 402
    FORBIDDEN: number // 403
    NOT_FOUND: number // 404
    METHOD_NOT_ALLOWED: number // 405
    CONFLICT: number // 409
    GONE: number // 410
    UNSUPPORTED_MEDIA_TYPE: number // 415
    TOO_MANY_REQUESTS: number // 429

    // 5xx - 服务器错误
    ERROR: number // 500
    NOT_IMPLEMENTED: number // 501
    BAD_GATEWAY: number // 502
    SERVICE_UNAVAILABLE: number // 503
    GATEWAY_TIMEOUT: number // 504
  }

  /**
   * 类别化的状态码分组
   */
  export const StatusGroups: {
    SUCCESS_CODES: number[]
    REDIRECT_CODES: number[]
    CLIENT_ERROR_CODES: number[]
    SERVER_ERROR_CODES: number[]
    RETRYABLE_CODES: number[]
  }

  /**
   * 检查状态码是否为成功状态（2xx）
   */
  export function isSuccess(status: number): boolean

  /**
   * 检查状态码是否为重定向状态（3xx）
   */
  export function isRedirect(status: number): boolean

  /**
   * 检查状态码是否为客户端错误（4xx）
   */
  export function isClientError(status: number): boolean

  /**
   * 检查状态码是否为服务器错误（5xx）
   */
  export function isServerError(status: number): boolean

  /**
   * 检查状态码是否应该重试
   */
  export function isRetryable(status: number): boolean

  /**
   * 获取状态码对应的默认消息
   */
  export function getStatusMessage(status: number): string
}
