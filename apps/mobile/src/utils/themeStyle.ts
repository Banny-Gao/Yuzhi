/**
 * 主题样式工具函数
 */
import { CSSProperties } from 'react'
import { ThemeConfig } from '../styles/themes'

/**
 * 创建文本样式
 */
export const createTextStyle = (
  theme: ThemeConfig,
  options?: {
    type?: 'primary' | 'secondary' | 'tertiary' | 'disabled'
    size?: number | string
    bold?: boolean
    color?: string
  }
): CSSProperties => {
  const { type = 'primary', size, bold, color } = options || {}

  let textColor = theme.textPrimary

  switch (type) {
    case 'secondary':
      textColor = theme.textSecondary
      break
    case 'tertiary':
      textColor = theme.textTertiary
      break
    case 'disabled':
      textColor = theme.textDisabled
      break
    default:
      textColor = theme.textPrimary
  }

  return {
    color: color || textColor,
    fontSize: size,
    fontWeight: bold ? 'bold' : 'normal',
  }
}

/**
 * 创建背景样式
 */
export const createBgStyle = (
  theme: ThemeConfig,
  options?: {
    type?: 'primary' | 'secondary' | 'tertiary' | 'mask'
    color?: string
  }
): CSSProperties => {
  const { type = 'primary', color } = options || {}

  let bgColor = theme.bgPrimary

  switch (type) {
    case 'secondary':
      bgColor = theme.bgSecondary
      break
    case 'tertiary':
      bgColor = theme.bgTertiary
      break
    case 'mask':
      bgColor = theme.bgMask
      break
    default:
      bgColor = theme.bgPrimary
  }

  return {
    backgroundColor: color || bgColor,
  }
}

/**
 * 创建边框样式
 */
export const createBorderStyle = (
  theme: ThemeConfig,
  options?: {
    width?: number
    type?: 'normal' | 'light'
    color?: string
    radius?: number | string
  }
): CSSProperties => {
  const { width = 1, type = 'normal', color, radius } = options || {}

  let borderColor = theme.borderColor

  if (type === 'light') {
    borderColor = theme.borderColorLight
  }

  return {
    border: `${width}px solid ${color || borderColor}`,
    borderRadius: radius,
  }
}

/**
 * 创建按钮样式
 */
export const createButtonStyle = (
  theme: ThemeConfig,
  options?: {
    type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
    plain?: boolean
    disabled?: boolean
  }
): CSSProperties => {
  const { type = 'primary', plain = false, disabled = false } = options || {}

  let backgroundColor = theme.primaryColor
  let textColor = '#fff'

  switch (type) {
    case 'success':
      backgroundColor = theme.successColor
      break
    case 'warning':
      backgroundColor = theme.warningColor
      break
    case 'danger':
      backgroundColor = theme.errorColor
      break
    case 'info':
      backgroundColor = theme.infoColor
      break
    default:
      backgroundColor = theme.primaryColor
  }

  if (plain) {
    textColor = backgroundColor
    backgroundColor = disabled ? '#f5f5f5' : '#fff'

    return {
      color: disabled ? '#bfbfbf' : textColor,
      backgroundColor,
      borderColor: disabled ? '#d9d9d9' : backgroundColor,
      borderWidth: 1,
      borderStyle: 'solid',
    }
  }

  return {
    color: textColor,
    backgroundColor: disabled ? '#bfbfbf' : backgroundColor,
    borderWidth: 0,
  }
}

/**
 * 创建阴影样式
 */
export const createShadowStyle = (theme: ThemeConfig, light: boolean = false): CSSProperties => {
  return {
    boxShadow: light ? theme.boxShadowLight : theme.boxShadow,
  }
}

/**
 * 创建卡片样式
 */
export const createCardStyle = (
  theme: ThemeConfig,
  options?: {
    shadow?: boolean
    light?: boolean
    border?: boolean
    radius?: number | string
  }
): CSSProperties => {
  const { shadow = true, light = true, border = false, radius = '8px' } = options || {}

  const style: CSSProperties = {
    backgroundColor: theme.bgPrimary,
    borderRadius: radius,
    padding: '16px',
  }

  if (shadow) {
    style.boxShadow = light ? theme.boxShadowLight : theme.boxShadow
  }

  if (border) {
    style.borderWidth = '1px'
    style.borderStyle = 'solid'
    style.borderColor = theme.borderColorLight
  }

  return style
}

export default {
  createTextStyle,
  createBgStyle,
  createBorderStyle,
  createButtonStyle,
  createShadowStyle,
  createCardStyle,
}
