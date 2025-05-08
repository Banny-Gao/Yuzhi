import Taro from '@tarojs/taro'

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

// 错误处理函数
export const showError = (error: Error | AppError) =>
  Taro.showToast({
    title: error?.message || '系统错误，请稍后重试',
    icon: 'none',
    duration: 2000,
  })

// 包装异步函数，自动处理错误
export const withErrorHandler = <T>(fn: () => Promise<T>): Promise<T> => {
  return fn().catch(error => {
    showError(error)
    return Promise.reject(error)
  })
}
