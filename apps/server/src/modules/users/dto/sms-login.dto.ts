import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Matches } from 'class-validator'

export class SmsLoginDto {
  @ApiProperty({ example: '13800138000', description: '手机号码' })
  @IsNotEmpty({ message: '手机号不能为空' })
  @Matches(/^1[3-9]\d{9}$/, { message: '手机号码格式不正确' })
  phoneNumber: string

  @ApiProperty({ example: '123456', description: '验证码' })
  @IsNotEmpty({ message: '验证码不能为空' })
  @Matches(/^\d{6}$/, { message: '验证码必须是6位数字' })
  code: string
}
