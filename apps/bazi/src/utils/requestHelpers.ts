/**
 * 请求助手工具函数
 * @description 提供在移动应用中使用的API请求辅助函数
 */
import { handleApiError, withRetry, DEFAULT_RETRY_CONFIG } from '@workspace/request'
import { showToast } from '@tarojs/taro'
import { AppError } from './error'

import type { ApiResponse } from '@workspace/request'

/**
 * 显示API错误提示
 * @param error 捕获到的错误
 * @param defaultMessage 默认错误消息
 */
export const showApiError = (error: unknown, defaultMessage = '请求失败'): void => {
  const errorMessage = handleApiError(error, defaultMessage)

  showToast({
    title: errorMessage,
    icon: 'none',
    duration: 2000,
  })
}

/**
 * 包装API请求，统一处理错误和重试
 * @param requestFn 原始请求函数
 * @param errorMessage 发生错误时显示的消息
 */
export const withErrorHandling = async <T>(
  requestFn: () => Promise<ApiResponse<T>>,
  errorMessage = '请求出错，请稍后重试'
): Promise<T> => {
  try {
    // 使用请求包中的重试工具函数
    const response = await withRetry(requestFn, DEFAULT_RETRY_CONFIG)

    const apiResponse = response as ApiResponse<T>
    // 检查是否是错误响应 (非2xx状态码)
    if (apiResponse.code >= 400) {
      throw new AppError(apiResponse.message || errorMessage)
    }

    // 如果是正常响应，返回data字段
    return apiResponse.data
  } catch (error) {
    // 防止多次显示同一错误，检查是否已经是AppError
    if (!(error instanceof AppError)) {
      // 显示错误提示
      showApiError(error, errorMessage)
    }

    // 将错误转换为应用错误
    if (error instanceof Error) {
      throw new AppError(error.message || errorMessage)
    }

    throw new AppError(errorMessage)
  }
}

/**
 * 检查网络并执行请求
 * 在网络不可用时提供友好提示
 */
export const withNetworkCheck = <T>(requestFn: () => Promise<T>): Promise<T> => {
  // 这里可以添加网络连接检查逻辑，如果在Taro环境中有这样的API

  return requestFn().catch(error => {
    // 检查是否已经是AppError，避免重复处理
    if (error instanceof AppError) {
      return Promise.reject(error)
    }

    // 处理网络错误
    if (
      !error.response &&
      (error.request ||
        error.message?.includes('network') ||
        error.message?.includes('Network') ||
        error.name === 'AbortError')
    ) {
      // 网络错误
      const networkError = new AppError('网络连接不可用，请检查您的网络设置')
      showToast({
        title: networkError.message,
        icon: 'none',
        duration: 3000,
      })
      return Promise.reject(networkError)
    }

    // 未知错误原样返回
    return Promise.reject(error)
  })
}
