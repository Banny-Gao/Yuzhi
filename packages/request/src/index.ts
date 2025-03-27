/**
 * 自动生成的API客户端
 * @description 此文件导出所有API服务和类型
 */

// 导出所有生成的服务和模型
export * from './generated'

// 导出配置API客户端的方法
export { ApiError, CancelablePromise, OpenAPI } from './generated'

// 为Axios配置添加拦截器的工具函数
export { setupApiClient } from './setup'
