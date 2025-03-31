import { Controller, Post, Body, UseGuards, Req, HttpCode, HttpStatus, Get } from '@nestjs/common'
import { AuthService } from './auth.service'
import { CreateUserDto } from '../users/dto/create-user.dto'
import { LoginUserDto } from '../users/dto/login-user.dto'
import { SmsLoginDto } from '../users/dto/sms-login.dto'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { JwtRefreshGuard } from './guards/jwt-refresh.guard'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { ResponseStatus } from '@workspace/request'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '用户注册' })
  @ApiResponse({ status: ResponseStatus.SUCCESS, description: '注册成功' })
  @ApiResponse({ status: ResponseStatus.BAD_REQUEST, description: '注册失败' })
  @ApiResponse({ status: ResponseStatus.CONFLICT, description: '用户名/手机号/邮箱已存在' })
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto)
  }

  @ApiOperation({ summary: '用户登录' })
  @ApiResponse({ status: ResponseStatus.SUCCESS, description: '登录成功' })
  @ApiResponse({ status: ResponseStatus.UNAUTHORIZED, description: '未授权' })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto)
  }

  @ApiOperation({ summary: '短信验证码登录' })
  @ApiResponse({ status: ResponseStatus.SUCCESS, description: '登录成功' })
  @ApiResponse({ status: ResponseStatus.BAD_REQUEST, description: '登录失败' })
  @HttpCode(HttpStatus.OK)
  @Post('login/sms')
  async loginWithSms(@Body() smsLoginDto: SmsLoginDto) {
    return this.authService.loginWithSms(smsLoginDto)
  }

  @ApiOperation({ summary: '刷新令牌' })
  @ApiResponse({ status: ResponseStatus.SUCCESS, description: '刷新成功' })
  @ApiResponse({ status: ResponseStatus.UNAUTHORIZED, description: '刷新失败' })
  @ApiBearerAuth()
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refreshTokens(@Req() req) {
    const userId = req.user.id
    const refreshToken = req.user.refreshToken
    return this.authService.refreshTokens(userId, refreshToken)
  }

  @ApiOperation({ summary: '退出登录' })
  @ApiResponse({ status: ResponseStatus.SUCCESS, description: '退出成功' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Req() req) {
    return this.authService.logout(req.user.id)
  }

  @ApiOperation({ summary: '获取当前用户信息' })
  @ApiResponse({ status: ResponseStatus.SUCCESS, description: '获取成功' })
  @ApiResponse({ status: ResponseStatus.UNAUTHORIZED, description: '未授权' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user
  }
}
