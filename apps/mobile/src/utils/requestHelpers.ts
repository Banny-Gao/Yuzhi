/**
 * 请求助手工具函数
 * @description 提供在移动应用中使用的API请求辅助函数
 */
import { handleApiError, withRetry, DEFAULT_RETRY_CONFIG } from '@workspace/request'
import { showToast } from '@tarojs/taro'
import { AppError } from './error'

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
export const withErrorHandling = async <T>(requestFn: () => Promise<T>, errorMessage = '请求出错，请稍后重试'): Promise<T> => {
  try {
    // 使用请求包中的重试工具函数
    return await withRetry(requestFn, DEFAULT_RETRY_CONFIG)
  } catch (error) {
    // 显示错误提示
    showApiError(error, errorMessage)

    // 将错误转换为应用错误
    if (error instanceof Error) {
      throw new AppError(error.message)
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
    if (!error.response && error.request) {
      // 网络错误
      showToast({
        title: '网络连接不可用，请检查您的网络设置',
        icon: 'none',
        duration: 3000,
      })
    }

    return Promise.reject(error)
  })
}
