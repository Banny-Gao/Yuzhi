// @ts-check
const tseslint = require('@typescript-eslint/eslint-plugin')
const tsParser = require('@typescript-eslint/parser')
const eslintJs = require('@eslint/js')
const reactPlugin = require('eslint-plugin-react')
const importPlugin = require('eslint-plugin-import')

/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = [
  // 基础配置
  {
    ignores: ['dist/**', 'node_modules/**', '*.js', '*.cjs', '*.json', 'config/**'],
  },
  eslintJs.configs.recommended,
  // 全局环境和变量配置
  {
    languageOptions: {
      globals: {
        // Taro 全局变量
        Taro: 'readonly',
        defineAppConfig: 'readonly',
        definePageConfig: 'readonly',
        // 浏览器环境变量
        document: 'readonly',
        window: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        process: 'readonly',
        // React 全局变量
        React: 'readonly',
        // 通用
        TaroGeneral: 'readonly',
      },
      ecmaVersion: 2022,
      sourceType: 'module',
    },
  },
  // TypeScript配置
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': tseslint,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.json',
      },
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          varsIgnorePattern: 'Taro|React|^_',
          argsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true,
        },
      ],
    },
  },
  // React配置
  {
    files: ['**/*.jsx', '**/*.tsx'],
    plugins: {
      react: reactPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      // 注意：移除了react-hooks规则，因为与ESLint v9存在兼容性问题
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/prop-types': 'off',
      'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.tsx'] }],
      'react/jsx-indent-props': [2, 2],
      'react/jsx-indent': [2, 2],
      'react/jsx-one-expression-per-line': 0,
      'react/prefer-stateless-function': [1, { ignorePureComponents: true }],
      'react/self-closing-comp': 1,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  // import插件配置
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/first': 'error',
      'import/no-duplicates': 'error',
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
        },
      ],
    },
  },
  // Taro特定规则
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    rules: {
      // Taro相关规则
      'no-unused-vars': [
        'warn',
        {
          varsIgnorePattern: 'Taro|React|^_',
          argsIgnorePattern: '^_',
        },
      ],
      semi: ['error', 'never'],
      quotes: ['error', 'single'],
      'comma-dangle': ['error', 'always-multiline'],
      'jsx-quotes': ['error', 'prefer-double'],
      'space-before-function-paren': ['error', 'always'],
      // 允许对props的后代进行变更
      'react/no-access-state-in-setstate': 0,
      'react/no-did-update-set-state': 0,
      // 允许异步Promise执行器，因为在Taro环境中可能需要
      'no-async-promise-executor': 'off',
      // Taro禁止循环中使用JSX组件
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ForInStatement',
          message:
            'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
        },
        {
          selector: 'LabeledStatement',
          message:
            'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
        },
        {
          selector: 'WithStatement',
          message:
            '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
        },
      ],
    },
  },
]
