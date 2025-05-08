import React, { useState } from 'react'
import { View, Text, Input } from '@tarojs/components'

import styles from './index.module.less'

import { useTheme } from '@/contexts/ThemeContext'

export interface InputFieldProps {
  label: string
  value: string
  onInput: (value: string) => void
  placeholder?: string
  type?: 'text' | 'password' | 'number' | 'idcard' | 'digit'
  required?: boolean
  error?: string
  maxLength?: number
  disabled?: boolean
  className?: string
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onInput,
  placeholder = '',
  type = 'text',
  required = false,
  error = '',
  maxLength,
  disabled = false,
  className = '',
}) => {
  const { themeType } = useTheme()
  const [focused, setFocused] = useState(false)

  // Handle input events
  const handleInput = e => {
    onInput(e.detail.value)
  }

  // Determine if the field has an error
  const hasError = error !== ''

  // Generate the class names based on state using CSS Modules
  const fieldClass = [
    styles.field,
    styles[themeType],
    focused && styles.focused,
    hasError && styles.error,
    disabled && styles.disabled,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <View className={fieldClass}>
      <View className={styles.labelRow}>
        <Text className={styles.label}>{label}</Text>
        {required && <Text className={styles.required}>*</Text>}
      </View>

      <View className={styles.inputContainer}>
        <Input
          className={styles.input}
          value={value}
          type={type === 'password' ? 'safe-password' : type}
          password={type === 'password'}
          placeholder={placeholder}
          onInput={handleInput}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          maxlength={maxLength}
          disabled={disabled}
        />
      </View>

      {hasError && <Text className={styles.errorText}>{error}</Text>}
    </View>
  )
}

export default InputField
