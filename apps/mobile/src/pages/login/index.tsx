import React from 'react'
import { View, Text, Switch, ScrollView, Input } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'

import AuthToggle from '@/pages/login/components/AuthToggle'
import { PageWrapper } from '@/components'
import InputField from '@/components/InputField'
import ThemedButton from '@/components/Button'
import { useLogin } from './useLogin'

import styles from './index.module.less'

export const pageMeta = {
  title: '登录页面',
  requiresAuth: false,
}

const Login: React.FC = () => {
  const {
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
  } = useLogin()

  useLoad(() => {
    console.log('登录页面加载完成')
  })

  // Render account login form
  const renderAccountLoginForm = () => {
    return (
      <View className={styles.formContent}>
        <View className={styles.usernameContainer}>
          <InputField
            label="用户名/手机号"
            value={username}
            onInput={handleUsernameInput}
            placeholder="请输入用户名或手机号"
            required
            error={formErrors.username}
          />
        </View>

        <InputField label="密码" value={password} onInput={handlePasswordInput} placeholder="请输入密码" type="password" required error={formErrors.password} />

        <View className={styles.options}>
          <View className={styles.remember}>
            <Switch checked={rememberMe} onChange={e => handleRememberMeChange(e.detail.value)} color="var(--primary-color)" className={styles.switch} />
            <Text className={styles.rememberText}>记住我</Text>
          </View>
          <Text className={styles.forgotPassword}>忘记密码?</Text>
        </View>

        <ThemedButton type="primary" size="large" onClick={handleSubmit} loading={isLoading} disabled={isLoading} block>
          登录
        </ThemedButton>
      </View>
    )
  }

  // Render SMS login form
  const renderSmsLoginForm = () => {
    return (
      <View className={styles.formContent}>
        <InputField
          label="手机号"
          value={phoneNumber}
          onInput={handlePhoneInput}
          placeholder="请输入手机号"
          type="number"
          required
          error={formErrors.phoneNumber}
          maxLength={11}
        />

        <View className={styles.verificationRow}>
          <Text className={styles.verificationLabel}>
            验证码<Text className={styles.required}>*</Text>
          </Text>
          <View className={styles.verificationInputContainer}>
            <Input
              className={styles.verificationInput}
              type="text"
              placeholder="请输入验证码"
              value={smsCode}
              onInput={e => handleSmsCodeInput(e.detail.value)}
              maxlength={6}
            />
            <Text
              className={styles.getCode}
              onClick={countdown === 0 ? requestSmsCode : undefined}
              style={{ color: countdown > 0 ? 'var(--text-tertiary)' : 'var(--primary-color)' }}
            >
              {countdown > 0 ? `${countdown}秒后重新获取` : '获取验证码'}
            </Text>
          </View>
          {formErrors.smsCode && <Text className={styles.errorText}>{formErrors.smsCode}</Text>}
        </View>

        <ThemedButton type="primary" size="large" onClick={handleSubmit} loading={isLoading} disabled={isLoading} block>
          登录
        </ThemedButton>
      </View>
    )
  }

  // Render registration form
  const renderRegistrationForm = () => {
    return (
      <View className={styles.formContent}>
        <InputField label="用户名" value={username} onInput={handleUsernameInput} placeholder="请设置用户名" required error={formErrors.username} />

        <InputField
          label="手机号"
          value={phoneNumber}
          onInput={handlePhoneInput}
          placeholder="请输入手机号"
          type="number"
          required
          error={formErrors.phoneNumber}
          maxLength={11}
        />

        <InputField label="邮箱" value={email} onInput={handleEmailInput} placeholder="请输入邮箱" required error={formErrors.email} />

        <InputField label="密码" value={password} onInput={handlePasswordInput} placeholder="请设置密码" type="password" required error={formErrors.password} />

        <InputField
          label="确认密码"
          value={confirmPassword}
          onInput={handleConfirmPasswordInput}
          placeholder="请再次输入密码"
          type="password"
          required
          error={formErrors.confirmPassword}
        />

        <ThemedButton type="primary" size="large" onClick={handleSubmit} loading={isLoading} disabled={isLoading} block>
          注册
        </ThemedButton>
      </View>
    )
  }

  // Render different forms based on auth mode
  const renderAuthForm = () => {
    if (authMode === 'login') {
      return renderAccountLoginForm()
    } else if (authMode === 'smsLogin') {
      return renderSmsLoginForm()
    } else {
      return renderRegistrationForm()
    }
  }

  return (
    <PageWrapper useScrollView={false}>
      <div className={styles.header}>
        <div className={styles.logoContainer}>
          <Text className={styles.logoText}>禹智</Text>
        </div>
        <Text className={styles.title}>欢迎回来</Text>
        <Text className={styles.subtitle}>请选择一种方式登录或注册您的账号</Text>
      </div>

      <AuthToggle currentMode={authMode} onChange={handleAuthModeChange} />

      <div className={styles.scrollArea}>
        <ScrollView scrollY className={styles.form} ref={scrollViewRef} enhanced showScrollbar={false} scrollWithAnimation enableFlex>
          <div className={styles.scrollContent}>
            <div key={animKey} className={styles.formContainer}>
              {renderAuthForm()}
            </div>
          </div>
        </ScrollView>
      </div>
    </PageWrapper>
  )
}

export default Login
