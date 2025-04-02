import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CorsConfig } from './entities/cors-config.entity'
import { CorsConfigService } from './services/cors-config.service'
import { CorsService } from './services/cors.service'
import { CorsController } from './controllers/cors.controller'

/**
 * 系统管理模块
 * 提供系统级功能，如CORS配置管理
 */
@Module({
  imports: [TypeOrmModule.forFeature([CorsConfig])],
  providers: [CorsConfigService, CorsService],
  controllers: [CorsController],
  exports: [CorsConfigService, CorsService],
})
export class SystemModule {}
