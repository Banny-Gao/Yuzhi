import { defineConfig } from '@hey-api/openapi-ts'
import dotenv from 'dotenv'

dotenv.config()

export default defineConfig({
  input: `${process.env.TARO_APP_API_URL}/api-json`,
  output: {
    format: 'prettier',
    lint: 'eslint',
    path: './src/utils/request/openapi',
  },
  plugins: [
    '@hey-api/client-axios',
    '@hey-api/schemas',
    'legacy/xhr',
    {
      dates: true,
      name: '@hey-api/transformers',
    },
    {
      enums: 'javascript',
      name: '@hey-api/typescript',
    },
    {
      name: '@hey-api/sdk',
      transformer: true,
    },
  ],
})
