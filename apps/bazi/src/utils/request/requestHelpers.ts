/**
 * 请求助手工具函数
 * @description 提供在移动应用中使用的API请求辅助函数
 */
import { handleApiError, withRetry, DEFAULT_RETRY_CONFIG } from './hooks'
import { showToast } from '@tarojs/taro'

// 自定义错误类
export class AppError extends Error {
  constructor(
    message: string,
    public code?: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}

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
  requestFn: () => Promise<T>,
  errorMessage = '请求出错，请稍后重试'
): Promise<T> => {
  try {
    // 使用请求包中的重试工具函数
    const response = await withRetry(requestFn, DEFAULT_RETRY_CONFIG)
    return response
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
