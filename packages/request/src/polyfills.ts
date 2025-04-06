/**
 * Web API Polyfills for Mini-Program Environment
 * 提供Web环境API的小程序平台替代实现
 */
import { TaroFormData } from './adapters/taro-adapter'

/**
 * 初始化环境polyfills
 * 为小程序环境提供Web API兼容
 */
export function initPolyfills(): void {
  if (process.env.TARO_ENV && process.env.TARO_ENV !== 'h5') {
    console.log(`[Request] 初始化小程序环境Polyfills: ${process.env.TARO_ENV}`)

    // 全局对象获取
    const globalObj: any = typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : ({} as any)

    // FormData polyfill
    if (!globalObj.FormData) {
      globalObj.FormData = TaroFormData
      console.log('[Request] FormData polyfill installed')
    }

    // URL polyfill - 简化实现
    if (!globalObj.URL) {
      globalObj.URL = class URL {
        public hash: string = ''
        public host: string = ''
        public hostname: string = ''
        public href: string
        public origin: string = ''
        public password: string = ''
        public pathname: string = ''
        public port: string = ''
        public protocol: string = ''
        public search: string = ''
        public searchParams: any = {}
        public username: string = ''

        constructor(url: string, base?: string) {
          this.href = url
          if (url.startsWith('http')) {
            // 简单解析
            const urlParts = url.split('?')
            if (urlParts.length > 1) {
              this.search = `?${urlParts[1]}`
            }
            // 设置origin
            const originMatch = url.match(/^(https?:\/\/[^\/]+)/)
            if (originMatch) {
              this.origin = originMatch[1]
              this.host = originMatch[1].replace(/^https?:\/\//, '')
              this.hostname = this.host.split(':')[0]
            }
            // 设置pathname
            const pathMatch = url.match(/^https?:\/\/[^\/]+(\/[^\?#]*)/)
            if (pathMatch) {
              this.pathname = pathMatch[1]
            }
          }
        }

        toString(): string {
          return this.href
        }
      }
      console.log('[Request] URL polyfill installed')
    }

    // URLSearchParams polyfill - 简化实现
    if (!globalObj.URLSearchParams) {
      globalObj.URLSearchParams = class URLSearchParams {
        private params: Record<string, string[]> = {}

        constructor(init?: string | Record<string, string>) {
          if (typeof init === 'string') {
            init = init.replace(/^\?/, '')
            const pairs = init.split('&')
            for (const pair of pairs) {
              const [key, value] = pair.split('=')
              this.append(decodeURIComponent(key), decodeURIComponent(value || ''))
            }
          } else if (init) {
            for (const key in init) {
              this.append(key, init[key])
            }
          }
        }

        append(key: string, value: string): void {
          if (!this.params[key]) {
            this.params[key] = []
          }
          this.params[key].push(value)
        }

        get(key: string): string | null {
          return this.params[key]?.[0] || null
        }

        getAll(key: string): string[] {
          return this.params[key] || []
        }

        has(key: string): boolean {
          return key in this.params
        }

        set(key: string, value: string): void {
          this.params[key] = [value]
        }

        delete(key: string): void {
          delete this.params[key]
        }

        toString(): string {
          const parts: string[] = []
          for (const key in this.params) {
            for (const value of this.params[key]) {
              parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            }
          }
          return parts.join('&')
        }
      }
      console.log('[Request] URLSearchParams polyfill installed')
    }
  }
}
