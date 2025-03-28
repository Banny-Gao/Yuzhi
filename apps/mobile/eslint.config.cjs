// 使用 CommonJS 格式的扁平配置
module.exports = [
  // 基本配置
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
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
        defineAppConfig: true,
        definePageConfig: true,
      },
    },

    // 规则配置
    rules: {
      // 基本规则
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      'no-undef': 'error',
    },
  },

  // React 配置
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      react: require('eslint-plugin-react'),
      'react-hooks': require('eslint-plugin-react-hooks'),
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // React 核心规则
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',

      // React Hooks 规则
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },

  // TypeScript 配置
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        project: './tsconfig.json',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
    },
    rules: {
      // TypeScript 规则
      'no-undef': 'off', // TypeScript 已经处理了 undefined 变量
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },

  // 忽略的文件和目录
  {
    ignores: ['dist/**', 'node_modules/**', 'config/**', '.git/**', '.temp/**', 'debug/**'],
  },
]
