import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger'
import { CorsService } from '../services/cors.service'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'

/**
 * CORS管理控制器
 * 提供管理CORS白名单的API
 * 注意：这些API应该只对管理员开放
 */
@ApiTags('System')
@Controller('system/cors')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard) // 确保只有登录用户可以访问
export class CorsController {
  constructor(private readonly corsService: CorsService) {}

  /**
   * 获取所有允许的Origin
   */
  @Get('origins')
  @ApiOperation({ summary: '获取CORS白名单' })
  getAllowedOrigins() {
    return {
      origins: this.corsService.getAllowedOrigins(),
    }
  }

  /**
   * 添加新的Origin到白名单
   */
  @Post('origins')
  @ApiOperation({ summary: '添加Origin到CORS白名单' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        origin: { type: 'string', example: 'http://example.com' },
      },
    },
  })
  addOrigin(@Body('origin') origin: string) {
    return {
      origins: this.corsService.addOrigin(origin),
      added: origin,
    }
  }

  /**
   * 从白名单中移除Origin
   */
  @Delete('origins/:origin')
  @ApiOperation({ summary: '从CORS白名单移除Origin' })
  removeOrigin(@Param('origin') origin: string) {
    return {
      origins: this.corsService.removeOrigin(origin),
      removed: origin,
    }
  }

  /**
   * 检查Origin是否在白名单中
   */
  @Get('origins/check/:origin')
  @ApiOperation({ summary: '检查Origin是否在CORS白名单中' })
  isOriginAllowed(@Param('origin') origin: string) {
    return {
      origin,
      allowed: this.corsService.isOriginAllowed(origin),
    }
  }
}
