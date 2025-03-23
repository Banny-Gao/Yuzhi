import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'
import { UsersService } from '../../users/users.service'

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.refreshSecret'),
      passReqToCallback: true,
    })
  }

  async validate(req: Request, payload: any) {
    const refreshToken = req.headers.authorization?.replace('Bearer ', '').trim()
    if (!refreshToken) {
      throw new UnauthorizedException('刷新令牌不存在')
    }

    try {
      const user = await this.usersService.findById(payload.sub)
      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('刷新令牌已失效')
      }

      return {
        ...user,
        refreshToken,
      }
    } catch (error) {
      throw new UnauthorizedException('刷新令牌已失效')
    }
  }
}
