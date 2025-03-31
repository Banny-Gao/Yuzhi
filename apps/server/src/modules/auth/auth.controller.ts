import { Controller, Post, Body, UseGuards, Req, HttpCode, HttpStatus, Get } from '@nestjs/common'
import { AuthService } from './auth.service'
import { CreateUserDto } from '../users/dto/create-user.dto'
import { LoginUserDto } from '../users/dto/login-user.dto'
import { SmsLoginDto } from '../users/dto/sms-login.dto'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { JwtRefreshGuard } from './guards/jwt-refresh.guard'
import { ApiTags, ApiOperation, ApiResponse as SwaggerResponse, ApiBearerAuth } from '@nestjs/swagger'
import { ResponseStatus } from '@workspace/request'
import { ResponseUtil, ApiResponse } from '../../config'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '用户注册' })
  @SwaggerResponse({ status: ResponseStatus.SUCCESS, description: '注册成功' })
  @SwaggerResponse({ status: ResponseStatus.BAD_REQUEST, description: '注册失败' })
  @SwaggerResponse({ status: ResponseStatus.CONFLICT, description: '用户名/手机号/邮箱已存在' })
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<ApiResponse> {
    const result = await this.authService.register(createUserDto)
    return ResponseUtil.success(result, '注册成功')
  }

  @ApiOperation({ summary: '用户登录' })
  @SwaggerResponse({ status: ResponseStatus.SUCCESS, description: '登录成功' })
  @SwaggerResponse({ status: ResponseStatus.UNAUTHORIZED, description: '未授权' })
  @HttpCode(ResponseStatus.SUCCESS)
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<ApiResponse> {
    const result = await this.authService.login(loginUserDto)
    return ResponseUtil.success(result, '登录成功')
  }

  @ApiOperation({ summary: '短信验证码登录' })
  @SwaggerResponse({ status: ResponseStatus.SUCCESS, description: '登录成功' })
  @SwaggerResponse({ status: ResponseStatus.BAD_REQUEST, description: '登录失败' })
  @HttpCode(ResponseStatus.SUCCESS)
  @Post('login/sms')
  async loginWithSms(@Body() smsLoginDto: SmsLoginDto): Promise<ApiResponse> {
    const result = await this.authService.loginWithSms(smsLoginDto)
    return ResponseUtil.success(result, '登录成功')
  }

  @ApiOperation({ summary: '刷新令牌' })
  @SwaggerResponse({ status: ResponseStatus.SUCCESS, description: '刷新成功' })
  @SwaggerResponse({ status: ResponseStatus.UNAUTHORIZED, description: '刷新失败' })
  @ApiBearerAuth()
  @UseGuards(JwtRefreshGuard)
  @HttpCode(ResponseStatus.SUCCESS)
  @Post('refresh')
  async refreshTokens(@Req() req): Promise<ApiResponse> {
    const userId = req.user.id
    const refreshToken = req.user.refreshToken
    const result = await this.authService.refreshTokens(userId, refreshToken)
    return ResponseUtil.success(result, '令牌刷新成功')
  }

  @ApiOperation({ summary: '退出登录' })
  @SwaggerResponse({ status: ResponseStatus.SUCCESS, description: '退出成功' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(ResponseStatus.SUCCESS)
  @Post('logout')
  async logout(@Req() req): Promise<ApiResponse> {
    await this.authService.logout(req.user.id)
    return ResponseUtil.success(null, '退出登录成功')
  }

  @ApiOperation({ summary: '获取当前用户信息' })
  @SwaggerResponse({ status: ResponseStatus.SUCCESS, description: '获取成功' })
  @SwaggerResponse({ status: ResponseStatus.UNAUTHORIZED, description: '未授权' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req): ApiResponse {
    return ResponseUtil.success(req.user, '获取用户资料成功')
  }
}
