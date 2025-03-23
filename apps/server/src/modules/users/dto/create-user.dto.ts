import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator'

export class CreateUserDto {
  @ApiProperty({ example: 'johndoe', description: '用户名' })
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString({ message: '用户名必须是字符串' })
  @Length(3, 20, { message: '用户名长度必须在3-20个字符之间' })
  @Matches(/^[a-zA-Z0-9_]+$/, { message: '用户名只能包含字母、数字和下划线' })
  username: string

  @ApiProperty({ example: 'john@example.com', description: '电子邮件' })
  @IsNotEmpty({ message: '电子邮件不能为空' })
  @IsEmail({}, { message: '电子邮件格式不正确' })
  email: string

  @ApiProperty({ example: '13800138000', description: '手机号码' })
  @IsOptional()
  @Matches(/^1[3-9]\d{9}$/, { message: '手机号码格式不正确' })
  phoneNumber?: string

  @ApiProperty({ example: 'Password123!', description: '密码' })
  @IsNotEmpty({ message: '密码不能为空' })
  @Length(8, 30, { message: '密码长度必须在8-30个字符之间' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: '密码必须包含至少一个大写字母、一个小写字母、一个数字和一个特殊字符',
  })
  password: string
}
