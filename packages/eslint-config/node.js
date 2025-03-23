import pluginNode from 'eslint-plugin-node'
import { parser, plugin } from 'typescript-eslint'
import { resolve } from 'path'
import { config as baseConfig } from './base.js'

const project = resolve(process.cwd(), 'tsconfig.json')

export const config = [
  ...baseConfig,
  pluginNode.configs.recommended,
  {
    plugins: {
      [plugin.name]: plugin,
    },
    parser,
    parserOptions: {
      project,
      ecmaVersion: 'latest',
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
]
