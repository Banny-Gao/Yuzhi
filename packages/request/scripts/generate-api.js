/**
 * 生成API客户端脚本
 * 根据服务端swagger文档自动生成带类型的Axios请求方法
 */
import { generate } from 'openapi-typescript-codegen'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync, mkdirSync, createWriteStream, readFileSync, unlink } from 'fs'
import dotenv from 'dotenv'
import https from 'https'
import http from 'http'

// 加载环境变量
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const API_URL = process.env.API_URL || 'http://localhost:3000'
const OUTPUT_DIR = join(__dirname, '../src/generated')

/**
 * 确保目录存在
 */
function ensureDirExists(dirPath) {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true })
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

      const fileStream = createWriteStream(outputPath)

      res.pipe(fileStream)

      fileStream.on('finish', () => {
        fileStream.close()
        console.log(`API规范已下载到: ${outputPath}`)

        try {
          // 验证下载的文件是有效的JSON
          const fileContent = readFileSync(outputPath, 'utf8')
          const parsedData = JSON.parse(fileContent)

          if (!parsedData.paths || Object.keys(parsedData.paths).length === 0) {
            reject(new Error('API规范未包含任何路径定义'))
            return
          }

          resolve(outputPath)
        } catch (error) {
          unlink(outputPath, () => {}) // 删除可能损坏的文件
          reject(new Error(`无效的API规范: ${error.message}`))
        }
      })

      fileStream.on('error', error => {
        unlink(outputPath, () => {}) // 删除可能损坏的文件
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
      httpClientType: 'axios',
      useSingleHttpClient: true,
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
    })

    console.log('API client generated successfully!')
  } catch (error) {
    console.error('Error generating API client:', error)
    process.exit(1)
  }
}

// 执行生成
generateApiClient()
