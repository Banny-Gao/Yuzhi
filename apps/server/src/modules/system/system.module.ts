import { Module } from '@nestjs/common'
import { CorsService } from './services/cors.service'
import { CorsController } from './controllers/cors.controller'

/**
 * 系统管理模块
 * 提供系统级功能，如CORS配置管理
 */
@Module({
  providers: [CorsService],
  controllers: [CorsController],
  exports: [CorsService],
})
export class SystemModule {}
