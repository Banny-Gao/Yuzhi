import React, { useState, useEffect, useRef } from 'react'
import { View, Text, Switch, Image, ScrollView, Input } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'

import routes from '@/generated.routes'
import { router } from '@/utils/router'
import { useTheme } from '@/contexts/ThemeContext'
import userStore from '@/store/user'

import AuthToggle, { AuthMode } from '@/pages/login/components/AuthToggle'
import InputField from '@/components/InputField'
import ThemedButton from '@/components/Button'

import './index.less'

export const pageMeta = {
  title: '登录页面',
  requiresAuth: false,
}

// Utility function to validate email format
const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Utility function to validate phone number format
const isValidPhone = (phone: string) => {
  return /^1[3456789]\d{9}$/.test(phone)
}

const Login: React.FC = () => {
  const { themeType } = useTheme()
  const scrollViewRef = useRef<any>(null)

  // Form state
  const [authMode, setAuthMode] = useState<AuthMode>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [smsCode, setSmsCode] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Local loading state for reactivity
  const [isLoading, setIsLoading] = useState(false)

  useLoad(() => {
    console.log('登录页面加载完成')
  })

  // Reset form when changing auth mode and scroll to top
  useEffect(() => {
    setFormErrors({})

    // Scroll to top when changing auth mode
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        top: 0,
        duration: 300,
      })
    }
  }, [authMode])

  // Validate the form based on current auth mode
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (authMode === 'login') {
      if (!username) errors.username = '请输入用户名或手机号'
      if (!password) errors.password = '请输入密码'
    } else if (authMode === 'smsLogin') {
      if (!phoneNumber) errors.phoneNumber = '请输入手机号'
      else if (!isValidPhone(phoneNumber)) errors.phoneNumber = '请输入有效的手机号'
      if (!smsCode) errors.smsCode = '请输入验证码'
    } else if (authMode === 'register') {
      if (!username) errors.username = '请输入用户名'
      if (!password) errors.password = '请输入密码'
      else if (password.length < 8) errors.password = '密码至少需要8个字符'

      if (!confirmPassword) errors.confirmPassword = '请确认密码'
      else if (password !== confirmPassword) errors.confirmPassword = '两次密码输入不一致'

      if (!email) errors.email = '请输入邮箱'
      else if (!isValidEmail(email)) errors.email = '请输入有效的邮箱地址'

      if (!phoneNumber) errors.phoneNumber = '请输入手机号'
      else if (!isValidPhone(phoneNumber)) errors.phoneNumber = '请输入有效的手机号'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsLoading(true)

    try {
      let success = false

      if (authMode === 'login') {
        success = await userStore.login({
          usernameOrPhone: username,
          password,
          rememberMe,
        })
      } else if (authMode === 'smsLogin') {
        success = await userStore.smsLogin({
          phoneNumber,
          code: smsCode,
        })
      } else if (authMode === 'register') {
        success = await userStore.register({
          username,
          email,
          phoneNumber,
          password,
        })
      }

      if (success) {
        router.navigateTo({ url: routes.index.path })
      }
    } catch (error) {
      console.error('提交失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Request SMS code
  const requestSmsCode = () => {
    if (!phoneNumber || !isValidPhone(phoneNumber)) {
      setFormErrors({ ...formErrors, phoneNumber: '请输入有效的手机号' })
      return
    }

    // TODO: Add SMS code request logic
    console.log('发送验证码到', phoneNumber)
  }

  // Render different forms based on auth mode
  const renderAuthForm = () => {
    if (authMode === 'login') {
      return (
        <View className="auth-form__content">
          <View className="auth-form__username-container">
            <InputField label="用户名/手机号" value={username} onInput={setUsername} placeholder="请输入用户名或手机号" required error={formErrors.username} />
            {username && (
              <View className="auth-form__avatar">
                <Image src="https://placekitten.com/100/100" mode="aspectFill" />
              </View>
            )}
          </View>

          <InputField label="密码" value={password} onInput={setPassword} type="password" placeholder="请输入密码" required error={formErrors.password} />

          <View className="auth-form__options">
            <View className="auth-form__remember">
              <Switch checked={rememberMe} onChange={e => setRememberMe(e.detail.value)} color="var(--primary-color)" />
              <Text className="auth-form__remember-text">记住我</Text>
            </View>

            <Text className="auth-form__forgot-password" onClick={() => console.log('忘记密码')}>
              忘记密码?
            </Text>
          </View>

          <ThemedButton type="primary" size="large" block onClick={handleSubmit} loading={isLoading}>
            登录
          </ThemedButton>
        </View>
      )
    } else if (authMode === 'smsLogin') {
      return (
        <View className="auth-form__content">
          <InputField
            label="手机号"
            value={phoneNumber}
            onInput={setPhoneNumber}
            placeholder="请输入手机号"
            type="number"
            required
            error={formErrors.phoneNumber}
          />

          <View className="auth-form__verification-row">
            <Text className="auth-form__verification-label">
              验证码<Text className="auth-form__required">*</Text>
            </Text>
            <View className="auth-form__verification-input-container">
              <Input
                className="auth-form__verification-input"
                value={smsCode}
                onInput={e => setSmsCode(e.detail.value)}
                placeholder=""
                type="number"
                maxlength={6}
              />
              <Text className="auth-form__get-code" onClick={requestSmsCode}>
                获取验证码
              </Text>
            </View>
          </View>
          {formErrors.smsCode && <Text className="auth-form__error-text">{formErrors.smsCode}</Text>}

          <ThemedButton type="primary" size="large" block onClick={handleSubmit} loading={isLoading}>
            登录
          </ThemedButton>
        </View>
      )
    } else {
      return (
        <View className="auth-form__content">
          <InputField label="用户名" value={username} onInput={setUsername} placeholder="请设置用户名" required error={formErrors.username} />

          <InputField
            label="手机号"
            value={phoneNumber}
            onInput={setPhoneNumber}
            placeholder="请输入手机号"
            type="number"
            required
            error={formErrors.phoneNumber}
          />

          <InputField label="邮箱" value={email} onInput={setEmail} placeholder="请输入邮箱" required error={formErrors.email} />

          <InputField label="密码" value={password} onInput={setPassword} type="password" placeholder="请设置密码" required error={formErrors.password} />

          <InputField
            label="确认密码"
            value={confirmPassword}
            onInput={setConfirmPassword}
            type="password"
            placeholder="请再次输入密码"
            required
            error={formErrors.confirmPassword}
          />

          <ThemedButton type="primary" size="large" block onClick={handleSubmit} loading={isLoading}>
            注册
          </ThemedButton>
        </View>
      )
    }
  }

  return (
    <ScrollView className={`login-page login-page--${themeType}`} scrollY enhanced showScrollbar={false} ref={scrollViewRef}>
      <View className="login-page__header">
        <View className="login-page__logo-container">
          <Text className="login-page__logo-text">Y</Text>
        </View>
        <Text className="login-page__title">欢迎使用</Text>
        <Text className="login-page__subtitle">登录后体验更多功能</Text>
      </View>

      <View className="login-page__content">
        <AuthToggle currentMode={authMode} onChange={setAuthMode} />

        <View className="auth-form">{renderAuthForm()}</View>
      </View>
    </ScrollView>
  )
}

export default Login
