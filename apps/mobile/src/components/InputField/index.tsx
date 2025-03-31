import React, { useState } from 'react'
import { View, Text, Input } from '@tarojs/components'
import { useTheme } from '@/contexts/ThemeContext'
import './index.less'

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

  // Generate the class names based on state
  const fieldClass = `
    input-field
    input-field--${themeType}
    ${focused ? 'input-field--focused' : ''}
    ${hasError ? 'input-field--error' : ''}
    ${disabled ? 'input-field--disabled' : ''}
    ${className}
  `

  return (
    <View className={fieldClass.trim()}>
      <View className="input-field__label-row">
        <Text className="input-field__label">{label}</Text>
        {required && <Text className="input-field__required">*</Text>}
      </View>

      <View className="input-field__input-container">
        <Input
          className="input-field__input"
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

      {hasError && <Text className="input-field__error-text">{error}</Text>}
    </View>
  )
}

export default InputField
