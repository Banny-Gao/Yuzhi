import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CorsConfig } from '../entities/cors-config.entity'

@Injectable()
export class CorsConfigService {
  private readonly logger = new Logger(CorsConfigService.name)
  private cachedConfigs: CorsConfig[] = []

  constructor(
    @InjectRepository(CorsConfig)
    private corsConfigRepository: Repository<CorsConfig>
  ) {
    this.initializeOrigins()
  }

  private async initializeOrigins() {
    try {
      const configs = await this.corsConfigRepository.find({
        where: { isActive: true },
      })
      this.cachedConfigs = configs
      this.logger.debug(`Initialized CORS origins from database: ${configs.map(config => config.origin).join(', ')}`)
    } catch (error) {
      this.logger.error('Failed to initialize CORS origins:', error)
    }
  }

  async getAllowedOrigins(): Promise<CorsConfig[]> {
    return this.cachedConfigs
  }

  async addAllowedOrigin(origin: string): Promise<CorsConfig[]> {
    try {
      if (!this.cachedConfigs.some(config => config.origin === origin)) {
        // 检查数据库中是否已存在但未激活
        let config = await this.corsConfigRepository.findOne({
          where: { origin },
        })

        if (config) {
          if (!config.isActive) {
            config.isActive = true
            config = await this.corsConfigRepository.save(config)
          }
        } else {
          config = await this.corsConfigRepository.save({
            origin,
            isActive: true,
          })
        }

        this.cachedConfigs.push(config)
        this.logger.debug(`Added origin to CORS whitelist: ${origin}`)
      }
    } catch (error) {
      this.logger.error(`Failed to add origin to CORS whitelist: ${origin}`, error)
    }

    return this.cachedConfigs
  }

  async removeAllowedOrigin(origin: string): Promise<boolean> {
    try {
      const config = await this.corsConfigRepository.findOne({
        where: { origin },
      })

      if (config) {
        config.isActive = false
        await this.corsConfigRepository.save(config)
        this.cachedConfigs = this.cachedConfigs.filter(c => c.origin !== origin)
        this.logger.debug(`Removed origin from CORS whitelist: ${origin}`)
        return true
      }
    } catch (error) {
      this.logger.error(`Failed to remove origin from CORS whitelist: ${origin}`, error)
    }

    return false
  }
}
