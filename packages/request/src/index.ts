/**
 * 自动生成的API客户端
 * @description 此文件导出所有API服务和类型
 */

// 导出API客户端配置工具
export { setupApiClient, clearApiClientSetup } from './setup'
export type { ApiClientOptions } from './setup'

// 这些导出将在运行 generate 命令后生效
// 如果您看到错误，请先运行 npm run generate
export * from './generated'

// 导出响应状态码和工具函数
export { ResponseStatus, StatusGroups, isSuccess, isRedirect, isClientError, isServerError, isRetryable, getStatusMessage } from './status'

// 导出实用工具函数
export { withRetry, withTimeout, withCache, handleApiError, clearCache, createPaginator, DEFAULT_RETRY_CONFIG } from './utils'

export type { RetryConfig, TimeoutOptions, CacheOptions, PaginationOptions } from './utils'
