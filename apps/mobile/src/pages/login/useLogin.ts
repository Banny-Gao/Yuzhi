import { useState, useRef, useEffect } from 'react'
import { router } from '@/utils/router'
import routes from '@/generated.routes'
import { userStore } from '@/store/user'
import type { LoginUserDto, SmsLoginDto, CreateUserDto } from '@workspace/request'

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

export type AuthMode = 'login' | 'register' | 'smsLogin'

export const useLogin = () => {
  const scrollViewRef = useRef<any>(null)

  // State management
  const [authMode, setAuthMode] = useState<AuthMode>('login')
  const [animKey, setAnimKey] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [countdown, setCountdown] = useState(0)

  // Form state
  const [username, setUsername] = useState('johndoe')
  const [password, setPassword] = useState('Password123!')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [email, setEmail] = useState('')
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
    scrollToTop()
  }

  // Scroll to top helper
  const scrollToTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        top: 0,
        duration: 300,
      })
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
    setConfirmPassword('')
    setEmail('')
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

    // 注册模式下的用户名验证
    if (authMode === 'register' && value) {
      if (value.length < 3 || value.length > 20) {
        setError('username', '用户名长度必须在3-20个字符之间')
      } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
        setError('username', '用户名只能包含字母、数字和下划线')
      } else {
        clearError('username')
      }
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

    // For registration, validate password
    if (authMode === 'register' && value.length > 0) {
      if (value.length < 8 || value.length > 30) {
        setError('password', '密码长度必须在8-30个字符之间')
      } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(value)) {
        setError('password', '密码必须包含至少一个大写字母、一个小写字母、一个数字和一个特殊字符')
      } else {
        clearError('password')
      }
    }

    // Also validate confirm password if it exists
    validatePasswordMatch(value, confirmPassword)
  }

  const validatePasswordMatch = (pass: string, confirmPass: string) => {
    if (!confirmPass) return

    if (pass !== confirmPass) {
      setError('confirmPassword', '两次密码输入不一致')
    } else {
      clearError('confirmPassword')
    }
  }

  const handleConfirmPasswordInput = (value: string) => {
    setConfirmPassword(value)

    if (!value) {
      setError('confirmPassword', '请确认密码')
      return
    }

    validatePasswordMatch(password, value)
  }

  const handleEmailInput = (value: string) => {
    setEmail(value)

    if (!value) {
      setError('email', '请输入邮箱')
      return
    }

    if (!isValidEmail(value)) {
      setError('email', '请输入有效的邮箱地址')
    } else {
      clearError('email')
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
    } else if (authMode === 'register') {
      if (!username) {
        errors.username = '请输入用户名'
      } else if (username.length < 3 || username.length > 20) {
        errors.username = '用户名长度必须在3-20个字符之间'
      } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        errors.username = '用户名只能包含字母、数字和下划线'
      }

      if (!password) {
        errors.password = '请输入密码'
      } else if (password.length < 8 || password.length > 30) {
        errors.password = '密码长度必须在8-30个字符之间'
      } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password)) {
        errors.password = '密码必须包含至少一个大写字母、一个小写字母、一个数字和一个特殊字符'
      }

      if (!confirmPassword) errors.confirmPassword = '请确认密码'
      else if (password !== confirmPassword) errors.confirmPassword = '两次密码输入不一致'

      if (!email) errors.email = '请输入邮箱'
      else if (!isValidEmail(email)) errors.email = '请输入有效的邮箱地址'

      validatePhone()
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
      } else if (authMode === 'register') {
        const registerData: CreateUserDto = {
          username,
          email,
          phoneNumber,
          password,
        }
        success = await userStore.register(registerData)
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
    confirmPassword,
    email,
    phoneNumber,
    smsCode,
    rememberMe,
    countdown,
    scrollViewRef,

    // Handlers
    handleAuthModeChange,
    handleUsernameInput,
    handlePhoneInput,
    handlePasswordInput,
    handleConfirmPasswordInput,
    handleEmailInput,
    handleSmsCodeInput,
    handleRememberMeChange,
    handleSubmit,
    requestSmsCode,

    // Utils
    validateForm,
    resetForm,
  }
}
