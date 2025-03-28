# @workspace/request

自动生成的API客户端库，提供带有完整TypeScript类型的请求方法。

## 功能特点

- 自动代码生成：基于服务端 Swagger/OpenAPI 规范自动生成客户端代码
- 完整类型支持：所有 API 请求参数和响应类型都有 TypeScript 定义
- 内置 Axios 集成：使用 Axios 作为 HTTP 客户端，提供可靠的请求处理
- 拦截器支持：可配置的请求/响应拦截器，便于全局处理认证和错误
- 请求取消功能：支持取消进行中的 API 请求
- 模块化结构：按服务类别组织 API 调用，便于使用和维护

## 快速开始

### 安装

```bash
# 在客户端项目中依赖这个包
yarn add @workspace/request
# 或
npm install @workspace/request
# 或
pnpm add @workspace/request
```

### 生成API客户端

- 确保后端服务器正在运行
- 确认 Swagger/OpenAPI 文档可访问（默认地址：http://localhost:3000/api-json）

```bash
# 生成API客户端代码
cd packages/request
pnpm run generate

# 构建包
pnpm run build
```

生成脚本会执行以下操作：

- 从服务器获取最新的 API 规范
- 根据规范生成类型化的服务类和模型
- 创建必要的辅助工具和类型定义
- 生成统一的导出文件

### 基本用法

在应用入口文件（如 main.ts 或 app.ts）中初始化：

```typescript
import { setupApiClient } from '@workspace/request'
// 配置API客户端
setupApiClient({
  baseUrl: 'http://localhost:3000',
  withAuth: true,
  getToken: () => localStorage.getItem('token'),
  requestInterceptor: config => {
    // 添加自定义请求头
    config.headers = config.headers || {}
    config.headers['X-App-Version'] = '1.0.0'
    return config
  },
  errorInterceptor: async error => {
    // 处理API错误
    if (error.response?.status === 401) {
      // 处理未授权错误
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
})
```

接口使用

```typescript
import { AuthService } from '@workspace/request'

// 用户登录
async function loginUser(username: string, password: string) {
  try {
    const result = await AuthService.login({
      usernameOrPhone: username,
      password: password,
      rememberMe: true,
    })

    // 保存令牌
    localStorage.setItem('token', result.accessToken)
    return result
  } catch (error) {
    console.error('登录失败:', error)
    throw error
  }
}

// 获取用户资料
async function getUserProfile() {
  try {
    const profile = await AuthService.getProfile()
    return profile
  } catch (error) {
    console.error('获取用户资料失败:', error)
    throw error
  }
}

// 退出登录
async function logout() {
  try {
    await AuthService.logout()
    localStorage.removeItem('token')
  } catch (error) {
    console.error('退出登录失败:', error)
  }
}
```

## 高级配置

### 完整配置

```typescript
import { setupApiClient } from '@workspace/request'

setupApiClient({
  // 基础配置
  baseUrl: 'https://api.example.com',
  withAuth: true,
  getToken: () => localStorage.getItem('token'),

  // 请求拦截器 - 在请求发送前修改请求
  requestInterceptor: config => {
    // 添加自定义头部
    config.headers = config.headers || {}
    config.headers['X-App-Version'] = '1.0.0'
    config.headers['X-Platform'] = 'web'

    // 在开发环境添加调试信息
    if (process.env.NODE_ENV === 'development') {
      config.params = { ...config.params, _debug: true }
    }

    return config
  },

  // 响应拦截器 - 在收到响应后处理
  responseInterceptor: response => {
    // 自定义响应处理
    if (response.headers['x-deprecation-notice']) {
      console.warn('API 即将弃用:', response.headers['x-deprecation-notice'])
    }

    return response
  },

  // 错误拦截器 - 统一处理错误
  errorInterceptor: async error => {
    if (error.response) {
      // 处理特定错误码
      const status = error.response.status

      if (status === 401) {
        // 未授权 - 重定向到登录页
        localStorage.removeItem('token')
        window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname)
      } else if (status === 403) {
        // 禁止访问 - 显示无权限页面
        window.location.href = '/forbidden'
      } else if (status === 429) {
        // 请求过多 - 实现重试逻辑
        console.warn('请求频率过高，将在 1 秒后重试')
        await new Promise(resolve => setTimeout(resolve, 1000))
        // 这里可以实现重试逻辑
      }
    } else if (error.request) {
      // 网络错误 - 显示网络错误提示
      console.error('网络错误，请检查您的连接')
    }

    // 继续抛出错误，供调用处处理
    return Promise.reject(error)
  },
})
```

