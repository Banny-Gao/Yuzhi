// This file is auto-generated by @hey-api/openapi-ts

export const ApiResponseSchema = {
  type: 'object',
  properties: {
    code: {
      type: 'number',
      description: '响应状态码',
      example: 200,
    },
    data: {
      type: 'object',
      description: '响应数据',
      example: {},
    },
    message: {
      type: 'string',
      description: '响应消息',
      example: '操作成功',
    },
  },
  required: ['code', 'data', 'message'],
} as const

export const UserDtoSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      description: '用户ID',
      example: '5f7c1b9a-9b9a-4b9a-9b9a-9b9a9b9a9b9a',
    },
    username: {
      type: 'string',
      description: '用户名',
      example: 'johndoe',
    },
    email: {
      type: 'string',
      description: '邮箱',
      example: 'johndoe@example.com',
    },
    phoneNumber: {
      type: 'string',
      description: '手机号',
      example: '13800138000',
    },
    isPhoneVerified: {
      type: 'boolean',
      description: '手机号是否已验证',
      example: true,
    },
    isEmailVerified: {
      type: 'boolean',
      description: '邮箱是否已验证',
      example: false,
    },
    avatar: {
      type: 'string',
      description: '用户头像URL',
      example: 'https://example.com/avatar.jpg',
    },
    createdAt: {
      format: 'date-time',
      type: 'string',
      description: '用户创建时间',
      example: '2023-01-01T00:00:00.000Z',
    },
    updatedAt: {
      format: 'date-time',
      type: 'string',
      description: '用户更新时间',
      example: '2023-01-01T00:00:00.000Z',
    },
    nickname: {
      type: 'string',
    },
    roles: {
      default: ['user'],
      type: 'array',
      items: {
        type: 'string',
      },
    },
    isActive: {
      type: 'boolean',
    },
  },
  required: [
    'id',
    'username',
    'email',
    'phoneNumber',
    'isPhoneVerified',
    'isEmailVerified',
    'createdAt',
    'updatedAt',
    'roles',
    'isActive',
  ],
} as const

export const LoginResponseDtoSchema = {
  type: 'object',
  properties: {
    accessToken: {
      type: 'string',
      description: '访问令牌',
      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    },
    refreshToken: {
      type: 'string',
      description: '刷新令牌',
      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    },
    user: {
      description: '用户信息',
      allOf: [
        {
          $ref: '#/components/schemas/UserDto',
        },
      ],
    },
  },
  required: ['accessToken', 'refreshToken', 'user'],
} as const

export const RegisterResponseDtoSchema = {
  type: 'object',
  properties: {
    accessToken: {
      type: 'string',
      description: '访问令牌',
      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    },
    refreshToken: {
      type: 'string',
      description: '刷新令牌',
      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    },
    user: {
      description: '用户信息',
      allOf: [
        {
          $ref: '#/components/schemas/UserDto',
        },
      ],
    },
  },
  required: ['accessToken', 'refreshToken', 'user'],
} as const

export const SmsLoginResponseDtoSchema = {
  type: 'object',
  properties: {
    accessToken: {
      type: 'string',
      description: '访问令牌',
      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    },
    refreshToken: {
      type: 'string',
      description: '刷新令牌',
      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    },
    user: {
      description: '用户信息',
      allOf: [
        {
          $ref: '#/components/schemas/UserDto',
        },
      ],
    },
    isNewUser: {
      type: 'boolean',
      description: '是否为新用户',
      example: false,
    },
  },
  required: ['accessToken', 'refreshToken', 'user', 'isNewUser'],
} as const

export const RefreshTokenResponseDtoSchema = {
  type: 'object',
  properties: {
    accessToken: {
      type: 'string',
      description: '访问令牌',
      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    },
    refreshToken: {
      type: 'string',
      description: '刷新令牌',
      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    },
  },
  required: ['accessToken', 'refreshToken'],
} as const

