/**
 * HTTP响应状态码
 * @description 定义常用HTTP响应状态码及其含义
 */

/**
 * 标准HTTP响应状态码
 */
export const ResponseStatus = {
  // 2xx - 成功
  SUCCESS: 200, // 请求成功
  CREATED: 201, // 资源创建成功
  ACCEPTED: 202, // 请求已接受，但处理未完成
  NO_CONTENT: 204, // 成功，但无返回内容

  // 3xx - 重定向
  MOVED_PERMANENTLY: 301, // 永久重定向
  FOUND: 302, // 临时重定向
  SEE_OTHER: 303, // 查看其他位置
  NOT_MODIFIED: 304, // 资源未修改

  // 4xx - 客户端错误
  BAD_REQUEST: 400, // 请求错误
  UNAUTHORIZED: 401, // 未授权（未登录）
  PAYMENT_REQUIRED: 402, // 需要付款
  FORBIDDEN: 403, // 禁止访问（已登录但无权限）
  NOT_FOUND: 404, // 资源未找到
  METHOD_NOT_ALLOWED: 405, // 请求方法不允许
  CONFLICT: 409, // 资源冲突
  GONE: 410, // 资源不再可用
  UNSUPPORTED_MEDIA_TYPE: 415, // 不支持的媒体类型
  TOO_MANY_REQUESTS: 429, // 请求过多（频率限制）

  // 5xx - 服务器错误
  ERROR: 500, // 服务器内部错误
  NOT_IMPLEMENTED: 501, // 功能未实现
  BAD_GATEWAY: 502, // 网关错误
  SERVICE_UNAVAILABLE: 503, // 服务不可用
  GATEWAY_TIMEOUT: 504, // 网关超时
}

/**
 * 类别化的状态码分组
 */
export const StatusGroups = {
  // 成功状态码（2xx）
  SUCCESS_CODES: [
    ResponseStatus.SUCCESS,
    ResponseStatus.CREATED,
    ResponseStatus.ACCEPTED,
    ResponseStatus.NO_CONTENT,
  ],

  // 重定向状态码（3xx）
  REDIRECT_CODES: [
    ResponseStatus.MOVED_PERMANENTLY,
    ResponseStatus.FOUND,
    ResponseStatus.SEE_OTHER,
    ResponseStatus.NOT_MODIFIED,
  ],

  // 客户端错误状态码（4xx）
  CLIENT_ERROR_CODES: [
    ResponseStatus.BAD_REQUEST,
    ResponseStatus.UNAUTHORIZED,
    ResponseStatus.PAYMENT_REQUIRED,
    ResponseStatus.FORBIDDEN,
    ResponseStatus.NOT_FOUND,
    ResponseStatus.METHOD_NOT_ALLOWED,
    ResponseStatus.CONFLICT,
    ResponseStatus.GONE,
    ResponseStatus.UNSUPPORTED_MEDIA_TYPE,
    ResponseStatus.TOO_MANY_REQUESTS,
  ],

  // 服务器错误状态码（5xx）
  SERVER_ERROR_CODES: [
    ResponseStatus.ERROR,
    ResponseStatus.NOT_IMPLEMENTED,
    ResponseStatus.BAD_GATEWAY,
    ResponseStatus.SERVICE_UNAVAILABLE,
    ResponseStatus.GATEWAY_TIMEOUT,
  ],

  // 应该重试的状态码
  RETRYABLE_CODES: [
    ResponseStatus.ERROR,
    ResponseStatus.BAD_GATEWAY,
    ResponseStatus.SERVICE_UNAVAILABLE,
    ResponseStatus.GATEWAY_TIMEOUT,
    ResponseStatus.TOO_MANY_REQUESTS,
  ],
}

/**
 * 检查状态码是否为成功状态（2xx）
 */
export function isSuccess(status: number): boolean {
  return status >= 200 && status < 300
}

/**
 * 检查状态码是否为重定向状态（3xx）
 */
export function isRedirect(status: number): boolean {
  return status >= 300 && status < 400
}

/**
 * 检查状态码是否为客户端错误（4xx）
 */
export function isClientError(status: number): boolean {
  return status >= 400 && status < 500
}

/**
 * 检查状态码是否为服务器错误（5xx）
 */
export function isServerError(status: number): boolean {
  return status >= 500 && status < 600
}

/**
 * 检查状态码是否应该重试
 */
export function isRetryable(status: number): boolean {
  return StatusGroups.RETRYABLE_CODES.includes(status)
}

/**
 * 获取状态码对应的默认消息
 */
export function getStatusMessage(status: number): string {
  switch (status) {
    // 2xx
    case ResponseStatus.SUCCESS:
      return '请求成功'
    case ResponseStatus.CREATED:
      return '资源创建成功'
    case ResponseStatus.ACCEPTED:
      return '请求已接受，但处理未完成'
    case ResponseStatus.NO_CONTENT:
      return '成功，但无返回内容'

    // 3xx
    case ResponseStatus.MOVED_PERMANENTLY:
      return '资源已永久移动到新位置'
    case ResponseStatus.FOUND:
      return '资源暂时移动到新位置'
    case ResponseStatus.SEE_OTHER:
      return '请查看其他位置'
    case ResponseStatus.NOT_MODIFIED:
      return '资源未修改'

    // 4xx
    case ResponseStatus.BAD_REQUEST:
      return '请求参数有误'
    case ResponseStatus.UNAUTHORIZED:
      return '未登录或登录已过期'
    case ResponseStatus.PAYMENT_REQUIRED:
      return '需要付款'
    case ResponseStatus.FORBIDDEN:
      return '无权访问该资源'
    case ResponseStatus.NOT_FOUND:
      return '请求的资源不存在'
    case ResponseStatus.METHOD_NOT_ALLOWED:
      return '请求方法不允许'
    case ResponseStatus.CONFLICT:
      return '资源冲突'
    case ResponseStatus.GONE:
      return '资源不再可用'
    case ResponseStatus.UNSUPPORTED_MEDIA_TYPE:
      return '不支持的媒体类型'
    case ResponseStatus.TOO_MANY_REQUESTS:
      return '请求频率过高，请稍后再试'

    // 5xx
    case ResponseStatus.ERROR:
      return '服务器内部错误'
    case ResponseStatus.NOT_IMPLEMENTED:
      return '服务器不支持此功能'
    case ResponseStatus.BAD_GATEWAY:
      return '网关错误'
    case ResponseStatus.SERVICE_UNAVAILABLE:
      return '服务暂时不可用'
    case ResponseStatus.GATEWAY_TIMEOUT:
      return '网关超时'

    default:
      return status >= 200 && status < 300
        ? '请求成功'
        : status >= 400 && status < 500
          ? '客户端错误'
          : status >= 500 && status < 600
            ? '服务器错误'
            : '未知状态'
  }
}
