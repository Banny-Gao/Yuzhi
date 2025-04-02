import { Controller, Get, Post, Delete, Body, Param, UseGuards, HttpStatus } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiOkResponse, ApiCreatedResponse, ApiExtraModels } from '@nestjs/swagger'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../../auth/guards/roles.guard'
import { Roles } from '../../auth/decorators/roles.decorator'
import { CorsService } from '../services/cors.service'
import { AddOriginDto, AddOriginsDto, RemoveOriginDto, CorsConfigDto } from '../dto/cors.dto'
import { ApiResponse } from '../../../common/dto/api-response.dto'

/**
 * CORS管理控制器
 * 提供管理CORS白名单的API
 * 注意：这些API应该只对管理员开放
 */
@ApiTags('系统配置')
@Controller('system/cors')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@ApiExtraModels(ApiResponse, CorsConfigDto, AddOriginDto, AddOriginsDto, RemoveOriginDto)
export class CorsController {
  constructor(private readonly corsService: CorsService) {}

  /**
   * 获取所有允许的Origin
   */
  @Get('origins')
  @ApiOperation({ summary: '获取CORS白名单列表' })
  @ApiOkResponse({
    description: '获取成功',
    schema: {
      allOf: [
        { $ref: '#/components/schemas/ApiResponse' },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/CorsConfigDto' },
            },
          },
        },
      ],
    },
  })
  @Roles('admin')
  async getAllowedOrigins(): Promise<ApiResponse<CorsConfigDto[]>> {
    const origins = await this.corsService.getAllowedOrigins()
    return {
      code: HttpStatus.OK,
      data: origins,
      message: '获取CORS白名单列表成功',
    }
  }

  /**
   * 添加新的Origin到白名单
   */
  @Post('origin')
  @ApiOperation({ summary: '添加域名到CORS白名单' })
  @ApiCreatedResponse({
    description: '添加成功',
    schema: {
      allOf: [
        { $ref: '#/components/schemas/ApiResponse' },
        {
          properties: {
            data: {
              $ref: '#/components/schemas/CorsConfigDto',
            },
          },
        },
      ],
    },
  })
  @Roles('admin')
  async addOrigin(@Body() dto: AddOriginDto): Promise<ApiResponse<CorsConfigDto>> {
    const result = await this.corsService.addAllowedOrigin(dto.origin)
    return {
      code: HttpStatus.CREATED,
      data: result,
      message: '添加域名到CORS白名单成功',
    }
  }

  @Post('origins')
  @ApiOperation({ summary: '批量添加域名到CORS白名单' })
  @ApiCreatedResponse({
    description: '批量添加成功',
    schema: {
      allOf: [
        { $ref: '#/components/schemas/ApiResponse' },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/CorsConfigDto' },
            },
          },
        },
      ],
    },
  })
  @Roles('admin')
  async addOrigins(@Body() dto: AddOriginsDto): Promise<ApiResponse<CorsConfigDto[]>> {
    const results = await this.corsService.addOrigins(dto.origins)
    return {
      code: HttpStatus.CREATED,
      data: results,
      message: '批量添加域名到CORS白名单成功',
    }
  }

  /**
   * 从白名单中移除Origin
   */
  @Delete('origin')
  @ApiOperation({ summary: '从CORS白名单移除域名' })
  @ApiOkResponse({
    description: '移除成功',
    schema: {
      allOf: [
        { $ref: '#/components/schemas/ApiResponse' },
        {
          properties: {
            data: {
              type: 'boolean',
            },
          },
        },
      ],
    },
  })
  @Roles('admin')
  async removeOrigin(@Body() dto: RemoveOriginDto): Promise<ApiResponse<boolean>> {
    const result = await this.corsService.removeAllowedOrigin(dto.origin)
    return {
      code: HttpStatus.OK,
      data: result,
      message: '从CORS白名单移除域名成功',
    }
  }

  /**
   * 检查Origin是否在白名单中
   */
  @Get('origins/check/:origin')
  @ApiOperation({ summary: '检查Origin是否在CORS白名单中' })
  @ApiOkResponse({
    description: '检查成功',
    schema: {
      allOf: [
        { $ref: '#/components/schemas/ApiResponse' },
        {
          properties: {
            data: {
              type: 'object',
              properties: {
                origin: { type: 'string' },
                allowed: { type: 'boolean' },
              },
            },
          },
        },
      ],
    },
  })
  async isOriginAllowed(@Param('origin') origin: string): Promise<ApiResponse<{ origin: string; allowed: boolean }>> {
    const allowed = await this.corsService.isOriginAllowed(origin)
    return {
      code: HttpStatus.OK,
      data: { origin, allowed },
      message: '检查域名是否在CORS白名单中成功',
    }
  }
}