export const LogoutResponseDtoSchema = {
  type: 'object',
  properties: {
    message: {
      type: 'string',
      description: '退出登录消息',
      example: '退出登录成功',
    },
  },
  required: ['message'],
} as const

export const CreateUserDtoSchema = {
  type: 'object',
  properties: {
    username: {
      type: 'string',
      example: 'johndoe',
      description: '用户名',
    },
    email: {
      type: 'string',
      example: 'john@example.com',
      description: '电子邮件',
    },
    phoneNumber: {
      type: 'string',
      example: '13800138000',
      description: '手机号码',
    },
    password: {
      type: 'string',
      example: 'Password123!',
      description: '密码',
    },
  },
  required: ['username', 'email', 'phoneNumber', 'password'],
} as const

export const LoginUserDtoSchema = {
  type: 'object',
  properties: {
    usernameOrPhone: {
      type: 'string',
      example: 'admin',
      description: '用户名或手机号',
    },
    password: {
      type: 'string',
      example: 'Admin@123',
      description: '密码',
    },
    rememberMe: {
      type: 'boolean',
      example: true,
      description: '是否记住登录状态',
    },
  },
  required: ['usernameOrPhone', 'password'],
} as const

export const SmsLoginDtoSchema = {
  type: 'object',
  properties: {
    phoneNumber: {
      type: 'string',
      example: '13800138000',
      description: '手机号码',
    },
    code: {
      type: 'string',
      example: '123456',
      description: '验证码',
    },
  },
  required: ['phoneNumber', 'code'],
} as const

export const SolarTermSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      description: '主键ID',
    },
    pub_year: {
      type: 'number',
      description: '年份',
    },
    name: {
      type: 'string',
      description: '节气名称',
    },
    pub_date: {
      type: 'string',
      description: '节气公历日期',
    },
    pri_date: {
      type: 'string',
      description: '节气农历日期',
    },
    pub_time: {
      type: 'string',
      description: '节气时间',
    },
    des: {
      type: 'string',
      description: '节气简介',
    },
    youLai: {
      type: 'string',
      description: '节气由来',
    },
    xiSu: {
      type: 'string',
      description: '节气习俗',
    },
    heath: {
      type: 'string',
      description: '节气养生建议',
    },
  },
  required: [
    'id',
    'pub_year',
    'name',
    'pub_date',
    'pri_date',
    'pub_time',
    'des',
    'youLai',
    'xiSu',
    'heath',
  ],
} as const

export const CorsConfigDtoSchema = {
  type: 'object',
  properties: {
    origin: {
      type: 'string',
      description: '域名',
      example: 'https://example.com',
    },
    isActive: {
      type: 'boolean',
      description: '是否启用',
      example: true,
    },
    createdAt: {
      format: 'date-time',
      type: 'string',
      description: '创建时间',
      example: '2024-04-02T00:00:00.000Z',
    },
    updatedAt: {
      format: 'date-time',
      type: 'string',
      description: '更新时间',
      example: '2024-04-02T00:00:00.000Z',
    },
  },
  required: ['origin', 'isActive', 'createdAt', 'updatedAt'],
} as const

export const AddOriginDtoSchema = {
  type: 'object',
  properties: {
    origin: {
      type: 'string',
      description: '要添加到CORS白名单的域名',
      example: 'https://example.com',
    },
  },
  required: ['origin'],
} as const

export const AddOriginsDtoSchema = {
  type: 'object',
  properties: {
    origins: {
      description: '要批量添加到CORS白名单的域名列表',
      example: ['https://example1.com', 'https://example2.com'],
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
  required: ['origins'],
} as const

export const RemoveOriginDtoSchema = {
  type: 'object',
  properties: {
    origin: {
      type: 'string',
      description: '要从CORS白名单移除的域名',
      example: 'https://example.com',
    },
  },
  required: ['origin'],
} as const
