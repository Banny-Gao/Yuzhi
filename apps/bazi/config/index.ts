import { defineConfig, type UserConfigExport } from '@tarojs/cli'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import dotenv from 'dotenv'

import devConfig from './dev'
import prodConfig from './prod'
// https://taro-docs.jd.com/docs/next/config#defineconfig-辅助函数
export default defineConfig<'webpack5'>(async (merge, { mode }) => {
  const isDev = mode === 'development'

  dotenv.config({ path: [isDev ? '.env.local' : '.env'] })

  const conmmonConfig: UserConfigExport<'webpack5'> = {
    postcss: {
      pxtransform: {
        enable: true,
        config: {
          onePxTransform: true,
          unitPrecision: 3,
          propList: ['*'],
          selectorBlackList: ['ignore'],
          replace: true,
          mediaQuery: false,
          minPixelValue: 0,
        },
      },
      cssModules: {
        enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
    },
    miniCssExtractPluginOption: {
      ignoreOrder: true,
    },
    webpackChain(chain) {
      chain.resolve.plugin('tsconfig-paths').use(TsconfigPathsPlugin)

      if (process.env.TARO_ENV !== 'h5') {
        chain.module
          .rule('replace')
          .test(/\.(j|t)sx?$/)
          .use('webpack-replace-loader')
          .loader('webpack-replace-loader')
          .options({
            arr: [
              {
                search: "lazy(() => import('@/custom-tab-bar'))",
                replace: 'Fragment',
                attr: 'g',
              },
            ],
          })
      }
    },
  }

  const baseConfig: UserConfigExport<'webpack5'> = {
    projectName: 'bazi',
    designWidth: 750,
    baseFontSize: 24,
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      375: 2,
      828: 1.81 / 2,
    },
    sourceRoot: 'src',
    outputRoot: `dist/${process.env.TARO_ENV}`,
    plugins: ['@tarojs/plugin-http'],
    defineConstants: {
      'process.env': JSON.stringify(process.env),
    },
    copy: {
      patterns: [],
      options: {},
    },
    framework: 'react',
    compiler: {
      type: 'webpack5',
      prebundle: {
        enable: true,
        exclude: ['axios'],
      },
    },
    cache: {
      enable: isDev, // Webpack 持久化缓存配置，建议开启。默认配置请参考：https://docs.taro.zone/docs/config-detail#cache
    },
    mini: {
      ...conmmonConfig,
    },
    h5: {
      publicPath: '/',
      staticDirectory: 'static',
      output: {
        filename: 'js/[name].[contenthash:8].js',
        chunkFilename: 'js/[name].[contenthash:8].js',
      },
      esnextModules: ['taro-ui'],
      ...conmmonConfig,
    },
    rn: {
      appName: 'taroDemo',
      postcss: {
        cssModules: {
          enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        },
      },
    },
  }

  if (isDev) {
    // 本地开发构建配置（不混淆压缩）
    return merge({}, baseConfig, devConfig)
  }
  // 生产构建配置（默认开启压缩混淆等）
  return merge({}, baseConfig, prodConfig)
})
