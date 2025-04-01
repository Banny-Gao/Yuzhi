import { generate } from 'openapi-typescript-codegen'
import { resolve } from 'path'

const input = resolve(__dirname, '../api-spec.json')
const output = resolve(__dirname, '../src/generated')

generate({
  input,
  output,
  httpClient: 'axios',
  useOptions: true,
  useUnionTypes: true,
  exportSchemas: true,
  exportServices: true,
  exportCore: true,
  exportModels: true,
  indent: 'tab',
})
