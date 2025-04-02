import { Injectable } from '@nestjs/common'
import { CorsConfigService } from './cors-config.service'
import { CorsConfigDto } from '../dto/cors.dto'
import { CorsConfig } from '../entities/cors-config.entity'

/**
 * CORS管理服务
 * 提供运行时管理CORS白名单的功能
 */
@Injectable()
export class CorsService {
  constructor(private readonly corsConfigService: CorsConfigService) {}

  private mapToDto(config: CorsConfig): CorsConfigDto {
    return {
      origin: config.origin,
      isActive: config.isActive,
      createdAt: config.createdAt,
      updatedAt: config.updatedAt,
    }
  }

  /**
   * 获取当前允许的Origin列表
   */
  async getAllowedOrigins(): Promise<CorsConfigDto[]> {
    const configs = await this.corsConfigService.getAllowedOrigins()
    return configs.map(config => this.mapToDto(config))
  }

  /**
   * 添加新的Origin到白名单
   * @param origin 新的Origin URL
   */
  async addAllowedOrigin(origin: string): Promise<CorsConfigDto> {
    const configs = await this.corsConfigService.addAllowedOrigin(origin)
    const config = configs.find(c => c.origin === origin)
    if (!config) {
      throw new Error('Failed to add origin')
    }
    return this.mapToDto(config)
  }

  /**
   * 批量添加Origins到白名单
   * @param origins Origin URL列表
   */
  async addOrigins(origins: string[]): Promise<CorsConfigDto[]> {
    const results: CorsConfigDto[] = []
    for (const origin of origins) {
      const config = await this.addAllowedOrigin(origin)
      results.push(config)
    }
    return results
  }

  /**
   * 从白名单中移除Origin
   * @param origin 要移除的Origin URL
   */
  async removeAllowedOrigin(origin: string): Promise<boolean> {
    return this.corsConfigService.removeAllowedOrigin(origin)
  }

  /**
   * 检查Origin是否在白名单中
   * @param origin 要检查的Origin URL
   */
  async isOriginAllowed(origin: string): Promise<boolean> {
    const configs = await this.getAllowedOrigins()
    return configs.some(config => config.origin === origin)
  }
}
