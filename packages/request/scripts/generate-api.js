/**
 * 生成API客户端脚本
 * 根据服务端swagger文档自动生成带类型的Axios请求方法
 */
import { generate } from 'openapi-typescript-codegen'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync } from 'fs'
import dotenv from 'dotenv'

// 加载环境变量
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const API_URL = process.env.API_URL || 'http://localhost:3000'
const OUTPUT_DIR = join(__dirname, '../src/generated')
const MODELS_DIR = join(OUTPUT_DIR, 'models')
const INDEX_PATH = join(OUTPUT_DIR, 'index.ts')

/**
 * 修复ApiResponse类型定义
 */
function fixApiResponseType() {
  const apiResponsePath = join(MODELS_DIR, 'ApiResponse.ts')

  if (existsSync(apiResponsePath)) {
    let content = readFileSync(apiResponsePath, 'utf8')

    // 修复data字段的类型定义，使用泛型
    content = content.replace(/data: Record<string, any>/g, 'data: T')

    // 添加泛型参数
    content = content.replace(/export type ApiResponse = {/g, 'export type ApiResponse<T = any> = {')

    writeFileSync(apiResponsePath, content)
    console.log(`Fixed ApiResponse type at: ${apiResponsePath}`)
  } else {
    console.warn(`ApiResponse file not found at: ${apiResponsePath}`)
  }
}

/**
 * 清理重复的导出
 */
function cleanIndexExports() {
  if (existsSync(INDEX_PATH)) {
    let content = readFileSync(INDEX_PATH, 'utf8')

    // 移除重复的导出
    const lines = content.split('\n')
    const uniqueExports = new Set()
    const cleanedLines = lines.filter(line => {
      if (line.startsWith('export type {') || line.startsWith('export {')) {
        const exportKey = line.trim()
        if (uniqueExports.has(exportKey)) {
          return false
        }
        uniqueExports.add(exportKey)
      }
      return true
    })

    content = cleanedLines.join('\n')
    writeFileSync(INDEX_PATH, content)
    console.log(`Cleaned index exports at: ${INDEX_PATH}`)
  }
}

/**
 * 更新服务方法的返回类型
 */
function updateServiceReturnTypes() {
  const servicesDir = join(OUTPUT_DIR, 'services')
  if (!existsSync(servicesDir)) return

  // 读取目录中的所有文件
  const files = readdirSync(servicesDir).filter(file => file.endsWith('.ts'))

  files.forEach(file => {
    const servicePath = join(servicesDir, file)
    let content = readFileSync(servicePath, 'utf8')

    // 更新返回类型为 ApiResponse<T>
    content = content.replace(/: CancelablePromise<ApiResponse>/g, ': CancelablePromise<ApiResponse<any>>')

    writeFileSync(servicePath, content)
    console.log(`Updated return types in ${file}`)
  })
}

/**
 * 执行后处理步骤
 */
async function postProcess() {
  console.log('执行后处理步骤...')

  try {
    // 修复ApiResponse类型
    fixApiResponseType()

    // 更新服务方法的返回类型
    updateServiceReturnTypes()

    // 清理重复的导出
    cleanIndexExports()

    console.log('后处理步骤完成！')
  } catch (error) {
    console.error('后处理步骤失败:', error)
    process.exit(1)
  }
}

/**
 * 生成API客户端代码
 */
async function generateApiClient() {
  try {
    // 确保输出目录存在
    if (!existsSync(OUTPUT_DIR)) {
      mkdirSync(OUTPUT_DIR, { recursive: true })
    }

    // 生成 API 客户端代码
    await generate({
      input: `${API_URL}/api-json`,
      output: OUTPUT_DIR,
      httpClient: 'axios',
      useOptions: true,
      useUnionTypes: true,
      exportSchemas: true,
      exportServices: true,
      exportCore: true,
      exportModels: true,
      exportClient: true,
      prettier: {
        printWidth: 120,
        tabWidth: 2,
        trailingComma: 'all',
        parser: 'typescript',
      },
      // 添加自定义配置以改进类型生成
      typescriptThreePlus: true,
      useSingleRequestParameter: true,
      enumNamesAsValues: true,
      // 确保响应类型使用泛型
      responseAs: 'generic',
      // 确保生成所有响应类型
      generateClient: true,
      generateSchemas: true,
      // 使用自定义响应类型
      customTypes: {
        ApiResponse: 'ApiResponse<T>',
      },
    })

    console.log('API client 生成成功!')

    // 执行后处理步骤
    await postProcess()
  } catch (error) {
    console.error('生成 API client 时出错:', error)
    process.exit(1)
  }
}

// 执行生成
generateApiClient()
