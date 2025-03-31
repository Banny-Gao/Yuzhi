#!/usr/bin/env node

/**
 * 创建页面脚本
 * 使用 Taro CLI 创建页面，并自动更新路由配置
 * 支持交互式命令行输入
 */
const { Command } = require('commander')
const inquirer = require('inquirer')
const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

// 定义命令行程序
const program = new Command()

// 项目根目录
const ROOT_DIR = path.resolve(__dirname, '..')

/**
 * 检查页面是否已存在
 * @param {string} pagePath 页面路径
 * @returns {boolean} 是否存在
 */
function pageExists(pagePath) {
  const fullPath = path.join(ROOT_DIR, 'src', pagePath)
  return fs.existsSync(fullPath)
}

const permissionLevels = ['general', 'more', 'super']
/**
 * 生成页面配置模板代码
 * @param {string} title 页面标题
 * @param {boolean} requiresAuth 是否需要登录
 * @param {string} requiresPermission 是否需要权限，以及权限类型
 * @returns {string} 页面配置代码
 */
function generatePageMetaTemplate(title, requiresAuth = false, requiresPermission = 'general') {
  return `export const pageMeta = {
  title: '${title}',
  requiresAuth: ${requiresAuth},
  requiresPermission:' ${requiresPermission}',
};
`
}

/**
 * 添加页面元数据到页面文件
 * @param {string} pagePath 页面文件路径
 * @param {string} title 页面标题
 * @param {boolean} requiresAuth 是否需要登录
 * @param {boolean} requiresPermission 是否需要权限
 */
function addPageMeta({ pagePath, title, requiresAuth, requiresPermission } = {}) {
  const pageSrcPath = path.join(ROOT_DIR, 'src', pagePath, 'index.tsx')

  if (fs.existsSync(pageSrcPath)) {
    // 读取文件内容
    let content = fs.readFileSync(pageSrcPath, 'utf-8')

    // 检查是否已有 pageMeta
    if (!content.includes('export const pageMeta')) {
      // 在文件顶部添加元数据
      const metaTemplate = generatePageMetaTemplate(title, requiresAuth, requiresPermission)
      const importStatements = content.match(/^import.*?$/gm) || []

      if (importStatements.length > 0) {
        // 在最后一个 import 后添加
        const lastImport = importStatements[importStatements.length - 1]
        const position = content.indexOf(lastImport) + lastImport.length
        content = content.slice(0, position) + '\n\n' + metaTemplate + content.slice(position)
      } else {
        // 在文件开头添加
        content = metaTemplate + '\n' + content
      }

      // 写回文件
      fs.writeFileSync(pageSrcPath, content)
      console.log(`✅ 已添加页面元数据到 ${pageSrcPath}`)
    }
  } else {
    console.warn(`⚠️ 警告: 页面文件不存在 ${pageSrcPath}`)
  }
}

/**
 * 探测 src/pages 目录结构，用于自动提示
 * @returns {Object} 目录结构
 */
function detectPagesStructure() {
  const pagesDir = path.join(ROOT_DIR, 'src', 'pages')
  let result = {
    directories: [],
    packages: [],
  }

  if (!fs.existsSync(pagesDir)) {
    return result
  }

  try {
    // 获取一级目录
    const entries = fs.readdirSync(pagesDir, { withFileTypes: true })

    for (const entry of entries) {
      if (entry.isDirectory()) {
        result.directories.push(entry.name)

        // 检查是否为分包
        const subDir = path.join(pagesDir, entry.name)
        const subEntries = fs.readdirSync(subDir, { withFileTypes: true })

        // 如果包含其他目录，可能是分包
        if (subEntries.some(e => e.isDirectory())) {
          result.packages.push(entry.name)
        }
      }
    }

    return result
  } catch (error) {
    console.warn('读取页面目录结构失败:', error.message)
    return result
  }
}

/**
 * 交互式询问页面信息
 * @param {Object} cmdOptions 命令行选项
 * @returns {Promise<Object>} 收集到的选项
 */
async function promptForOptions(cmdOptions) {
  const pagesStructure = detectPagesStructure()

  const questions = []

  // 如果没有提供名称，询问
  if (!cmdOptions.name) {
    questions.push({
      type: 'input',
      name: 'name',
      message: '请输入页面名称:',
      validate: input => (input ? true : '页面名称不能为空'),
    })
  }

  // 如果没有提供页面类型，询问
  if (!cmdOptions.type) {
    questions.push({
      type: 'list',
      name: 'type',
      message: '选择创建的模板类型:',
      default: 'page',
      choices: [
        { name: '页面 (page)', value: 'page' },
        { name: '组件 (component)', value: 'component' },
      ],
    })
  }

  // 如果没有提供目录，询问
  if (!cmdOptions.dir && pagesStructure.directories.length > 0) {
    questions.push({
      type: 'list',
      name: 'dir',
      message: '选择页面目录:',
      choices: [{ name: '根目录', value: '' }, ...pagesStructure.directories.map(dir => ({ name: dir, value: dir }))],
    })
  }

  // 如果没有提供分包，询问
  if (!cmdOptions.subpkg && pagesStructure.packages.length > 0) {
    questions.push({
      type: 'list',
      name: 'subpkg',
      message: '选择分包:',
      choices: [{ name: '不使用分包', value: '' }, ...pagesStructure.packages.map(pkg => ({ name: pkg, value: pkg }))],
    })
  }

  // 如果没有提供描述，询问
  if (!cmdOptions.description) {
    questions.push({
      type: 'input',
      name: 'description',
      message: '请输入页面描述 (可选):',
      default: answers => answers.name || cmdOptions.name || '新页面',
    })
  }

  // 如果没有提供认证选项，询问
  if (cmdOptions.auth === undefined) {
    questions.push({
      type: 'confirm',
      name: 'auth',
      message: '此页面是否需要登录授权?',
      default: false,
    })
  }

  // 如果没有提供权限选项，询问
  if (cmdOptions.permission === undefined) {
    questions.push({
      type: 'list',
      name: 'permission',
      message: '请选择页面权限:',
      choices: permissionLevels,
      default: 'general',
    })
  }

  // 如果有需要询问的问题，进行交互
  if (questions.length > 0) {
    const answers = await inquirer.prompt(questions)
    return { ...cmdOptions, ...answers }
  }

  return cmdOptions
}

