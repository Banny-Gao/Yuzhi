import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcrypt'
import { UsersService } from '../users/users.service'
import { CreateUserDto } from '../users/dto/create-user.dto'
import { LoginUserDto } from '../users/dto/login-user.dto'
import { SmsLoginDto } from '../users/dto/sms-login.dto'
import { LoginResponseDto, RegisterResponseDto, SmsLoginResponseDto, RefreshTokenResponseDto, LogoutResponseDto } from './dto/auth-response.dto'
import { UserDto } from '../users/dto/user.dto'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async validateUser(usernameOrPhone: string, password: string): Promise<Omit<UserDto, 'password' | 'refreshToken'> | null> {
    const user = await this.usersService.findByUsernameOrPhone(usernameOrPhone)
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, refreshToken, ...result } = user
      return result
    }
    return null
  }

  async register(createUserDto: CreateUserDto): Promise<RegisterResponseDto> {
    try {
      const user = await this.usersService.create(createUserDto)
      const { password, refreshToken, ...userData } = user
      const tokens = await this.getTokens(user.id, user.username)
      await this.usersService.updateRefreshToken(user.id, tokens.refreshToken)

      // Format the response to match RegisterResponseDto
      return {
        ...tokens,
        user: userData as UserDto,
      }
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error
      }
      throw new BadRequestException('注册失败')
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<LoginResponseDto> {
    const user = await this.validateUser(loginUserDto.usernameOrPhone, loginUserDto.password)

    if (!user) {
      throw new UnauthorizedException('用户名/手机号或密码不正确')
    }

    const tokens = await this.getTokens(user.id, user.username)

    // 如果选择记住登录状态，则更新刷新令牌
    if (loginUserDto.rememberMe) {
      await this.usersService.updateRefreshToken(user.id, tokens.refreshToken)
    }

    // Format the response to match LoginResponseDto
    return {
      ...tokens,
      user: user as UserDto,
    }
  }

  async loginWithSms(smsLoginDto: SmsLoginDto): Promise<SmsLoginResponseDto> {
    // 在实际应用中，这里应该实现验证码验证逻辑
    // 这里简化处理，假设验证码已验证通过

    let user = await this.usersService.findByPhone(smsLoginDto.phoneNumber)
    let isNewUser = false

    // 如果用户不存在，则为首次登录，需要注册
    if (!user) {
      // 这里仅创建一个带有手机号的基础用户，后续需要完善用户信息
      const randomUsername = `user_${Math.random().toString(36).substring(2, 10)}`
      const randomPassword = Math.random().toString(36).substring(2, 15)

      // 创建临时用户
      try {
        const createUserDto = {
          username: randomUsername,
          email: `${randomUsername}@temp.com`,
          phoneNumber: smsLoginDto.phoneNumber,
          password: randomPassword,
        }

        user = await this.usersService.create(createUserDto)
        isNewUser = true

        // 标记手机号已验证
        user = await this.usersService.verifyPhone(user.id)
      } catch (error) {
        throw new BadRequestException('用户创建失败')
      }
    }

    // 手机号验证通过，生成令牌
    const tokens = await this.getTokens(user.id, user.username)
    await this.usersService.updateRefreshToken(user.id, tokens.refreshToken)

    const { password, refreshToken, ...userData } = user

    // Format the response to match SmsLoginResponseDto
    return {
      ...tokens,
      user: userData as UserDto,
      isNewUser,
    }
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<RefreshTokenResponseDto> {
    const user = await this.usersService.findById(userId)
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('刷新令牌已失效')
    }

    // 验证刷新令牌
    const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshToken)
    if (!refreshTokenMatches) {
      throw new UnauthorizedException('刷新令牌无效')
    }

    // 生成新的令牌
    const tokens = await this.getTokens(user.id, user.username)
    await this.usersService.updateRefreshToken(user.id, tokens.refreshToken)

    return tokens
  }

  async logout(userId: string): Promise<LogoutResponseDto> {
    // 清除刷新令牌
    await this.usersService.updateRefreshToken(userId, null)
    return { message: '退出登录成功' }
  }

  private async getTokens(userId: string, username: string): Promise<RefreshTokenResponseDto> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('jwt.secret'),
          expiresIn: this.configService.get<string>('jwt.accessExpiresIn'),
        }
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('jwt.refreshSecret'),
          expiresIn: this.configService.get<string>('jwt.refreshExpiresIn'),
        }
      ),
    ])

    return {
      accessToken,
      refreshToken,
    }
  }
}
