import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface'
import { Injectable } from '@nestjs/common'
import { CorsConfigService } from '../modules/system/services/cors-config.service'

@Injectable()
export class CorsConfig {
  constructor(private readonly corsConfigService: CorsConfigService) {}

  async createCorsOptions(): Promise<CorsOptions> {
    return {
      origin: async (origin, callback) => {
        const configs = await this.corsConfigService.getAllowedOrigins()
        const allowedOrigins = ['http://localhost', ...configs.map(config => config.origin)]
        const isAllowedOrigin = (origin: string): boolean => {
          return allowedOrigins.some(allowedOrigin => origin.startsWith(allowedOrigin))
        }
        if (!origin || isAllowedOrigin(origin)) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      exposedHeaders: ['Content-Disposition'],
    }
  }
}
