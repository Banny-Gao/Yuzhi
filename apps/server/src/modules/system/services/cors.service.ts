import { Injectable, Logger } from '@nestjs/common'
import { addAllowedOrigin, removeAllowedOrigin, getAllowedOrigins } from '../../../config/cors.config'

/**
 * CORS管理服务
 * 提供运行时管理CORS白名单的功能
 */
@Injectable()
export class CorsService {
  private readonly logger = new Logger(CorsService.name)

  /**
   * 获取当前允许的Origin列表
   */
  getAllowedOrigins(): string[] {
    return getAllowedOrigins()
  }

  /**
   * 添加新的Origin到白名单
   * @param origin 新的Origin URL
   */
  addOrigin(origin: string): string[] {
    this.logger.log(`添加Origin: ${origin}`)
    return addAllowedOrigin(origin)
  }

  /**
   * 批量添加Origins到白名单
   * @param origins Origin URL列表
   */
  addOrigins(origins: string[]): string[] {
    origins.forEach(origin => {
      addAllowedOrigin(origin)
    })
    return this.getAllowedOrigins()
  }

  /**
   * 从白名单中移除Origin
   * @param origin 要移除的Origin URL
   */
  removeOrigin(origin: string): string[] {
    this.logger.log(`移除Origin: ${origin}`)
    return removeAllowedOrigin(origin)
  }

  /**
   * 检查Origin是否在白名单中
   * @param origin 要检查的Origin URL
   */
  isOriginAllowed(origin: string): boolean {
    return getAllowedOrigins().includes(origin)
  }
}
