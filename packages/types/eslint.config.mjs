import js from '@eslint/js'
import globals from 'globals'
import { eslint as tseslint } from '@typescript-eslint/eslint-plugin'

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
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
