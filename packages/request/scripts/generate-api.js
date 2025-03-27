/**
 * 生成API客户端脚本
 * 根据服务端swagger文档自动生成带类型的Axios请求方法
 */
import pkg from 'openapi-typescript-codegen'
const { generate } = pkg
import path from 'path'
import fs from 'fs'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import https from 'https'
import http from 'http'

// ES模块中获取__dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// 加载环境变量
dotenv.config({ path: path.resolve(__dirname, '../../../.env') })

// 默认服务器URL
const DEFAULT_SERVER_URL = 'http://localhost:3000'
const API_URL = process.env.API_URL || DEFAULT_SERVER_URL
const OUTPUT_PATH = path.resolve(__dirname, '../src/generated')
const SPEC_FILE_PATH = path.resolve(__dirname, '../api-spec.json')

/**
 * 确保目录存在
 */
function ensureDirExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
    console.log(`创建目录: ${dirPath}`)
  }
}

/**
 * 下载API规范到文件
 */
function downloadApiSpec(url, outputPath) {
  return new Promise((resolve, reject) => {
    console.log(`正在从 ${url} 下载API规范...`)

    const request = url.startsWith('https') ? https.get : http.get

    request(url, res => {
      const { statusCode } = res

      if (statusCode !== 200) {
        reject(new Error(`API端点返回状态码: ${statusCode}`))
        return
      }

      const fileStream = fs.createWriteStream(outputPath)

      res.pipe(fileStream)

      fileStream.on('finish', () => {
        fileStream.close()
        console.log(`API规范已下载到: ${outputPath}`)

        try {
          // 验证下载的文件是有效的JSON
          const fileContent = fs.readFileSync(outputPath, 'utf8')
          const parsedData = JSON.parse(fileContent)

          if (!parsedData.paths || Object.keys(parsedData.paths).length === 0) {
            reject(new Error('API规范未包含任何路径定义'))
            return
          }

          resolve(outputPath)
        } catch (error) {
          reject(new Error(`无效的API规范: ${error.message}`))
        }
      })

      fileStream.on('error', error => {
        fs.unlink(outputPath, () => {}) // 删除可能损坏的文件
        reject(new Error(`写入API规范文件失败: ${error.message}`))
      })
    }).on('error', error => {
      reject(new Error(`下载API规范失败: ${error.message}`))
    })
  })
}

/**
 * 生成API客户端代码
 */
async function generateApi() {
  const apiJsonUrl = `${API_URL}/api-json`

  try {
    // 下载API规范
    await downloadApiSpec(apiJsonUrl, SPEC_FILE_PATH)

    ensureDirExists(OUTPUT_PATH)

    // 清空生成目录
    fs.rmSync(OUTPUT_PATH, { recursive: true, force: true })
    ensureDirExists(OUTPUT_PATH)

    console.log('开始生成API客户端...')
    await generate({
      input: SPEC_FILE_PATH,
      output: OUTPUT_PATH,
      httpClient: 'axios',
      useOptions: true,
      useUnionTypes: true,
      exportCore: true,
      exportServices: true,
      exportModels: true,
      exportSchemas: false,
      indent: '  ',
      moduleNameFirstTag: true,
      prettier: {
        printWidth: 100,
        tabWidth: 2,
        trailingComma: 'all',
        singleQuote: true,
      },
    })

    // 验证生成的文件
    validateGeneratedFiles()

    console.log(`API客户端生成成功! 输出目录: ${OUTPUT_PATH}`)
    console.log('生成的客户端包含以下内容:')
    console.log('- 所有API端点的TypeScript类型定义')
    console.log('- 基于Axios的API调用方法')
    console.log('- 请求参数和响应类型')

    // 创建索引文件
    createIndexFile()
  } catch (error) {
    console.error('生成API客户端时出错:', error)
    process.exit(1)
  }
}

/**
 * 验证生成的文件
 */
