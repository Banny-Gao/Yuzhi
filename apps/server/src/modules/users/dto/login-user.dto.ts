import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsOptional } from 'class-validator'

export class LoginUserDto {
  @ApiProperty({ example: 'admin', description: '用户名或手机号' })
  @IsNotEmpty({ message: '用户名/手机号不能为空' })
  @IsString({ message: '用户名/手机号必须是字符串' })
  usernameOrPhone: string

  @ApiProperty({ example: 'Admin@123', description: '密码' })
  @IsNotEmpty({ message: '密码不能为空' })
  @IsString({ message: '密码必须是字符串' })
  password: string

  @ApiProperty({ example: true, description: '是否记住登录状态', required: false })
  @IsOptional()
  rememberMe?: boolean
}
