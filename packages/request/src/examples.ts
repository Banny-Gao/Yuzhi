/**
 * API客户端使用示例
 * @description 展示如何使用优化后的API客户端
 * 注意：这些示例为了说明API用法，实际方法名称和参数需要根据实际生成的API服务调整
 */

import {
  setupApiClient,
  AuthService,
  SolarTermsService,
  withRetry,
  withTimeout,
  withCache,
  handleApiError,
  createPaginator,
  ResponseStatus,
  isRetryable,
  getStatusMessage,
  isSuccess,
  isRedirect,
  isClientError,
  isServerError,
  StatusGroups,
} from './index'

// 为了示例目的，定义一些示例类型
interface LoginResponse {
  accessToken: string
  user: {
    id: string
    username: string
  }
}

interface SolarTerm {
  id: string
  name: string
  date: string
  description: string
}

interface PaginatedResponse<T> {
  items: T[]
  totalCount: number
  hasMore: boolean
}

/**
 * 基本配置示例
 */
export function setupExample() {
  // 初始化API客户端
  setupApiClient({
    baseUrl: 'https://api.example.com',
    withAuth: true,
    timeout: 10000, // 10秒超时

    // 获取token的函数
    getToken: () => localStorage.getItem('token'),

    // 请求拦截器示例
    requestInterceptor: config => {
      // 添加应用版本头
      config.headers['X-App-Version'] = '1.0.0'
      return config
    },

    // 响应拦截器示例
    responseInterceptor: response => {
      // 可以在这里处理某些全局响应逻辑
      if (response.headers['x-deprecation-notice']) {
        console.warn('API 即将弃用:', response.headers['x-deprecation-notice'])
      }
      return response
    },

    // 错误拦截器示例
    errorInterceptor: error => {
      // 全局错误处理
      if (error.response) {
        const status = error.response.status

        if (status === ResponseStatus.UNAUTHORIZED) {
          // 未登录，重定向到登录页
          localStorage.removeItem('token')
          window.location.href = '/login'
        }
      }

      return Promise.reject(error)
    },

    // 请求重试配置
    retry: {
      maxRetries: 3,
      retryDelay: 1000,
      statusCodes: [ResponseStatus.ERROR, ResponseStatus.BAD_GATEWAY, ResponseStatus.SERVICE_UNAVAILABLE],
    },
  })
}

/**
 * 登录示例
 * 注意：实际方法名称和参数需要根据实际生成的API服务调整
 */
export async function loginExample(username: string, password: string) {
  try {
    // 模拟登录API调用
    // 在实际使用中，应替换为实际生成的API方法
    const loginRequest = async () => {
      // 通过类型断言使用示例接口
      // 此处仅为示例，实际应使用生成的方法
      const mockLoginFn = async () => {
        return {
          accessToken: 'example-token',
          user: {
            id: '123',
            username: username,
          },
        } as LoginResponse
      }

      // 根据实际生成的API服务调整
      // 如果AuthService.login存在，则可以直接使用
      return AuthService.authControllerLogin({
        usernameOrPhone: username,
        password: password,
        rememberMe: true,
      })

      return mockLoginFn()
    }

    // 使用带超时的登录请求
    const result = await withTimeout(loginRequest, { timeout: 5000 })

    // 保存令牌
    localStorage.setItem('token', result.accessToken)

    return result
  } catch (error) {
    // 使用标准错误处理
    const errorMessage = handleApiError(error, '登录失败')
    console.error(errorMessage)
    throw error
  }
}

/**
 * 获取带重试的API数据示例
 * 注意：实际方法名称和参数需要根据实际生成的API服务调整
 */
export async function getSolarTermsWithRetry() {
  try {
    // 模拟API调用
    const getSolarTerms = async (): Promise<SolarTerm[]> => {
      // 此处仅为示例，实际应使用生成的方法
      const result = await SolarTermsService.solarTermsControllerGetSolarTerms()
      return result as unknown as SolarTerm[]
    }

    // 使用带重试功能的请求
    const result = await withRetry(getSolarTerms, {
      maxRetries: 3,
      retryDelay: retryCount => Math.pow(2, retryCount) * 1000, // 指数退避
      statusCodes: [ResponseStatus.ERROR, ResponseStatus.SERVICE_UNAVAILABLE, ResponseStatus.BAD_GATEWAY],
    })

    return result
  } catch (error) {
    console.error('获取数据失败:', handleApiError(error))
    throw error
  }
}

