import type { UserConfigExport } from '@tarojs/cli'

export default {
  mini: {},
  h5: {
    /**
     * WebpackChain 插件配置
     * @docs https://github.com/neutrinojs/webpack-chain
     */
    webpackChain(chain) {
      /**
       * 如果 h5 端编译后体积过大，可以使用 webpack-bundle-analyzer 插件对打包体积进行分析。
       * @docs https://github.com/webpack-contrib/webpack-bundle-analyzer
       */
      chain.plugin('analyzer').use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [])

      // 分包
      chain.plugin('splitChunks').use(require('webpack').optimize.SplitChunksPlugin, [
        {
          chunks: 'all',
          minSize: 20000,
          maxSize: 0,
          minChunks: 1,
          maxAsyncRequests: 5,
          maxInitialRequests: 3,
        },
      ])
    },
  },
} satisfies UserConfigExport<'webpack5'>
