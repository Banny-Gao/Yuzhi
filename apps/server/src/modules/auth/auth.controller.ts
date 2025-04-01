import { Controller, Post, Body, UseGuards, Get, Request, HttpStatus } from '@nestjs/common'
import { AuthService } from './auth.service'
import { CreateUserDto } from '../users/dto/create-user.dto'
import { LoginUserDto } from '../users/dto/login-user.dto'
import { SmsLoginDto } from '../users/dto/sms-login.dto'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { RefreshAuthGuard } from './guards/refresh-auth.guard'
import { Public } from './decorators/public.decorator'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiOkResponse, ApiCreatedResponse, ApiExtraModels } from '@nestjs/swagger'
import { ApiResponse } from '../../common/dto/api-response.dto'
import { LoginResponseDto, RegisterResponseDto, SmsLoginResponseDto, RefreshTokenResponseDto, LogoutResponseDto } from './dto/auth-response.dto'
import { UserDto } from '../users/dto/user.dto'

@ApiTags('auth')
@ApiExtraModels(ApiResponse, LoginResponseDto, RegisterResponseDto, SmsLoginResponseDto, RefreshTokenResponseDto, LogoutResponseDto, UserDto)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: '用户注册' })
  @ApiCreatedResponse({
    description: '注册成功',
    schema: {
      allOf: [
        { $ref: '#/components/schemas/ApiResponse' },
        {
          properties: {
            data: {
              $ref: '#/components/schemas/RegisterResponseDto',
            },
          },
        },
      ],
    },
  })
  async register(@Body() createUserDto: CreateUserDto): Promise<ApiResponse<RegisterResponseDto>> {
    const result = await this.authService.register(createUserDto)
    return {
      code: HttpStatus.CREATED,
      data: result,
      message: '注册成功',
    }
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: '用户登录' })
  @ApiOkResponse({
    description: '登录成功',
    schema: {
      allOf: [
        { $ref: '#/components/schemas/ApiResponse' },
        {
          properties: {
            data: {
              $ref: '#/components/schemas/LoginResponseDto',
            },
          },
        },
      ],
    },
  })
  async login(@Body() loginUserDto: LoginUserDto): Promise<ApiResponse<LoginResponseDto>> {
    const result = await this.authService.login(loginUserDto)
    return {
      code: HttpStatus.OK,
      data: result,
      message: '登录成功',
    }
  }

  @Public()
  @Post('sms-login')
  @ApiOperation({ summary: '短信验证码登录' })
  @ApiOkResponse({
    description: '登录成功',
    schema: {
      allOf: [
        { $ref: '#/components/schemas/ApiResponse' },
        {
          properties: {
            data: {
              $ref: '#/components/schemas/SmsLoginResponseDto',
            },
          },
        },
      ],
    },
  })
  async smsLogin(@Body() smsLoginDto: SmsLoginDto): Promise<ApiResponse<SmsLoginResponseDto>> {
    const result = await this.authService.loginWithSms(smsLoginDto)
    return {
      code: HttpStatus.OK,
      data: result,
      message: '登录成功',
    }
  }

  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  @ApiOperation({ summary: '刷新访问令牌' })
  @ApiOkResponse({
    description: '令牌刷新成功',
    schema: {
      allOf: [
        { $ref: '#/components/schemas/ApiResponse' },
        {
          properties: {
            data: {
              $ref: '#/components/schemas/RefreshTokenResponseDto',
            },
          },
        },
      ],
    },
  })
  async refreshTokens(@Request() req): Promise<ApiResponse<RefreshTokenResponseDto>> {
    const userId = req.user.sub
    const refreshToken = req.user.refreshToken
    const tokens = await this.authService.refreshTokens(userId, refreshToken)
    return {
      code: HttpStatus.OK,
      data: tokens,
      message: '令牌刷新成功',
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiOperation({ summary: '用户退出登录' })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: '退出登录成功',
    schema: {
      allOf: [
        { $ref: '#/components/schemas/ApiResponse' },
        {
          properties: {
            data: {
              $ref: '#/components/schemas/LogoutResponseDto',
            },
          },
        },
      ],
    },
  })
  async logout(@Request() req): Promise<ApiResponse<LogoutResponseDto>> {
    const userId = req.user.sub
    const result = await this.authService.logout(userId)
    return {
      code: HttpStatus.OK,
      data: result,
      message: '退出登录成功',
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: '获取当前用户信息' })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: '获取用户信息成功',
    schema: {
      allOf: [
        { $ref: '#/components/schemas/ApiResponse' },
        {
          properties: {
            data: {
              $ref: '#/components/schemas/UserDto',
            },
          },
        },
      ],
    },
  })
  async getProfile(@Request() req): Promise<ApiResponse<UserDto>> {
    return {
      code: HttpStatus.OK,
      data: req.user,
      message: '获取用户信息成功',
    }
  }
}