/**
 * 缓存数据示例
 * 注意：实际方法名称和参数需要根据实际生成的API服务调整
 */
export async function getCachedSolarTerms() {
  // 模拟API调用
  const getSolarTerms = async (): Promise<SolarTerm[]> => {
    // 此处仅为示例，实际应使用生成的方法
    // 如果SolarTermsService.getSolarTerms存在，则可以直接使用
    // return SolarTermsService.getSolarTerms();

    return [
      { id: '1', name: '立春', date: '2023-02-04', description: '立春描述' },
      { id: '2', name: '雨水', date: '2023-02-19', description: '雨水描述' },
    ]
  }

  // 使用缓存功能
  return withCache(getSolarTerms, {
    key: 'solar-terms',
    ttl: 60 * 60 * 1000, // 1小时缓存
  })
}

/**
 * 分页加载示例
 * 注意：实际方法名称和参数需要根据实际生成的API服务调整
 */
export function createSolarTermsPaginator() {
  // 创建分页器
  const paginator = createPaginator<SolarTerm>({
    fetchPage: async (page, pageSize) => {
      // 模拟分页API调用
      // 此处仅为示例，实际应使用生成的方法
      const getSolarTermsPaginated = async (params: { page: number; pageSize: number }) => {
        // 如果SolarTermsService.getSolarTermsPaginated存在，则可以直接使用
        // return SolarTermsService.getSolarTermsPaginated(params);

        // 模拟分页数据
        const allItems: SolarTerm[] = []
        for (let i = 1; i <= 30; i++) {
          allItems.push({
            id: i.toString(),
            name: `节气${i}`,
            date: `2023-${Math.floor(i / 2) + 1}-${(i % 30) + 1}`,
            description: `节气${i}的描述`,
          })
        }

        // 计算分页
        const startIdx = (params.page - 1) * params.pageSize
        const endIdx = startIdx + params.pageSize
        const paginatedItems = allItems.slice(startIdx, endIdx)

        return {
          items: paginatedItems,
          totalCount: allItems.length,
          hasMore: endIdx < allItems.length,
        } as PaginatedResponse<SolarTerm>
      }

      const response = await getSolarTermsPaginated({
        page,
        pageSize,
      })

      return {
        items: response.items,
        total: response.totalCount,
        hasMore: response.hasMore,
      }
    },
    pageSize: 10,
  })

  // 使用分页器
  async function loadMoreItems() {
    try {
      const items = await paginator.loadNextPage()
      return items
    } catch (error) {
      console.error('加载更多失败:', handleApiError(error))
      throw error
    }
  }

  // 返回分页器和加载函数
  return {
    paginator,
    loadMoreItems,
  }
}

/**
 * 完整API使用流程示例
 */
export async function completeWorkflow() {
  // 1. 设置客户端
  setupExample()

  // 2. 登录
  try {
    await loginExample('username', 'password')
    console.log('登录成功')

    // 3. 获取数据
    try {
      // 首先尝试使用缓存
      const cachedData = await getCachedSolarTerms()
      console.log('获取数据成功:', cachedData)

      // 使用分页加载更多数据
      const { paginator, loadMoreItems } = createSolarTermsPaginator()

      // 加载第一页
      await paginator.loadFirstPage()
      console.log('已加载第一页数据:', paginator.items)

      // 模拟加载更多
      if (paginator.hasMore) {
        await loadMoreItems()
        console.log('已加载更多数据，当前项目数:', paginator.items.length)
      }
    } catch (error) {
      console.error('数据操作失败:', handleApiError(error))
    }
  } catch (error) {
    console.error('工作流失败:', handleApiError(error))
  }
}

/**
 * 状态码工具函数示例
 */
