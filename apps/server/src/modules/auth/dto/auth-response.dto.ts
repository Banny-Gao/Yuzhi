import { ApiProperty, ApiExtraModels } from '@nestjs/swagger'
import { UserDto } from '../../users/dto/user.dto'

/**
 * 令牌响应DTO - 包含访问令牌和刷新令牌
 */
@ApiExtraModels()
export class TokensResponseDto {
  @ApiProperty({
    description: '访问令牌',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string

  @ApiProperty({
    description: '刷新令牌',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string
}

/**
 * 登录响应DTO - 包含用户信息和令牌
 */
@ApiExtraModels()
export class LoginResponseDto extends TokensResponseDto {
  @ApiProperty({
    description: '用户信息',
    type: UserDto,
  })
  user: UserDto
}

/**
 * 注册响应DTO - 包含用户信息和令牌
 */
@ApiExtraModels()
export class RegisterResponseDto extends LoginResponseDto {}

/**
 * 短信登录响应DTO - 包含用户信息、令牌和是否新用户标志
 */
@ApiExtraModels()
export class SmsLoginResponseDto extends LoginResponseDto {
  @ApiProperty({
    description: '是否为新用户',
    example: false,
  })
  isNewUser: boolean
}

/**
 * 刷新令牌响应DTO
 */
@ApiExtraModels()
export class RefreshTokenResponseDto extends TokensResponseDto {}

/**
 * 退出登录响应DTO
 */
@ApiExtraModels()
export class LogoutResponseDto {
  @ApiProperty({
    description: '退出登录消息',
    example: '退出登录成功',
  })
  message: string
}
