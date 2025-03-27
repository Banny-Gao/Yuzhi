/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiRequestOptions } from './ApiRequestOptions'

export type OpenAPIConfig = {
  BASE: string
  VERSION: string
  WITH_CREDENTIALS: boolean
  CREDENTIALS: 'include' | 'omit' | 'same-origin'
  TOKEN?: string | (() => string)
  USERNAME?: string | (() => string)
  PASSWORD?: string | (() => string)
  HEADERS?: Record<string, string | (() => string)>
  ENCODE_PATH?: (path: string) => string
  SIGNAL?: AbortSignal | (() => AbortSignal)
  REQUEST?: (options: ApiRequestOptions) => Promise<ApiRequestOptions>
  RESPONSE?: (response: Response, options: ApiRequestOptions) => Promise<Response>
  ERROR?: (error: Error, options: ApiRequestOptions) => Promise<never>
}

export const OpenAPI: OpenAPIConfig = {
  BASE: '',
  VERSION: '1.0',
  WITH_CREDENTIALS: false,
  CREDENTIALS: 'same-origin',
  TOKEN: undefined,
  USERNAME: undefined,
  PASSWORD: undefined,
  HEADERS: undefined,
  ENCODE_PATH: undefined,
  SIGNAL: undefined,
  REQUEST: undefined,
  RESPONSE: undefined,
  ERROR: undefined,
}
