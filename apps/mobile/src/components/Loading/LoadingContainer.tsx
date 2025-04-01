import { forwardRef, useImperativeHandle } from 'react'
import Loading from './index'

/**
 * 全局Loading容器组件
 * 用于在应用根组件中渲染Loading指示器
 *
 * 使用方法：
 * 在应用根组件中添加：<LoadingContainer />
 *
 * 在API请求时自动处理，无需手动调用
 */
const LoadingContainer = forwardRef<{ initialize: () => void }>((_, ref) => {
  // 暴露初始化方法给父组件
  useImperativeHandle(ref, () => ({
    initialize: () => {
      console.log('Initialize called from ref')
      // 触发初始化过程
      const timer = setTimeout(() => {
        import('./index').then(module => {
          module.initializeLoadingCanvas()
        })
      }, 100)
      return () => clearTimeout(timer)
    },
  }))

  return <Loading size={120} />
})

export default LoadingContainer
