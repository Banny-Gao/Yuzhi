import { useState, useRef, useEffect } from 'react'
import { router } from '@/utils/router'
import routes from '@/generated.routes'
import { userStore } from '@/store/user'
import type { LoginUserDto, SmsLoginDto } from '@/utils/openapi/types.gen'

// Validation utilities
export const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export const isValidPhone = (phone: string) => {
  return /^1[3456789]\d{9}$/.test(phone)
}

export const isPhoneNumber = (value: string) => {
  return /^\d+$/.test(value) && value.length <= 11
}

// 添加用户名验证规则
export const isValidUsername = (username: string) => {
  return /^[a-zA-Z0-9_]{3,20}$/.test(username)
}

// 添加密码验证规则
export const isValidPassword = (password: string) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/.test(password)
}

export type AuthMode = 'login' | 'smsLogin'

export const useLogin = () => {
  const scrollViewRef = useRef<any>(null)

  // State management
  const [authMode, setAuthMode] = useState<AuthMode>('login')
  const [animKey, setAnimKey] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [countdown, setCountdown] = useState(0)

  // Form state
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('Admin@123')

  const [phoneNumber, setPhoneNumber] = useState('')
  const [smsCode, setSmsCode] = useState('')
  const [rememberMe, setRememberMe] = useState(true)

  // Utility functions for form error handling
  const clearError = (field: string) => {
    setFormErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }

  const setError = (field: string, message: string) => {
    setFormErrors(prev => ({ ...prev, [field]: message }))
  }

  // Handle auth mode change with animation
  const handleAuthModeChange = (mode: AuthMode) => {
    if (mode === authMode) return

    setAnimKey(prev => prev + 1) // Force re-render for animation
    setAuthMode(mode)
    setFormErrors({})
    resetForm()
    // scrollToTop()
  }

  // Scroll to top helper
  const scrollToTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTop = 0
    }
  }

  // Reset form when changing auth mode
  useEffect(() => {
    setFormErrors({})
    scrollToTop()
  }, [authMode])

  // Reset form fields
  const resetForm = () => {
    setUsername('')
    setPassword('')

    setPhoneNumber('')
    setSmsCode('')
    setFormErrors({})
  }

  // Form input handlers with validation
  const handleUsernameInput = (value: string) => {
    setUsername(value)

    if (value) {
      clearError('username')
    }

    // Phone number validation if applicable
    if (isPhoneNumber(value)) {
      if (value.length === 11 && !isValidPhone(value)) {
        setError('username', '请输入有效的手机号')
      } else if (value.length === 11) {
        clearError('username')
      }
    }
  }

  const handlePhoneInput = (value: string) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return

    setPhoneNumber(value)

    if (!value || (value.length === 11 && isValidPhone(value))) {
      clearError('phoneNumber')
    } else if (value.length === 11) {
      setError('phoneNumber', '请输入有效的手机号')
    }
  }

  const handlePasswordInput = (value: string) => {
    setPassword(value)

    if (value) {
      clearError('password')
    }
  }

  const handleSmsCodeInput = (value: string) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return

    setSmsCode(value)

    if (value) {
      clearError('smsCode')
    }
  }

  const handleRememberMeChange = (value: boolean) => {
    setRememberMe(value)
  }

  // Form validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    // Common validation for phone number
    const validatePhone = () => {
      if (!phoneNumber) errors.phoneNumber = '请输入手机号'
      else if (!isValidPhone(phoneNumber)) errors.phoneNumber = '请输入有效的手机号'
    }

    if (authMode === 'login') {
      if (!username) errors.username = '请输入用户名或手机号'
      if (!password) errors.password = '请输入密码'
    } else if (authMode === 'smsLogin') {
      validatePhone()
      if (!smsCode) errors.smsCode = '请输入验证码'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // API Interactions
  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsLoading(true)

    try {
      let success = false

      if (authMode === 'login') {
        const loginData: LoginUserDto = {
          usernameOrPhone: username,
          password,
          rememberMe,
        }
        success = await userStore.login(loginData)
      } else if (authMode === 'smsLogin') {
        const smsData: SmsLoginDto = {
          phoneNumber,
          code: smsCode,
        }
        success = await userStore.smsLogin(smsData)
      }

      if (success) {
        router.redirectTo({ url: routes.index.path })
      }
    } finally {
      setIsLoading(false)
    }
  }

  // SMS code request
  const requestSmsCode = async () => {
    const isValidPhoneInput = phoneNumber && isValidPhone(phoneNumber)

    if (!isValidPhoneInput) {
      setError('phoneNumber', '请输入有效的手机号')
      return
    }

    try {
      // Send SMS validation code API call
      // Note: If the API is not available, this is a placeholder
      console.log('Sending SMS code to', phoneNumber)

      // Start countdown
      startCountdown()
    } catch (error) {
      console.error('Failed to send SMS code:', error)
    }
  }

  // Countdown timer logic
  const startCountdown = () => {
    setCountdown(60)
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }

  return {
    // State
    authMode,
    animKey,
    isLoading,
    formErrors,
    username,
    password,
    phoneNumber,
    smsCode,
    rememberMe,
    countdown,
    scrollViewRef,

    // Methods
    handleAuthModeChange,
    handleUsernameInput,
    handlePasswordInput,
    handlePhoneInput,
    handleSmsCodeInput,
    handleRememberMeChange,
    handleSubmit,
    requestSmsCode,
  }
}
