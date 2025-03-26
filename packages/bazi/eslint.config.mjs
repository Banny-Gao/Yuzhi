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
    rules: {
      'tsdoc/syntax': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      '@typescript-eslint/non-nullable-type-assertion-style': 'off',
      'no-param-reassign': 'off',
      'import/no-cycle': 'off',
      'import/no-unresolved': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      'eslint-comments/require-description': 'off',
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
]
