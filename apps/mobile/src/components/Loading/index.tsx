import React, { useEffect, useRef, useState } from 'react'
import { View, Canvas } from '@tarojs/components'
import Taro, { useReady } from '@tarojs/taro'
import { useTheme } from '@/contexts/ThemeContext'
import styles from './index.module.less'

interface LoadingProps {
  show?: boolean
  size?: number
}

// 请求计数器类，用于管理多个请求时的Loading状态
class LoadingManager {
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
  public show(): void {
    this.counter++
    if (this.counter === 1 && this.onChange) {
      this.onChange(true)
    }
  }

  // 结束一个请求
  public hide(): void {
    if (this.counter > 0) {
      this.counter--
    }

    if (this.counter === 0 && this.onChange) {
      this.onChange(false)
    }
  }

  // 强制重置状态，用于处理异常情况
  public reset(): void {
    this.counter = 0
    if (this.onChange) {
      this.onChange(false)
    }
  }

  // 获取当前活跃请求数
  public getCount(): number {
    return this.counter
  }
}

// 从CSS变量获取计算后的颜色值
const getCssVariableValue = (variableName: string): string => {
  // 获取文档根元素的计算样式
  const computedStyle = getComputedStyle(document.documentElement)
  // 获取CSS变量的值
  const value = computedStyle.getPropertyValue(variableName).trim()

  // 如果找不到值，返回默认颜色
  if (!value) {
    return variableName.includes('primary') ? '#9d7ad2' : variableName.includes('bg') ? '#1e1e1e' : '#ffffff'
  }

  return value
}

// 导出Loading管理器单例
export const loadingManager = LoadingManager.getInstance()

// 全局Canvas引用，用于在外部初始化
let globalCanvasInitialized = false
let globalInitTimer: ReturnType<typeof setTimeout> | null = null

// 导出初始化方法，供app.tsx调用
export const initializeLoadingCanvas = () => {
  console.log('Attempting to initialize loading canvas from app...')

  // 如果已经初始化过，则不再重复初始化
  if (globalCanvasInitialized) return

  // 延迟执行以确保组件已挂载
  if (globalInitTimer) clearTimeout(globalInitTimer)

  globalInitTimer = setTimeout(async () => {
    try {
      // 检查Canvas元素是否存在
      const canvas = await getCanvasById(CANVAS_ID).catch(() => null)
      if (!canvas) {
        console.log('Canvas not ready yet, retrying in 100ms...')
        // 如果Canvas不存在，再次尝试
        initializeLoadingCanvas()
        return
      }

      console.log('Canvas element found, initializing...')
      globalCanvasInitialized = true

      // 触发Loading组件显示再隐藏，以启动初始化流程
      loadingManager.show()
      setTimeout(() => {
        loadingManager.hide()
      }, 300)
    } catch (error) {
      console.error('Failed to initialize loading canvas:', error)
    }
  }, 100)
}

// 定义鱼的类型
interface Fish {
  x: number
  y: number
  angle: number
  color: string
  tailColor: string
  eyeColor: string
}

// 使用原生requestAnimationFrame或创建兼容版本
const requestAnimFrame = (callback: FrameRequestCallback): number => {
  if (typeof window !== 'undefined' && window.requestAnimationFrame) {
    return window.requestAnimationFrame(callback)
  }
  return setTimeout(callback, 16) as unknown as number
}

// 取消动画帧请求的兼容方法
const cancelAnimFrame = (id: number): void => {
  if (typeof window !== 'undefined' && window.cancelAnimationFrame) {
    window.cancelAnimationFrame(id)
  } else {
    clearTimeout(id)
  }
}

const CANVAS_ID = 'loading-canvas'

// 获取Canvas元素函数
const getCanvasById = (id: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const query = Taro.createSelectorQuery()
    query
      .select(`#${id}`)
      .node()
      .exec(res => {
        if (res && res[0]?.node) {
          resolve(res[0].node)
        } else {
          console.error('Canvas node not found:', res)
          reject(new Error('Canvas node not found'))
        }
      })
  })
}

