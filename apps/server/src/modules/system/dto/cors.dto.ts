import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsArray, IsNotEmpty, IsUrl } from 'class-validator'

export class AddOriginDto {
  @ApiProperty({
    description: '要添加到CORS白名单的域名',
    example: 'https://example.com',
  })
  @IsNotEmpty({ message: '域名不能为空' })
  @IsString({ message: '域名必须是字符串' })
  @IsUrl({}, { message: '域名格式不正确' })
  origin: string
}

export class AddOriginsDto {
  @ApiProperty({
    description: '要批量添加到CORS白名单的域名列表',
    example: ['https://example1.com', 'https://example2.com'],
    type: [String],
  })
  @IsArray({ message: '域名列表必须是数组' })
  @IsString({ each: true, message: '每个域名必须是字符串' })
  @IsUrl({}, { each: true, message: '域名格式不正确' })
  origins: string[]
}

export class RemoveOriginDto {
  @ApiProperty({
    description: '要从CORS白名单移除的域名',
    example: 'https://example.com',
  })
  @IsNotEmpty({ message: '域名不能为空' })
  @IsString({ message: '域名必须是字符串' })
  @IsUrl({}, { message: '域名格式不正确' })
  origin: string
}

export class CorsConfigDto {
  @ApiProperty({
    description: '域名',
    example: 'https://example.com',
  })
  origin: string

  @ApiProperty({
    description: '是否启用',
    example: true,
  })
  isActive: boolean

  @ApiProperty({
    description: '创建时间',
    example: '2024-04-02T00:00:00.000Z',
  })
  createdAt: Date

  @ApiProperty({
    description: '更新时间',
    example: '2024-04-02T00:00:00.000Z',
  })
  updatedAt: Date
}