/**
 * 执行 Taro 命令创建页面
 * @param {object} options 选项
 */
async function createPage(options) {
  try {
    console.log('📝 开始创建页面...')

    // 确定页面路径
    let pagePath = 'pages'
    if (options.dir) {
      // 从 --dir=value 或 dir 中提取值
      const dirValue = options.dir.startsWith('--dir=') ? options.dir.substring(6) : options.dir
      pagePath = path.join(pagePath, dirValue)
    }

    if (options.subpkg) {
      // 从 --subpkg=value 或 subpkg 中提取值
      const subpkgValue = options.subpkg.startsWith('--subpkg=') ? options.subpkg.substring(9) : options.subpkg
      pagePath = path.join(pagePath, subpkgValue)
    }

    if (options.name) {
      // 从 --name=value 或 name 中提取值
      const nameValue = options.name.startsWith('--name=') ? options.name.substring(7) : options.name
      pagePath = path.join(pagePath, nameValue)
    }

    // 检查页面是否已存在
    if (pageExists(pagePath)) {
      const answers = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: `⚠️ 页面 ${pagePath} 已存在，是否覆盖?`,
          default: false,
        },
      ])

      if (!answers.overwrite) {
        console.log('❌ 已取消创建页面')
        return
      }
    }

    // 构建 Taro 命令
    let command = `cd ${ROOT_DIR} && npx taro create`

    // 如果提供了名称参数，使用它
    if (options.name) {
      // 转换为 Taro CLI 参数格式
      if (!options.name.startsWith('--name=')) {
        command += ` --name=${options.name}`
      } else {
        command += ` ${options.name}`
      }
    }

    // 添加其他选项
    if (options.dir) {
      if (!options.dir.startsWith('--dir=')) {
        command += ` --dir=${options.dir}`
      } else {
        command += ` ${options.dir}`
      }
    }

    if (options.subpkg) {
      if (!options.subpkg.startsWith('--subpkg=')) {
        command += ` --subpkg=${options.subpkg}`
      } else {
        command += ` ${options.subpkg}`
      }
    }

    if (options.description) {
      if (!options.description.startsWith('--description=')) {
        command += ` --description=${options.description}`
      } else {
        command += ` ${options.description}`
      }
    }

    // 设置类型为 page (如果没有明确指定)
    if (!options.type) {
      command += ' --type=page'
    } else {
      if (!options.type.startsWith('--type=')) {
        command += ` --type=${options.type}`
      } else {
        command += ` ${options.type}`
      }
    }

    // 执行命令
    console.log(`🔄 执行: ${command}`)
    execSync(command, { stdio: 'inherit' })

    // 添加页面元数据
    const title = options.description || (options.name && options.name.replace(/--name=/, '')) || '新页面'
    const requiresAuth = options.auth === true
    const requiresPermission = options.permission || 'general'
    addPageMeta({ pagePath, title, requiresAuth, requiresPermission })

    // 自动生成路由配置
    console.log('🔄 更新路由配置...')
    execSync(`cd ${ROOT_DIR} && node --no-inspect scripts/generate-routes.js`, { stdio: 'inherit' })

    // 确保路由文件生成完成
    const routesFile = path.join(ROOT_DIR, 'src', 'generated.routes.ts')
    if (fs.existsSync(routesFile)) {
      console.log(`✅ 路由配置文件已更新: ${routesFile}`)
    } else {
      console.warn(`⚠️ 警告: 路由配置文件未生成: ${routesFile}`)
    }

    console.log('✅ 页面创建成功!')
  } catch (error) {
    console.error('❌ 创建页面失败:', error.message)
    process.exit(1)
  }
}

// 配置命令行程序
program
  .name('createPage')
  .description('创建Taro页面并自动配置路由')
  .option('--name <name>')
  .option('--dir <dir>')
  .option('--subpkg <subpkg>')
  .option('--description <description>')
  .option('--type <type>')
  .option('--auth <auth>')
  .option('--permission <permission>')
  .action(async options => {
    try {
      // 收集完整的选项（命令行参数 + 交互式输入）
      const completeOptions = await promptForOptions(options)
      await createPage(completeOptions)
    } catch (error) {
      console.error('❌ 执行过程中出错:', error.message)
      process.exit(1)
    }
  })

// 解析命令行参数
program.parse(process.argv)

// 如果没有参数，直接进入交互模式
if (process.argv.length <= 2) {
  ;(async () => {
    try {
      const options = await promptForOptions({})
      await createPage(options)
    } catch (error) {
      console.error('❌ 执行过程中出错:', error.message)
      process.exit(1)
    }
  })()
}