const Loading: React.FC<LoadingProps> = ({ show = true, size = 120 }) => {
  const { themeType } = useTheme()
  const [isVisible, setIsVisible] = useState(show)
  const [shouldShow, setShouldShow] = useState(show)

  // 动画状态
  const [animationState, setAnimationState] = useState<'entering' | 'showing' | 'exiting' | 'hidden'>('hidden')
  const animationProgress = useRef(0)
  const animationFrameId = useRef<number | null>(null)

  // Canvas相关引用
  const systemInfoRef = useRef(Taro.getSystemInfoSync())
  const canvasRef = useRef<any>(null)
  const ctxRef = useRef<any>(null)
  const canvasInitializedRef = useRef(false)
  const lastFrameTimeRef = useRef(0)

  // 使用LoadingManager控制组件状态
  useEffect(() => {
    loadingManager.registerCallback(show => {
      setShouldShow(show)
    })

    return () => {
      loadingManager.unregisterCallback()
    }
  }, [])

  useEffect(() => {
    if (shouldShow) {
      setIsVisible(true)
      setAnimationState('entering')
      animationProgress.current = 0
    } else {
      setAnimationState('exiting')
      animationProgress.current = 0

      // 等待退出动画完成后隐藏组件
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 600)
      return () => clearTimeout(timer)
    }
  }, [shouldShow])

  // 使用useReady钩子确保组件已经挂载
  useReady(() => {
    // 使用nextTick确保Canvas已经渲染
    Taro.nextTick(() => {
      if (isVisible && !canvasInitializedRef.current) {
        initCanvas()
      }
    })
  })

  // 初始化Canvas
  const initCanvas = async () => {
    // 取消之前的动画帧
    if (animationFrameId.current !== null) {
      cancelAnimFrame(animationFrameId.current)
      animationFrameId.current = null
    }

    console.log('Initializing canvas...')

    // 获取Canvas节点
    const canvas = await getCanvasById(CANVAS_ID)

    // 设置Canvas画布尺寸（处理高清显示）
    const pixelRatio = systemInfoRef.current.pixelRatio || 1

    // 确保尺寸不超过4096限制
    const maxCanvasSize = 4096
    let targetWidth = size * pixelRatio
    let targetHeight = size * pixelRatio

    if (targetWidth > maxCanvasSize || targetHeight > maxCanvasSize) {
      const scale = Math.min(maxCanvasSize / targetWidth, maxCanvasSize / targetHeight)
      targetWidth *= scale
      targetHeight *= scale
    }

    // 设置Canvas尺寸
    canvas.width = targetWidth
    canvas.height = targetHeight

    // 获取绘图上下文
    const ctx = canvas.getContext('2d')
    // 缩放以匹配逻辑像素
    ctx.scale(pixelRatio, pixelRatio)

    // 保存引用
    canvasRef.current = canvas
    ctxRef.current = ctx
    canvasInitializedRef.current = true

    console.log('Canvas initialized successfully')

    // 开始动画
    startAnimation()
  }

  // 监听可见性变化和主题变化
  // useEffect(() => {
  //   if (isVisible && !canvasInitializedRef.current) {
  //     // 当组件可见且Canvas未初始化时尝试初始化
  //     Taro.nextTick(() => {
  //       debugger
  //       initCanvas()
  //     })
  //   }

  //   return () => {
  //     // 清理动画
  //     if (animationFrameId.current !== null) {
  //       cancelAnimFrame(animationFrameId.current)
  //       animationFrameId.current = null
  //     }
  //   }
  // }, [isVisible, themeType])

  // 启动动画
  const startAnimation = () => {
    if (!ctxRef.current) {
      console.error('Cannot start animation: Canvas context not available')
      return
    }

    // 获取主题颜色
    const whiteFishColor = '#ffffff'
    const blackFishColor = '#000000'
    const whiteFishTail = '#f0f0f0'
    const blackFishTail = '#303030'

    // 帧动画函数
    const animate = (timestamp = 0) => {
      try {
        if (!ctxRef.current) {
          console.error('Canvas context lost during animation')
          return
        }

        // 计算帧间隔，确保动画速度一致
        const deltaTime = timestamp - lastFrameTimeRef.current
        lastFrameTimeRef.current = timestamp
        const frameRate = deltaTime > 0 ? deltaTime / 1000 : 0.016 // 默认约60fps

        const ctx = ctxRef.current
        // 清空画布
        ctx.clearRect(0, 0, size, size)

        const centerX = size / 2
        const centerY = size / 2
        const radius = size * 0.4 // 鱼游动的半径

        // 更新动画进度 - 根据帧率调整速度
        const speedFactor = frameRate * 60 // 基于60fps标准化
        if (animationState === 'entering') {
          animationProgress.current += 0.02 * speedFactor
          if (animationProgress.current >= 1) {
            setAnimationState('showing')
            animationProgress.current = 0
          }
        } else if (animationState === 'showing') {
          animationProgress.current += 0.01 * speedFactor
          if (animationProgress.current > 1) animationProgress.current = 0
        } else if (animationState === 'exiting') {
          animationProgress.current += 0.02 * speedFactor
          if (animationProgress.current >= 1) {
            // 动画结束，停止绘制
            return
          }
        }

        // 计算鱼的位置和角度
        let whiteFish: Fish = { x: 0, y: 0, angle: 0, color: whiteFishColor, tailColor: whiteFishTail, eyeColor: blackFishColor }
        let blackFish: Fish = { x: 0, y: 0, angle: 0, color: blackFishColor, tailColor: blackFishTail, eyeColor: whiteFishColor }

        if (animationState === 'entering') {
          // 入场动画：从屏幕外游进，然后开始旋转
          const progress = animationProgress.current

          // 白鱼从左上角游入
          whiteFish.x = centerX - (1 - progress) * size
          whiteFish.y = centerY - (1 - progress) * size
          whiteFish.angle = Math.PI * 0.25 + progress * Math.PI

          // 黑鱼从右下角游入
          blackFish.x = centerX + (1 - progress) * size
          blackFish.y = centerY + (1 - progress) * size
          blackFish.angle = Math.PI * 1.25 + progress * Math.PI

          // 当接近完成时，逐渐向正确的阴阳位置靠拢
          if (progress > 0.7) {
            const finalProgress = (progress - 0.7) / 0.3

            // 计算最终位置（阴阳图中的位置）
            const finalWhiteX = centerX + radius * Math.cos(Math.PI * 0.5)
            const finalWhiteY = centerY + radius * Math.sin(Math.PI * 0.5)
            const finalBlackX = centerX + radius * Math.cos(Math.PI * 1.5)
            const finalBlackY = centerY + radius * Math.sin(Math.PI * 1.5)

            // 插值到最终位置
            whiteFish.x = whiteFish.x * (1 - finalProgress) + finalWhiteX * finalProgress
            whiteFish.y = whiteFish.y * (1 - finalProgress) + finalWhiteY * finalProgress

            blackFish.x = blackFish.x * (1 - finalProgress) + finalBlackX * finalProgress
            blackFish.y = blackFish.y * (1 - finalProgress) + finalBlackY * finalProgress
          }
        } else if (animationState === 'showing') {
          // 正常显示：两条鱼旋转围绕形成阴阳图
          const baseAngle = animationProgress.current * Math.PI * 2

          whiteFish.x = centerX + radius * Math.cos(baseAngle)
          whiteFish.y = centerY + radius * Math.sin(baseAngle)
          whiteFish.angle = baseAngle + Math.PI * 0.5

          blackFish.x = centerX + radius * Math.cos(baseAngle + Math.PI)
          blackFish.y = centerY + radius * Math.sin(baseAngle + Math.PI)
          blackFish.angle = baseAngle + Math.PI * 1.5
        } else if (animationState === 'exiting') {
          // 退出动画：两条鱼游出屏幕
          const progress = animationProgress.current

          // 从阴阳位置开始
          const startWhiteX = centerX + radius * Math.cos(Math.PI * 0.5)
          const startWhiteY = centerY + radius * Math.sin(Math.PI * 0.5)
          const startBlackX = centerX + radius * Math.cos(Math.PI * 1.5)
          const startBlackY = centerY + radius * Math.sin(Math.PI * 1.5)

          // 白鱼游向右上方
          whiteFish.x = startWhiteX * (1 - progress) + (centerX + size) * progress
          whiteFish.y = startWhiteY * (1 - progress) + (centerY - size) * progress
          whiteFish.angle = Math.PI * 0.5 + progress * Math.PI * 0.25

          // 黑鱼游向左下方
          blackFish.x = startBlackX * (1 - progress) + (centerX - size) * progress
          blackFish.y = startBlackY * (1 - progress) + (centerY + size) * progress
          blackFish.angle = Math.PI * 1.5 + progress * Math.PI * 0.25
        }

        // 绘制两条鱼
        drawFish(ctx, whiteFish)
        drawFish(ctx, blackFish)

        // 绘制
        ctx.draw(false, () => {
          // 仅当组件可见且不是最后一帧退出动画时继续动画
          if (isVisible && (animationState !== 'exiting' || animationProgress.current < 1)) {
            animationFrameId.current = requestAnimFrame(animate)
          }
        })
      } catch (error) {
        console.error('Animation error:', error)
        // 发生错误时，尝试在短暂延迟后继续
        if (isVisible) {
          setTimeout(() => {
            animationFrameId.current = requestAnimFrame(animate)
          }, 100)
        }
      }
    }

    // 绘制鱼的函数
    const drawFish = (ctx, fish: Fish) => {
      const fishSize = size * 0.28 // 鱼的大小

      // 保存当前上下文状态
      const currentX = fish.x
      const currentY = fish.y
      const currentAngle = fish.angle

      // 绘制鱼身
      drawFishBody()

      // 绘制尾鳍
      drawFishTail()

      // 绘制眼睛
      drawFishEye()

      // 绘制鱼身函数
      function drawFishBody() {
        ctx.beginPath()

        // 在鱼的位置进行坐标变换
        const x0 = currentX
        const y0 = currentY - fishSize * 0.5 * Math.sin(currentAngle)
        const x1 = x0 + fishSize * 0.6 * Math.cos(currentAngle)
        const y1 = y0 + fishSize * 0.6 * Math.sin(currentAngle)
        const x2 = x0 + fishSize * 0.8 * Math.cos(currentAngle)
        const y2 = y0 + fishSize * 0.8 * Math.sin(currentAngle)
        const x3 = x0 + fishSize * 0.5 * Math.sin(currentAngle)
        const y3 = y0 + fishSize * 0.5 * Math.cos(currentAngle)

        ctx.moveTo(x0, y0)
        ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3)

        const x4 = x0 - fishSize * 0.2 * Math.cos(currentAngle)
        const y4 = y0 - fishSize * 0.2 * Math.sin(currentAngle)
        const x5 = x0 - fishSize * 0.2 * Math.cos(currentAngle + Math.PI * 0.3)
        const y5 = y0 - fishSize * 0.2 * Math.sin(currentAngle + Math.PI * 0.3)

        ctx.bezierCurveTo(x4, y4, x5, y5, x0, y0)

        ctx.setFillStyle(fish.color)
        ctx.fill()
      }

      // 绘制尾鳍函数
      function drawFishTail() {
        ctx.beginPath()

        const tx0 = currentX + fishSize * 0.5 * Math.sin(currentAngle)
        const ty0 = currentY + fishSize * 0.5 * Math.cos(currentAngle)

        const tx1 = tx0 - fishSize * 0.6 * Math.cos(currentAngle - Math.PI * 0.2)
        const ty1 = ty0 - fishSize * 0.6 * Math.sin(currentAngle - Math.PI * 0.2)
        const tx2 = tx0 - fishSize * 0.8 * Math.cos(currentAngle - Math.PI * 0.3)
        const ty2 = ty0 - fishSize * 0.8 * Math.sin(currentAngle - Math.PI * 0.3)
        const tx3 = tx0 - fishSize * 0.6 * Math.cos(currentAngle - Math.PI * 0.7)
        const ty3 = ty0 - fishSize * 0.6 * Math.sin(currentAngle - Math.PI * 0.7)

        ctx.moveTo(tx0, ty0)
        ctx.bezierCurveTo(tx1, ty1, tx2, ty2, tx3, ty3)

        const tx4 = tx0 - fishSize * 0.3 * Math.cos(currentAngle - Math.PI * 0.5)
        const ty4 = ty0 - fishSize * 0.3 * Math.sin(currentAngle - Math.PI * 0.5)
        const tx5 = tx0 - fishSize * 0.3 * Math.cos(currentAngle - Math.PI * 0.3)
        const ty5 = ty0 - fishSize * 0.3 * Math.sin(currentAngle - Math.PI * 0.3)

        ctx.bezierCurveTo(tx4, ty4, tx5, ty5, tx0, ty0)

        ctx.setFillStyle(fish.tailColor)
        ctx.fill()
      }

      // 绘制眼睛函数
      function drawFishEye() {
        const eyeX = currentX + fishSize * 0.15 * Math.cos(currentAngle)
        const eyeY = currentY + fishSize * 0.15 * Math.sin(currentAngle)

        ctx.beginPath()
        ctx.arc(eyeX, eyeY, fishSize * 0.08, 0, Math.PI * 2)
        ctx.setFillStyle(fish.eyeColor)
        ctx.fill()
      }
    }

    // 启动动画
    lastFrameTimeRef.current = performance.now()
    animationFrameId.current = requestAnimFrame(animate)
  }

  if (!isVisible) return null

  // 组装容器类名
  const containerClassName = [styles.container, shouldShow ? styles.fadeIn : styles.fadeOut, styles[themeType]].filter(Boolean).join(' ')

  return (
    <View className={containerClassName}>
      <Canvas id={CANVAS_ID} className={styles.canvas} style={{ width: `${size}px`, height: `${size}px` }} type="2d" />
    </View>
  )
}

export default Loading
