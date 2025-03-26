import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { AuthService } from '../auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'usernameOrPhone', // 使用usernameOrPhone字段替代默认的username字段
    })
  }

  async validate(usernameOrPhone: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(usernameOrPhone, password)
    if (!user) {
      throw new UnauthorizedException('用户名/手机号或密码不正确')
    }
    return user
  }
}
