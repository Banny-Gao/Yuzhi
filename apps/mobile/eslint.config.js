// ESLint 9 扁平配置
export default [
  // 基本配置
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        // 浏览器全局变量
        window: true,
        document: true,
        console: true,

        // Taro 特定全局变量
        wx: true,
        getApp: true,
        getCurrentPages: true,
        Taro: true,
      },
    },

    // 规则配置
    rules: {
      // 推荐规则
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      'no-undef': 'error',

      // React 相关规则 - 这些规则需要相应的 React 插件
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },

  // 忽略的文件和目录
  {
    ignores: ['dist/**', 'node_modules/**', 'config/**', '.git/**', '.temp/**', 'debug/**'],
  },
]