export function statusUtilsExample() {
  // isRetryable - 检查状态码是否应该重试
  const checkRetryableStatus = (status: number) => {
    if (isRetryable(status)) {
      console.log(`状态码 ${status} (${getStatusMessage(status)}) 应该进行重试`)
      return true
    } else {
      console.log(`状态码 ${status} (${getStatusMessage(status)}) 不应该重试`)
      return false
    }
  }

  // 检查各种状态码
  checkRetryableStatus(ResponseStatus.SUCCESS) // 200 - 不重试
  checkRetryableStatus(ResponseStatus.BAD_REQUEST) // 400 - 不重试
  checkRetryableStatus(ResponseStatus.UNAUTHORIZED) // 401 - 不重试
  checkRetryableStatus(ResponseStatus.ERROR) // 500 - 重试
  checkRetryableStatus(ResponseStatus.BAD_GATEWAY) // 502 - 重试
  checkRetryableStatus(ResponseStatus.TOO_MANY_REQUESTS) // 429 - 重试

  // 自定义错误处理逻辑
  const handleErrorByStatus = (status: number, error?: Error) => {
    const message = getStatusMessage(status)

    if (status === ResponseStatus.SUCCESS) {
      console.log('请求成功')
    } else if (status === ResponseStatus.UNAUTHORIZED) {
      console.log('需要登录:', message)
      // 跳转到登录页
    } else if (status === ResponseStatus.FORBIDDEN) {
      console.log('无权访问:', message)
      // 显示无权限页面
    } else if (isRetryable(status)) {
      console.log('服务暂时不可用，正在重试:', message)
      // 实现重试逻辑
    } else {
      console.error('请求错误:', message, error)
      // 显示错误信息
    }
  }

  // 测试不同状态码
  handleErrorByStatus(ResponseStatus.SUCCESS)
  handleErrorByStatus(ResponseStatus.UNAUTHORIZED)
  handleErrorByStatus(ResponseStatus.FORBIDDEN)
  handleErrorByStatus(ResponseStatus.SERVICE_UNAVAILABLE, new Error('服务器维护中'))

  // API错误处理示例
  try {
    // 模拟API错误
    throw {
      name: 'ApiError',
      status: ResponseStatus.ERROR,
      message: '服务器内部错误',
      response: {
        status: ResponseStatus.ERROR,
        data: { message: '服务器处理请求时发生错误' },
      },
    }
  } catch (error) {
    // 使用handleApiError处理错误
    const userFriendlyMessage = handleApiError(error, '操作失败')
    console.error(userFriendlyMessage)

    // 根据状态码决定是否重试
    const status = (error as any).status || ResponseStatus.ERROR
    if (isRetryable(status)) {
      console.log('正在尝试重试请求...')
      // 实现重试逻辑
    }
  }
}

/**
 * 演示响应状态码辅助函数的使用
 */
export function statusHelperExample() {
  // 创建一个模拟的响应处理函数
  const handleResponse = (status: number) => {
    console.log(`处理状态码: ${status} (${getStatusMessage(status)})`)

    if (isSuccess(status)) {
      console.log('✅ 成功: 处理响应数据')
    } else if (isRedirect(status)) {
      console.log('➡️ 重定向: 处理新位置')
    } else if (isClientError(status)) {
      console.log('❌ 客户端错误: 显示错误信息')

      // 进一步细分客户端错误
      switch (status) {
        case ResponseStatus.UNAUTHORIZED:
          console.log('  - 用户未登录，重定向到登录页')
          break
        case ResponseStatus.FORBIDDEN:
          console.log('  - 无访问权限，显示权限错误')
          break
        case ResponseStatus.NOT_FOUND:
          console.log('  - 资源不存在，显示404页面')
          break
        default:
          console.log('  - 其他客户端错误')
      }
    } else if (isServerError(status)) {
      console.log('🔥 服务器错误: 显示服务器错误提示')

      // 检查是否应重试
      if (isRetryable(status)) {
        console.log('  - 可重试错误，安排重试')
      } else {
        console.log('  - 不可重试错误，显示故障提示')
      }
    }
  }

  // 测试各种状态码
  console.log('=== 2xx 成功状态 ===')
  handleResponse(ResponseStatus.SUCCESS) // 200
  handleResponse(ResponseStatus.CREATED) // 201
  handleResponse(ResponseStatus.NO_CONTENT) // 204

  console.log('\n=== 3xx 重定向状态 ===')
  handleResponse(ResponseStatus.MOVED_PERMANENTLY) // 301
  handleResponse(ResponseStatus.FOUND) // 302

  console.log('\n=== 4xx 客户端错误 ===')
  handleResponse(ResponseStatus.BAD_REQUEST) // 400
  handleResponse(ResponseStatus.UNAUTHORIZED) // 401
  handleResponse(ResponseStatus.FORBIDDEN) // 403
  handleResponse(ResponseStatus.NOT_FOUND) // 404

  console.log('\n=== 5xx 服务器错误 ===')
  handleResponse(ResponseStatus.ERROR) // 500
  handleResponse(ResponseStatus.SERVICE_UNAVAILABLE) // 503

  // 展示状态码组的使用
  console.log('\n=== 使用状态码分组 ===')
  console.log('可重试状态码:', StatusGroups.RETRYABLE_CODES.map(code => `${code} (${getStatusMessage(code)})`).join(', '))
}
