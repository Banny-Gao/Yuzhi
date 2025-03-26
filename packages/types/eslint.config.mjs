import js from '@eslint/js'
import globals from 'globals'
import typescript from 'typescript-eslint'

export default [
  js.configs.recommended,
  ...typescript.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: '.',
      },
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
]
