// 实现一个简单的 event emitter

type EventHandler = (...args: any[]) => void

export class EventEmitter {
  private events: Map<string, EventHandler[]>

  constructor() {
    this.events = new Map()
  }

  /**
   * 订阅事件
   * @param event 事件名称
   * @param handler 事件处理函数
   */
  on(event: string, handler: EventHandler): this {
    if (!this.events.has(event)) {
      this.events.set(event, [])
    }

    this.events.get(event)!.push(handler)
    return this
  }

  /**
   * 取消订阅事件
   * @param event 事件名称
   * @param handler 事件处理函数，如果不提供则移除所有该事件的处理函数
   */
  off(event: string, handler?: EventHandler): this {
    if (!this.events.has(event)) {
      return this
    }

    if (!handler) {
      this.events.delete(event)
      return this
    }

    const handlers = this.events.get(event)!
    const index = handlers.indexOf(handler)

    if (index !== -1) {
      handlers.splice(index, 1)

      if (handlers.length === 0) {
        this.events.delete(event)
      }
    }

    return this
  }

  /**
   * 触发事件
   * @param event 事件名称
   * @param args 传递给事件处理函数的参数
   */
  emit(event: string, ...args: any[]): boolean {
    if (!this.events.has(event)) {
      return false
    }

    const handlers = this.events.get(event)!.slice()

    for (const handler of handlers) {
      handler(...args)
    }

    return true
  }

  /**
   * 订阅事件，但只触发一次
   * @param event 事件名称
   * @param handler 事件处理函数
   */
  once(event: string, handler: EventHandler): this {
    const onceHandler = (...args: any[]) => {
      this.off(event, onceHandler)
      handler(...args)
    }

    return this.on(event, onceHandler)
  }

  /**
   * 获取某个事件的所有监听器
   * @param event 事件名称
   */
  listeners(event: string): EventHandler[] {
    return this.events.has(event) ? [...this.events.get(event)!] : []
  }

  /**
   * 移除所有事件监听器
   */
  removeAllListeners(): this {
    this.events.clear()
    return this
  }
}

export const emitter = new EventEmitter()
