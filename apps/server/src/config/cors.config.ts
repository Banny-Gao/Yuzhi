import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface'
import { Injectable } from '@nestjs/common'
import { CorsConfigService } from '../modules/system/services/cors-config.service'

@Injectable()
export class CorsConfig {
  constructor(private readonly corsConfigService: CorsConfigService) {}

  async createCorsOptions(): Promise<CorsOptions> {
    const configs = await this.corsConfigService.getAllowedOrigins()
    const allowedOrigins = ['http://localhost:3000', ...configs.map(config => config.origin)]

    return {
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
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