### 取消请求

```typescript
import { SolarTermsService, CancelablePromise } from '@workspace/request'

// 保存请求引用，以便稍后取消
let currentRequest: CancelablePromise<any> | null = null

async function fetchDataWithCancellation() {
  // 如果有进行中的请求，先取消
  if (currentRequest) {
    currentRequest.cancel()
  }

  // 创建新请求
  currentRequest = SolarTermsService.getSolarTerms()

  try {
    const result = await currentRequest
    currentRequest = null
    return result
  } catch (error) {
    if (error.name === 'CancelError') {
      console.log('请求已取消')
    } else {
      console.error('请求失败:', error)
    }
    throw error
  }
}

// 例如在组件卸载时
function cleanup() {
  if (currentRequest) {
    currentRequest.cancel()
    currentRequest = null
  }
}
```

### 错误处理

所有 API 调用都可能抛出 ApiError 异常，包含以下属性：

```typescript
import { ApiError } from '@workspace/request'

try {
  const result = await AuthService.login(credentials)
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`API 错误: ${error.status} ${error.statusText}`, `URL: ${error.url}`, `消息: ${error.message}`, `响应体:`, error.body)

    // 根据状态码处理
    switch (error.status) {
      case 400: // 请求错误
        handleValidationErrors(error.body)
        break
      case 401: // 未授权
        redirectToLogin()
        break
      case 404: // 未找到
        showNotFoundMessage()
        break
      case 500: // 服务器错误
        showServerErrorMessage()
        break
      default:
        showGenericErrorMessage()
    }
  } else {
    console.error('非 API 错误:', error)
  }
}
```

## 生成的API结构

```
packages/request/
├── src/
│   ├── generated/             # 自动生成的代码
│   │   ├── core/              # 核心工具类
│   │   │   ├── ApiError.ts    # API 错误类
│   │   │   ├── CancelablePromise.ts # 可取消的Promise实现
│   │   │   ├── OpenAPI.ts     # OpenAPI配置
│   │   │   └── request.ts     # 请求实现
│   │   ├── models/            # 数据模型
│   │   │   ├── CreateUserDto.ts # 创建用户DTO
│   │   │   ├── LoginUserDto.ts  # 登录DTO
│   │   │   └── ...            # 其他模型
│   │   └── services/          # API服务
│   │       ├── AuthService.ts   # 认证服务
│   │       ├── SolarTermsService.ts # 节气服务
│   │       └── ...            # 其他服务
│   ├── setup.ts               # API客户端配置工具
│   └── index.ts               # 主导出文件
├── scripts/                   # 脚本
│   └── generate-api.js        # API生成脚本
├── package.json               # 包配置
└── README.md                  # 文档
```

## 自定义开发

### 手动修改生成的代码

通常不建议手动修改自动生成的代码，因为重新生成会覆盖您的更改。相反，您可以：

1. 创建包装类或高级函数，扩展自动生成的服务
2. 扩展 `setup.ts` 添加全局功能
3. 使用拦截器添加全局行为

如确实需要修改生成的代码，请更新生成脚本。

### 本地开发与测试

```bash
# 启动开发模式，监听文件变化
pnpm run dev

# 运行测试
pnpm run test

# 构建并手动测试
pnpm run build
```

## 故障排除

### 常见问题解决

1. **生成的 API 不完整**

   - 确保服务器运行时执行生成命令
   - 检查服务器是否正确配置了 Swagger/OpenAPI

2. **类型错误**

   - 确保重新生成并构建最新的 API 客户端
   - 检查您使用的类型是否与后端匹配

3. **CORS 问题**

   - 确保服务器配置了正确的 CORS 头
   - 在开发环境中考虑使用代理

4. **认证问题**
   - 确保正确设置了 `getToken` 函数
   - 检查令牌格式是否正确

## 版本与维护

- 当后端 API 变更时，重新运行生成命令更新客户端
- 发布新版本时遵循语义化版本规范

## 贡献指南

欢迎贡献！如需参与开发：

1. Fork 仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

## 许可证

[MIT](LICENSE)
