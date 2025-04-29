import type { UserConfigExport } from '@tarojs/cli'

export default {
  logger: {
    quiet: true,
    stats: false,
  },
  mini: {},
  h5: {
    devServer: {
      hot: true,
      liveReload: true,
      client: {
        overlay: false,
      },
    },
  },
} satisfies UserConfigExport<'webpack5'>
