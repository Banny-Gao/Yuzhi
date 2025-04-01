import { ResponseStatus, getStatusMessage } from '@workspace/request'

/**
 * 标准API响应接口
 */
export interface ApiResponse<T = any> {
  status: number
  message: string
  data?: T
  timestamp: string
  path?: string
}

/**
 * API响应工具类
 * 用于创建统一格式的API响应
 */
export class ResponseUtil {
  /**
   * 创建成功响应
   * @param data 响应数据
   * @param message 响应消息
   * @param path 请求路径
   * @returns 标准格式的成功响应
   */
  static success<T = any>(data?: T, message?: string, path?: string): ApiResponse<T> {
    return {
      status: ResponseStatus.SUCCESS,
      message: message || getStatusMessage(ResponseStatus.SUCCESS),
      data,
      timestamp: new Date().toISOString(),
      ...(path && { path }),
    }
  }

  /**
   * 创建资源创建成功响应
   * @param data 响应数据
   * @param message 响应消息
   * @param path 请求路径
   * @returns 标准格式的创建成功响应
   */
  static created<T = any>(data?: T, message?: string, path?: string): ApiResponse<T> {
    return {
      status: ResponseStatus.CREATED,
      message: message || getStatusMessage(ResponseStatus.CREATED),
      data,
      timestamp: new Date().toISOString(),
      ...(path && { path }),
    }
  }

  /**
   * 创建无内容响应
   * @param message 响应消息
   * @param path 请求路径
   * @returns 标准格式的无内容响应
   */
  static noContent(message?: string, path?: string): ApiResponse<void> {
    return {
      status: ResponseStatus.NO_CONTENT,
      message: message || getStatusMessage(ResponseStatus.NO_CONTENT),
      timestamp: new Date().toISOString(),
      ...(path && { path }),
    }
  }

  /**
   * 创建错误响应
   * @param status HTTP状态码
   * @param message 错误消息
   * @param path 请求路径
   * @returns 标准格式的错误响应
   */
  static error(status: number, message?: string, path?: string): ApiResponse<void> {
    return {
      status,
      message: message || getStatusMessage(status),
      timestamp: new Date().toISOString(),
      ...(path && { path }),
    }
  }

  /**
   * 创建分页响应数据
   * @param items 分页项目
   * @param totalItems 总条目数
   * @param page 当前页码
   * @param pageSize 每页大小
   * @returns 标准格式的分页数据
   */
  static paginated<T = any>(items: T[], totalItems: number, page: number, pageSize: number) {
    const totalPages = Math.ceil(totalItems / pageSize)
    const hasNext = page < totalPages
    const hasPrevious = page > 1

    return {
      items,
      meta: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: pageSize,
        totalPages,
        currentPage: page,
        hasNext,
        hasPrevious,
      },
    }
  }
}
