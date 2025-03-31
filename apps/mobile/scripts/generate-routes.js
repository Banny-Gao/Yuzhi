#!/usr/bin/env node

/**
 * 自动生成路由配置脚本
 * 遍历 pages 目录下的所有文件夹，为每个页面生成路由配置
 */
const fs = require('fs')
const path = require('path')

// 项目根目录
const ROOT_DIR = path.resolve(__dirname, '..')
// pages 目录
const PAGES_DIR = path.resolve(ROOT_DIR, 'src/pages')
// 输出文件
const OUTPUT_FILE = path.resolve(ROOT_DIR, 'src/generated.routes.ts')

/**
 * 解析页面元数据
 * @param {string} filePath 页面文件路径
 * @returns {Object} 页面元数据对象
 */
function parseMeta(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')

    // 提取pageMeta对象
    const regex = /export\s+const\s+pageMeta\s*=\s*({[\s\S]*?})/
    const match = content.match(regex)

    if (match && match[1]) {
      try {
        // 使用Function构造器安全地解析对象
        const parseObject = new Function(`return ${match[1]}`)
        return parseObject()
      } catch (e) {
        console.warn(`警告: 解析pageMeta失败 ${filePath}`, e.message)
      }
    }

    // 如果没有找到pageMeta或解析失败，返回默认值
    return {
      title: path.basename(path.dirname(filePath)),
      requiresAuth: false,
    }
  } catch (e) {
    console.warn(`警告: 读取文件失败 ${filePath}`, e.message)
    return {
      title: '',
      requiresAuth: false,
    }
  }
}

/**
 * 递归获取目录下的所有页面
 * @param {string} dir 目录路径
 * @param {string} baseDir 基础目录路径
 * @returns {Object} 路由配置对象
 */
function getPages(dir, baseDir = '') {
  const routes = {}

  // 确保目录存在
  if (!fs.existsSync(dir)) {
    console.warn(`警告: 目录不存在 ${dir}`)
    return routes
  }

  // 读取目录内容
  const files = fs.readdirSync(dir)

  // 遍历目录内容
  for (const file of files) {
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)

    // 如果是目录，则作为页面处理
    if (stat.isDirectory()) {
      const pagePath = path.join(baseDir, file)

      // 检查是否存在 index.tsx 作为页面入口
      const indexFile = path.join(fullPath, 'index.tsx')

      if (fs.existsSync(indexFile)) {
        // 创建路由键名 (将路径中的斜杠替换为下划线)
        const routeKey = pagePath.replace(/\//g, '_') || 'index'

        // 构建路由路径
        const routePath = `/pages/${pagePath}/index`

        // 获取页面元数据
        const meta = parseMeta(indexFile)

        // 添加到路由配置
        routes[routeKey] = {
          path: routePath,
          meta,
        }
      }

      // 递归处理子目录
      const subRoutes = getPages(fullPath, pagePath)
      Object.assign(routes, subRoutes)
    }
  }

  return routes
}

/**
 * 生成路由配置文件
 */
function generateRoutes() {
  try {
    console.log('开始生成路由配置...')

    // 获取所有页面
    const routes = getPages(PAGES_DIR)

    // 生成 TypeScript 代码
    const content = `/**
 * 自动生成的路由配置
 * 请勿手动修改此文件，修改将在下次生成时被覆盖
 */

const routes = ${JSON.stringify(routes, null, 2)}

export default routes

export const pages = Object.keys(routes).map(key => routes[key].path)

export const authRequiredPages = Object.keys(routes)
  .filter(key => routes[key].meta.requiresAuth)
  .map(key => routes[key].path)

`

    // 写入文件
    fs.writeFileSync(OUTPUT_FILE, content, { encoding: 'utf8', flag: 'w' })

    // 确保文件写入完成
    fs.fsyncSync(fs.openSync(OUTPUT_FILE, 'r+'))

    console.log(`路由配置已生成: ${OUTPUT_FILE}`)
    console.log(`共找到 ${Object.keys(routes).length} 个页面`)
  } catch (error) {
    console.error('生成路由配置失败:', error)
    process.exit(1)
  }
}

// 执行生成
generateRoutes()
