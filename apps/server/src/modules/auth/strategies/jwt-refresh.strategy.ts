import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.refreshSecret'),
      passReqToCallback: true,
    })
  }

  async validate(req: Request, payload: any) {
    // Extract the refreshToken from the Authorization header
    const authHeader = req.headers.authorization
    const refreshToken = authHeader?.split(' ')[1] // Bearer <token>

    return {
      ...payload,
      refreshToken,
    }
  }
}
