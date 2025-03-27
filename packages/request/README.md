# @workspace/request

自动生成的API客户端库，提供带有完整TypeScript类型的请求方法。

## 功能特点

- 基于服务端Swagger/OpenAPI规范自动生成
- 完整的TypeScript类型支持，包括请求参数和响应类型
- 基于Axios构建的请求客户端
- 可配置的拦截器和认证机制

## 快速开始

### 安装

```bash
# 在客户端项目中依赖这个包
yarn add @workspace/request
# 或
npm install @workspace/request
```

### 生成API客户端

确保服务端正在运行并已配置Swagger，然后执行：

```bash
# 生成API客户端代码
cd packages/request
pnpm run generate
```

### 使用

```typescript
import { UserService, setupApiClient } from '@workspace/request'

// 配置API客户端
setupApiClient({
  baseUrl: 'http://localhost:3000',
  withAuth: true,
  getToken: () => localStorage.getItem('access_token'),
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

// 使用生成的API服务
async function fetchUsers() {
  try {
    const users = await UserService.getUsers()
    console.log('获取到的用户:', users)
    return users
  } catch (error) {
    console.error('获取用户失败:', error)
    throw error
  }
}

// 带参数的请求
async function createUser(username, email) {
  return UserService.createUser({
    requestBody: {
      username,
      email,
    },
  })
}
```

## 生成的API结构

```
src/
  ├── generated/           # 自动生成的API代码
  │   ├── core/            # 核心工具类
  │   ├── models/          # 数据模型定义
  │   ├── services/        # API服务方法
  │   └── index.ts         # 导出所有生成的内容
  ├── setup.ts             # API配置工具
  └── index.ts             # 主导出文件
```

## 高级用法

### 自定义BASE URL

```typescript
import { OpenAPI } from '@workspace/request'

// 直接设置基础URL
OpenAPI.BASE = 'https://api.example.com'
```

### 自定义请求配置

```typescript
import { UserService } from '@workspace/request'

// 使用特定配置发送请求
const users = await UserService.getUsers({
  headers: {
    'X-Custom-Header': 'value',
  },
  timeout: 5000,
})
```
