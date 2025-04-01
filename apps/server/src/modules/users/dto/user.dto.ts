import { ApiProperty, ApiExtraModels } from '@nestjs/swagger'

/**
 * 用户DTO - 安全地表示用户数据，移除敏感字段如密码
 */
@ApiExtraModels()
export class UserDto {
  @ApiProperty({
    description: '用户ID',
    example: '5f7c1b9a-9b9a-4b9a-9b9a-9b9a9b9a9b9a',
  })
  id: string

  @ApiProperty({
    description: '用户名',
    example: 'johndoe',
  })
  username: string

  @ApiProperty({
    description: '邮箱',
    example: 'johndoe@example.com',
  })
  email: string

  @ApiProperty({
    description: '手机号',
    example: '13800138000',
  })
  phoneNumber: string

  @ApiProperty({
    description: '手机号是否已验证',
    example: true,
  })
  isPhoneVerified: boolean

  @ApiProperty({
    description: '邮箱是否已验证',
    example: false,
  })
  isEmailVerified: boolean

  @ApiProperty({
    description: '用户头像URL',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  avatar?: string

  @ApiProperty({
    description: '用户创建时间',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date

  @ApiProperty({
    description: '用户更新时间',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date
}
