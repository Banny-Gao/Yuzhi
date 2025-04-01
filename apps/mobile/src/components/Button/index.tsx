import React from 'react'
import { Button as TaroButton, View } from '@tarojs/components'
import { useTheme } from '@/contexts/ThemeContext'
import styles from './index.module.less'

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

  // Generate button class name based on props using CSS Modules
  const buttonClass = [styles.button, styles[type], styles[size], styles[themeType], block && styles.block, animated && styles.animated, className]
    .filter(Boolean)
    .join(' ')

  return (
    <TaroButton className={buttonClass} onClick={disabled || loading ? undefined : onClick} disabled={disabled} loading={loading}>
      {loading ? <View className={styles.loading} /> : children}
    </TaroButton>
  )
}

export default ThemedButton
