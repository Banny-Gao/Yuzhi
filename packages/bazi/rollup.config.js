import typescript from '@rollup/plugin-typescript'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import path from 'path'

const input = 'src/index.ts'
const external = ['dayjs', '@amap/amap-jsapi-loader', 'decimal.js', 'localforage', 'tslib']

// 基础插件配置
const basePlugins = [nodeResolve(), commonjs()]

export default [
  // ESM build
  {
    input,
    output: {
      dir: 'dist/esm',
      format: 'es',
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
    plugins: [
      ...basePlugins,
      typescript({
        tsconfig: './tsconfig.json',
        outDir: 'dist/esm',
        declaration: true,
        declarationDir: 'dist/esm/types',
        declarationMap: true,
        exclude: ['**/*.test.ts'],
      }),
    ],
    external,
  },
  // CJS build
  {
    input,
    output: {
      dir: 'dist/cjs',
      format: 'cjs',
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
    plugins: [
      ...basePlugins,
      typescript({
        tsconfig: './tsconfig.json',
        outDir: 'dist/cjs',
        declaration: false,
        declarationMap: false,
        exclude: ['**/*.test.ts'],
      }),
    ],
    external,
  },
  // Minified bundle
  {
    input,
    output: {
      file: 'dist/index.min.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      ...basePlugins,
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationMap: false,
        outDir: 'dist/min',
        exclude: ['**/*.test.ts'],
      }),
      terser(),
    ],
    external,
  },
]
