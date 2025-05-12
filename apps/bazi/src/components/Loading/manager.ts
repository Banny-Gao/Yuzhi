export class LoadingManager {
  private static instance: LoadingManager
  private counter: number = 0
  private onChange: ((show: boolean) => void) | null = null

  private constructor() {}

  public static getInstance(): LoadingManager {
    if (!LoadingManager.instance) {
      LoadingManager.instance = new LoadingManager()
    }
    return LoadingManager.instance
  }

  // 注册状态变化回调
  public registerCallback(callback: (show: boolean) => void): void {
    this.onChange = callback
  }

  // 取消注册
  public unregisterCallback(): void {
    this.onChange = null
  }

  // 开始一个请求
  public async show(): Promise<void> {
    this.counter++
    if (this.counter === 1 && this.onChange) {
      await this.onChange(true)
    }
  }

  // 结束一个请求
  public async hide(): Promise<void> {
    if (this.counter > 0) {
      this.counter--
    }

    if (this.counter === 0 && this.onChange) {
      await this.onChange(false)
    }
  }

  // 强制重置状态，用于处理异常情况
  public async reset(): Promise<void> {
    this.counter = 0
    if (this.onChange) {
      await this.onChange(false)
    }
  }

  // 获取当前活跃请求数
  public getCount(): number {
    return this.counter
  }
}

// 导出Loading管理器单例
export const loadingManager = LoadingManager.getInstance()