function validateGeneratedFiles() {
  const servicesPath = path.resolve(OUTPUT_PATH, 'services')
  const modelsPath = path.resolve(OUTPUT_PATH, 'models')

  if (!fs.existsSync(servicesPath) || !fs.existsSync(modelsPath)) {
    throw new Error('生成的目录结构不完整')
  }

  // 检查服务文件是否为空
  const serviceFiles = fs.readdirSync(servicesPath)
  if (serviceFiles.length === 0) {
    throw new Error('没有生成任何服务文件')
  }

  // 检查是否有空文件
  for (const file of serviceFiles) {
    const filePath = path.resolve(servicesPath, file)
    const stats = fs.statSync(filePath)
    const content = fs.readFileSync(filePath, 'utf8')

    if (stats.size === 0 || !content.trim()) {
      throw new Error(`服务文件 ${file} 是空的`)
    }
  }

  console.log(`验证完成：已生成 ${serviceFiles.length} 个服务文件`)
}

/**
 * 创建统一导出文件
 */
function createIndexFile() {
  const indexPath = path.resolve(__dirname, '../src/index.ts')
  const indexContent = `/**
 * 自动生成的API客户端
 * @description 此文件导出所有API服务和类型
 */

// 导出所有生成的服务和模型
export * from './generated';

// 导出配置API客户端的方法
export { ApiError, CancelablePromise, OpenAPI } from './generated';

// 为Axios配置添加拦截器的工具函数
export { setupApiClient } from './setup';
`

  // 创建设置API客户端的实用工具
  const setupPath = path.resolve(__dirname, '../src/setup.ts')
  const setupContent = `/**
 * API客户端配置工具
 * @description 配置全局API客户端设置，如基础URL、拦截器等
 */
import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { OpenAPI } from './generated';

/**
 * API客户端配置选项
 */
export interface ApiClientOptions {
  /**
   * API服务器基础URL
   */
  baseUrl?: string;
  
  /**
   * 请求拦截器
   */
  requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>;
  
  /**
   * 响应拦截器
   */
  responseInterceptor?: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>;
  
  /**
   * 错误拦截器
   */
  errorInterceptor?: (error: AxiosError) => Promise<never>;
  
  /**
   * 是否自动添加授权头
   */
  withAuth?: boolean;
  
  /**
   * 获取授权令牌的函数
   */
  getToken?: () => string | null | undefined;
}

/**
 * 初始化并配置API客户端
 */
export function setupApiClient(options: ApiClientOptions = {}): void {
  // 设置基础URL
  if (options.baseUrl) {
    OpenAPI.BASE = options.baseUrl;
  }

  // 配置全局请求拦截器
  if (options.requestInterceptor) {
    OpenAPI.WITH_CREDENTIALS = true;
    const originalRequest = OpenAPI.REQUEST;
    
    OpenAPI.REQUEST = async (config) => {
      // 应用自定义请求拦截器
      const modifiedConfig = await options.requestInterceptor(config);
      
      // 如果启用了授权并提供了令牌获取函数
      if (options.withAuth && options.getToken) {
        const token = options.getToken();
        if (token) {
          modifiedConfig.headers = modifiedConfig.headers || {};
          modifiedConfig.headers['Authorization'] = \`Bearer \${token}\`;
        }
      }
      
      return originalRequest(modifiedConfig);
    };
  }

  // 配置全局响应拦截器
  if (options.responseInterceptor) {
    const originalResponse = OpenAPI.RESPONSE;
    
    OpenAPI.RESPONSE = async (response) => {
      // 先应用原始响应处理
      const handledResponse = await originalResponse(response);
      // 然后应用自定义响应拦截器
      return options.responseInterceptor(handledResponse);
    };
  }

  // 配置错误拦截器
  if (options.errorInterceptor) {
    OpenAPI.ERROR = options.errorInterceptor;
  }
}
`

  fs.writeFileSync(indexPath, indexContent)
  fs.writeFileSync(setupPath, setupContent)

  console.log('创建了索引文件和API设置工具')
}

// 执行生成
generateApi().catch(console.error)
