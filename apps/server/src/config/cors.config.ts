import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface'

/**
 * 允许的跨域请求来源
 * 开发环境和生产环境的前端域名列表
 */
export const allowedOrigins = [
  // 开发环境
  'http://localhost:10086',
  'http://192.168.72.31:10086',

  // 可以添加生产环境域名
  // 'https://example.com',
]

/**
 * CORS配置选项
 */
export const corsOptions: CorsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true, // 允许携带认证信息(cookies, headers等)
  allowedHeaders: ['Content-Type', 'Authorization', 'X-App-Version', 'X-Platform'],
  exposedHeaders: ['X-Auth-Token'], // 允许浏览器访问这些响应头
}

/**
 * 添加允许的Origin到白名单
 * @param origin 新的Origin URL
 * @returns 当前白名单列表
 */
export const addAllowedOrigin = (origin: string): string[] => {
  if (!allowedOrigins.includes(origin)) {
    allowedOrigins.push(origin)
    console.log(`已添加Origin到CORS白名单: ${origin}`)
  }
  return allowedOrigins
}

/**
 * 从白名单中移除Origin
 * @param origin 要移除的Origin URL
 * @returns 当前白名单列表
 */
export const removeAllowedOrigin = (origin: string): string[] => {
  const index = allowedOrigins.indexOf(origin)
  if (index !== -1) {
    allowedOrigins.splice(index, 1)
    console.log(`已从CORS白名单移除Origin: ${origin}`)
  }
  return allowedOrigins
}

/**
 * 获取当前允许的Origin列表
 * @returns 当前白名单列表
 */
export const getAllowedOrigins = (): string[] => {
  return [...allowedOrigins]
}
