import React from 'react'
import { Button as TaroButton, View } from '@tarojs/components'
import { useTheme } from '@/contexts/ThemeContext'
import './index.less'

export interface ThemedButtonProps {
  children: React.ReactNode
  onClick?: () => void
  type?: 'primary' | 'secondary' | 'text' | 'outlined'
  size?: 'small' | 'medium' | 'large'
  block?: boolean
  disabled?: boolean
  loading?: boolean
  className?: string
  animated?: boolean
}

const ThemedButton: React.FC<ThemedButtonProps> = ({
  children,
  onClick,
  type = 'primary',
  size = 'medium',
  block = false,
  disabled = false,
  loading = false,
  className = '',
  animated = true,
}) => {
  const { themeType } = useTheme()

  // Generate button class name based on props
  const buttonClass = `
    themed-button
    themed-button--${type}
    themed-button--${size}
    themed-button--${themeType}
    ${block ? 'themed-button--block' : ''}
    ${animated ? 'themed-button--animated' : ''}
    ${className}
  `

  return (
    <TaroButton className={buttonClass.trim()} onClick={disabled || loading ? undefined : onClick} disabled={disabled} loading={loading}>
      {loading ? <View className="themed-button__loading" /> : children}
    </TaroButton>
  )
}

export default ThemedButton
